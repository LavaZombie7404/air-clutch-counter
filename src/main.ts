import "./styles/main.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <main class="app">
      <h1>Air Clutch Counter</h1>
      <p class="app__hint">Scaffold ready — logic goes here.</p>
    </main>
  `;
}
