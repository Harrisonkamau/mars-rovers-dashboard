const root = document.getElementById('root');
let store = {
  roverName: 'Curiosity',
  roverNames: ['Select a rover', 'Curiosity', 'Spirit', 'Opportunity'],
};

/* -------------------  HELPER FUNCTIONS  --------------------- */
async function getRoverPhotos(roverName) {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/rovers/${roverName}`);
    const result = await response.json();
    return result.data.photos;
  } catch (error) {
    console.error(error);
  }
}

async function handleOnBarChange() {
  const selectedValue = document.getElementById('selectionBar');
  if (selectedValue) {
    updateStore(store, { roverName: selectedValue.value });
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

/* -------------------  COMPONENTS  --------------------- */
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

function Image({ url, alt }) {
  return `
    <div class=''>
      <img src=${url} alt=${alt} />
    </div>
  `;
}

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

const NavigationBar = () => `
<header class="nav">
  <div class="nav-brand">
    <a nohref>Mars Rovers Dashboard</a>
  </div>
</header>`;

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

function updateStore(store, newState) {
  Object.assign(store, newState);
  render(root, store);
}

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
