
import React, { useEffect, useState } from 'react';
import { SettingsSidebarProps, AIModel } from '../types';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ settings, setSettings }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('viralclip-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.model && parsed.model.startsWith('gemini')) {
            setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, [setSettings]);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('viralclip-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col h-full flex-none z-20">
      <div className="p-8 border-b border-white/5">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 opacity-90">
          <div className="p-1.5 bg-indigo-500/20 rounded-lg">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Configuration
        </h2>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        
        {/* Model Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Model</label>
          <div className="relative group">
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value as AIModel)}
              className="w-full bg-black/40 text-slate-200 text-sm border border-white/10 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all hover:bg-black/50"
            >
              {/* Correct model names per Gemini guidelines */}
              <option className="bg-gray-900" value="gemini-3-pro-preview">Gemini 3 Pro Preview</option>
              <option className="bg-gray-900" value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* API Key section removed per GenAI guidelines */}

        {/* Context Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Audience / Context</label>
          <textarea
            value={settings.context}
            onChange={(e) => handleChange('context', e.target.value)}
            className="w-full h-40 bg-black/40 text-slate-200 text-sm border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all resize-none placeholder-slate-600 hover:bg-black/50 leading-relaxed"
            placeholder="e.g. I am a crypto YouTuber looking for high energy moments..."
          />
          <p className="text-[10px] text-slate-500 font-medium">
            Refines the AI's definition of "viral".
          </p>
        </div>

      </div>

      <div className="p-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-600 font-mono">v1.1.0 • React • Tailwind</p>
      </div>
    </aside>
  );
};