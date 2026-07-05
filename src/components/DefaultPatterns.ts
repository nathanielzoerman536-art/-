/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultPattern } from '../types';

export const DEFAULT_PATTERNS: DefaultPattern[] = [
  {
    id: 'double_happiness',
    name: '囍·双喜临门',
    englishName: 'Double Happiness',
    description: '中国传统婚礼核心字符，由两个“喜”字并列组成，象征新婚夫妇双喜临门、百年好合。结构严谨对称，饱满端庄。',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M12 20h30v6H12zm0 12h30v6H12zm0 12h30v6H12zm46-24h30v6H58zm0 12h30v6H58zm0 12h30v6H58z" fill="currentColor"/>
      <path d="M22 15h6v40h-6zm46 0h6v40h-6zM18 55h22v6H18zm0 12h22v6H18zm0 12h22v6H18zm46-30h22v6H64zm0 12h22v6H64zm0 12h22v6H64z" fill="currentColor"/>
      <path d="M22 50h6v40h-6zm46 0h6v40h-6zm-36 5h10v30H32zm46 0h10v30H78z" fill="currentColor"/>
      <path d="M42 28h16v6H42zm0 40h16v6H42z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'auspicious_cloud',
    name: '祥云·福运连绵',
    englishName: 'Auspicious Cloud',
    description: '寓意“渊源共生，和谐共融”。云气袅袅，盘旋上升，象征高升、祥瑞与连绵不断的福泽，常用于婚礼边缘装饰。',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M50 85c-16.5 0-30-13.5-30-30 0-14.8 10.8-27.1 25-29.5C46.8 15.3 57.7 10 70 10c16.5 0 30 13.5 30 30 0 8.5-3.5 16.2-9.2 21.7C86.7 75.8 71.8 85 50 85zm20-65c-8.3 0-15.6 4.7-18.7 11.8L50 35l-2.3-1.6C36.8 26.1 26 36.3 26 55c0 13.2 10.8 24 24 24 16.5 0 29.5-7.5 38.3-21l1.7-2.6-2.6-1.7C82.1 50.2 80 45.3 80 40c0-11 9-20 20-20z" fill="currentColor"/>
      <path d="M60 48c0-6.6-5.4-12-12-12s-12 5.4-12 12 5.4 12 12 12c3.3 0 6.3-1.3 8.5-3.5l1.5-1.5c-2-2-4.5-3-8-3-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8c0 2-1 3.5-2.5 4.5l2 2c2-2 3-4.4 3-7z" fill="currentColor"/>
      <path d="M40 70c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.3 2-6 5-7.3V50c-6.1 2-10 7.8-10 14.5C19 74.8 27.2 83 37 83c8.3 0 15-5.7 16.5-13H40z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'ruyi_motif',
    name: '如意·万事顺遂',
    englishName: 'Ruyi Motif',
    description: '源自传统如意器物头部造型，融合灵芝与祥云，寓意“如意称心，吉祥如意”。线条优美流畅，结构和美。',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M50 12C32 12 18 26 18 44c0 12 6.5 22.5 16 28l1 1v15c0 3.3 2.7 6 6 6h18c3.3 0 6-2.7 6-6V73l1-1c9.5-5.5 16-16 16-28 0-18-14-32-32-32zm16 32c0 8.8-7.2 16-16 16s-16-7.2-16-16 7.2-16 16-16 16 7.2 16 16z" fill="currentColor"/>
      <path d="M50 20c-13.2 0-24 10.8-24 24 0 9.2 5.2 17.2 13 21.2v18.8h22V65.2c7.8-4 13-12 13-21.2 0-13.2-10.8-24-24-24zm0 8c8.8 0 16 7.2 16 16S58.8 60 50 60s-16-7.2-16-16 7.2-16 16-16z" fill="currentColor"/>
      <path d="M50 34c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 4c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'peony_bloom',
    name: '牡丹·繁花富贵',
    englishName: 'Peony Bloom',
    description: '牡丹被称为“国色天香”，代表富贵吉祥。圆润饱满的瓣片重叠生长，极具植物类团花构成的美感，华丽典雅。',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="10" fill="currentColor"/>
      <path d="M50 28c-12 0-22 10-22 22s10 22 22 22 22-10 22-22-10-22-22-22zm0 38c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" fill="currentColor"/>
      <path d="M50 16c-18.8 0-34 15.2-34 34s15.2 34 34 34 34-15.2 34-34-15.2-34-34-34zm0 62c-15.4 0-28-12.6-28-28s12.6-28 28-28 28 12.6 28 28-12.6 28-28 28z" fill="currentColor"/>
      <!-- Petals decoration -->
      <path d="M50 2c-3.3 0-6 2.7-6 6v6c0 3.3 2.7 6 6 6s6-2.7 6-6V8c0-3.3-2.7-6-6-6zM50 80c-3.3 0-6 2.7-6 6v6c0 3.3 2.7 6 6 6s6-2.7 6-6v-6c0-3.3-2.7-6-6-6zM2 50c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6s-2.7 6-6 6H8c-3.3 0-6-2.7-6-6zM80 50c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6s-2.7 6-6 6h-6c-3.3 0-6-2.7-6-6z" fill="currentColor"/>
      <path d="M16 16c-2.3-2.3-6.1-2.3-8.5 0s-2.3 6.1 0 8.5l4.2 4.2c2.3 2.3 6.1 2.3 8.5 0s2.3-6.1 0-8.5zM84 84c-2.3-2.3-6.1-2.3-8.5 0s-2.3 6.1 0 8.5l4.2 4.2c2.3 2.3 6.1 2.3 8.5 0s2.3-6.1 0-8.5zM16 84l-4.2 4.2c-2.3 2.3-2.3 6.1 0 8.5s6.1 2.3 8.5 0l4.2-4.2c2.3-2.3 2.3-6.1 0-8.5s-6.1-2.3-8.5 0zM84 16l-4.2 4.2c-2.3 2.3-2.3 6.1 0 8.5s6.1 2.3 8.5 0l4.2-4.2c2.3-2.3 2.3-6.1 0-8.5s-6.1-2.3-8.5 0z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'magpie_bird',
    name: '喜鹊·双喜临门',
    englishName: 'Magpie Joy',
    description: '喜鹊在中国传统文化中是“好消息”与“喜庆”的报春使者。其不对称的生动姿态非常适合在 F6 饰带群（含镜像与旋转）中展示完美的对称构成与方向变化。',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M85 35c-2-4-5-8-10-10-3-1-7-1-10 1-4 3-7 8-9 13s-3 10-2 15c2 6 7 11 13 13 5 2 11 1 15-2 4-3 7-8 7-13v-5c0-4-2-8-4-12z" fill="currentColor"/>
      <path d="M54 54c-5 2-10 5-15 9s-9 9-13 14c-4 5-7 11-9 18l-1 2 2-1c6-3 13-5 19-5 6-1 12 1 17 4 3 2 6 5 8 8l1 1c0-4-1-8-2-12-1-5-3-9-5-14s-5-9-8-13l-4-6z" fill="currentColor"/>
      <path d="M60 40c2 1 4 2 6 2l12-3c2-1 4-1 6 0l10 5c1 1 2 1 3 0s1-2 0-3L85 30c-1-1-3-2-5-2h-8c-2 0-4 1-6 2l-6 10z" fill="currentColor"/>
      <circle cx="78" cy="30" r="2" fill="#8B0000"/>
    </svg>`
  }
];
