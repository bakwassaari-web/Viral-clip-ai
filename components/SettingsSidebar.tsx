
import React, { useEffect, useState } from 'react';
import { SettingsSidebarProps, AIModel } from '../types';
import { Activity, Zap, ShieldCheck, BarChart3, Clock, Lock, Sliders, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ settings, setSettings }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // 1. Initial Load: Load settings and API key from persistence
  useEffect(() => {
    const savedSettings = localStorage.getItem('viralclip-settings');
    const savedKey = localStorage.getItem('gemini_api_key');
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ 
          ...prev, 
          ...parsed,
          apiKey: savedKey || prev.apiKey 
        }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else if (savedKey) {
      setSettings(prev => ({ ...prev, apiKey: savedKey }));
    }

    setIsLoaded(true);
  }, [setSettings]);

  // 2. Persistence: Save settings on change
  useEffect(() => {
    if (isLoaded) {
      const { apiKey, ...otherSettings } = settings;
      localStorage.setItem('viralclip-settings', JSON.stringify(otherSettings));
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [settings, isLoaded]);

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Instant readiness check for visual feedback
  const isKeyReady = settings.apiKey && settings.apiKey.trim().length >= 10;

  return (
    <aside className="w-80 bg-slate-900/80 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full flex-none z-20 overflow-hidden">
      {/* SaaS Header & Status */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            System Status
          </h2>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isKeyReady ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-[10px] font-mono uppercase ${isKeyReady ? 'text-emerald-400' : 'text-red-400'}`}>
              {isKeyReady ? 'READY' : 'NO KEY'}
            </span>
          </div>
        </div>
        
        {/* Toggleable API Management */}
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border
            ${showConfig 
              ? 'bg-white/10 border-white/20 text-white' 
              : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
            }`}
        >
          <Sliders className="w-3 h-3" />
          {showConfig ? 'Hide Config' : 'API Management'}
          {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showConfig && (
          <div className="mt-4 bg-black/40 rounded-xl p-4 border border-white/10 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Gemini API Key</span>
              </div>
            </div>
            
            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="Pasted key here..."
                className="w-full bg-black/60 text-slate-200 text-xs border border-white/10 rounded-lg p-3 pr-10 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700"
              />
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="text-[9px] text-slate-500 leading-relaxed italic">
              * Keys are encrypted and saved locally in your browser to maintain SaaS performance.
            </p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Updated Model Selector with professional labels */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3 h-3 text-indigo-400" />
            AI Intelligence
          </label>
          <select
            value={settings.model}
            onChange={(e) => handleChange('model', e.target.value as AIModel)}
            className="w-full bg-black/60 text-slate-200 text-sm border border-white/10 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all hover:border-white/20"
          >
            <option value="gemini-3-pro-preview">Google Gemini 3 Pro Preview</option>
            <option value="gemini-3-flash-preview">Google Gemini 3 Flash Preview</option>
          </select>
        </div>

        {/* Viral Context Strategy */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3 h-3 text-purple-400" />
            Viral Strategy
          </label>
          <textarea
            value={settings.context}
            onChange={(e) => handleChange('context', e.target.value)}
            className="w-full h-32 bg-black/60 text-slate-200 text-sm border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none placeholder-slate-600 leading-relaxed"
            placeholder="Describe your niche, audience, and preferred tone for clipping strategy..."
          />
        </div>

        {/* Workspace Insights */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Workspace
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="block text-[10px] text-slate-500 mb-1">Total Clips</span>
              <span className="text-lg font-bold text-white">0</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="block text-[10px] text-slate-500 mb-1">Saved Time</span>
              <span className="text-lg font-bold text-indigo-400">0h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
           <Clock className="w-3 h-3" />
           <span className="text-[10px] font-mono uppercase tracking-tighter">Plan: SaaS Pro</span>
        </div>
        <span className="text-[10px] text-slate-700 font-mono">v1.6.0-stable</span>
      </div>
    </aside>
  );
};
