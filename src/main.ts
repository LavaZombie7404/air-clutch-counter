import "./styles/main.scss";

interface State {
  total: number;
}

const STORAGE_KEY = "air-clutch-counter-v2";

const MILESTONES = [100, 250, 500, 750, 1000, 1500, 2000];

function load(): State {
  const empty: State = { total: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

const state: State = load();

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, etc.) — counter still works in-memory
  }
}

/** Landed a clutch: total goes up. */
function hit(): void {
  state.total += 1;
  render();
}

/** Manually set the total (e.g. to your real current count). Persisted to localStorage. */
function setTotal(): void {
  const input = prompt("Set total to:", String(state.total));
  if (input === null) return;
  const value = parseInt(input, 10);
  if (Number.isNaN(value) || value < 0) {
    alert("Please enter a whole number (0 or more).");
    return;
  }
  state.total = value;
  render();
}

/** Wipe the total back to zero. */
function reset(): void {
  if (!confirm("Reset the total to zero?")) return;
  state.total = 0;
  render();
}

const app = document.querySelector<HTMLDivElement>("#app");

function render(): void {
  save();
  if (!app) return;
  app.innerHTML = `
    <main class="app">
      <h1>Air Clutch Counter</h1>
      <div class="counters">
        <button class="counter counter--total" data-action="hit">
          <span class="counter__value">${state.total}</span>
          <span class="counter__label">Total</span>
          <span class="counter__hint">click: +1</span>
        </button>
      </div>
      <h2 class="milestones__title">Milestones</h2>
      <ul class="milestones">
        ${MILESTONES.map((m) => {
          const done = state.total >= m;
          return `
            <li class="milestone ${done ? "milestone--collected" : "milestone--uncollected"}">
              <span class="milestone__goal">${m} total</span>
              <span class="milestone__status">${done ? "collected" : "uncollected"}</span>
            </li>`;
        }).join("")}
      </ul>
      <div class="actions">
        <button class="btn" data-action="set-total">Set total</button>
        <button class="btn btn--reset" data-action="reset">Reset all</button>
      </div>
    </main>
  `;
}

app?.addEventListener("click", (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
  if (!button) return;
  switch (button.dataset.action) {
    case "hit":
      hit();
      break;
    case "set-total":
      setTotal();
      break;
    case "reset":
      reset();
      break;
  }
});

render();
