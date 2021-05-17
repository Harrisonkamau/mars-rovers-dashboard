const root = document.getElementById('root');

const App = (state) => {

  return `
    <header>${state.name || 'Mars Rover'}</header>
    <main>
      <section>
        <h3>Rover Name</h3>
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
