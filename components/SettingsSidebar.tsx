
import React, { useEffect, useState } from 'react';
import { SettingsSidebarProps, AIModel } from '../types';
import { Activity, Zap, ShieldCheck, BarChart3, Clock, Lock, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ settings, setSettings }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [secureToken, setSecureToken] = useState('');

  // 1. On Load (useEffect): Load saved settings and tokens
  useEffect(() => {
    const savedSettings = localStorage.getItem('viralclip-settings');
    const savedToken = localStorage.getItem('workspace-secure-token');
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.model) {
            setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    if (savedToken) {
      setSecureToken(savedToken);
    }

    setIsLoaded(true);
  }, [setSettings]);

  // 2. On Change: Automatically persist settings to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('viralclip-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Persist secure token (demonstrating the "Remember Me" logic for credentials)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('workspace-secure-token', secureToken);
    }
  }, [secureToken, isLoaded]);

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

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
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300 uppercase">
              Secure Link Active
            </span>
          </div>
        </div>
        
        {/* Advanced Config Toggle Button - Fixing the unresponsiveness */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border
            ${showAdvanced 
              ? 'bg-white/10 border-white/20 text-white' 
              : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
            }`}
        >
          <Sliders className="w-3 h-3" />
          {showAdvanced ? 'Hide Config' : 'Configure Workspace'}
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* 3. Input Box (Conditional Rendering): Controlled by showAdvanced state */}
        {showAdvanced && (
          <div className="mt-4 bg-black/40 rounded-xl p-4 border border-white/10 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Deployment Token</span>
            </div>
            {/* The Input Field Itself: password type, bound to state */}
            <input
              type="password"
              value={secureToken}
              onChange={(e) => setSecureToken(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/60 text-slate-200 text-sm border border-white/10 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700"
            />
            <p className="text-[9px] text-slate-500 leading-relaxed italic">
              * Secure tokens are persisted locally to enable workspace synchronization.
            </p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Model Selector */}
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
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Analysis)</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
          </select>
        </div>

        {/* Context Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3 h-3 text-purple-400" />
            Viral Strategy
          </label>
          <textarea
            value={settings.context}
            onChange={(e) => handleChange('context', e.target.value)}
            className="w-full h-32 bg-black/60 text-slate-200 text-sm border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none placeholder-slate-600 leading-relaxed"
            placeholder="Target audience details..."
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
              <span className="block text-[10px] text-slate-500 mb-1">Clips</span>
              <span className="text-lg font-bold text-white">128</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="block text-[10px] text-slate-500 mb-1">Saved</span>
              <span className="text-lg font-bold text-indigo-400">14h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
           <Clock className="w-3 h-3" />
           <span className="text-[10px] font-mono uppercase tracking-tighter">Plan: Pro</span>
        </div>
        <span className="text-[10px] text-slate-700 font-mono">v1.3.0-secure</span>
      </div>
    </aside>
  );
};
