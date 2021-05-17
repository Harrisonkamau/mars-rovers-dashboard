const root = document.getElementById('root');

const SelectionBar = ({ options, onChange }) => {
  return `
    <select onChange=${onChange}>
      ${options.map(({ label, value }) => `<option value=${value}>${label}</option>`)}
    </select>
  `;
};

const options = ['Curiosity', 'Spirit', 'Opportunity', 'Perserverance'].map((item) => ({
  label: item,
  value: item.toLowerCase(),
}));

const handleOnChange = (event) => console.log('event', event.target);

const App = (state) => {
  return `
    <header>${state.name || 'Mars Rover'}</header>
    <main>
      <section>
        <h3>Rover Name</h3>
        ${SelectionBar({ options, onChange: handleOnChange })}
      </section>
    </main>
  `;
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

window.addEventListener('load', () => {
  render(root, { name: 'Harrison' });
});
