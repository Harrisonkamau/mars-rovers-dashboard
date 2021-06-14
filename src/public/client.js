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
const CalendarSVG = () => `
<svg viewBox="0 0 24 24"><path d="M30.224,3.948h-1.098V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.474,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75
  c0-1.517-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75c0-1.517-1.197-2.75-2.67-2.75
  c-1.473,0-2.67,1.233-2.67,2.75v1.197H6.224c-2.343,0-4.25,1.907-4.25,4.25v24c0,2.343,1.907,4.25,4.25,4.25h24
  c2.344,0,4.25-1.907,4.25-4.25v-24C34.474,5.855,32.567,3.948,30.224,3.948z M25.286,2.75c0-0.689,0.525-1.25,1.17-1.25
  c0.646,0,1.17,0.561,1.17,1.25v4.896c0,0.689-0.524,1.25-1.17,1.25c-0.645,0-1.17-0.561-1.17-1.25V2.75z M17.206,2.75
  c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M9.125,2.75
  c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z
    M31.974,32.198c0,0.965-0.785,1.75-1.75,1.75h-24c-0.965,0-1.75-0.785-1.75-1.75v-22h27.5V32.198z" />
    <rect x="6.724" y="14.626" width="4.595" height="4.089"/>
    <rect x="12.857" y="14.626" width="4.596" height="4.089"/>
    <rect x="18.995" y="14.626" width="4.595" height="4.089"/>
    <rect x="25.128" y="14.626" width="4.596" height="4.089"/>
    <rect x="6.724" y="20.084" width="4.595" height="4.086"/>
    <rect x="12.857" y="20.084" width="4.596" height="4.086"/>
    <rect x="18.995" y="20.084" width="4.595" height="4.086"/>
    <rect x="25.128" y="20.084" width="4.596" height="4.086"/>
    <rect x="6.724" y="25.54" width="4.595" height="4.086"/>
    <rect x="12.857" y="25.54" width="4.596" height="4.086"/>
    <rect x="18.995" y="25.54" width="4.595" height="4.086"/>
    <rect x="25.128" y="25.54" width="4.596" height="4.086"/>
  </svg>
`;

const StatusSVG = () => `
<svg viewBox="0 0 523.315 523.315"><g>
<g>
  <path d="M78.453,250.507H19.615C8.782,250.507,0,259.29,0,270.122v225.424c0,10.833,8.782,19.615,19.615,19.615h58.838
    c10.832,0,19.614-8.782,19.614-19.615v-225.43C98.073,259.283,89.285,250.507,78.453,250.507z"/>
  <path d="M220.143,165.965h-58.837c-10.833,0-19.615,8.782-19.615,19.615v309.965c0,10.833,8.782,19.615,19.615,19.615h58.837
    c10.833,0,19.615-8.782,19.615-19.615V185.574C239.757,174.748,230.975,165.965,220.143,165.965z"/>
  <path d="M361.833,81.424h-58.844c-10.832,0-19.614,8.782-19.614,19.614v394.507c0,10.833,8.782,19.615,19.614,19.615h58.838
    c10.832,0,19.614-8.782,19.614-19.615V101.032C381.441,90.2,372.659,81.424,361.833,81.424z"/>
  <path d="M503.701,8.155h-58.838c-10.833,0-19.615,8.782-19.615,19.615v467.776c0,10.833,8.782,19.615,19.615,19.615h58.838
    c10.832,0,19.614-8.782,19.614-19.615V27.764C523.315,16.931,514.533,8.155,503.701,8.155z"/>
</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`;

const PhotosSVG = () => `
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 606.365 606.366"
	 xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M547.727,144.345h-13.619v-13.618c0-32.059-26.08-58.14-58.139-58.14H58.64c-32.059,0-58.14,26.082-58.14,58.14v273.155
				c0,32.058,26.082,58.14,58.14,58.14h13.618v13.618c0,32.059,26.082,58.14,58.14,58.14h417.327
				c32.059,0,58.141-26.081,58.141-58.14V202.485C605.865,170.426,579.785,144.345,547.727,144.345z M563.025,475.639
				c0,8.45-6.85,15.3-15.299,15.3H130.398c-8.45,0-15.3-6.85-15.3-15.3v-13.618v-21.42v-21.42V202.485c0-8.451,6.85-15.3,15.3-15.3
				h360.87h21.42h21.42h13.619c8.449,0,15.299,6.85,15.299,15.3V475.639z M43.34,403.881V130.727c0-8.45,6.85-15.3,15.3-15.3
				h417.329c8.449,0,15.299,6.85,15.299,15.3v13.618h-360.87c-32.058,0-58.14,26.082-58.14,58.14v216.696H58.641
				C50.19,419.181,43.34,412.331,43.34,403.881z"/>
			<path d="M547.725,534.279H130.397c-32.334,0-58.64-26.306-58.64-58.64v-13.118H58.64c-32.334,0-58.64-26.306-58.64-58.64V130.727
				c0-32.334,26.306-58.64,58.64-58.64h417.329c32.333,0,58.639,26.306,58.639,58.64v13.118h13.119
				c32.333,0,58.639,26.306,58.639,58.64v273.154C606.365,507.973,580.06,534.279,547.725,534.279z M58.64,73.086
				C26.857,73.086,1,98.944,1,130.727v273.155c0,31.782,25.857,57.64,57.64,57.64h14.118v14.118c0,31.782,25.857,57.64,57.64,57.64
				h417.327c31.783,0,57.641-25.857,57.641-57.64V202.485c0-31.783-25.856-57.64-57.639-57.64h-14.119v-14.118
				c0-31.783-25.856-57.64-57.639-57.64H58.64z M547.727,491.439H130.398c-8.712,0-15.8-7.088-15.8-15.8V202.485
				c0-8.712,7.088-15.8,15.8-15.8h417.329c8.712,0,15.799,7.088,15.799,15.8v273.154
				C563.525,484.351,556.438,491.439,547.727,491.439z M130.398,187.685c-8.161,0-14.8,6.64-14.8,14.8v273.154
				c0,8.161,6.639,14.8,14.8,14.8h417.329c8.16,0,14.799-6.639,14.799-14.8V202.485c0-8.161-6.639-14.8-14.799-14.8H130.398z
				 M72.758,419.681H58.641c-8.712,0-15.801-7.088-15.801-15.8V130.727c0-8.712,7.088-15.8,15.8-15.8h417.329
				c8.712,0,15.799,7.088,15.799,15.8v14.118h-361.37c-31.783,0-57.64,25.857-57.64,57.64V419.681z M58.64,115.926
				c-8.161,0-14.8,6.639-14.8,14.8v273.155c0,8.16,6.64,14.8,14.801,14.8h13.118V202.485c0-32.334,26.306-58.64,58.64-58.64h360.37
				v-13.118c0-8.161-6.639-14.8-14.799-14.8H58.64z"/>
		</g>
		<g>
			<path d="M502.035,427.5l-14.096-14.097l-68.252-68.252c-5.975-5.976-15.662-5.976-21.637,0l-38.783,38.782l-72.451-72.451
				c-5.975-5.976-15.663-5.976-21.637,0L157.48,419.181l-8.32,8.319c-3.57,3.57-5.005,8.464-4.31,13.101
				c0.469,3.124,1.904,6.132,4.31,8.537l8.656,8.655c2.281,2.281,5.104,3.688,8.054,4.228c1.827,0.334,3.702,0.334,5.528,0
				c2.951-0.539,5.774-1.946,8.055-4.228l17.192-17.192l21.42-21.42l47.113-47.113c5.975-5.976,15.663-5.976,21.637,0l47.112,47.113
				l21.42,21.42l17.193,17.192c2.281,2.281,5.104,3.688,8.055,4.228c1.826,0.334,3.701,0.334,5.527,0
				c2.951-0.539,5.773-1.946,8.055-4.228l8.656-8.655c2.404-2.406,3.84-5.413,4.309-8.537c0.695-4.637-0.738-9.53-4.309-13.101
				l-8.32-8.319l-4.953-4.954l19.307-19.309l24.264,24.263l21.42,21.42l17.191,17.192c2.156,2.155,4.797,3.529,7.57,4.129
				c3.635,0.787,7.498,0.239,10.811-1.646c1.166-0.664,2.264-1.488,3.258-2.482l8.654-8.655c5.611-5.61,5.953-14.493,1.029-20.503
				C502.742,428.245,502.4,427.866,502.035,427.5z"/>
			<path d="M383.359,462.772c-0.955,0-1.915-0.088-2.854-0.259c-3.164-0.578-6.04-2.088-8.318-4.366l-85.726-85.726
				c-2.795-2.796-6.512-4.335-10.465-4.335s-7.67,1.539-10.465,4.335l-85.725,85.726c-2.277,2.278-5.154,3.788-8.318,4.366
				c-1.877,0.342-3.83,0.342-5.708,0c-3.164-0.578-6.04-2.088-8.318-4.366l-8.656-8.655c-2.407-2.406-3.946-5.455-4.451-8.816
				c-0.741-4.942,0.923-10,4.451-13.528l116.019-116.018c2.984-2.984,6.952-4.628,11.172-4.628s8.188,1.644,11.172,4.628
				l72.098,72.098l38.43-38.429c2.984-2.984,6.951-4.628,11.172-4.628s8.188,1.644,11.172,4.628l82.348,82.349
				c0.364,0.364,0.722,0.758,1.062,1.17c5.165,6.304,4.708,15.406-1.062,21.175l-8.654,8.655c-0.998,0.998-2.13,1.86-3.364,2.563
				c-2.367,1.348-5.065,2.06-7.804,2.06c-0.001,0-0.001,0-0.001,0c-1.128,0-2.258-0.12-3.358-0.359
				c-2.966-0.641-5.669-2.115-7.818-4.264l-62.521-62.521l-18.6,18.602l12.92,12.92c3.527,3.527,5.19,8.585,4.449,13.528
				c-0.504,3.359-2.042,6.407-4.449,8.816l-8.656,8.655c-2.278,2.278-5.154,3.788-8.318,4.366
				C385.274,462.684,384.314,462.772,383.359,462.772z M275.997,367.086c4.22,0,8.188,1.644,11.172,4.628l85.726,85.726
				c2.134,2.134,4.828,3.548,7.791,4.089c1.758,0.322,3.59,0.322,5.348,0c2.963-0.541,5.657-1.955,7.791-4.089l8.656-8.655
				c2.254-2.256,3.695-5.111,4.168-8.258c0.694-4.631-0.864-9.368-4.168-12.673l-13.627-13.627l20.014-20.016l63.229,63.229
				c2.014,2.013,4.545,3.394,7.322,3.994c3.538,0.764,7.328,0.188,10.458-1.593c1.156-0.658,2.217-1.467,3.151-2.401l8.654-8.655
				c5.404-5.403,5.832-13.93,0.996-19.833c-0.319-0.386-0.654-0.756-0.996-1.098l-82.348-82.349
				c-2.795-2.796-6.512-4.335-10.465-4.335s-7.67,1.539-10.465,4.335l-39.137,39.136l-72.805-72.805
				c-2.795-2.796-6.512-4.335-10.465-4.335s-7.669,1.539-10.465,4.335L149.514,427.854c-3.305,3.305-4.863,8.043-4.168,12.673
				c0.472,3.148,1.914,6.004,4.168,8.258l8.656,8.655c2.134,2.134,4.828,3.548,7.791,4.089c1.76,0.322,3.59,0.322,5.349,0
				c2.963-0.541,5.658-1.955,7.791-4.089l85.725-85.726C267.809,368.73,271.777,367.086,275.997,367.086z"/>
		</g>
		<g>
			<path d="M491.268,213.967c-6.672-2.622-13.934-4.063-21.523-4.063c-32.551,0-59.033,26.482-59.033,59.032
				c0,32.551,26.482,59.032,59.033,59.032c7.59,0,14.852-1.441,21.523-4.063c8.188-3.218,15.486-8.214,21.42-14.51
				c9.969-10.574,16.088-24.814,16.088-40.459c0-15.644-6.119-29.885-16.088-40.459
				C506.754,222.181,499.455,217.184,491.268,213.967z M469.742,285.128c-8.941,0-16.191-7.25-16.191-16.192
				c0-8.942,7.25-16.191,16.191-16.191c8.943,0,16.193,7.25,16.193,16.191C485.936,277.878,478.686,285.128,469.742,285.128z"/>
			<path d="M469.744,328.467c-32.827,0-59.533-26.706-59.533-59.532c0-32.826,26.706-59.532,59.533-59.532
				c7.482,0,14.786,1.379,21.706,4.098c8.114,3.188,15.584,8.248,21.602,14.632c10.462,11.098,16.224,25.588,16.224,40.802
				s-5.762,29.704-16.224,40.802c-6.016,6.383-13.485,11.442-21.602,14.633C484.531,327.088,477.229,328.467,469.744,328.467z
				 M469.744,210.403c-32.275,0-58.533,26.257-58.533,58.532c0,32.275,26.258,58.532,58.533,58.532
				c7.358,0,14.538-1.355,21.341-4.029c7.979-3.136,15.323-8.11,21.238-14.387c10.287-10.912,15.952-25.158,15.952-40.116
				s-5.665-29.205-15.952-40.116c-5.916-6.277-13.261-11.252-21.238-14.387C484.281,211.759,477.102,210.403,469.744,210.403z
				 M469.742,285.628c-9.204,0-16.691-7.488-16.691-16.692c0-9.204,7.487-16.691,16.691-16.691c9.205,0,16.693,7.488,16.693,16.691
				C486.436,278.14,478.947,285.628,469.742,285.628z M469.742,253.244c-8.652,0-15.691,7.039-15.691,15.691
				c0,8.653,7.039,15.692,15.691,15.692c8.653,0,15.693-7.04,15.693-15.692C485.436,260.283,478.396,253.244,469.742,253.244z"/>
		</g>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`

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
  <button class='tab-btn launchDate tab-btn__active' onclick="showTab('launchDate')">${CalendarSVG()} Launch Date</button>
  <button class='tab-btn landingDate' onclick="showTab('landingDate')">${CalendarSVG()} Landing Date</button>
  <button class='tab-btn status' onclick="showTab('status')">${StatusSVG()} Status</button>
  <button class='tab-btn recentPhotos' onclick="showTab('recentPhotos')">${PhotosSVG()} Recent Photos</button>
  <button class='tab-btn recentPhotosDate' onclick="showTab('recentPhotosDate')">${CalendarSVG()} Recent Photos Date</button>
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
