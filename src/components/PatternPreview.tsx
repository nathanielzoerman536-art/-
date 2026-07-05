/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Eye, ShieldAlert, CheckCircle2, HelpCircle, BookOpen, Settings } from 'lucide-react';
import { PatternConfig } from '../types';
import { drawF1Pattern, drawF6Symmetry, drawPolarPattern } from '../utils/canvasHelper';

interface PatternPreviewProps {
  config: PatternConfig;
  filteredImage: HTMLCanvasElement | HTMLImageElement | null;
  baseImageWidth: number;
  baseImageHeight: number;
  onTileCanvasRef: (canvas: HTMLCanvasElement | null) => void;
}

export default function PatternPreview({
  config,
  filteredImage,
  baseImageWidth,
  baseImageHeight,
  onTileCanvasRef,
}: PatternPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [showMetadata, setShowMetadata] = useState(true);

  // Redraw the canvas when config or image changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const W = 500;
    const H = 500;
    canvas.width = W;
    canvas.height = H;

    // Report this canvas back to App.tsx so it can be used for mockups and downloading
    onTileCanvasRef(canvas);

    // If no image is loaded yet, draw a placeholder
    if (!filteredImage) {
      ctx.fillStyle = '#0f0f11';
      ctx.fillRect(0, 0, W, H);
      
      // Draw elegant traditional grid pattern in background
      ctx.strokeStyle = 'rgba(212,175,55,0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
        ctx.stroke();
      }

      ctx.fillStyle = '#D4AF37';
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillText('正在加载喜纹样基础素材...', W / 2, H / 2);
      return;
    }

    // Clear and draw pattern based on mode
    ctx.clearRect(0, 0, W, H);

    // Set high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (config.mode === 'F1') {
      drawF1Pattern(ctx, filteredImage, W, H, config);
    } else if (config.mode === 'F6') {
      drawF6Symmetry(ctx, filteredImage, W, H, config);
    } else if (config.mode === 'POLAR') {
      drawPolarPattern(ctx, filteredImage, W, H, config);
    }

    // Draw coordinate guides / Illustrator rulers if enabled
    if (showGuides) {
      ctx.save();
      ctx.strokeStyle = 'rgba(212,175,55,0.2)';
      ctx.lineWidth = 1;
      
      // Outer border
      ctx.strokeRect(0, 0, W, H);

      // Fine golden grid intersections
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      // Verticals
      ctx.moveTo(W / 4, 0); ctx.lineTo(W / 4, H);
      ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
      ctx.moveTo((3 * W) / 4, 0); ctx.lineTo((3 * W) / 4, H);
      // Horizontals
      ctx.moveTo(0, H / 4); ctx.lineTo(W, H / 4);
      ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
      ctx.moveTo(0, (3 * H) / 4); ctx.lineTo(W, (3 * H) / 4);
      ctx.stroke();

      // Draw center crop markers / crosshair
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      
      const l = 15;
      const c = W / 2;
      ctx.beginPath();
      ctx.moveTo(c - l, c); ctx.lineTo(c + l, c);
      ctx.moveTo(c, c - l); ctx.lineTo(c, c + l);
      ctx.stroke();

      ctx.restore();
    }
  }, [config, filteredImage, showGuides, onTileCanvasRef]);

  // Academic metadata content based on pattern mode
  const getAcademicMetadata = () => {
    switch (config.mode) {
      case 'F1':
        return {
          title: 'F1 饰带平移对称群 (p1)',
          operations: '平移变换 T(x, y) = (x + m·Tx, y + n·Ty)',
          description: '采用最纯粹的单向平移复制构成，无反射、旋转及滑动反射。此法起源于商周青铜器上的回纹与绳纹装饰，呈现规则、均匀的无限铺展效果（All-over Pattern）。在婚礼装潢中，多用于满版底纹、请柬边框的骨骼构建。',
          characteristics: '连续无尽、端正方直、骨骼匀称',
          visType: '多行多列平移网络 (Grid)'
        };
      case 'F6':
        return {
          title: 'F6 双重对称与二重旋转群 (pma2)',
          operations: '平移 T + 纵向镜像 σv + 180°二重旋转 C2',
          description: '由平移与相互垂直的对称轴联合作用。不仅包含左右镜像映射，亦结合了原点 180° 二重旋转，这保证了纹样在旋转后完美重合。源于汉唐重色织锦中的禽鸟动物纹、连珠纹构图，常展现生动、对称、互相照应的吉庆仪式感。',
          characteristics: '四向观照、张力均衡、严整生动',
          visType: '周期基本构成单元 (Fundamental Period Block)'
        };
      case 'POLAR':
        return {
          title: '极坐标闭合团窠纹群 (Polar-F1)',
          operations: '圆周平移 Tθ + 径向同心收束 Rr',
          description: '由 F1 平移饰带映射至极坐标系：(x, y) ➔ (r, θ)。使原本横向连续生长、缠绕的纹样在角度 θ 方向上首尾衔接，闭合并聚合成象征“团圆”、“聚合”的同心放射状团花、团窠纹。各层环状对称点可自定义密度，在密实与疏朗间取得完美张力。',
          characteristics: '首尾圆融、向心收纳、逐层叠彩',
          visType: '多层同心极坐标圆环 (Concentric Circles)'
        };
    }
  };

  const meta = getAcademicMetadata();

  return (
    <div className="flex flex-col gap-5 bg-stone-950 border border-amber-900/40 p-5 rounded-2xl shadow-xl text-stone-100">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-950/60">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-amber-400" />
          <h2 className="text-md font-serif font-semibold tracking-wide text-amber-100">
            图案构成 · Pattern Canvas
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`px-2 py-1 rounded text-[11px] font-serif transition-colors flex items-center gap-1 ${
              showGuides ? 'bg-red-950/40 text-amber-200 border border-red-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
            }`}
            title="显示标尺和十字参考线"
          >
            <Eye size={12} />
            标尺网格
          </button>
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`px-2 py-1 rounded text-[11px] font-serif transition-colors flex items-center gap-1 ${
              showMetadata ? 'bg-red-950/40 text-amber-200 border border-red-800' : 'bg-stone-900 text-stone-400 border border-stone-800'
            }`}
            title="查看学术分析和公式"
          >
            <Settings size={12} />
            学术解说
          </button>
        </div>
      </div>

      {/* Rulers and Canvas Container */}
      <div className="relative flex flex-col items-center justify-center p-4 bg-stone-900/40 rounded-xl border border-stone-900 overflow-hidden">
        
        {/* Illustrator Ruler Corner Icon */}
        <div className="absolute top-0 left-0 w-6 h-6 border-r border-b border-stone-800 bg-stone-950 flex items-center justify-center text-[8px] text-amber-500 font-mono">
          px
        </div>

        {/* Top Horizontal Ruler */}
        <div className="w-[500px] h-6 border-b border-stone-800 bg-stone-950 flex items-end justify-between px-1 relative text-[8px] text-stone-500 font-mono select-none">
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400</span>
          <span>500</span>
          {/* Tic lines */}
          <div className="absolute inset-x-0 bottom-0 h-1 flex justify-between">
            {Array.from({ length: 51 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] bg-stone-800 ${i % 10 === 0 ? 'h-1.5 bg-amber-600/50' : i % 5 === 0 ? 'h-1' : 'h-0.5'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Left Vertical Ruler */}
          <div className="w-6 h-[500px] border-r border-stone-800 bg-stone-950 flex flex-col justify-between py-1 relative text-[8px] text-stone-500 font-mono select-none">
            <span className="transform -rotate-90 origin-left pl-1">0</span>
            <span className="transform -rotate-90 origin-left pl-1">100</span>
            <span className="transform -rotate-90 origin-left pl-1">200</span>
            <span className="transform -rotate-90 origin-left pl-1">300</span>
            <span className="transform -rotate-90 origin-left pl-1">400</span>
            <span className="transform -rotate-90 origin-left pl-1">500</span>
            {/* Tic lines */}
            <div className="absolute inset-y-0 right-0 w-1 flex flex-col justify-between">
              {Array.from({ length: 51 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[1px] bg-stone-800 ${i % 10 === 0 ? 'w-1.5 bg-amber-600/50' : i % 5 === 0 ? 'w-1' : 'w-0.5'}`}
                />
              ))}
            </div>
          </div>

          {/* Core Interactive Canvas */}
          <div className="relative shadow-2xl bg-neutral-950 rounded-sm overflow-hidden" style={{ width: '500px', height: '500px' }}>
            <canvas
              ref={canvasRef}
              className="block w-full h-full cursor-crosshair"
              style={{ width: '500px', height: '500px' }}
            />
            
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-amber-500/40 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-amber-500/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-amber-500/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-amber-500/40 pointer-events-none" />
          </div>
        </div>

        {/* Floating Active Status Tag */}
        <div className="absolute bottom-6 right-6 px-2.5 py-1 rounded bg-stone-950/95 border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
          Illustrator Pattern Make MODE
        </div>
      </div>

      {/* Academic Explanations (Symmetry Groups, Formulas, Cultural Meaning) */}
      {showMetadata && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-stone-900/60 border border-amber-950/40 text-stone-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif text-amber-200 font-semibold tracking-wider">
              ✦ {meta.title}
            </span>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/40">
              {meta.visType}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase">群生成算式 (Group Formula):</span>
            <code className="text-xs font-mono bg-stone-950 p-2 rounded text-amber-300 overflow-x-auto whitespace-nowrap border border-stone-900">
              {meta.operations}
            </code>
          </div>

          <div className="flex flex-col gap-1 mt-0.5">
            <span className="text-[10px] text-stone-500 font-serif tracking-wider">喜纹学术渊源 & 构造分析:</span>
            <p className="text-[11px] leading-relaxed text-stone-300">
              {meta.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1 pt-2.5 border-t border-stone-800/60 text-[11px]">
            <div>
              <span className="text-stone-500 font-serif">艺术美感特征:</span>
              <p className="text-amber-200 font-serif mt-0.5">{meta.characteristics}</p>
            </div>
            <div>
              <span className="text-stone-500 font-serif">输入纹样尺寸:</span>
              <p className="text-stone-300 mt-0.5 font-mono">{baseImageWidth} × {baseImageHeight} 像素</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
