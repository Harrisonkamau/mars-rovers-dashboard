const root = document.getElementById('root');
let store = {
  roverName: 'Curiosity',
  roverNames: ['Select a rover', 'Curiosity', 'Spirit', 'Opportunity'],
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
async function handleOnBarChange() {
  const selectedValue = document.getElementById('selectionBar');
  if (selectedValue) {
    updateStore(store, { roverName: titleize(selectedValue.value) });
    const roverData = await getRoverPhotos(selectedValue.value);

    if (roverData) {
      const selectionDropdownDiv = document.querySelector('.rovers-selection-bar');
      selectionDropdownDiv.classList.add('hidden');
      const sliderDiv = document.querySelector('.slideshow-container');
      sliderDiv.hidden = false;

      const sliderImgDiv = document.querySelector('.slider-img');
      sliderImgDiv.hidden = false;
      const [firstPhoto] = roverData;
      const imgTag = Image({ url: firstPhoto.img_src, alt: firstPhoto.camera.full_name });
      sliderImgDiv.innerHTML = imgTag;
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
 * Function to either move to the prev or next slider image
 * @param {Number} position - either -1 (for the previous slider img) or 1 (for the next slider img)
 * @returns {void}
 */
function navigateSliderImages(position) {}

/* -------------------  COMPONENTS  --------------------- */

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
      <select id='selectionBar' onchange="handleOnBarChange()">
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
function Image({ url, alt }) {
  return `
    <div class=''>
      <img src=${url} alt=${alt} />
    </div>
  `;
}

/**
 * Component that renders a rovers navigation arrows. A user can click on them to move between current, previous and next images on the slide show
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
function NextAndPrevArrows() {
  return `
    <a class='slider-show__prev'>
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </a>
    <a class='slider-show__next'>
      <i class="fa fa-arrow-right" aria-hidden="true"></i>
    </a>
  `;
}

/**
 * Component that renders a rovers navigation dots. Shortcut to navigate to a specific image on the slide show
 * @param {void}
 * @returns {HTMLElement} - returns an HTML element
 */
function SliderDots() {
  return `
    <div class='slider-show__dots'>
      <span class='slider-show__dot'></span>
      <span class='slider-show__dot'></span>
      <span class='slider-show__dot'></span>
      <span class='slider-show__dot'></span>
    </div>
  `
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
const Slider = (roverName) => `
  <div class="slideshow-container" hidden>
    <h3>${roverName} Photos</h3>
    <div class="slider-img" hidden></div>
    <div class="slider-img" hidden></div>
    ${NextAndPrevArrows()}
    ${SliderDots()}
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
      <section>
        ${SelectionBar(options)}
      </section>
      <section>
      ${Slider(state.roverName)}
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
