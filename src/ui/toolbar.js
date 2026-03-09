import { resetCollage } from '../app.js';
import { exportCollage } from '../export.js';

export function renderToolbar() {
  const toolbar = document.getElementById('toolbar');
  if (!toolbar) return;

  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary';
  exportBtn.textContent = 'Export PNG';
  exportBtn.addEventListener('click', exportCollage);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-secondary';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', resetCollage);

  toolbar.appendChild(resetBtn);
  toolbar.appendChild(exportBtn);
}
