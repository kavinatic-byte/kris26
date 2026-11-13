// ==================== Sorting Game ====================

let gameId = null;
let n = 0;
let selectedPos = [];
let comparisons = 0;
let swaps = 0;
let revealedRelations = {};
let dragPos = null;

// UI elements
const $setup = document.getElementById('setup');
const $gameBoard = document.getElementById('gameBoard');
const $winScreen = document.getElementById('winScreen');
const $nSelector = document.getElementById('nSelector');
const $startBtn = document.getElementById('startBtn');
const $slots = document.getElementById('slots');
const $selectedDisplay = document.getElementById('selectedDisplay');
const $compareBtn = document.getElementById('compareBtn');
const $swapBtn = document.getElementById('swapBtn');
const $submitBtn = document.getElementById('submitBtn');
const $message = document.getElementById('message');
const $compCount = document.getElementById('compCount');
const $swapCount = document.getElementById('swapCount');
const $moveCount = document.getElementById('moveCount');
const $winStats = document.getElementById('winStats');
const $playAgainBtn = document.getElementById('playAgainBtn');

// ==================== Event Listeners ====================

// Build N selector buttons (2-20)
for (let i = 2; i <= 20; i++) {
  const btn = document.createElement('button');
  btn.className = 'n-btn';
  btn.textContent = String(i);
  btn.addEventListener('click', () => {
    document.querySelectorAll('.n-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    n = i;
    $startBtn.disabled = false;
  });
  $nSelector.appendChild(btn);
}

$startBtn.addEventListener('click', startGame);
$playAgainBtn.addEventListener('click', resetToSetup);
$compareBtn.addEventListener('click', handleCompare);
$swapBtn.addEventListener('click', handleSwapClick);
$submitBtn.addEventListener('click', handleSubmit);

// ==================== Game Flow ====================

async function startGame() {
  const resp = await fetch('/api/sorting/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n }),
  });
  if (!resp.ok) { alert('Failed to start game'); return; }

  const data = await resp.json();
  gameId = data.gameId;
  comparisons = 0;
  swaps = 0;
  selectedPos = [];
  dragPos = null;
  revealedRelations = {};
  updateStats();

  // Build slot elements
  $slots.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.pos = String(i);
    slot.draggable = true;
    slot.innerHTML = '<div class="value">?</div><div class="pos-label">' + i + '</div>';

    // Click to select for compare
    slot.addEventListener('click', () => toggleSlot(i, slot));

    // Drag and drop to swap
    slot.addEventListener('dragstart', e => onDragStart(e, i, slot));
    slot.addEventListener('dragend', e => onDragEnd(e, slot));
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => onDrop(e, i, slot));

    $slots.appendChild(slot);
  }

  $setup.style.display = 'none';
  $gameBoard.classList.add('active');
  $winScreen.classList.remove('active');
  updateButtons();
  showMessage('', '');
}

function resetToSetup() {
  gameId = null;
  $gameBoard.classList.remove('active');
  $winScreen.classList.remove('active');
  $setup.style.display = '';
  selectedPos = [];
  dragPos = null;
  comparisons = 0;
  swaps = 0;
  revealedRelations = {};
  $slots.innerHTML = '';
  updateButtons();
  showMessage('', '');
}

// ==================== Slot Selection ====================

function toggleSlot(pos, slotEl) {
  if (selectedPos.includes(pos)) {
    selectedPos = selectedPos.filter(p => p !== pos);
    slotEl.classList.remove('selected');
  } else if (selectedPos.length < 2) {
    selectedPos.push(pos);
    slotEl.classList.add('selected');
  }
  updateButtons();
  updateSelectedDisplay();
}

// ==================== Drag & Drop Swap ====================

function onDragStart(e, pos, el) {
  dragPos = pos;
  el.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
}

function onDragEnd(e, el) {
  el.classList.remove('dragging');
  dragPos = null;
  document.querySelectorAll('.drag-over').forEach(s => s.classList.remove('drag-over'));
}

async function onDrop(e, targetPos, targetEl) {
  e.preventDefault();
  targetEl.classList.remove('drag-over');
  if (dragPos === null || dragPos === targetPos) return;
  await doSwap(dragPos, targetPos);
  dragPos = null;
}

// ==================== Operations ====================

async function doSwap(a, b) {
  const resp = await fetch('/api/sorting/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, posA: a, posB: b }),
  });
  if (!resp.ok) { showMessage('Game session lost. Start a new game.', 'error'); return; }

  swaps++;
  updateStats();

  // Update revealed relations after swap
  const newRels = {};
  for (const [key, val] of Object.entries(revealedRelations)) {
    const [p1, p2] = key.split('-').map(Number);
    const remap = pos => pos === a ? b : pos === b ? a : pos;
    const np1 = remap(p1);
    const np2 = remap(p2);
    newRels[Math.min(np1, np2) + '-' + Math.max(np1, np2)] = val;
  }
  revealedRelations = newRels;

  // Trigger swap animation on both cards
  const sA = document.querySelector('.slot[data-pos="' + a + '"]');
  const sB = document.querySelector('.slot[data-pos="' + b + '"]');
  if (sA) {
    sA.classList.add('swapping');
    sA.addEventListener('animationend', () => sA.classList.remove('swapping'), { once: true });
  }
  if (sB) {
    sB.classList.add('swapping');
    sB.addEventListener('animationend', () => sB.classList.remove('swapping'), { once: true });
  }

  showMessage('Swapped positions ' + a + ' and ' + b, 'info');
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('compared'));
  clearSelection();
}

// Button-based swap (uses current selection)
async function handleSwapClick() {
  if (selectedPos.length !== 2) return;
  const [a, b] = selectedPos;
  await doSwap(a, b);
}

async function handleCompare() {
  if (selectedPos.length !== 2) return;
  const [a, b] = selectedPos;

  const resp = await fetch('/api/sorting/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, posA: a, posB: b }),
  });
  if (!resp.ok) { showMessage('Game session lost. Start a new game.', 'error'); return; }

  const data = await resp.json();
  comparisons++;
  updateStats();

  // Highlight compared slots
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('compared'));
  const sA = document.querySelector('.slot[data-pos="' + a + '"]');
  const sB = document.querySelector('.slot[data-pos="' + b + '"]');
  if (sA) sA.classList.add('compared');
  if (sB) sB.classList.add('compared');

  const larger = data.larger;
  const key = Math.min(a, b) + '-' + Math.max(a, b);
  revealedRelations[key] = larger;

  showMessage('Position ' + larger + ' has the larger value', 'info');
  clearSelection();
}

async function handleSubmit() {
  $submitBtn.disabled = true;
  $submitBtn.textContent = '⏳ Checking...';

  const resp = await fetch('/api/sorting/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });

  $submitBtn.disabled = false;
  $submitBtn.textContent = '✅ Submit Solution';

  if (!resp.ok) { showMessage('Game session lost. Start a new game.', 'error'); return; }

  const data = await resp.json();

  if (data.correct) {
    $gameBoard.classList.remove('active');
    $winScreen.classList.add('active');
    $winStats.textContent = 'Sorted ' + n + ' numbers in ' + (comparisons + swaps) +
      ' moves (' + comparisons + ' comparisons, ' + swaps + ' swaps)';
  } else {
    showMessage('Not sorted! Numbers have been reshuffled — start over.', 'error');
    clearSelection();
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('compared'));
    comparisons = 0;
    swaps = 0;
    revealedRelations = {};
    updateStats();
  }
}

// ==================== Helpers ====================

function updateButtons() {
  const twoSelected = selectedPos.length === 2;
  $compareBtn.disabled = !twoSelected;
  $swapBtn.disabled = !twoSelected;
}

function updateSelectedDisplay() {
  if (selectedPos.length === 0) {
    $selectedDisplay.textContent = 'Select two positions, or drag to swap';
  } else if (selectedPos.length === 1) {
    $selectedDisplay.innerHTML = 'Position <span>' + selectedPos[0] + '</span> selected. Pick another, or drag to swap.';
  } else {
    $selectedDisplay.innerHTML = 'Position <span>' + selectedPos[0] + '</span> and <span>' + selectedPos[1] + '</span> selected';
  }
}

function updateStats() {
  $compCount.textContent = String(comparisons);
  $swapCount.textContent = String(swaps);
  $moveCount.textContent = String(comparisons + swaps);
}

function showMessage(text, type) {
  $message.textContent = text;
  $message.className = 'message';
  if (text) {
    $message.classList.add('show', type);
  }
}

function clearSelection() {
  document.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
  selectedPos = [];
  updateButtons();
  updateSelectedDisplay();
}
