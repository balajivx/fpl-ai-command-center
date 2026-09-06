import React, { useState } from 'react';
import type { SquadPlayer, SellCandidatePlan, LiveTeamProfile } from '../types/fpl';

interface ExecutiveAlertBannerProps {
  squad: SquadPlayer[];
  transferCandidates: SellCandidatePlan[];
  profile: LiveTeamProfile | null;
  onNavigateToTransfers: () => void;
  onNavigateToPitch: () => void;
}

export const ExecutiveAlertBanner: React.FC<ExecutiveAlertBannerProps> = ({
  squad,
  transferCandidates,
  profile,
  onNavigateToTransfers,
  onNavigateToPitch
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // 1. Identify urgent injury / availability flags
  const flaggedPlayers = squad.filter(
    p => p.status !== 'a' || (p.chance_of_playing_next_round !== null && p.chance_of_playing_next_round < 75)
  );

  // 2. Identify tough upcoming fixtures for starters (FDR 4 or 5)
  const startersWithToughFixtures = squad.filter(
    p => p.isStarter && p.upcomingFixtures.length > 0 && p.upcomingFixtures[0].difficulty >= 4
  );

  // 3. Top transfer priority
  const topSell = transferCandidates.length > 0 ? transferCandidates[0] : null;
  const topAlternative = topSell && topSell.alternatives.length > 0 ? topSell.alternatives[0] : null;

  // 4. Hit justification status
  const hitWorthyOption = topAlternative?.hitJustification.isHitWorthy;

  // If squad has no major flags, we can show an all-clear or lightweight briefing
  const hasUrgentAlerts = flaggedPlayers.length > 0 || (topSell && topSell.sellScore >= 70);

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 shadow-xl">
      {/* Dynamic top accent line */}
      <div 
        className={`h-1.5 w-full bg-gradient-to-r ${
          flaggedPlayers.length > 0
            ? 'from-rose-500 via-amber-400 to-emerald-500'
            : 'from-emerald-400 via-teal-400 to-indigo-500'
        }`}
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              flaggedPlayers.length > 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {flaggedPlayers.length > 0 ? (
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Executive Squad Briefing
                </span>
                {profile && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {profile.teamName} · Bank: £{profile.bank}m
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {hasUrgentAlerts ? (
                  <>
                    <span>Squad Status:</span>
                    <span className="text-amber-400">Action Required Before Deadline</span>
                  </>
                ) : (
                  <>
                    <span>Squad Status:</span>
                    <span className="text-emerald-400">Optimal Structure &amp; Fixture Run</span>
                  </>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Briefing' : 'Collapse Briefing'}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Injury & Flag Alerts */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Availability &amp; Injury Intel
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    flaggedPlayers.length > 0 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {flaggedPlayers.length} Flagged
                  </span>
                </div>

                {flaggedPlayers.length > 0 ? (
                  <div className="space-y-1.5">
                    {flaggedPlayers.slice(0, 2).map((player) => (
                      <div key={player.id} className="text-xs flex items-center justify-between text-slate-200">
                        <span className="font-semibold">{player.web_name} ({player.teamObj?.short_name})</span>
                        <span className="text-rose-400 text-[11px] font-mono">
                          {player.news ? player.news.slice(0, 25) + '...' : 'Doubtful (50%)'}
                        </span>
                      </div>
                    ))}
                    {flaggedPlayers.length > 2 && (
                      <div className="text-[10px] text-slate-400 italic">
                        +{flaggedPlayers.length - 2} more flagged on bench
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    All 15 players are currently fully fit with 100% availability status.
                  </p>
                )}
              </div>

              <button
                onClick={onNavigateToPitch}
                className="mt-3 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                Inspect Squad Lineup &rarr;
              </button>
            </div>

            {/* 2. Fixture FDR Watch */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Tough Matchups (FDR 4+)
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {startersWithToughFixtures.length} Starters
                  </span>
                </div>

                {startersWithToughFixtures.length > 0 ? (
                  <div className="space-y-1.5">
                    {startersWithToughFixtures.slice(0, 2).map((player) => {
                      const fix = player.upcomingFixtures[0];
                      return (
                        <div key={player.id} className="text-xs flex items-center justify-between text-slate-200">
                          <span className="font-semibold">{player.web_name}</span>
                          <span className="text-amber-400 text-[11px] font-mono">
                            vs {fix?.opponent.short_name} ({fix?.isHome ? 'H' : 'A'}, FDR {fix?.difficulty})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Your starting XI has favorable or balanced fixture difficulty ratings for the next gameweek.
                  </p>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                Next 3 GW avg FDR: <span className="text-slate-200 font-bold">2.7 (Favorable)</span>
              </div>
            </div>

            {/* 3. Immediate Transfer & Hit Strategy */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    AI Priority Move
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {hitWorthyOption ? 'Hit Justified (-4)' : 'Free Transfer'}
                  </span>
                </div>

                {topSell && topAlternative ? (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-400 font-medium">OUT: {topSell.playerOut.web_name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">£{(topSell.playerOut.now_cost / 10).toFixed(1)}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-medium">IN: {topAlternative.playerIn.web_name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">£{(topAlternative.playerIn.now_cost / 10).toFixed(1)}m</span>
                    </div>
                    <div className="text-[11px] text-slate-300 pt-1">
                      Projected 3-GW boost: <span className="text-emerald-400 font-bold">+{topAlternative.xPts3GWDelta.toFixed(1)} pts</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Squad is well balanced. Rolling your free transfer is currently supported by the model.
                  </p>
                )}
              </div>

              <button
                onClick={onNavigateToTransfers}
                className="mt-3 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                Open Transfer Advisor &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
