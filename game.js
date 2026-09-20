const COLORS = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#7b2cbf", "#f77f00", "#90e0ef"];

const state = {
  towers: [[], [], []],
  diskCount: 4,
  selected: null,
  moves: 0,
  history: [],
  startedAt: null,
  timerId: null,
  solving: false,
};

const els = {
  stacks: [...document.querySelectorAll(".stack")],
  pegs: [...document.querySelectorAll(".peg")],
  moves: document.getElementById("moves"),
  minMoves: document.getElementById("min-moves"),
  timer: document.getElementById("timer"),
  hint: document.getElementById("hint"),
  diskCount: document.getElementById("disk-count"),
  dialog: document.getElementById("win-dialog"),
  winText: document.getElementById("win-text"),
};

function minMoves(n) {
  return 2 ** n - 1;
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  if (state.startedAt) return;
  state.startedAt = Date.now();
  state.timerId = setInterval(() => {
    els.timer.textContent = formatTime(Date.now() - state.startedAt);
  }, 250);
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function reset(n = state.diskCount) {
  stopTimer();
  state.diskCount = n;
  state.towers = [Array.from({ length: n }, (_, i) => n - i), [], []];
  state.selected = null;
  state.moves = 0;
  state.history = [];
  state.startedAt = null;
  state.solving = false;
  els.timer.textContent = "00:00";
  els.moves.textContent = "0";
  els.minMoves.textContent = String(minMoves(n));
  els.hint.textContent = "Chọn đĩa trên cùng, rồi chọn cột đích.";
  els.dialog.close();
  render();
}

function topDisk(peg) {
  const tower = state.towers[peg];
  return tower[tower.length - 1] ?? null;
}

function canMove(from, to) {
  const disk = topDisk(from);
  if (!disk) return false;
  const dest = topDisk(to);
  return dest === null || disk < dest;
}

function move(from, to) {
  if (from === to || !canMove(from, to)) return false;
  const disk = state.towers[from].pop();
  state.towers[to].push(disk);
  state.history.push([from, to]);
  state.moves += 1;
  els.moves.textContent = String(state.moves);
  startTimer();
  render();
  if (state.towers[2].length === state.diskCount) {
    stopTimer();
    const elapsed = formatTime(Date.now() - state.startedAt);
    const perfect = state.moves === minMoves(state.diskCount);
    els.winText.textContent = perfect
      ? `Bạn giải tối ưu với ${state.moves} bước trong ${elapsed}.`
      : `Xong sau ${state.moves} bước (tối thiểu ${minMoves(state.diskCount)}) trong ${elapsed}.`;
    els.dialog.showModal();
  }
  return true;
}

function render() {
  els.pegs.forEach((peg, i) => {
    peg.classList.toggle("selected", state.selected === i);
  });
  els.stacks.forEach((stack, i) => {
    stack.replaceChildren();
    state.towers[i].forEach((size) => {
      const disk = document.createElement("div");
      disk.className = "disk";
      if (state.selected === i && size === topDisk(i)) disk.classList.add("lifted");
      disk.style.width = `${28 + size * 18}px`;
      disk.style.background = COLORS[(size - 1) % COLORS.length];
      disk.dataset.size = String(size);
      stack.append(disk);
    });
  });
}

function selectPeg(index) {
  if (state.solving) return;
  if (state.selected === null) {
    if (!topDisk(index)) {
      flashInvalid(index);
      return;
    }
    state.selected = index;
    els.hint.textContent = "Chọn cột để đặt đĩa.";
    render();
    return;
  }
  if (state.selected === index) {
    state.selected = null;
    els.hint.textContent = "Chọn đĩa trên cùng, rồi chọn cột đích.";
    render();
    return;
  }
  const from = state.selected;
  state.selected = null;
  if (!move(from, index)) {
    flashInvalid(index);
    els.hint.textContent = "Không được đặt đĩa lớn lên đĩa nhỏ.";
  } else {
    els.hint.textContent = "Tốt. Tiếp tục chuyển đĩa sang cột C.";
  }
}

function flashInvalid(index) {
  const peg = els.pegs[index];
  peg.classList.add("invalid");
  setTimeout(() => peg.classList.remove("invalid"), 280);
}

function undo() {
  if (state.solving || !state.history.length || state.towers[2].length === state.diskCount) return;
  const [from, to] = state.history.pop();
  const disk = state.towers[to].pop();
  state.towers[from].push(disk);
  state.moves = Math.max(0, state.moves - 1);
  els.moves.textContent = String(state.moves);
  state.selected = null;
  render();
}

function solveMoves(n, from, to, aux, acc = []) {
  if (n === 0) return acc;
  solveMoves(n - 1, from, aux, to, acc);
  acc.push([from, to]);
  solveMoves(n - 1, aux, to, from, acc);
  return acc;
}

async function autoSolve() {
  if (state.solving) return;
  reset(state.diskCount);
  state.solving = true;
  els.hint.textContent = "Máy đang giải...";
  const steps = solveMoves(state.diskCount, 0, 2, 1);
  for (const [from, to] of steps) {
    await new Promise((r) => setTimeout(r, 280));
    move(from, to);
  }
  state.solving = false;
}

els.pegs.forEach((peg) => {
  peg.addEventListener("click", () => selectPeg(Number(peg.dataset.peg)));
});

document.getElementById("btn-reset").addEventListener("click", () => reset());
document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-solve").addEventListener("click", autoSolve);
els.diskCount.addEventListener("change", (e) => reset(Number(e.target.value)));
els.dialog.addEventListener("close", () => reset());

reset(4);
