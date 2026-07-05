/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Download, Layers, ShieldCheck, Heart } from 'lucide-react';
import { PatternConfig } from '../types';

interface MockupShowcaseProps {
  config: PatternConfig;
  tileCanvas: HTMLCanvasElement | null; // The generated pattern canvas from PatternPreview
  filteredImage: HTMLCanvasElement | HTMLImageElement | null; // The single base element
}

export default function MockupShowcase({
  config,
  tileCanvas,
  filteredImage,
}: MockupShowcaseProps) {
  const plateRef = useRef<HTMLCanvasElement>(null);
  const scarfRef = useRef<HTMLCanvasElement>(null);
  const inviteRef = useRef<HTMLCanvasElement>(null);

  // Scarf display mode: 'FULL' (满铺连续) or 'CENTER' (中央团窠)
  const [scarfDisplayMode, setScarfDisplayMode] = useState<'FULL' | 'CENTER'>('FULL');

  // Triggered when tileCanvas or config changes to update the mockups
  useEffect(() => {
    drawPlateMockup();
    drawScarfMockup();
    drawInviteMockup();
  }, [config, tileCanvas, filteredImage, scarfDisplayMode]);

  // --- 1. Draw Plate Mockup ---
  const drawPlateMockup = () => {
    const canvas = plateRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 320;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;
    const outerR = 135;
    const innerR = 95;

    // A. Draw shadows for the 3D plate
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 10;
    
    // Draw outer plate circle (Ivory base)
    ctx.fillStyle = '#FCFBF7'; // Premium Jingdezhen high-white porcelain
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // B. Draw porcelain borders/gilded rims
    ctx.save();
    
    // Outer gilded gold trim
    ctx.strokeStyle = '#D4AF37'; // Imperial gold
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 2, 0, Math.PI * 2);
    ctx.stroke();

    // Inner gilded circle separating rim from center
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();

    // Draw traditional ruyi/key-pattern details on the plate rim
    ctx.strokeStyle = 'rgba(192, 57, 43, 0.2)'; // Faint vermilion lacquer
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, (outerR + innerR) / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // C. Clip and fill pattern in decorative area
    if (tileCanvas) {
      ctx.save();
      
      // We clip to the inner decorated zone
      ctx.beginPath();
      ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2);
      ctx.clip();

      // Create repeat pattern from the generated tile canvas
      const pattern = ctx.createPattern(tileCanvas, 'repeat');
      if (pattern) {
        ctx.save();
        // Translate and scale pattern according to user adjustments
        ctx.translate(cx + config.mockupOffsetX, cy + config.mockupOffsetY);
        ctx.scale(config.mockupScale * 0.45, config.mockupScale * 0.45); // Sized down to look natural on a plate
        ctx.fillStyle = pattern;
        
        // We fill a huge area centered on translation
        ctx.beginPath();
        ctx.rect(-W * 3, -H * 3, W * 6, H * 6);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    } else {
      // Draw a subtle traditional seal placeholder
      ctx.fillStyle = 'rgba(192, 57, 43, 0.04)';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.font = 'serif 12px';
      ctx.textAlign = 'center';
      ctx.fillText('上传后纹样自动印花', cx, cy);
    }

    // D. 3D Glaze Gloss Highlights
    ctx.save();
    const grad = ctx.createRadialGradient(
      cx - 40, cy - 40, 5,
      cx, cy, outerR
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)'); // Bright shine
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)'); // Rim shadow
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // --- 2. Draw Scarf Mockup ---
  const drawScarfMockup = () => {
    const canvas = scarfRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 320;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;
    const size = 230; // Scarf width and height
    const x = cx - size / 2;
    const y = cy - size / 2;

    // A. Drape shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 12;

    // Draw slightly rotated/wrinkled square base
    ctx.fillStyle = '#9B1C1C'; // Solid deep silk crimson red base
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.restore();

    // B. Render Pattern on Scarf
    if (tileCanvas) {
      ctx.save();
      
      // Clip to scarf square
      ctx.beginPath();
      ctx.rect(x + 4, y + 4, size - 8, size - 8);
      ctx.clip();

      if (scarfDisplayMode === 'FULL') {
        // Mode 1: All-over tile repeat
        const pattern = ctx.createPattern(tileCanvas, 'repeat');
        if (pattern) {
          ctx.save();
          ctx.translate(cx + config.mockupOffsetX, cy + config.mockupOffsetY);
          ctx.scale(config.mockupScale * 0.45, config.mockupScale * 0.45);
          ctx.fillStyle = pattern;
          ctx.beginPath();
          ctx.rect(-W * 3, -H * 3, W * 6, H * 6);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // Mode 2: Concentric Polar 团窠纹 centered layout
        // We will draw the tile pattern but ensure it is centered as one single giant mandala!
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(config.mockupScale * 0.5, config.mockupScale * 0.5);
        // Draw the generated canvas as an image centered
        ctx.drawImage(tileCanvas, -250, -250, 500, 500);
        ctx.restore();
      }

      ctx.restore();
    }

    // C. Traditional Silk Border and Corner Tassels
    ctx.save();
    
    // Golden border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 6, y + 6, size - 12, size - 12);

    // Inner fine line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 12, y + 12, size - 24, size - 24);

    // Corner Tassel Draw (Golden traditional Chinese tassels)
    const drawTassel = (tx: number, ty: number, angle: number) => {
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate((angle * Math.PI) / 180);
      
      // Tassel top bead
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Fringe
      const grad = ctx.createLinearGradient(-3, 4, 3, 22);
      grad.addColorStop(0, '#FFE894');
      grad.addColorStop(0.5, '#D4AF37');
      grad.addColorStop(1, '#9A7B1C');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-1, 4);
      ctx.lineTo(-4, 22);
      ctx.lineTo(4, 22);
      ctx.lineTo(1, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Draw 4 corner tassels
    drawTassel(x, y, 45); // Top Left
    drawTassel(x + size, y, -45); // Top Right
    drawTassel(x, y + size, 135); // Bottom Left
    drawTassel(x + size, y + size, -135); // Bottom Right

    ctx.restore();

    // D. Soft Multiply Wave Shading (Silk Sheen & Waves)
    ctx.save();
    const shineGrad = ctx.createLinearGradient(x, y, x + size, y + size);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    shineGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.0)');
    shineGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
    shineGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
    shineGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = shineGrad;
    ctx.beginPath();
    ctx.rect(x + 4, y + 4, size - 8, size - 8);
    ctx.fill();

    // Silk hanging drape folds
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.bezierCurveTo(cx - 30, cy - 60, cx + 30, cy + 60, x + size, y + size - 40);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(x, y + 60);
    ctx.bezierCurveTo(cx - 30, cy - 40, cx + 30, cy + 80, x + size, y + size - 20);
    ctx.stroke();

    ctx.restore();
  };

  // --- 3. Draw Wedding Invitation Mockup ---
  const drawInviteMockup = () => {
    const canvas = inviteRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 320;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;
    
    // Vertical card dimensions (Chinese traditional envelope size)
    const cardW = 180;
    const cardH = 260;
    const x = cx - cardW / 2;
    const y = cy - cardH / 2;

    // A. Card Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 10;

    // Rich Imperial red card paper
    ctx.fillStyle = '#8B0000'; // Dark Crimson Red
    ctx.beginPath();
    ctx.rect(x, y, cardW, cardH);
    ctx.fill();
    ctx.restore();

    // B. Apply dynamically-matched pattern layouts
    if (tileCanvas) {
      ctx.save();
      
      // Layout based on pattern mode
      if (config.mode === 'F1') {
        // ----------------------------------------------------
        // F1 Layout: Golden Border Lace Frame (适用于边框连续装饰)
        // ----------------------------------------------------
        ctx.save();
        ctx.beginPath();
        // Inner frame rectangle
        ctx.rect(x + 14, y + 14, cardW - 28, cardH - 28);
        ctx.rect(x + 24, y + 24, cardW - 48, cardH - 48);
        ctx.clip('evenodd'); // Creates hollow frame

        const pattern = ctx.createPattern(tileCanvas, 'repeat');
        if (pattern) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(0.12, 0.12); // Tiny scale for thin frame pattern
          ctx.fillStyle = pattern;
          ctx.beginPath();
          ctx.rect(-W * 4, -H * 4, W * 8, H * 8);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

      } else if (config.mode === 'F6') {
        // ----------------------------------------------------
        // F6 Layout: Center Crest / Symmetry Embossing (适用于封面中心对称图案)
        // ----------------------------------------------------
        ctx.save();
        // Clip to a beautiful central square/diamond emblem
        const crestS = 100;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, crestS / 2, 0, Math.PI * 2);
        ctx.clip();

        // Draw the full F6 symmetry block scaled down in the center
        ctx.translate(cx, cy - 20);
        ctx.scale(config.mockupScale * 0.22, config.mockupScale * 0.22);
        ctx.drawImage(tileCanvas, -250, -250, 500, 500);
        ctx.restore();

        // Golden circular frame for the F6 Crest
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, crestS / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();

      } else if (config.mode === 'POLAR') {
        // ----------------------------------------------------
        // Polar Layout: Central Round TuanKe Medallion (适用于中央团花装饰)
        // ----------------------------------------------------
        ctx.save();
        const diameter = 110;
        ctx.beginPath();
        ctx.arc(cx, cy - 15, diameter / 2, 0, Math.PI * 2);
        ctx.clip();

        ctx.translate(cx, cy - 15);
        ctx.scale(config.mockupScale * 0.23, config.mockupScale * 0.23);
        ctx.drawImage(tileCanvas, -250, -250, 500, 500);
        ctx.restore();

        // Golden circular boundary
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy - 15, diameter / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // C. Traditional text styling ("囍", "婚礼邀请", "喜结良缘")
    ctx.save();
    
    // Small fine line frame
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 10, cardW - 20, cardH - 20);

    // Double Happiness character (囍) in bottom center or inside the crest
    if (config.mode === 'F1') {
      // Big centered gold "囍"
      ctx.fillStyle = '#FFE894';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.font = 'bold 38px serif';
      ctx.textAlign = 'center';
      ctx.fillText('囍', cx, cy - 10);
    } else {
      // Small "囍" in bottom center
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('囍', cx, cy + 60);
    }

    // Invitation text (Wedding Invitation)
    ctx.fillStyle = 'rgba(255, 232, 148, 0.9)'; // Bright gold text
    ctx.font = 'serif 11px';
    ctx.textAlign = 'center';
    ctx.fillText('婚礼邀请 · INVITATION', cx, cy + 90);

    ctx.fillStyle = 'rgba(255, 232, 148, 0.65)';
    ctx.font = 'serif 9px';
    ctx.fillText('喜 结 良 缘  ·  百 年 好 合', cx, cy + 108);

    // Dynamic Layout tag (shows what type of arrangement was used)
    const layoutTag = config.mode === 'F1' ? '边缘连续 lace 装饰' :
                      config.mode === 'F6' ? '中心对称 seal 雕刻' : '中央圆融 团窠 徽章';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText(`版式配对: ${layoutTag}`, cx, cy + 124);

    ctx.restore();
  };

  // Helper function to trigger downloading of a mockup canvas
  const handleDownloadMockup = (canvasRef: React.RefObject<HTMLCanvasElement | null>, name: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${name}_mockup_${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col gap-5 bg-stone-950 border border-amber-900/40 p-5 rounded-2xl shadow-xl text-stone-100">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-950/60">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <h2 className="text-md font-serif font-semibold tracking-wide text-amber-100">
            文创应用展示 · Mockups
          </h2>
        </div>
        <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck size={11} className="text-green-500" /> 
          3D等比例自动贴合
        </span>
      </div>

      {/* Grid of 3 mockups */}
      <div className="flex flex-col gap-6">

        {/* 1. Plate Mockup */}
        <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-900/80 flex flex-col items-center relative group">
          <div className="absolute top-3 left-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-serif text-amber-100">Jingdezhen Plate · 瓷盘样机</span>
          </div>

          <button
            onClick={() => handleDownloadMockup(plateRef, 'Traditional_Plate')}
            className="absolute top-3 right-4 p-1.5 rounded bg-stone-950/80 hover:bg-red-900 border border-amber-900/50 text-stone-300 hover:text-white transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            title="导出此样机效果图"
          >
            <Download size={12} />
          </button>

          <canvas ref={plateRef} className="block max-w-full aspect-square w-[260px] h-[260px] mt-4" />
          
          <div className="w-full text-center mt-3 pt-2 border-t border-stone-800/40">
            <span className="text-[10px] text-stone-400 font-mono">应用形式: 骨瓷盘 描金满铺式数字贴花</span>
          </div>
        </div>

        {/* 2. Scarf Mockup */}
        <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-900/80 flex flex-col items-center relative group">
          <div className="absolute top-3 left-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-serif text-amber-100">Silk Scarf · 丝巾样机</span>
          </div>

          {/* Toggle controls for Scarf Layout */}
          <div className="absolute top-3 right-12 flex gap-1 bg-stone-950 p-0.5 rounded border border-amber-900/30">
            <button
              onClick={() => setScarfDisplayMode('FULL')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-serif transition-colors ${
                scarfDisplayMode === 'FULL' ? 'bg-red-900 text-amber-200' : 'text-stone-400 hover:text-white'
              }`}
            >
              满铺
            </button>
            <button
              onClick={() => setScarfDisplayMode('CENTER')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-serif transition-colors ${
                scarfDisplayMode === 'CENTER' ? 'bg-red-900 text-amber-200' : 'text-stone-400 hover:text-white'
              }`}
            >
              中央团窠
            </button>
          </div>

          <button
            onClick={() => handleDownloadMockup(scarfRef, 'Traditional_Scarf')}
            className="absolute top-3 right-4 p-1.5 rounded bg-stone-950/80 hover:bg-red-900 border border-amber-900/50 text-stone-300 hover:text-white transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            title="导出此样机效果图"
          >
            <Download size={12} />
          </button>

          <canvas ref={scarfRef} className="block max-w-full aspect-square w-[260px] h-[260px] mt-4" />

          <div className="w-full text-center mt-3 pt-2 border-t border-stone-800/40 flex justify-between px-2 text-[10px] text-stone-400">
            <span>应用形式: 织真丝大方巾 45cm 规格</span>
            <span className="text-amber-400 font-serif">含四角流苏穗</span>
          </div>
        </div>

        {/* 3. Wedding Invitation Mockup */}
        <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-900/80 flex flex-col items-center relative group">
          <div className="absolute top-3 left-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-serif text-amber-100">Wedding Invitation · 请柬样机</span>
          </div>

          <button
            onClick={() => handleDownloadMockup(inviteRef, 'Traditional_Invitation')}
            className="absolute top-3 right-4 p-1.5 rounded bg-stone-950/80 hover:bg-red-900 border border-amber-900/50 text-stone-300 hover:text-white transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            title="导出此样机效果图"
          >
            <Download size={12} />
          </button>

          <canvas ref={inviteRef} className="block max-w-full aspect-square w-[260px] h-[260px] mt-4" />

          <div className="w-full text-center mt-3 pt-2 border-t border-stone-800/40 text-[10px] text-stone-400 flex items-center justify-center gap-1 font-serif">
            <Heart size={11} className="text-red-500 fill-red-500" />
            版式自适应匹配: 根据饰带群理论自动完成对称构图
          </div>
        </div>

      </div>

    </div>
  );
}
