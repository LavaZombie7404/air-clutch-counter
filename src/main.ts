import "./styles/main.scss";

interface State {
  total: number;
  inARow: number;
  bld: number;
  best: number;
}

const STORAGE_KEY = "air-clutch-counter-v2";

const MILESTONES = [100, 250, 500, 750, 1000, 1500, 2000];

function load(): State {
  const empty: State = { total: 0, inARow: 0, bld: 0, best: 0 };
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
    // storage unavailable (private mode, etc.) — counters still work in-memory
  }
}

/** Landed a normal clutch: streak + total go up. */
function hit(): void {
  state.inARow += 1;
  state.total += 1;
  if (state.inARow > state.best) state.best = state.inARow;
  render();
}

/** Missed: Total still counts the attempt, but the streak resets. */
function miss(): void {
  state.total += 1;
  state.inARow = 0;
  render();
}

/** Landed a blind clutch: BLD + total go up, streak untouched. */
function bldHit(): void {
  state.bld += 1;
  state.total += 1;
  render();
}

/** Wipe everything back to zero. */
function reset(): void {
  if (!confirm("Reset all counters to zero?")) return;
  state.total = 0;
  state.inARow = 0;
  state.bld = 0;
  state.best = 0;
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
        <button class="counter counter--total" data-action="miss">
          <span class="counter__value">${state.total}</span>
          <span class="counter__label">Total</span>
          <span class="counter__hint">click: +1, reset streak</span>
        </button>
      </div>
      <aside class="extra">
        <h2 class="extra__title">Extra</h2>
        <button class="counter counter--row" data-action="hit">
          <span class="counter__value">${state.inARow}</span>
          <span class="counter__label">In a row</span>
          <span class="counter__hint">click: +1 (also Total)</span>
        </button>
        <button class="counter counter--bld" data-action="bld">
          <span class="counter__value">${state.bld}</span>
          <span class="counter__label">BLD</span>
          <span class="counter__hint">click: +1 (also Total)</span>
        </button>
      </aside>
      <p class="best">Best streak: <strong>${state.best}</strong></p>
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
      <button class="reset" data-action="reset">Reset all</button>
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
    case "miss":
      miss();
      break;
    case "bld":
      bldHit();
      break;
    case "reset":
      reset();
      break;
  }
});

render();
