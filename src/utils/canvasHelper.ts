/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatternConfig, TraditionalColorFilter } from '../types';

/**
 * Loads an SVG string into an HTMLImageElement
 */
export function loadSvgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Loads an image URL (such as data URL or uploaded file URL) into an HTMLImageElement
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Creates a recolored version of the source image/canvas on a new canvas
 * based on traditional Chinese color filters.
 */
export function applyColorFilter(
  source: HTMLImageElement | HTMLCanvasElement,
  filter: TraditionalColorFilter
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width || (source as HTMLCanvasElement).width;
  canvas.height = source.height || (source as HTMLCanvasElement).height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Draw the source image
  ctx.drawImage(source, 0, 0);

  if (filter === 'ORIGINAL') {
    return canvas;
  }

  // Create an offscreen buffer to apply color composite
  const bufferCanvas = document.createElement('canvas');
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;
  const bCtx = bufferCanvas.getContext('2d');
  if (!bCtx) return canvas;

  // Draw solid color or gradient in buffer
  if (filter === 'GOLDEN') {
    // Elegant shining golden gradient
    const grad = bCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#FFE894'); // Bright gold
    grad.addColorStop(0.3, '#D4AF37'); // Classic gold
    grad.addColorStop(0.7, '#9A7B1C'); // Deep bronze gold
    grad.addColorStop(1, '#FFE894');
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (filter === 'VERMILION') {
    // Rich traditional Chinese imperial vermilion red
    const grad = bCtx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 5,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.2
    );
    grad.addColorStop(0, '#E74C3C'); // Vermilion light
    grad.addColorStop(1, '#922B21'); // Deep lacquered red
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (filter === 'COBALT') {
    // Deep Ming cobalt blue (青花瓷色)
    const grad = bCtx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 5,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.2
    );
    grad.addColorStop(0, '#1F4E79'); // Cobalt light
    grad.addColorStop(1, '#0B2F54'); // Cobalt deep
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (filter === 'INK') {
    // Elegant Chinese ink wash gray-black
    const grad = bCtx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#2C3E50'); // Ink charcoal
    grad.addColorStop(1, '#1A252F'); // Pure ink black
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Use 'source-in' composite on the buffer to mask it to the original image alpha
  // But wait, it's easier to mask the buffer canvas with the original drawing
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = canvas.width;
  finalCanvas.height = canvas.height;
  const fCtx = finalCanvas.getContext('2d');
  if (!fCtx) return canvas;

  // Draw original first to get its alpha mask
  fCtx.drawImage(source, 0, 0);
  // Source-in composite: draws the colored buffer ONLY where original pixels exist
  fCtx.globalCompositeOperation = 'source-in';
  fCtx.drawImage(bufferCanvas, 0, 0);

  // For the INK filter, we can also blend a bit of luminance for photo uploads,
  // but for SVG outlines, pure source-in is perfect. If the user uploaded a complex JPG,
  // source-in makes it a solid silhouette. To handle photo uploads where we want to preserve
  // textures, let's write a fallback: if the original has zero transparent pixels, or we want
  // true photo tinting, we can do pixel-level blending:
  // Let's implement an intelligent fallback:
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let hasAlpha = false;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 250) {
        hasAlpha = true;
        break;
      }
    }

    // If it's a solid photo (no alpha), we do photographic tinting instead of silhouette
    if (!hasAlpha) {
      const tintedCanvas = document.createElement('canvas');
      tintedCanvas.width = canvas.width;
      tintedCanvas.height = canvas.height;
      const tCtx = tintedCanvas.getContext('2d');
      if (!tCtx) return finalCanvas;

      tCtx.drawImage(source, 0, 0);
      
      // Convert to grayscale first
      const tImgData = tCtx.getImageData(0, 0, canvas.width, canvas.height);
      const tPixels = tImgData.data;
      for (let i = 0; i < tPixels.length; i += 4) {
        const r = tPixels[i];
        const g = tPixels[i + 1];
        const b = tPixels[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        tPixels[i] = gray;
        tPixels[i + 1] = gray;
        tPixels[i + 2] = gray;
      }
      tCtx.putImageData(tImgData, 0, 0);

      // Now blend with traditional color palette
      tCtx.globalCompositeOperation = 'color';
      tCtx.fillStyle = filter === 'GOLDEN' ? '#D4AF37' :
                       filter === 'VERMILION' ? '#C0392B' :
                       filter === 'COBALT' ? '#0B2F54' : '#2C3E50';
      tCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Add multiply for extra contrast
      tCtx.globalCompositeOperation = 'multiply';
      tCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      tCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      return tintedCanvas;
    }
  } catch (e) {
    // Fallback if cross-origin or ImageData fails
    console.warn('ImageData color filter fallback:', e);
  }

  return finalCanvas;
}

/**
 * Draws the F1 all-over pattern onto a target canvas
 */
export function drawF1Pattern(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
  config: PatternConfig
) {
  ctx.clearRect(0, 0, width, height);

  const baseSize = 80; // Standard base size for a tile
  const tileW = baseSize * config.f1Scale;
  const tileH = baseSize * config.f1Scale;

  if (tileW < 5 || tileH < 5) return;

  const stepX = tileW * config.f1SpacingX;
  const stepY = tileH * config.f1SpacingY;
  const rad = (config.f1Angle * Math.PI) / 180;

  // We need to cover a larger bounds to account for rotation
  const maxDim = Math.max(width, height);
  const startX = -maxDim;
  const endX = width + maxDim;
  const startY = -maxDim;
  const endY = height + maxDim;

  ctx.save();
  // To rotate the entire grid cleanly around the center of the canvas
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  ctx.translate(-width / 2, -height / 2);

  for (let x = startX; x < endX; x += stepX) {
    for (let y = startY; y < endY; y += stepY) {
      ctx.drawImage(img, x - tileW / 2, y - tileH / 2, tileW, tileH);
    }
  }

  ctx.restore();
}

/**
 * Draws the F6 symmetry period block on a target canvas
 */
export function drawF6Symmetry(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
  config: PatternConfig
) {
  ctx.clearRect(0, 0, width, height);

  const baseSize = 100; // Larger base size for symmetry detail
  const size = baseSize * config.f6Scale;
  const cx = width / 2;
  const cy = height / 2;

  // The 4 quadrants representing the full F6 symmetry
  // Quadrant 1: Top-Left (Original)
  // Quadrant 2: Top-Right (Horizontal reflection: flipped left-right)
  // Quadrant 3: Bottom-Right (180 deg Rotation: flipped horizontally and vertically)
  // Quadrant 4: Bottom-Left (Vertical reflection: flipped up-down)

  const drawHalfWidth = size;
  const drawHalfHeight = size;

  const spacing = 15; // Small margin between quadrants for crystal clear visual structure

  // --- Quadrant 1: Top-Left (Original) ---
  ctx.save();
  ctx.translate(cx - drawHalfWidth / 2 - spacing, cy - drawHalfHeight / 2 - spacing);
  ctx.drawImage(img, -drawHalfWidth / 2, -drawHalfHeight / 2, drawHalfWidth, drawHalfHeight);
  ctx.restore();

  // --- Quadrant 2: Top-Right (Horizontal mirror) ---
  ctx.save();
  ctx.translate(cx + drawHalfWidth / 2 + spacing, cy - drawHalfHeight / 2 - spacing);
  ctx.scale(-1, 1); // Flip horizontally
  ctx.drawImage(img, -drawHalfWidth / 2, -drawHalfHeight / 2, drawHalfWidth, drawHalfHeight);
  ctx.restore();

  // --- Quadrant 3: Bottom-Right (180 Rotation) ---
  ctx.save();
  ctx.translate(cx + drawHalfWidth / 2 + spacing, cy + drawHalfHeight / 2 + spacing);
  ctx.scale(-1, -1); // Flip horizontally and vertically (equivalent to 180 deg rotation)
  ctx.drawImage(img, -drawHalfWidth / 2, -drawHalfHeight / 2, drawHalfWidth, drawHalfHeight);
  ctx.restore();

  // --- Quadrant 4: Bottom-Left (Vertical mirror) ---
  ctx.save();
  ctx.translate(cx - drawHalfWidth / 2 - spacing, cy + drawHalfHeight / 2 + spacing);
  ctx.scale(1, -1); // Flip vertically
  ctx.drawImage(img, -drawHalfWidth / 2, -drawHalfHeight / 2, drawHalfWidth, drawHalfHeight);
  ctx.restore();

  // --- Academic overlays ---
  if (config.showSymmetryAxes) {
    ctx.save();
    
    // Draw vertical mirror line (Golden/Red dashed line)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)'; // Classic Gold
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 40);
    ctx.lineTo(cx, height - 40);
    ctx.stroke();

    // Draw horizontal glide-reflection line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.beginPath();
    ctx.moveTo(40, cy);
    ctx.lineTo(width - 40, cy);
    ctx.stroke();

    // Label axes
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('纵向镜像轴 (Vertical Mirror)', cx + 8, 30);
    ctx.fillText('横向滑动反射轴 (Horizontal Glide Mirror)', 45, cy - 8);

    // Draw 2-fold rotation center indicator at intersection
    ctx.fillStyle = '#C0392B'; // Crimson
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    ctx.fillText('2-Fold Center', cx + 12, cy + 15);

    // Draw grid bounds
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      cx - drawHalfWidth - spacing - 10,
      cy - drawHalfHeight - spacing - 10,
      drawHalfWidth * 2 + spacing * 2 + 20,
      drawHalfHeight * 2 + spacing * 2 + 20
    );

    ctx.restore();
  }
}

/**
 * Draws the Polar 团窠纹 (circular Concentric Composition) on a target canvas
 */
export function drawPolarPattern(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
  config: PatternConfig
) {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 20;

  const baseSize = 65; // Normal sizing for circular components

  // Helper to draw a single ring
  const drawRing = (radius: number, count: number, angleShift: number) => {
    if (count <= 0 || radius <= 0) return;
    
    // Scale element size slightly based on layer radius so it naturally tapers inward
    const layerScale = (radius / maxRadius) * 0.9 + 0.1;
    const tileW = baseSize * config.f1Scale * layerScale;
    const tileH = baseSize * config.f1Scale * layerScale;

    for (let i = 0; i < count; i++) {
      const theta = (i * 2 * Math.PI) / count + angleShift;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(theta);
      
      // Draw at the specified radius
      ctx.translate(0, -radius);

      if (!config.polarRotateElements) {
        // Rotate back to keep the image strictly upright
        ctx.rotate(-theta);
      }

      ctx.drawImage(img, -tileW / 2, -tileH / 2, tileW, tileH);
      ctx.restore();
    }
  };

  // Draw concentric layers
  const r1 = maxRadius * config.polarRadius1;
  const r2 = maxRadius * config.polarRadius2;
  const r3 = maxRadius * config.polarRadius3;

  // Layer 1: Outer Layer
  const shift1 = 0;
  drawRing(r1, config.polarCount1, shift1);

  // Layer 2: Middle Layer
  if (config.polarLayers >= 2) {
    // Interlaced shift: offset middle layer by half of the outer or middle gap
    const shift2 = config.polarInterlace ? Math.PI / config.polarCount2 : 0;
    drawRing(r2, config.polarCount2, shift2);
  }

  // Layer 3: Inner Layer
  if (config.polarLayers >= 3 && config.polarCount3 > 0) {
    const shift3 = config.polarInterlace ? Math.PI / config.polarCount3 : 0;
    drawRing(r3, config.polarCount3, shift3);
  }

  // Draw Central Accent Medallion
  // If there's a 3rd layer or if we want to fill the center, we draw one element at the absolute center
  // if layer count is small or as a gorgeous finishing medallion!
  ctx.save();
  ctx.translate(cx, cy);
  const centerSize = baseSize * config.f1Scale * 0.55;
  ctx.drawImage(img, -centerSize / 2, -centerSize / 2, centerSize, centerSize);
  ctx.restore();

  // Academic guides: concentric faint circles to illustrate the composition layers
  if (config.showSymmetryAxes) {
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;

    // Outer Circle
    ctx.beginPath();
    ctx.arc(cx, cy, r1, 0, Math.PI * 2);
    ctx.stroke();

    // Middle Circle
    if (config.polarLayers >= 2) {
      ctx.beginPath();
      ctx.arc(cx, cy, r2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Inner Circle
    if (config.polarLayers >= 3) {
      ctx.beginPath();
      ctx.arc(cx, cy, r3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radiating guidelines
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
    const radialCount = 8;
    for (let j = 0; j < radialCount; j++) {
      const angle = (j * Math.PI) / (radialCount / 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.stroke();
    }

    ctx.restore();
  }
}
