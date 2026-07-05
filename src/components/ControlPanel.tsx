/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Upload, Sliders, Palette, RefreshCw, Layers, ZoomIn, ArrowRight } from 'lucide-react';
import { PatternConfig, PatternMode, TraditionalColorFilter, DefaultPattern } from '../types';
import { DEFAULT_PATTERNS } from './DefaultPatterns';

interface ControlPanelProps {
  config: PatternConfig;
  onChangeConfig: (newConfig: PatternConfig) => void;
  selectedTemplateId: string | null;
  onSelectTemplate: (template: DefaultPattern) => void;
  onUploadImage: (file: File) => void;
  userUploadedFilename: string | null;
  onResetToDefault: () => void;
  onDownloadTile: () => void;
}

export default function ControlPanel({
  config,
  onChangeConfig,
  selectedTemplateId,
  onSelectTemplate,
  onUploadImage,
  userUploadedFilename,
  onResetToDefault,
  onDownloadTile,
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update specific keys in config
  const updateConfig = (updates: Partial<PatternConfig>) => {
    onChangeConfig({ ...config, ...updates });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUploadImage(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleModeChange = (mode: PatternMode) => {
    updateConfig({ mode });
  };

  const colorPresets: { value: TraditionalColorFilter; name: string; bgClass: string; textColor: string; desc: string }[] = [
    { value: 'ORIGINAL', name: '原色', bgClass: 'bg-neutral-800 border-neutral-600', textColor: 'text-white', desc: '保留素材原始色彩' },
    { value: 'GOLDEN', name: '描金', bgClass: 'bg-amber-100 border-amber-400', textColor: 'text-amber-800', desc: '宫廷描金工艺，华贵大气' },
    { value: 'VERMILION', name: '朱砂', bgClass: 'bg-red-50 border-red-500', textColor: 'text-red-700', desc: '传统朱红印泥，喜庆典雅' },
    { value: 'COBALT', name: '青花', bgClass: 'bg-blue-50 border-blue-600', textColor: 'text-blue-800', desc: '景德镇青花瓷韵，宁静高雅' },
    { value: 'INK', name: '水墨', bgClass: 'bg-stone-100 border-stone-800', textColor: 'text-stone-900', desc: '徽州徽墨气韵，素净深邃' },
  ];

  return (
    <div className="flex flex-col gap-6 bg-stone-950 border border-amber-900/40 p-5 rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar text-stone-100">
      
      {/* 1. Header with traditional emblem */}
      <div className="flex items-center gap-3 pb-4 border-b border-amber-950">
        <div className="relative flex items-center justify-center w-10 h-10 bg-red-800 rounded-full border border-amber-400 shadow-md">
          <span className="text-amber-300 font-serif text-lg font-bold">囍</span>
        </div>
        <div>
          <h2 className="text-lg font-serif font-semibold tracking-wide text-amber-100">天工造纹 · 智坊</h2>
          <p className="text-[11px] text-stone-400 font-mono tracking-tight uppercase">Auspicious Pattern Engine</p>
        </div>
      </div>

      {/* 2. Upload / Selection Area */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-serif font-medium text-amber-200 flex items-center gap-1.5">
          <Upload size={14} className="text-red-500" /> 一、上传或选择纹样基础
        </h3>

        {/* Drag & drop upload box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
            isDragging
              ? 'border-red-500 bg-red-950/20 shadow-inner'
              : 'border-amber-900/40 bg-stone-900/60 hover:border-red-800 hover:bg-stone-900'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />
          <Upload size={24} className={`mb-2 ${isDragging ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
          <span className="text-xs font-medium text-stone-200">
            {userUploadedFilename ? `已载入: ${userUploadedFilename}` : '拖拽图片或点击此处上传'}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">支持 PNG, JPG, JPEG 格式连续或单元纹样</span>
        </div>

        {/* Traditional Starter Materials (Auspicious templates) */}
        <div className="mt-1">
          <span className="text-[11px] text-amber-400 font-serif mb-1.5 block">▼ 传世华章·喜庆基础素材:</span>
          <div className="grid grid-cols-5 gap-1.5">
            {DEFAULT_PATTERNS.map((pattern) => {
              const isSelected = selectedTemplateId === pattern.id && !userUploadedFilename;
              return (
                <button
                  key={pattern.id}
                  onClick={() => onSelectTemplate(pattern)}
                  className={`relative p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all duration-200 group overflow-hidden ${
                    isSelected
                      ? 'border-red-500 bg-red-950/40 shadow-inner'
                      : 'border-stone-800 bg-stone-900 hover:border-amber-700 hover:bg-stone-850'
                  }`}
                  title={`${pattern.name}: ${pattern.description}`}
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-md p-1 transition-colors ${
                      isSelected ? 'text-red-500' : 'text-amber-400 group-hover:text-amber-300'
                    }`}
                    dangerouslySetInnerHTML={{ __html: pattern.svgData }}
                  />
                  <span className="text-[9px] text-stone-400 truncate w-full text-center">
                    {pattern.name.split('·')[0]}
                  </span>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-bl" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Color Filter / Traditional Palettes */}
      <div className="flex flex-col gap-3 pt-2 border-t border-amber-950">
        <h3 className="text-sm font-serif font-medium text-amber-200 flex items-center gap-1.5">
          <Palette size={14} className="text-red-500" /> 二、金石五色·艺术重构
        </h3>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          将上传的素材瞬间转化为经典的中国婚礼传统金石瓷漆风韵，使色彩浑然天成。
        </p>

        <div className="flex flex-col gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => updateConfig({ colorFilter: preset.value })}
              className={`flex items-center gap-3 p-2 rounded-xl border text-left transition-all ${
                config.colorFilter === preset.value
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-stone-800 bg-stone-900/50 hover:border-amber-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-serif text-xs font-bold ${preset.bgClass} ${preset.textColor} shadow-sm shrink-0`}>
                {preset.name[0]}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-serif font-medium text-amber-100 flex items-center gap-1.5">
                  {preset.name}
                  {config.colorFilter === preset.value && (
                    <span className="text-[9px] px-1 bg-red-800 text-amber-100 rounded">选定</span>
                  )}
                </span>
                <p className="text-[10px] text-stone-400 truncate mt-0.5">{preset.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Pattern Mode Selector */}
      <div className="flex flex-col gap-3 pt-2 border-t border-amber-950">
        <h3 className="text-sm font-serif font-medium text-amber-200 flex items-center gap-1.5">
          <Layers size={14} className="text-red-500" /> 三、喜纹法则·饰带变换
        </h3>

        <div className="grid grid-cols-3 gap-1.5">
          {(['F1', 'F6', 'POLAR'] as PatternMode[]).map((mode) => {
            const label = mode === 'F1' ? '几何类' : mode === 'F6' ? '动物类' : '植物类';
            const subLabel = mode === 'F1' ? 'F1 饰带' : mode === 'F6' ? 'F6 饰带' : '团窠圆环';
            const active = config.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  active
                    ? 'border-red-500 bg-red-900/30 font-semibold'
                    : 'border-stone-800 bg-stone-900/50 hover:border-amber-800'
                }`}
              >
                <span className={`text-xs ${active ? 'text-amber-200' : 'text-stone-300'}`}>{label}</span>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-1.5 py-0.5 rounded">
                  {subLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Dynamic Parameter Sliders */}
      <div className="flex flex-col gap-4 pt-3 border-t border-amber-950 bg-stone-950 p-3 rounded-xl border border-stone-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif text-amber-300 flex items-center gap-1">
            <Sliders size={12} /> 细部规矩·参数微调
          </span>
          <button
            onClick={onResetToDefault}
            className="text-[10px] text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            title="恢复预设参数"
          >
            <RefreshCw size={10} /> 重置
          </button>
        </div>

        {/* F1 Mode Parameters */}
        {config.mode === 'F1' && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] text-stone-400 mb-1 leading-relaxed bg-stone-900 p-2 rounded border border-amber-950">
              <strong className="text-amber-200 font-serif">F1 几何法：</strong>平移复制构成。单元将在水平与垂直方向进行无限规则平移复制，均匀铺满构成画面。
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">纹样比例 (Scale)</span>
                <span className="text-amber-400 font-mono font-bold">{(config.f1Scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="1.2"
                step="0.05"
                value={config.f1Scale}
                onChange={(e) => updateConfig({ f1Scale: parseFloat(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">横向间距倍数 (Spacing X)</span>
                <span className="text-amber-400 font-mono font-bold">{config.f1SpacingX.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={config.f1SpacingX}
                onChange={(e) => updateConfig({ f1SpacingX: parseFloat(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">纵向间距倍数 (Spacing Y)</span>
                <span className="text-amber-400 font-mono font-bold">{config.f1SpacingY.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={config.f1SpacingY}
                onChange={(e) => updateConfig({ f1SpacingY: parseFloat(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">旋转角度 (Angle)</span>
                <span className="text-amber-400 font-mono font-bold">{config.f1Angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={config.f1Angle}
                onChange={(e) => updateConfig({ f1Angle: parseInt(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* F6 Mode Parameters */}
        {config.mode === 'F6' && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] text-stone-400 mb-1 leading-relaxed bg-stone-900 p-2 rounded border border-amber-950">
              <strong className="text-amber-200 font-serif">F6 动物法：</strong>双重镜像与180°旋转中心对称。在一个基本周期内包含平移、镜像与二重旋转。
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">对称体比例 (Scale)</span>
                <span className="text-amber-400 font-mono font-bold">{(config.f6Scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={config.f6Scale}
                onChange={(e) => updateConfig({ f6Scale: parseFloat(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-stone-900/60 p-2.5 rounded-xl border border-stone-850 mt-1">
              <div className="flex flex-col">
                <span className="text-xs text-amber-100 font-medium">显示学术对称轴</span>
                <span className="text-[10px] text-stone-400">显示横向与纵向对称群轨迹</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSymmetryAxes}
                  onChange={(e) => updateConfig({ showSymmetryAxes: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-800 peer-checked:after:bg-amber-300"></div>
              </label>
            </div>
          </div>
        )}

        {/* Polar Mode Parameters */}
        {config.mode === 'POLAR' && (
          <div className="flex flex-col gap-3.5">
            <div className="text-[11px] text-stone-400 mb-1 leading-relaxed bg-stone-900 p-2 rounded border border-amber-950">
              <strong className="text-amber-200 font-serif">F1+团窠纹植物法：</strong>多层同心圆闭合构图。首先由 F1 饰带平移拉伸，随后闭合转化为极坐标圆环结构。
            </div>

            {/* Layer Count */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-stone-300">同心圆环层数 (Layers)</span>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map((l) => (
                  <button
                    key={l}
                    onClick={() => updateConfig({ polarLayers: l })}
                    className={`py-1 rounded text-xs transition-colors ${
                      config.polarLayers === l
                        ? 'bg-red-900/40 border border-red-500 text-amber-200 font-bold'
                        : 'bg-stone-900 border border-stone-800 hover:border-amber-900'
                    }`}
                  >
                    {l} 层
                  </button>
                ))}
              </div>
            </div>

            {/* Layer counts sliders */}
            <div className="flex flex-col gap-2.5 bg-stone-900/40 p-2 rounded-lg border border-stone-850">
              <span className="text-[10px] text-amber-400 font-serif font-semibold">各层纹样重复数量 (Counts)</span>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300">外层数量</span>
                  <span className="text-amber-300 font-mono font-bold">{config.polarCount1} 个</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="1"
                  value={config.polarCount1}
                  onChange={(e) => updateConfig({ polarCount1: parseInt(e.target.value) })}
                  className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                />
              </div>

              {config.polarLayers >= 2 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-300">中层数量</span>
                    <span className="text-amber-300 font-mono font-bold">{config.polarCount2} 个</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="1"
                    value={config.polarCount2}
                    onChange={(e) => updateConfig({ polarCount2: parseInt(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                  />
                </div>
              )}

              {config.polarLayers >= 3 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-300">内层数量</span>
                    <span className="text-amber-300 font-mono font-bold">{config.polarCount3} 个</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={config.polarCount3}
                    onChange={(e) => updateConfig({ polarCount3: parseInt(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                  />
                </div>
              )}
            </div>

            {/* Radius ratio adjust */}
            <div className="flex flex-col gap-2.5 bg-stone-900/40 p-2 rounded-lg border border-stone-850">
              <span className="text-[10px] text-amber-400 font-serif font-semibold">各层圆环半径尺度 (Radii)</span>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300">外层半径比</span>
                  <span className="text-amber-300 font-mono font-bold">{(config.polarRadius1 * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={config.polarRadius1}
                  onChange={(e) => updateConfig({ polarRadius1: parseFloat(e.target.value) })}
                  className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                />
              </div>

              {config.polarLayers >= 2 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-300">中层半径比</span>
                    <span className="text-amber-300 font-mono font-bold">{(config.polarRadius2 * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="0.7"
                    step="0.05"
                    value={config.polarRadius2}
                    onChange={(e) => updateConfig({ polarRadius2: parseFloat(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                  />
                </div>
              )}

              {config.polarLayers >= 3 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-300">内层半径比</span>
                    <span className="text-amber-300 font-mono font-bold">{(config.polarRadius3 * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.45"
                    step="0.05"
                    value={config.polarRadius3}
                    onChange={(e) => updateConfig({ polarRadius3: parseFloat(e.target.value) })}
                    className="w-full accent-red-600 h-1 bg-stone-800 rounded"
                  />
                </div>
              )}
            </div>

            {/* Element size scale inside polar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">单体视觉尺寸 (Tile Size)</span>
                <span className="text-amber-400 font-mono font-bold">{(config.f1Scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={config.f1Scale}
                onChange={(e) => updateConfig({ f1Scale: parseFloat(e.target.value) })}
                className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Interlace toggle */}
            <div className="flex items-center justify-between bg-stone-900/60 p-2 rounded-xl border border-stone-850">
              <div className="flex flex-col">
                <span className="text-xs text-amber-100 font-medium">多层错位交织排列</span>
                <span className="text-[9px] text-stone-400">相邻环层自动旋转错位，规避重叠</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.polarInterlace}
                  onChange={(e) => updateConfig({ polarInterlace: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-800 peer-checked:after:bg-amber-300"></div>
              </label>
            </div>

            {/* Radial Rotation toggle */}
            <div className="flex items-center justify-between bg-stone-900/60 p-2 rounded-xl border border-stone-850">
              <div className="flex flex-col">
                <span className="text-xs text-amber-100 font-medium">沿径向放射旋转</span>
                <span className="text-[9px] text-stone-400">开启为放射状，关闭则单体保持正立</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.polarRotateElements}
                  onChange={(e) => updateConfig({ polarRotateElements: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-800 peer-checked:after:bg-amber-300"></div>
              </label>
            </div>

            {/* Show Concentric Circles Toggle */}
            <div className="flex items-center justify-between bg-stone-900/60 p-2 rounded-xl border border-stone-850">
              <div className="flex flex-col">
                <span className="text-xs text-amber-100 font-medium">显示同心研究轨迹线</span>
                <span className="text-[9px] text-stone-400">显示极坐标放射划分与层半径</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSymmetryAxes}
                  onChange={(e) => updateConfig({ showSymmetryAxes: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-800 peer-checked:after:bg-amber-300"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 6. Mockup Tuning parameters */}
      <div className="flex flex-col gap-3 pt-2 border-t border-amber-950">
        <h3 className="text-sm font-serif font-medium text-amber-200 flex items-center gap-1.5">
          <ZoomIn size={14} className="text-red-500" /> 四、文创样机·排版微调
        </h3>
        <p className="text-[11px] text-stone-400">
          手动调整大小时，样机始终保持等比例缩放不拉伸。您可在此微调纹样在样机中的贴合位置。
        </p>

        <div className="flex flex-col gap-2.5 bg-stone-900/40 p-2 rounded-lg border border-stone-850">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">样机内纹样缩放 (Mockup Scale)</span>
              <span className="text-amber-400 font-mono font-bold">{(config.mockupScale * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={config.mockupScale}
              onChange={(e) => updateConfig({ mockupScale: parseFloat(e.target.value) })}
              className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">水平位移 (Offset X)</span>
              <span className="text-amber-400 font-mono font-bold">{config.mockupOffsetX}px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="2"
              value={config.mockupOffsetX}
              onChange={(e) => updateConfig({ mockupOffsetX: parseInt(e.target.value) })}
              className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">垂直位移 (Offset Y)</span>
              <span className="text-amber-400 font-mono font-bold">{config.mockupOffsetY}px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="2"
              value={config.mockupOffsetY}
              onChange={(e) => updateConfig({ mockupOffsetY: parseInt(e.target.value) })}
              className="w-full accent-red-600 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 7. Output Action */}
      <div className="pt-4 border-t border-amber-950 flex flex-col gap-2">
        <button
          onClick={onDownloadTile}
          className="w-full bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 border border-amber-400 text-amber-200 py-3 rounded-xl text-xs font-serif font-medium flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-red-900/30 transition-all duration-300"
        >
          <ArrowRight size={14} className="text-amber-300 animate-pulse" /> 导出数字化喜纹图案 (.PNG)
        </button>
        <span className="text-[10px] text-stone-500 text-center block">
          无损无水印导出，可直接用于 AI/CAD 或数码印花
        </span>
      </div>

    </div>
  );
}
