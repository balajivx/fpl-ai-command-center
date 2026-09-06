import React, { useState } from 'react';
import type { LiveTeamProfile, LiveSyncStatus } from '../types/fpl';
import { getRecentTeamIds } from '../services/fplApi';

interface TeamSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: LiveTeamProfile | null;
  syncStatus: LiveSyncStatus;
  syncError: string | null;
  onSyncTeamId: (teamId: number) => Promise<void>;
  onSelectPreset: (presetIndex: number) => void;
}

export const TeamSyncModal: React.FC<TeamSyncModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  syncStatus,
  syncError,
  onSyncTeamId,
  onSelectPreset
}) => {
  const [inputVal, setInputVal] = useState<string>(currentProfile ? String(currentProfile.id) : '');
  const [activeTab, setActiveTab] = useState<'sync' | 'guide'>('sync');
  const recentIds = getRecentTeamIds();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(inputVal.trim(), 10);
    if (!isNaN(id) && id > 0) {
      onSyncTeamId(id);
    }
  };

  const handleSelectRecent = (id: number) => {
    setInputVal(String(id));
    onSyncTeamId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
        
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Connect FPL Squad
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                    Live API 2026
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sync any live FPL team directly using their official entry ID
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 my-4 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('sync')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Sync Live ID
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Where is my Team ID?
            </button>
          </div>

          {activeTab === 'sync' ? (
            <div className="space-y-5">
              {/* Active Profile Status */}
              {currentProfile && (
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {currentProfile.teamName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{currentProfile.teamName}</div>
                      <div className="text-xs text-slate-400">
                        {currentProfile.managerName} · Rank: <span className="text-emerald-400 font-medium">#{currentProfile.overallRank.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-slate-300 font-medium">£{currentProfile.bank}m in bank</div>
                    <div className="text-slate-500 text-[11px]">{currentProfile.freeTransfers} FTs available</div>
                  </div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Enter FPL Team / Entry ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 482, 1000, 24591..."
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      disabled={syncStatus === 'loading'}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={syncStatus === 'loading' || !inputVal.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {syncStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Load Team</span>
                      </>
                    )}
                  </button>
                </div>

                {syncError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{syncError}</span>
                  </div>
                )}
              </form>

              {/* Recent IDs */}
              {recentIds.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Recent Team IDs
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentIds.map((id) => (
                      <button
                        key={id}
                        onClick={() => handleSelectRecent(id)}
                        disabled={syncStatus === 'loading'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                          currentProfile?.id === id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ID: {id}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Teams */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Or load demo presets:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onSelectPreset(0);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center justify-between">
                      Balaji XI
                      <span className="text-[10px] text-emerald-400 font-mono">#24.5k</span>
                    </div>
                    <div className="text-[11px] text-slate-400">3-4-3 with Palmer & Isak</div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectPreset(1);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center justify-between">
                      Top 10k Template
                      <span className="text-[10px] text-indigo-400 font-mono">#8.1k</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Consensus Meta Template</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Guide Tab */
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700 space-y-2.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center text-xs font-bold">1</span>
                  Go to the official FPL website
                </div>
                <p className="text-slate-400 pl-7">
                  Log in to your account at <a href="https://fantasy.premierleague.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">fantasy.premierleague.com</a> and click on the <strong className="text-slate-200">"Points"</strong> or <strong className="text-slate-200">"Pick Team"</strong> tab.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700 space-y-2.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center text-xs font-bold">2</span>
                  Inspect your browser's URL address bar
                </div>
                <p className="text-slate-400 pl-7">
                  Look at the URL in your browser. It will look like this:
                </p>
                <div className="ml-7 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                  https://fantasy.premierleague.com/entry/<span className="text-emerald-400 font-bold bg-emerald-500/20 px-1 py-0.5 rounded">XXXXXXX</span>/event/3
                </div>
                <p className="text-slate-400 pl-7">
                  The number after <code className="text-emerald-400 font-mono">/entry/</code> is your unique Team ID. Copy and paste it into the sync box above!
                </p>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-[11px] flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Team IDs are 100% public under official FPL rules. No passwords or tokens are ever needed.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with live FPL 2026/27 servers</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
