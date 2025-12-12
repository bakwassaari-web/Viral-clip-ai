import React, { useState } from 'react';
import { ResultsGridProps } from '../types';

export const ResultsGrid: React.FC<ResultsGridProps> = ({ clips, loading }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-indigo-400 animate-pulse font-medium tracking-wide">Hunting for viral moments...</p>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="font-medium">No clips generated yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {clips.map((clip, idx) => (
        <div 
          key={idx}
          className={`
            group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer 
            hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1
            ${expandedIndex === idx ? 'ring-2 ring-purple-500 shadow-purple-500/20 col-span-1 md:col-span-2 lg:col-span-3 z-10' : ''}
          `}
          onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
        >
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Header / Summary */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                Score: {clip.score}/10
              </span>
              <span className="text-xs text-slate-400 font-mono bg-black/30 px-2 py-1 rounded border border-white/5">
                {clip.start} - {clip.end}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white leading-snug tracking-tight mb-2 group-hover:text-purple-200 transition-colors">
              {clip.title}
            </h3>

            {/* Expanded Content */}
            {expandedIndex === idx && (
              <div className="mt-5 pt-5 border-t border-white/10 animate-fadeIn">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Viral Potential</h4>
                <p className="text-slate-300 text-sm leading-7">
                  {clip.reasoning}
                </p>
                
                <div className="mt-6 flex gap-3">
                   <button className="flex-1 bg-white hover:bg-gray-100 text-black text-xs font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-white/10">
                     Export Clip JSON
                   </button>
                   <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors backdrop-blur-sm">
                     Copy Title
                   </button>
                </div>
              </div>
            )}
            
            {expandedIndex !== idx && (
              <p className="text-sm text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {clip.reasoning}
              </p>
            )}
          </div>
          
          {/* Footer Hint */}
          <div className="bg-black/20 p-2.5 text-center border-t border-white/5 transition-colors group-hover:bg-purple-500/10">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold group-hover:text-purple-300">
              {expandedIndex === idx ? 'Collapse Details' : 'View Analysis'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};