const root = document.getElementById('root');
let store = {
  currentRoverName: 'Curiosity',
  roverNames: ['Select a rover', 'Curiosity', 'Spirit', 'Opportunity'],
  roverPhotos: [],
  currentSliderPosition: 0,
  currentRover: {
    id: '5',
    name: 'Curiosity',
    landing_date: '2012-08-06',
    launch_date: '2011-11-26',
    status: 'active',
  },
};

/* -------------------  HELPER FUNCTIONS  --------------------- */
/**
 * Function to capitalize a string
 * @param {String} str - string to capitalize
 * @returns {String} - returns a capitalized string
 */
function titleize(str) {
  if (str && str.length > 1) {
    const [first, ...rest] = str.split('');
    return `${first.toUpperCase()}${rest.join('')}`;
  }

  return 'Default Title';
}

/**
 * Function to retrieve a rover's photos by name
 * @param {String} roverName - Name of the rover to search & retrieve its photos
 * @returns {any<object>} - returns a Rover's object from the backend
 */
async function getRoverPhotos(roverName) {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/rovers/${roverName}`);
    const result = await response.json();
    return result.data.photos;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Function to get the selected rover & makes an API call to get the rover's photos
 * - Also hides the Selection bar if the API returns a success.
 * - Then it triggers a render of the slideshow.
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
async function handleOnBarChange(store) {
  const selectedValue = document.getElementById('selectionBar');
  if (selectedValue) {
    updateStore(store, { currentRoverName: titleize(selectedValue.value) });
    const roverData = await getRoverPhotos(selectedValue.value);

    if (roverData) {
      const [firstPhoto] = roverData;
      updateStore(store, { roverPhotos: roverData, currentRover: firstPhoto.rover });
      // hide dropdown & show the slideshow and the Tabs
      const selectionBarSection = document.querySelector('.selection_bar-section');
      const sliderSection = document.querySelector('.slider-section');
      const tabsSection = document.querySelector('.tabs-section');
      const defaultTab = document.querySelector('#launchDate');

      selectionBarSection.style.display = 'none';
      sliderSection.style.display = 'block';
      tabsSection.style.display = 'block';
      defaultTab.style.display = 'block';

      SliderImages(store);
    }
  }
}

/**
 * Pure function to update the global store. Also triggers a DOM re-render
 * @param {any<Object>} store - old state to update
 * @param {any<Object>} newState - a newly state generated from the old one
 * @returns {void}
 */
function updateStore(store, newState) {
  Object.assign(store, newState);
  render(root, store);
}

/**
 * Retrieve the image being shown currently on the slideshow (or the one with class `slider-img__show`)
 * @param {any<Object>} state - Global current app state
 * @returns {any<Object>}
 */
function getCurrentImage(state) {
  try {
    const galleryDiv = document.querySelector('.slider-images');
    const currentChild = galleryDiv.querySelector('.slider-img__show');
    const metadata = JSON.parse(currentChild.firstChild.lastChild.getAttribute('metadata'));
    const image = state.roverPhotos.find(({ id }) => id === metadata.id);
    const position = state.roverPhotos.indexOf(image);

    return {
      ...metadata,
      position,
      nodeElement: currentChild,
      parentDiv: galleryDiv,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Pure function to render a previous image on the slide show
 * @param {any<Object>} state - current global store to retrieve the current slideshow position & to generate a new state
 * @returns {void}
 */
function showPreviousImage(state) {
  const currentImg = getCurrentImage(state);

  const prevImgElement = currentImg.position === 0
    ? currentImg.parentDiv.lastChild : currentImg.nodeElement.previousSibling;

  currentImg.nodeElement.classList.remove('slider-img__show');
  currentImg.nodeElement.classList.add('slider-img__hide');
  prevImgElement.classList.remove('slider-img__hide');
  prevImgElement.classList.add('slider-img__show');

   // update state without rerendering
   Object.assign(state, { currentSliderPosition: currentImg.position - 1 });
}

/**
 * Render the next image on the slide show
 * @param {any<Object>} state - state - current global store to retrieve the current slideshow position & to generate a new state
 * * @returns {void}
 */
function showNextImage(state) {
  const currentImg = getCurrentImage(state);

   // check if the currentImg is the last item (if so, set to start all over)
  const nextImgElement = currentImg.position === state.roverPhotos.length - 1
    ? currentImg.parentDiv.firstChild : currentImg.nodeElement.nextSibling;

  currentImg.nodeElement.classList.remove('slider-img__show');
  currentImg.nodeElement.classList.add('slider-img__hide');
  nextImgElement.classList.remove('slider-img__hide');
  nextImgElement.classList.add('slider-img__show');

  // update state without rerendering
  Object.assign(state, { currentSliderPosition: currentImg.position + 1 });
}

/**
 * Generate an HTML element that contains a slider image
 * @param {HTMLElement} nodeElement - raw node element to wrap within a styled div
 * @param {Number} index - position of the nodeElement in the array of elements
 * @returns {HTMLElement} div
 */
function generateSliderElement(nodeElement, index) {
  const div = document.createElement('div');

  div.classList.add('slider-img');
  div.innerHTML = nodeElement;

  // the first image on the slideshow should be shown by default
  if (index === 0) {
    div.classList.add('slider-img__show');
  } else {
    div.classList.add('slider-img__hide');
  }

  return div;
}

/**
 * Display a given Tab's content on click
 * @param {*} className
 * @returns {void}
 */
function showTab(className) {
  const tabBtns = document.querySelectorAll('.tab-btn__active');
  tabBtns.forEach((btn) => btn.classList.remove('tab-btn__active'));

  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach((tabContent) => tabContent.style.display = 'none');

  const tabBtn = document.querySelector(`.${className}`);
  const tabContent = document.querySelector(`#${className}`);
  tabBtn.classList.add('tab-btn__active');
  tabContent.style.display = 'block';
}

/**
 * Format Date from 'YYYY-MM-DD' to 'DD, MM, YYY'
 * @param {String} dateStr - Date string to convert
 * @returns {String} formattedDateStr - returns a date string in the format 'Day, Month, Year'
 */
function formatDate(dateStr) {
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return new Date(dateStr).toLocaleDateString('en-US', dateOptions);
}

/* -------------------  COMPONENTS  --------------------- */

const TabContent = (state) => `
<div class='tab-content' id='launchDate'>
  <p><strong>${state.currentRover.name}</strong> was launched on <strong>${formatDate(state.currentRover.launch_date)}</strong> </p>
</div>

<div class=' tab-content' id='landingDate'>
  <p><strong>${state.currentRover.name}</strong> landed on Mars on <strong>${formatDate(state.currentRover.landing_date)}</strong> </p>
</div>

<div class='tab-content' id='status'>
  <p><strong>${state.currentRover.name} </strong> mission's status <strong>"${state.currentRover.status}"</strong> </p>
</div>

<div class='tab-content' id='recentPhotos'>
  <p>Recent Photos</p>
</div>

<div class='tab-content' id='recentPhotosDate'>
  <p>Recent photos date</p>
</div>
  `;

const Tab = (state) => `
<div class='tab-header'>
  <h3>Rover Name: <strong>${state.currentRover.name}</strong></h3>
  <hr class='tab-header_underline' />
</div>
<div class='tab'>
  <button class='tab-btn launchDate tab-btn__active' onclick="showTab('launchDate')">Launch Date</button>
  <button class='tab-btn landingDate' onclick="showTab('landingDate')">Landing Date</button>
  <button class='tab-btn status' onclick="showTab('status')">Status</button>
  <button class='tab-btn recentPhotos' onclick="showTab('recentPhotos')">Recent Photos</button>
  <button class='tab-btn recentPhotosDate' onclick="showTab('recentPhotosDate')">Recent Photos Date</button>
</div>
`;
/**
 * Component that renders a dropdown menu with a list of available rovers to view.
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
const SelectionBar = (options) => {
  return `
    <div class='rovers-selection-bar'>
      <h4>Select a Rover to show</h4>
      <br />
      <select id='selectionBar' onchange="handleOnBarChange(store)">
        ${options.map(({ label, value }) => `<option value=${value} id=${value}>${label}</option>`)}
      </select>
    </div>
  `;
};

/**
 * Component that renders a rover Photo
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
function Image({ url, alt, metadata, current = 0, total = 0 }) {
  return `<div><span class='slider-spanner'>${current} / ${total}</span><img src=${url} alt="${alt}" metadata=${JSON.stringify(metadata)} /></div>`;
}

/**
 * Populate the slider images div with the rover's photos
 * Only the first item is shown by default. The rest will be revealed by clicking prev & next arrows
 * @param {any<Object>} state - Global app state
 * @returns {void}
 */
function SliderImages(state) {
  const targetDiv = document.querySelector('.slider-images');
  targetDiv.hidden = false;

  const images = state.roverPhotos.map(({ img_src, camera, id }) => ({ url: img_src, alt: camera.full_name, metadata: { id } }));
  const childrenDivs = images.map(({ url, alt, metadata }, index) => Image({ url, alt, metadata, current: index + 1, total: state.roverPhotos.length }));
  childrenDivs.forEach((child, index) => targetDiv.appendChild(generateSliderElement(child, index)));
}

/**
 * Component that renders a rovers navigation arrows. A user can click on them to move between current, previous and next images on the slide show
 * @param {store} - Global store
 * @returns {HTMLElement} - returns an HTML element
 */
function NextAndPrevArrows(store) {
  return `
    <a class='slider-show__prev' onclick="showPreviousImage(store)">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </a>
    <a class='slider-show__next' onclick="showNextImage(store)">
      <i class="fa fa-arrow-right" aria-hidden="true"></i>
    </a>
  `;
}

/**
 * Component that renders a Navbar
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
const NavigationBar = () => `
<header class="nav">
  <div class="nav-brand">
    <a nohref>Mars Rovers Dashboard</a>
  </div>
</header>`;

/**
 * Component that a rover's photos slide show.
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
const Slider = (state) => `
  <div class="slideshow-container">
    <div class="slider-images" hidden></div>
    ${NextAndPrevArrows(state)}
</div>
`;

const options = store.roverNames.map((item) => ({
  label: item,
  value: item.toLowerCase(),
}));


const App = (state) => {
  return `
    ${NavigationBar()}
    <main>
      <section class='selection_bar-section'>
        ${SelectionBar(options)}
      </section>
      <section class='slider-section'>
        ${Slider(state)}
      </section>
      <section class='tabs-section'>
        ${Tab(state)}
        ${TabContent(state)}
      </section>
    </main>
  `;
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

window.addEventListener('load', () => {
  render(root, store);
});
