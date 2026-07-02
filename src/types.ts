export interface NumerologyResults {
  drumVietii: number;
  expresie: number;
  suflet: number;
  personalit: number;
  psihic: number;
  maturitate: number;
  atitudine: number;
  generatie: number;
}

export interface ElementInfo {
  label: string;
  icon: string;
  color: string;
  dark: string;
  nums: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  elements: string[];
  nums: number[];
  cromatics: string[];
  style: string;
  desc: string;
  url: string;
  img: string;
}

export interface SavedProfile {
  name: string;
  day: number;
  month: number;
  year: number;
  nums: NumerologyResults;
  savedAt: string;
  customTitle?: string;
}
