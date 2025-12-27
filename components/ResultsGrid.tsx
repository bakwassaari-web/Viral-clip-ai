
import React, { useState, useRef } from 'react';
import { ResultsGridProps } from '../types';
// Fix: Added missing 'Clock' icon import from lucide-react
import { Play, TrendingUp, Info, Copy, Share2, Youtube, Clock } from 'lucide-react';

export const ResultsGrid: React.FC<ResultsGridProps> = ({ clips, loading, youtubeUrl }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const youtubeId = youtubeUrl ? getYoutubeId(youtubeUrl) : null;

  const handleClipClick = (idx: number, start: string) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
    
    if (youtubeId && playerRef.current) {
      const seconds = timeToSeconds(start);
      playerRef.current.src = `https://www.youtube.com/embed/${youtubeId}?start=${seconds}&autoplay=1`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-8 animate-fadeIn">
        <div className="relative">
            <div className="w-24 h-24 border-b-2 border-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
               <TrendingUp className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">Deconstructing Content...</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">Our AI is currently mapping retention hooks and emotional peak moments.</p>
        </div>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04]">
        <Youtube className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-semibold text-lg opacity-40">Awaiting content for analysis</p>
        <p className="text-sm opacity-30 mt-1">Paste a transcript to begin the viral extraction.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      {youtubeId && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe
              ref={playerRef}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`}
              title="Clip Sync Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clips.map((clip, idx) => (
          <div 
            key={idx}
            className={`
              group relative bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-500
              hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2
              ${expandedIndex === idx ? 'ring-2 ring-indigo-500/50 bg-white/[0.06]' : ''}
            `}
            onClick={() => handleClipClick(idx, clip.start)}
          >
            <div className="p-7">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${clip.score >= 9 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Viral Index</span>
                  </div>
                  <div className="text-2xl font-black text-white">{clip.score}<span className="text-slate-600 text-sm">/10</span></div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                   <Clock className="w-3 h-3 text-indigo-400" />
                   <span className="text-xs font-mono text-slate-300">{clip.start}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white leading-tight mb-4 group-hover:text-indigo-300 transition-colors">
                {clip.title}
              </h3>

              {expandedIndex === idx ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Retention Strategy</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {clip.reasoning}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                     <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                       <Share2 className="w-3.5 h-3.5" />
                       Optimize
                     </button>
                     <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white transition-colors">
                       <Copy className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <Play className="w-3 h-3 fill-current" />
                  Preview Moment
                </div>
              )}
            </div>
            
            <div className="h-1 w-full bg-white/5">
               <div 
                 className={`h-full transition-all duration-1000 ${clip.score >= 9 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                 style={{ width: `${clip.score * 10}%` }} 
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
