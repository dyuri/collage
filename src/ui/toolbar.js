import { resetCollage, setAspectRatio, setBgColor, setOverlayImage, clearOverlay, state } from '../app.js';
import { exportCollage } from '../export.js';

const RATIOS = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '3:2', w: 3, h: 2 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
  { label: '3:4', w: 3, h: 4 },
];

export function renderToolbar() {
  const toolbar = document.getElementById('toolbar');
  if (!toolbar) return;

  toolbar.innerHTML = '';

  // Aspect ratio dropdown (left side)
  const ratioSelect = document.createElement('select');
  ratioSelect.className = 'ratio-select';
  ratioSelect.setAttribute('aria-label', 'Aspect ratio');

  RATIOS.forEach(({ label, w, h }) => {
    const option = document.createElement('option');
    option.value = `${w}:${h}`;
    option.textContent = label;
    if (w === state.aspectRatio.w && h === state.aspectRatio.h) {
      option.selected = true;
    }
    ratioSelect.appendChild(option);
  });

  ratioSelect.addEventListener('change', () => {
    const [w, h] = ratioSelect.value.split(':').map(Number);
    setAspectRatio(w, h);
  });

  // Action buttons (right side)
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary';
  exportBtn.textContent = 'Export PNG';
  exportBtn.addEventListener('click', exportCollage);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-secondary';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', resetCollage);

  // Background color picker
  const colorLabel = document.createElement('label');
  colorLabel.className = 'color-label';
  colorLabel.textContent = 'BG';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.className = 'color-input';
  colorInput.value = state.bgColor;
  colorInput.setAttribute('aria-label', 'Background / gap color');
  colorInput.addEventListener('input', () => setBgColor(colorInput.value));
  colorLabel.appendChild(colorInput);

  // Overlay picker
  const hasOverlay = !!state.overlay.objectURL;

  const overlayLabel = document.createElement('label');
  overlayLabel.className = 'overlay-label';
  overlayLabel.textContent = hasOverlay ? 'Overlay ✓' : 'Overlay';
  overlayLabel.title = 'Add a transparent PNG overlay on top of the collage';

  const overlayInput = document.createElement('input');
  overlayInput.type = 'file';
  overlayInput.accept = 'image/png';
  overlayInput.hidden = true;
  overlayInput.setAttribute('aria-label', 'Overlay image');
  overlayInput.addEventListener('change', () => {
    const file = overlayInput.files[0];
    if (file) setOverlayImage(file);
  });
  overlayLabel.appendChild(overlayInput);

  const spacer = document.createElement('div');
  spacer.style.marginLeft = 'auto';

  toolbar.appendChild(ratioSelect);
  toolbar.appendChild(colorLabel);
  toolbar.appendChild(overlayLabel);

  if (hasOverlay) {
    const overlayClearBtn = document.createElement('button');
    overlayClearBtn.className = 'overlay-clear';
    overlayClearBtn.textContent = '×';
    overlayClearBtn.title = 'Remove overlay';
    overlayClearBtn.setAttribute('aria-label', 'Remove overlay');
    overlayClearBtn.addEventListener('click', clearOverlay);
    toolbar.appendChild(overlayClearBtn);
  }

  toolbar.appendChild(spacer);
  toolbar.appendChild(resetBtn);
  toolbar.appendChild(exportBtn);
}
