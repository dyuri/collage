import { state, setSlotImage } from '../app.js';
import { renderCollageGrid } from './collage-grid.js';

export function createSlot(index, gridArea) {
  const slotData = state.slots[index];

  const el = document.createElement('div');
  el.className = 'slot';
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `Image slot ${index + 1}. Click or drop an image.`);
  if (gridArea) el.style.gridArea = gridArea;

  // Hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlotImage(index, file);
      renderCollageGrid();
    }
  });
  el.appendChild(fileInput);

  // Content area
  if (slotData.objectURL) {
    const img = document.createElement('img');
    img.src = slotData.objectURL;
    img.style.objectPosition = slotData.objectPosition;
    img.draggable = false;
    img.alt = '';
    el.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'slot-placeholder';
    placeholder.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
      <span>Drop or click</span>
    `;
    el.appendChild(placeholder);
  }

  // Click to pick file
  el.addEventListener('click', () => fileInput.click());
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // Drag and drop
  el.addEventListener('dragenter', (e) => {
    e.preventDefault();
    el.classList.add('drag-over');
  });
  el.addEventListener('dragleave', (e) => {
    if (!el.contains(e.relatedTarget)) {
      el.classList.remove('drag-over');
    }
  });
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    el.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSlotImage(index, file);
      renderCollageGrid();
    }
  });

  return el;
}
