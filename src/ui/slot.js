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

  if (slotData.objectURL) {
    const img = document.createElement('img');
    img.src = slotData.objectURL;
    img.draggable = false;
    img.alt = '';
    el.classList.add('has-image');
    el.appendChild(img);

    // Position as soon as natural dimensions are known
    const onReady = () => {
      if (!img.naturalWidth) return;
      if (!slotData.naturalWidth) {
        slotData.naturalWidth = img.naturalWidth;
        slotData.naturalHeight = img.naturalHeight;
      }
      // Defer to ensure el is in DOM and has layout
      const tryPosition = () => {
        if (el.offsetWidth > 0) {
          positionImage(img, el, slotData);
        } else {
          requestAnimationFrame(tryPosition);
        }
      };
      tryPosition();
    };
    img.addEventListener('load', onReady);
    if (img.complete) onReady();

    setupImageInteractions(el, img, index, fileInput);
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
    el.addEventListener('click', () => fileInput.click());
  }

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // File drag-and-drop from OS
  el.addEventListener('dragenter', (e) => {
    e.preventDefault();
    el.classList.add('drag-over');
  });
  el.addEventListener('dragleave', (e) => {
    if (!el.contains(e.relatedTarget)) el.classList.remove('drag-over');
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

/**
 * Position the image inside its slot using explicit width/height/left/top.
 * This replaces object-fit:cover so the full image is accessible via pan.
 */
export function positionImage(imgEl, slotEl, slotData) {
  const iw = slotData.naturalWidth;
  const ih = slotData.naturalHeight;
  if (!iw || !ih) return;

  const sw = slotEl.offsetWidth;
  const sh = slotEl.offsetHeight;
  if (!sw || !sh) return;

  // Scale so image covers the slot (same as object-fit:cover)
  const coverScale = Math.max(sw / iw, sh / ih);
  const dw = iw * coverScale * slotData.zoom;
  const dh = ih * coverScale * slotData.zoom;

  imgEl.style.width = `${dw}px`;
  imgEl.style.height = `${dh}px`;
  imgEl.style.left = `${(sw - dw) / 2 + slotData.pan.x}px`;
  imgEl.style.top = `${(sh - dh) / 2 + slotData.pan.y}px`;
}

/**
 * Clamp pan so the image always covers the entire slot (no empty corners).
 * At zoom=1 with a landscape image in a square slot, maxPanX > 0,
 * allowing the user to pan left/right to reveal the parts hidden by the initial crop.
 */
function clampPan(slotEl, slotData) {
  const iw = slotData.naturalWidth;
  const ih = slotData.naturalHeight;
  if (!iw || !ih) return;

  const sw = slotEl.offsetWidth;
  const sh = slotEl.offsetHeight;
  if (!sw || !sh) return;

  const coverScale = Math.max(sw / iw, sh / ih);
  const dw = iw * coverScale * slotData.zoom;
  const dh = ih * coverScale * slotData.zoom;

  // Max pan = half the overflow beyond the slot edge
  const maxX = Math.max(0, (dw - sw) / 2);
  const maxY = Math.max(0, (dh - sh) / 2);

  slotData.pan.x = Math.max(-maxX, Math.min(maxX, slotData.pan.x));
  slotData.pan.y = Math.max(-maxY, Math.min(maxY, slotData.pan.y));
}

function setupImageInteractions(slotEl, imgEl, index, fileInput) {
  const slotData = state.slots[index];

  let dragMoved = false;
  let dragStart = null;
  let panStart = null;

  const activePointers = new Map();
  let pinchStartDist = null;
  let pinchStartZoom = null;

  slotEl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 1) {
      dragMoved = false;
      dragStart = { x: e.clientX, y: e.clientY };
      panStart = { ...slotData.pan };
      slotEl.setPointerCapture(e.pointerId);
    } else if (activePointers.size === 2) {
      dragStart = null;
      const pts = [...activePointers.values()];
      pinchStartDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartZoom = slotData.zoom;
    }
  });

  slotEl.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 2 && pinchStartDist !== null) {
      const pts = [...activePointers.values()];
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      slotData.zoom = Math.max(1, Math.min(10, pinchStartZoom * (dist / pinchStartDist)));
      clampPan(slotEl, slotData);
      positionImage(imgEl, slotEl, slotData);
    } else if (activePointers.size === 1 && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (!dragMoved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        dragMoved = true;
        slotEl.classList.add('dragging');
      }
      if (dragMoved) {
        slotData.pan = { x: panStart.x + dx, y: panStart.y + dy };
        clampPan(slotEl, slotData);
        positionImage(imgEl, slotEl, slotData);
      }
    }
  });

  const onPointerEnd = (e) => {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) pinchStartDist = null;
    if (activePointers.size === 0) {
      slotEl.classList.remove('dragging');
      dragStart = null;
    }
  };
  slotEl.addEventListener('pointerup', onPointerEnd);
  slotEl.addEventListener('pointercancel', onPointerEnd);

  slotEl.addEventListener('click', () => {
    if (dragMoved) {
      dragMoved = false;
      return;
    }
    fileInput.click();
  });

  slotEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    slotData.zoom = Math.max(1, Math.min(10, slotData.zoom * factor));
    clampPan(slotEl, slotData);
    positionImage(imgEl, slotEl, slotData);
  }, { passive: false });
}
