import { state } from './app.js';

const OUTPUT_WIDTH = 2400;

/**
 * Compute object-fit:cover crop rect for drawImage.
 * Returns { sx, sy, sw, sh } — the source crop in image coords.
 */
function coverCrop(imgNatW, imgNatH, destW, destH, objectPosition) {
  const imgAspect = imgNatW / imgNatH;
  const destAspect = destW / destH;

  let sw, sh;
  if (imgAspect > destAspect) {
    // Image is wider than dest — crop horizontally
    sh = imgNatH;
    sw = imgNatH * destAspect;
  } else {
    // Image is taller than dest — crop vertically
    sw = imgNatW;
    sh = imgNatW / destAspect;
  }

  // Parse objectPosition percentages
  const [px, py] = objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const sx = (imgNatW - sw) * px;
  const sy = (imgNatH - sh) * py;

  return { sx, sy, sw, sh };
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

  // Background
  ctx.fillStyle = '#ffffff';
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
      // Draw placeholder grey
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(dx, dy, dw, dh);
      continue;
    }

    try {
      const img = await loadImage(slotData.objectURL);
      const { sx, sy, sw, sh } = coverCrop(
        img.naturalWidth,
        img.naturalHeight,
        dw,
        dh,
        slotData.objectPosition
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
