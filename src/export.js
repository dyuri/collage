import { state } from './app.js';

const OUTPUT_WIDTH = 2400;

/**
 * Compute the source crop rect for drawImage that replicates
 * object-fit:cover + translate(panX,panY) scale(zoom) on the canvas.
 *
 * @param {number} imgNatW - natural image width
 * @param {number} imgNatH - natural image height
 * @param {number} destW   - canvas destination rect width (px)
 * @param {number} destH   - canvas destination rect height (px)
 * @param {number} panX    - pan in canvas dest pixels (= CSS pan * scale)
 * @param {number} panY    - pan in canvas dest pixels
 * @param {number} zoom    - zoom factor (1 = cover fill)
 * @returns {{ sx, sy, sw, sh }}
 */
function coverCrop(imgNatW, imgNatH, destW, destH, panX, panY, zoom) {
  const imgAspect = imgNatW / imgNatH;
  const destAspect = destW / destH;

  // Base cover-fit source rect (zoom=1, centered)
  let sw0, sh0;
  if (imgAspect > destAspect) {
    sh0 = imgNatH;
    sw0 = imgNatH * destAspect;
  } else {
    sw0 = imgNatW;
    sh0 = imgNatW / destAspect;
  }
  const sx0 = (imgNatW - sw0) / 2;
  const sy0 = (imgNatH - sh0) / 2;

  // Zoomed: visible source rect shrinks by zoom
  const sw = sw0 / zoom;
  const sh = sh0 / zoom;

  // Center of the zoomed crop (in source coords)
  const sxCenter = sx0 + (sw0 - sw) / 2;
  const syCenter = sy0 + (sh0 - sh) / 2;

  // Pan: 1 dest canvas pixel = sw/destW source pixels
  // Positive pan (image moved right) → we see more of the left → sx decreases
  const sx = sxCenter - panX * (sw / destW);
  const sy = syCenter - panY * (sh / destH);

  return {
    sx: Math.max(0, Math.min(imgNatW - sw, sx)),
    sy: Math.max(0, Math.min(imgNatH - sh, sy)),
    sw,
    sh,
  };
}

export async function exportCollage() {
  if (!state.selectedLayout) {
    alert('Please select a layout first.');
    return;
  }

  const gridEl = document.getElementById('collage-grid');
  const slotEls = gridEl.querySelectorAll('.slot');
  if (slotEls.length === 0) return;

  const gridRect = gridEl.getBoundingClientRect();
  const scale = OUTPUT_WIDTH / gridRect.width;
  const outputHeight = Math.round(gridRect.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = state.bgColor;
  ctx.fillRect(0, 0, OUTPUT_WIDTH, outputHeight);

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  for (let i = 0; i < slotEls.length; i++) {
    const slotEl = slotEls[i];
    const slotRect = slotEl.getBoundingClientRect();
    const slotData = state.slots[i];

    const dx = Math.round((slotRect.left - gridRect.left) * scale);
    const dy = Math.round((slotRect.top - gridRect.top) * scale);
    const dw = Math.round(slotRect.width * scale);
    const dh = Math.round(slotRect.height * scale);

    if (!slotData.objectURL) {
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(dx, dy, dw, dh);
      continue;
    }

    try {
      const img = await loadImage(slotData.objectURL);
      // Convert pan from CSS pixels to canvas pixels
      const panX = slotData.pan.x * scale;
      const panY = slotData.pan.y * scale;
      const { sx, sy, sw, sh } = coverCrop(
        img.naturalWidth, img.naturalHeight,
        dw, dh,
        panX, panY, slotData.zoom
      );
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    } catch {
      ctx.fillStyle = '#999999';
      ctx.fillRect(dx, dy, dw, dh);
    }
  }

  canvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `collage-${Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },
    'image/png'
  );
}
