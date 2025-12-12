import React from 'react';

export type AIModel = 
  | 'models/gemini-3-pro-preview' 
  | 'models/gemini-2.5-flash' 
  | 'claude-3-5-sonnet-20240620';

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
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

export interface ResultsGridProps {
  clips: Clip[];
  loading: boolean;
}