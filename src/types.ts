/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PatternMode = 'F1' | 'F6' | 'POLAR';

export type TraditionalColorFilter = 'ORIGINAL' | 'GOLDEN' | 'VERMILION' | 'COBALT' | 'INK';

export interface PatternConfig {
  mode: PatternMode;
  colorFilter: TraditionalColorFilter;
  
  // F1 parameters
  f1Scale: number;      // 0.1 to 1.5
  f1SpacingX: number;   // 0.5 to 2.0
  f1SpacingY: number;   // 0.5 to 2.0
  f1Angle: number;      // 0 to 360 degrees
  
  // F6 parameters
  f6Scale: number;      // 0.2 to 1.5
  showSymmetryAxes: boolean; // For academic research display
  
  // Polar parameters
  polarLayers: number;  // 1 to 3
  polarCount1: number;  // Outer layer count (4 to 32)
  polarCount2: number;  // Middle layer count (4 to 24)
  polarCount3: number;  // Inner layer count (0 to 16, 0 means none)
  polarRadius1: number; // Outer layer radius ratio (0.5 to 0.9)
  polarRadius2: number; // Middle layer radius ratio (0.3 to 0.7)
  polarRadius3: number; // Inner layer radius ratio (0.1 to 0.5)
  polarInterlace: boolean; // Offset alternate layers angularly
  polarRotateElements: boolean; // Rotate elements to align radially or keep upright
  
  // Mockup parameters (shared/individual offsets if needed)
  mockupScale: number;  // 0.2 to 2.0
  mockupOffsetX: number; // -100 to 100 px
  mockupOffsetY: number; // -100 to 100 px
}

export interface DefaultPattern {
  id: string;
  name: string;
  englishName: string;
  description: string;
  svgData: string; // inline SVG string or base64
}
