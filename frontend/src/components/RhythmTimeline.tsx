import React from 'react';
import { RhythmTimelineDay } from '../types';
import { ClockIcon, MoonIcon, AlertCircleIcon, CheckCircleIcon } from './Icons';

export const RhythmTimeline: React.FC<{ days: RhythmTimelineDay[] }> = ({ days }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">7-Day Rhythm Timeline</h3>
        <span className="text-xs text-indigo-300/70">Connecting deadlines, study timing & energy</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const isDelayedOrMissed = day.deadline_status === 'delayed' || day.deadline_status === 'missed';
          return (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                day.trend_marker === 'shift'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : day.trend_marker === 'recovering'
                  ? 'bg-purple-950/20 border-purple-500/20'
                  : 'bg-indigo-950/40 border-indigo-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-200">{day.day_label}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">{day.date}</span>
                </div>

                {day.deadline_event && (
                  <div className="mb-2">
                    <span
                      className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 ${
                        day.deadline_status === 'on_time'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : day.deadline_status === 'delayed'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : day.deadline_status === 'missed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {day.deadline_status === 'delayed' ? 'Delayed' : day.deadline_status === 'missed' ? 'Missed deadline' : 'On track'}
                    </span>
                    <p className="text-[11px] text-white/90 line-clamp-2 leading-tight">
                      {day.deadline_event}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5 py-1.5 border-t border-indigo-500/10 text-[11px] text-indigo-300/80">
                  <div className="flex items-center justify-between">
                    <span>Consistency:</span>
                    <span className="text-white font-medium">{day.study_consistency_pct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Past midnight:</span>
                    <span className={`font-medium ${day.late_night_hours > 1.5 ? 'text-amber-300' : 'text-indigo-200'}`}>
                      {day.late_night_hours}h
                    </span>
                  </div>
                  {day.energy_level && (
                    <div className="flex items-center justify-between">
                      <span>Energy check-in:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`w-1.5 h-1.5 rounded-full ${
                              lvl <= (day.energy_level || 0)
                                ? day.energy_level! <= 2 ? 'bg-amber-400' : 'bg-teal-400'
                                : 'bg-indigo-900'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-indigo-500/10">
                <p className="text-[10px] text-indigo-300/70 italic leading-snug">
                  {day.gentle_note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
