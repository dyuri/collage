import { layouts } from '../layouts.js';
import { state, selectLayout } from '../app.js';

function buildThumbnail(layout) {
  const { templateColumns, templateRows, templateAreas } = layout.grid;
  const thumb = document.createElement('div');
  thumb.className = 'layout-thumb-grid';
  thumb.style.gridTemplateColumns = templateColumns;
  thumb.style.gridTemplateRows = templateRows;
  if (templateAreas) {
    thumb.style.gridTemplateAreas = templateAreas;
    // Extract area letters from template
    const letters = [...new Set(templateAreas.replace(/["\s]/g, '').split(''))];
    letters.forEach((letter) => {
      const cell = document.createElement('div');
      cell.className = 'layout-thumb-cell';
      cell.style.gridArea = letter;
      thumb.appendChild(cell);
    });
  } else {
    for (let i = 0; i < layout.slots; i++) {
      const cell = document.createElement('div');
      cell.className = 'layout-thumb-cell';
      thumb.appendChild(cell);
    }
  }
  return thumb;
}

export function renderLayoutPicker() {
  const container = document.getElementById('layout-picker');
  if (!container) return;
  container.innerHTML = '';

  layouts.forEach((layout) => {
    const btn = document.createElement('button');
    btn.className = 'layout-option' + (state.selectedLayout?.id === layout.id ? ' selected' : '');
    btn.setAttribute('aria-label', layout.name);
    btn.setAttribute('aria-pressed', state.selectedLayout?.id === layout.id ? 'true' : 'false');
    btn.title = layout.name;

    btn.appendChild(buildThumbnail(layout));

    const label = document.createElement('span');
    label.className = 'layout-option-label';
    label.textContent = layout.name;
    btn.appendChild(label);

    btn.addEventListener('click', () => selectLayout(layout));
    container.appendChild(btn);
  });
}
