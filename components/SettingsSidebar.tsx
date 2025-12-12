import React, { useEffect, useState } from 'react';
import { SettingsSidebarProps, AIModel } from '../types';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ settings, setSettings, apiKey, setApiKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('viralclip-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure the loaded model is one of the valid options, otherwise fallback
        if (parsed.model && (
            parsed.model.includes('gemini') || 
            parsed.model.includes('claude')
        )) {
            // Filter out apiKey from legacy saved settings if present
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { apiKey, ...validSettings } = parsed;
            setSettings(prev => ({ ...prev, ...validSettings }));
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

  const isGemini = settings.model.includes('gemini');

  return (
    <aside className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-none">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuration
        </h2>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1">
        
        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Model</label>
          <div className="relative">
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value as AIModel)}
              className="w-full bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="models/gemini-3-pro-preview">Gemini 3 Pro Preview</option>
              <option value="models/gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {isGemini ? 'Gemini API Key' : 'Claude API Key'}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={isGemini ? "AIzaSy..." : "sk-ant-..."}
            className="w-full bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-600"
          />
          <p className="text-xs text-gray-500">
            Key is used for this session only.
          </p>
        </div>

        {/* Context Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Audience / Context</label>
          <textarea
            value={settings.context}
            onChange={(e) => handleChange('context', e.target.value)}
            className="w-full h-32 bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none placeholder-gray-600"
            placeholder="e.g. I am a crypto YouTuber looking for high energy moments..."
          />
          <p className="text-xs text-gray-500">
            Helps the AI understand what "viral" means for you.
          </p>
        </div>

      </div>

      <div className="p-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">v1.1.0 • React • Tailwind</p>
      </div>
    </aside>
  );
};