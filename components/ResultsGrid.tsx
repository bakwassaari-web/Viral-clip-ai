import React, { useState } from 'react';
import { ResultsGridProps, Clip } from '../types';

export const ResultsGrid: React.FC<ResultsGridProps> = ({ clips, loading }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-indigo-400 animate-pulse font-medium">Hunting for viral moments...</p>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p>No clips generated yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
      {clips.map((clip, idx) => (
        <div 
          key={idx}
          className={`
            bg-gray-800 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-indigo-500/50 hover:-translate-y-1
            ${expandedIndex === idx ? 'ring-2 ring-indigo-500 shadow-indigo-500/20 col-span-1 md:col-span-3' : ''}
          `}
          onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
        >
          {/* Header / Summary */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                Viral Score: {clip.score}/10
              </span>
              <span className="text-xs text-gray-500 font-mono bg-gray-900 px-2 py-1 rounded">
                {clip.start} - {clip.end}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white leading-tight mb-2">
              {clip.title}
            </h3>

            {/* Expanded Content */}
            {expandedIndex === idx && (
              <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Why it works</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {clip.reasoning}
                </p>
                
                <div className="mt-4 flex gap-2">
                   <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                     Export Clip
                   </button>
                   <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                     Copy Title
                   </button>
                </div>
              </div>
            )}
            
            {expandedIndex !== idx && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {clip.reasoning}
              </p>
            )}
          </div>
          
          {/* Footer Hint */}
          <div className="bg-gray-900/50 p-2 text-center border-t border-gray-700/50">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              {expandedIndex === idx ? 'Click to collapse' : 'Click to see details'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};