import { state } from '../app.js';
import { createSlot, repositionAllImages } from './slot.js';

let resizeObserver = null;

function applyGridSizes(gridEl) {
  gridEl.style.gridTemplateColumns = state.columnSizes.map(s => `${s}fr`).join(' ');
  gridEl.style.gridTemplateRows = state.rowSizes.map(s => `${s}fr`).join(' ');
}

function updateDividerPositions(gridEl) {
  const colTotal = state.columnSizes.reduce((a, b) => a + b, 0);
  gridEl.querySelectorAll('.divider-col').forEach((div, i) => {
    const pct = state.columnSizes.slice(0, i + 1).reduce((a, b) => a + b, 0) / colTotal * 100;
    div.style.left = `${pct}%`;
  });

  const rowTotal = state.rowSizes.reduce((a, b) => a + b, 0);
  gridEl.querySelectorAll('.divider-row').forEach((div, i) => {
    const pct = state.rowSizes.slice(0, i + 1).reduce((a, b) => a + b, 0) / rowTotal * 100;
    div.style.top = `${pct}%`;
  });
}

function setupColDividerDrag(handle, gridEl, divIdx) {
  handle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    handle.classList.add('active');

    const startX = e.clientX;
    const gridWidth = gridEl.offsetWidth;
    const startSizes = [...state.columnSizes];
    const totalFr = startSizes[divIdx] + startSizes[divIdx + 1];
    const minFr = totalFr * 0.1;

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const allFr = state.columnSizes.reduce((a, b) => a + b, 0);
      const deltaFr = (dx / gridWidth) * allFr;
      const newLeft = Math.max(minFr, Math.min(totalFr - minFr, startSizes[divIdx] + deltaFr));
      state.columnSizes[divIdx] = newLeft;
      state.columnSizes[divIdx + 1] = totalFr - newLeft;
      applyGridSizes(gridEl);
      updateDividerPositions(gridEl);
      requestAnimationFrame(() => repositionAllImages(gridEl));
    };

    const onUp = () => {
      handle.classList.remove('active');
      handle.removeEventListener('pointermove', onMove);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp, { once: true });
    handle.addEventListener('pointercancel', onUp, { once: true });
  });
}

function setupRowDividerDrag(handle, gridEl, divIdx) {
  handle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    handle.classList.add('active');

    const startY = e.clientY;
    const gridHeight = gridEl.offsetHeight;
    const startSizes = [...state.rowSizes];
    const totalFr = startSizes[divIdx] + startSizes[divIdx + 1];
    const minFr = totalFr * 0.1;

    const onMove = (e) => {
      const dy = e.clientY - startY;
      const allFr = state.rowSizes.reduce((a, b) => a + b, 0);
      const deltaFr = (dy / gridHeight) * allFr;
      const newTop = Math.max(minFr, Math.min(totalFr - minFr, startSizes[divIdx] + deltaFr));
      state.rowSizes[divIdx] = newTop;
      state.rowSizes[divIdx + 1] = totalFr - newTop;
      applyGridSizes(gridEl);
      updateDividerPositions(gridEl);
      requestAnimationFrame(() => repositionAllImages(gridEl));
    };

    const onUp = () => {
      handle.classList.remove('active');
      handle.removeEventListener('pointermove', onMove);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp, { once: true });
    handle.addEventListener('pointercancel', onUp, { once: true });
  });
}

function addDividers(gridEl) {
  const colTotal = state.columnSizes.reduce((a, b) => a + b, 0);
  for (let i = 0; i < state.columnSizes.length - 1; i++) {
    const pct = state.columnSizes.slice(0, i + 1).reduce((a, b) => a + b, 0) / colTotal * 100;
    const handle = document.createElement('div');
    handle.className = 'divider divider-col';
    handle.style.left = `${pct}%`;
    setupColDividerDrag(handle, gridEl, i);
    gridEl.appendChild(handle);
  }

  const rowTotal = state.rowSizes.reduce((a, b) => a + b, 0);
  for (let i = 0; i < state.rowSizes.length - 1; i++) {
    const pct = state.rowSizes.slice(0, i + 1).reduce((a, b) => a + b, 0) / rowTotal * 100;
    const handle = document.createElement('div');
    handle.className = 'divider divider-row';
    handle.style.top = `${pct}%`;
    setupRowDividerDrag(handle, gridEl, i);
    gridEl.appendChild(handle);
  }
}

export function renderCollageGrid() {
  const container = document.getElementById('collage-grid');
  if (!container) return;

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  container.innerHTML = '';

  if (!state.selectedLayout) {
    container.innerHTML = '<p class="no-layout">Select a layout above to begin.</p>';
    return;
  }

  applyGridSizes(container);
  container.style.gap = `${state.gap}px`;
  container.style.aspectRatio = `${state.aspectRatio.w} / ${state.aspectRatio.h}`;
  container.style.background = state.bgColor;

  const { templateAreas } = state.selectedLayout.grid;
  if (templateAreas) {
    container.style.gridTemplateAreas = templateAreas;
    const letters = [...new Set(templateAreas.replace(/["\s]/g, '').split(''))];
    letters.forEach((letter, i) => {
      const slot = createSlot(i, letter);
      container.appendChild(slot);
    });
  } else {
    container.style.gridTemplateAreas = '';
    for (let i = 0; i < state.selectedLayout.slots; i++) {
      const slot = createSlot(i, null);
      container.appendChild(slot);
    }
  }

  addDividers(container);

  resizeObserver = new ResizeObserver(() => repositionAllImages(container));
  resizeObserver.observe(container);
}
