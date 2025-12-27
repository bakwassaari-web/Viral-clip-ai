import React from 'react';

export type AIModel = 
  | 'gemini-3-pro-preview' 
  | 'gemini-3-flash-preview';

export interface Settings {
  model: AIModel;
  context: string;
}

export interface Clip {
  title: string;
  start: string;
  end: string;
  score: number;
  reasoning: string;
}

// Props types for components
export interface SettingsSidebarProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export interface ResultsGridProps {
  clips: Clip[];
  loading: boolean;
  youtubeUrl?: string;
}