import { CountyData } from '../types';
import { GANSU_COUNTIES } from './gansuCounties';
import { QINGHAI_COUNTIES } from './qinghaiCounties';

// Combine all 86 counties of Gansu + 45 counties of Qinghai = 131 counties!
export const COUNTIES_DATA: CountyData[] = [
  ...GANSU_COUNTIES,
  ...QINGHAI_COUNTIES,
];

export const DEFAULT_COUNTY_ID = 'sunan';

export function getCountyById(id: string): CountyData {
  const found = COUNTIES_DATA.find((c) => c.id === id);
  return found || COUNTIES_DATA[0];
}

export function getCountiesByProvince(province: '甘肃' | '青海'): CountyData[] {
  return COUNTIES_DATA.filter((c) => c.province === province);
}

export function getAllAutonomousCounties(): CountyData[] {
  return COUNTIES_DATA.filter((c) => c.isAutonomous);
}

export function getAllPrefectures(): string[] {
  const set = new Set<string>();
  COUNTIES_DATA.forEach((c) => set.add(c.prefecture));
  return Array.from(set);
}

export function searchCounties(query: string): CountyData[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTIES_DATA;
  return COUNTIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.prefecture.toLowerCase().includes(q) ||
      c.terrainType.toLowerCase().includes(q) ||
      c.naturalLandmark.name.toLowerCase().includes(q) ||
      c.culturalLandmark.name.toLowerCase().includes(q) ||
      c.ethnicFeatures.specialty.toLowerCase().includes(q) ||
      c.ethnicGroup.toLowerCase().includes(q)
  );
}
