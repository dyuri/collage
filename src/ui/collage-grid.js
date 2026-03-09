import { state } from '../app.js';
import { createSlot } from './slot.js';

export function renderCollageGrid() {
  const container = document.getElementById('collage-grid');
  if (!container) return;
  container.innerHTML = '';

  if (!state.selectedLayout) {
    container.innerHTML = '<p class="no-layout">Select a layout above to begin.</p>';
    return;
  }

  const { templateColumns, templateRows, templateAreas } = state.selectedLayout.grid;
  container.style.gridTemplateColumns = templateColumns;
  container.style.gridTemplateRows = templateRows;
  container.style.gap = `${state.gap}px`;

  if (templateAreas) {
    container.style.gridTemplateAreas = templateAreas;
    // Extract ordered unique area letters
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
}
