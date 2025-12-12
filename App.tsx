import React, { useState, useEffect } from 'react';
import { SettingsSidebar } from './components/SettingsSidebar';
import { ResultsGrid } from './components/ResultsGrid';
import { generateViralClips } from './services/aiService';
import { AIModel, Clip, Settings } from './types';

export default function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  // Default settings
  const [settings, setSettings] = useState<Settings>({
    model: 'models/gemini-3-pro-preview',
    context: 'General Audience'
  });

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      setError("Please enter a transcript.");
      return;
    }
    if (!apiKey) {
      setError("Please enter an API Key in the settings.");
      return;
    }

    setLoading(true);
    setError(null);
    setClips([]);

    try {
      const results = await generateViralClips(
        transcript,
        apiKey,
        settings.model,
        settings.context
      );
      setClips(results);
    } catch (err: any) {
      setError(err.message || "Failed to generate clips.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-gray-100 font-sans selection:bg-purple-500/30">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Sidebar */}
      <SettingsSidebar 
        settings={settings}
        setSettings={setSettings}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex-none p-8 border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 filter drop-shadow-lg">
            ViralClip AI
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Transform long transcripts into viral gold using <span className="text-white">{settings.model.includes('gemini') ? 'Google Gemini' : 'Anthropic Claude'}</span>.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* Transcript Input Section */}
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl transition-all hover:border-white/20">
            <div className="bg-black/40 rounded-xl p-5">
              <label htmlFor="transcript" className="block text-sm font-semibold text-slate-300 mb-3 tracking-wide uppercase">
                Video Transcript
              </label>
              <textarea
                id="transcript"
                className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-4 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all resize-none text-gray-200 placeholder-slate-600 font-mono leading-relaxed"
                placeholder="Paste your raw video transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-500">
                  {transcript.length} characters
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !transcript}
                  className={`
                    relative overflow-hidden px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5
                    ${loading || !transcript 
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/10'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Generate Viral Clips'}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm shadow-lg">
              <span className="text-xl">🚨</span>
              {error}
            </div>
          )}

          {/* Results Section */}
          <ResultsGrid clips={clips} loading={loading} />
          
        </div>
      </main>
    </div>
  );
}