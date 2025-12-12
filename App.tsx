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
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100 font-sans">
      {/* Sidebar */}
      <SettingsSidebar 
        settings={settings}
        setSettings={setSettings}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex-none p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md z-10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            ViralClip AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Transform long transcripts into viral gold using {settings.model.includes('gemini') ? 'Google Gemini' : 'Anthropic Claude'}.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Transcript Input Section */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
            <label htmlFor="transcript" className="block text-sm font-medium text-gray-300 mb-2">
              Video Transcript
            </label>
            <textarea
              id="transcript"
              className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-gray-200 placeholder-gray-600"
              placeholder="Paste your video transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {transcript.length} characters
              </span>
              <button
                onClick={handleGenerate}
                disabled={loading || !transcript}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all shadow-md
                  ${loading || !transcript 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25'
                  }`}
              >
                {loading ? 'Analyzing...' : 'Generate Viral Clips'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
              🚨 {error}
            </div>
          )}

          {/* Results Section */}
          <ResultsGrid clips={clips} loading={loading} />
          
        </div>
      </main>
    </div>
  );
}