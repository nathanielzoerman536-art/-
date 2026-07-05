/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Landmark, HelpCircle, GraduationCap, Sparkles } from 'lucide-react';
import { PatternConfig, PatternMode, TraditionalColorFilter, DefaultPattern } from './types';
import { DEFAULT_PATTERNS } from './components/DefaultPatterns';
import { loadSvgToImage, loadImageFromUrl, applyColorFilter } from './utils/canvasHelper';
import ControlPanel from './components/ControlPanel';
import PatternPreview from './components/PatternPreview';
import MockupShowcase from './components/MockupShowcase';

const DEFAULT_CONFIG: PatternConfig = {
  mode: 'POLAR',
  colorFilter: 'GOLDEN',
  
  // F1 parameters
  f1Scale: 0.65,
  f1SpacingX: 1.15,
  f1SpacingY: 1.15,
  f1Angle: 0,
  
  // F6 parameters
  f6Scale: 0.85,
  showSymmetryAxes: true,
  
  // Polar parameters
  polarLayers: 2,
  polarCount1: 12,
  polarCount2: 8,
  polarCount3: 4,
  polarRadius1: 0.8,
  polarRadius2: 0.55,
  polarRadius3: 0.3,
  polarInterlace: true,
  polarRotateElements: true,
  
  // Mockup parameters
  mockupScale: 1.0,
  mockupOffsetX: 0,
  mockupOffsetY: 0,
};

export default function App() {
  const [config, setConfig] = useState<PatternConfig>(DEFAULT_CONFIG);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(DEFAULT_PATTERNS[0].id);
  const [userUploadedFilename, setUserUploadedFilename] = useState<string | null>(null);
  
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [filteredImage, setFilteredImage] = useState<HTMLCanvasElement | HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // References to active canvas to trigger downloads
  const tileCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Callback from PatternPreview to store the tile canvas
  const handleTileCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    tileCanvasRef.current = canvas;
  }, []);

  // 1. Initial Load of default template
  useEffect(() => {
    loadTemplate(DEFAULT_PATTERNS[0]);
  }, []);

  // 2. Re-apply color filter whenever baseImage or colorFilter changes
  useEffect(() => {
    if (!baseImage) return;
    try {
      const filtered = applyColorFilter(baseImage, config.colorFilter);
      setFilteredImage(filtered);
    } catch (err) {
      console.error('Error applying color filter:', err);
      setErrorMsg('应用传统色彩滤波器失败，请更换图片。');
    }
  }, [baseImage, config.colorFilter]);

  // Load an SVG template
  const loadTemplate = async (template: DefaultPattern) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const img = await loadSvgToImage(template.svgData);
      setBaseImage(img);
      setImageSize({ width: img.width || 100, height: img.height || 100 });
      setSelectedTemplateId(template.id);
      setUserUploadedFilename(null);
    } catch (err) {
      console.error('Error loading SVG template:', err);
      setErrorMsg('载入预设素材失败，请尝试上传自己的图片。');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle uploaded image
  const handleUploadImage = (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        try {
          const img = await loadImageFromUrl(result);
          setBaseImage(img);
          setImageSize({ width: img.width || 100, height: img.height || 100 });
          setUserUploadedFilename(file.name);
          setSelectedTemplateId(null);
        } catch (err) {
          console.error('Error loading uploaded image:', err);
          setErrorMsg('图片加载失败，请确保格式正确且未损坏。');
        } finally {
          setIsLoading(false);
        }
      }
    };

    reader.onerror = () => {
      setErrorMsg('文件读取失败，请重试。');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Reset parameters to default
  const handleResetToDefault = () => {
    setConfig({
      ...DEFAULT_CONFIG,
      mode: config.mode, // Preserve current active mode
      colorFilter: config.colorFilter, // Preserve current color filter
    });
  };

  // Trigger download of the composed pattern
  const handleDownloadTile = () => {
    const canvas = tileCanvasRef.current;
    if (!canvas) {
      setErrorMsg('无法获取生成图案，请刷新后重试。');
      return;
    }
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `auspicious_pattern_${config.mode.toLowerCase()}_${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-screen bg-stone-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black text-stone-100 font-sans selection:bg-red-800 selection:text-amber-100 relative overflow-x-hidden">
      
      {/* Decorative Traditional Border Lines */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-800 via-amber-400 to-red-800" />
      
      {/* Subtle traditional watermarks/clouds in background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80')] opacity-[0.015] pointer-events-none mix-blend-color-dodge" />

      {/* Elegant Header */}
      <header className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-gradient-to-b from-stone-950 to-stone-900/40 border border-amber-900/30 p-5 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Decorative Corner */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/20 rounded-tl-xl" />
          {/* Right Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/20 rounded-br-xl" />

          <div className="flex items-center gap-4">
            {/* Wedding Seal Emblem */}
            <div className="relative w-16 h-16 bg-red-800 rounded-2xl border-2 border-amber-400 flex items-center justify-center shadow-lg shrink-0 transform hover:rotate-6 transition-transform">
              <span className="text-amber-300 font-serif text-3xl font-bold tracking-tight">囍</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-amber-100">
                  中国传统喜纹样智能生成器
                </h1>
                <span className="bg-red-950 text-red-400 border border-red-900/60 text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <GraduationCap size={11} /> 学术智造版 v1.0
                </span>
              </div>
              <p className="text-xs md:text-sm text-stone-400 font-serif leading-relaxed">
                基于饰带对称群（Frieze Group）七类演化理论与极坐标（Rectangular to Polar）团窠纹映射逻辑，打造端侧数字化生成与文创应用展示系统。
              </p>
            </div>
          </div>

          {/* Academic Stats Box */}
          <div className="flex items-center gap-4 bg-stone-950 p-3 rounded-2xl border border-stone-900 text-stone-400 text-xs font-serif divide-x divide-stone-800">
            <div className="flex items-center gap-2 px-1">
              <Landmark size={14} className="text-amber-500" />
              <div>
                <p className="text-stone-300">饰带群理论</p>
                <p className="text-[10px] text-stone-500 font-mono">Frieze Group (F1-F7)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Sparkles size={14} className="text-red-500" />
              <div>
                <p className="text-stone-300">首尾闭合率</p>
                <p className="text-[10px] text-stone-500 font-mono">100% (Polar Warp)</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Feedback messages */}
      {(errorMsg || isLoading) && (
        <div className="max-w-7xl mx-auto px-4 mt-2">
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-900/60 p-3 rounded-xl text-xs text-red-200 font-serif flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {errorMsg}
            </div>
          )}
          {isLoading && (
            <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-xs text-amber-200 font-serif flex items-center gap-2 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              正在生成极坐标映射及对称变换，请稍候...
            </div>
          )}
        </div>
      )}

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Column 1: Control Panel (Operation Module) - Width: 3/12 */}
          <div className="lg:col-span-3">
            <ControlPanel
              config={config}
              onChangeConfig={setConfig}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={loadTemplate}
              onUploadImage={handleUploadImage}
              userUploadedFilename={userUploadedFilename}
              onResetToDefault={handleResetToDefault}
              onDownloadTile={handleDownloadTile}
            />
          </div>

          {/* Column 2: Pattern Preview (Illustrator Pattern Make Grid) - Width: 5/12 */}
          <div className="lg:col-span-5">
            <PatternPreview
              config={config}
              filteredImage={filteredImage}
              baseImageWidth={imageSize.width}
              baseImageHeight={imageSize.height}
              onTileCanvasRef={handleTileCanvasRef}
            />
          </div>

          {/* Column 3: Mockup Showcase - Width: 4/12 */}
          <div className="lg:col-span-4">
            <MockupShowcase
              config={config}
              tileCanvas={tileCanvasRef.current}
              filteredImage={filteredImage}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-amber-950 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-serif">
          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-amber-600/60" />
            <span>中国传统喜纹样数字化研究中心 · 智绘坊学术课题成果</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span>© 2026 Traditional Wedding Auspicious Pattern Studio. All Rights Reserved.</span>
            <Heart size={10} className="text-red-700 fill-red-700" />
          </div>
        </div>
      </footer>

    </div>
  );
}
