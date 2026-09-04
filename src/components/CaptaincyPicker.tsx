import React from 'react';
import type { CaptaincyRank } from '../types/fpl';
import { Crown, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaptaincyPickerProps {
  rankings: CaptaincyRank[];
  currentCaptainId: number;
  currentViceCaptainId: number;
  onSetCaptain: (playerId: number) => void;
  onSetViceCaptain: (playerId: number) => void;
  currentGW: number;
}

export const CaptaincyPicker: React.FC<CaptaincyPickerProps> = ({
  rankings,
  currentCaptainId,
  currentViceCaptainId,
  onSetCaptain,
  onSetViceCaptain,
  currentGW
}) => {
  const top3 = rankings.slice(0, 3);

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/30';
      case 1:
        return 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-bold';
      case 2:
        return 'bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Crown className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Captaincy Matrix & Optimizer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Calculates highest expected ceiling and goal involvement probabilities for Gameweek {currentGW}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
              GW {currentGW} Armband Recommendations
            </span>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((item, idx) => {
          const isCaptain = currentCaptainId === item.player.id;
          const isVice = currentViceCaptainId === item.player.id;

          return (
            <div
              key={item.player.id}
              className={`glass-panel rounded-3xl p-6 border relative flex flex-col justify-between transition-all ${
                idx === 0 
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/80 to-slate-950 shadow-xl shadow-amber-500/10 scale-102' 
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 ${getRankBadge(idx)}`}>
                    {idx === 0 && <Crown className="w-3.5 h-3.5" />}
                    <span>Rank #{idx + 1} Recommendation</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isCaptain && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px]">
                        ACTIVE (C)
                      </span>
                    )}
                    {isVice && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-300 text-slate-950 font-black text-[10px]">
                        ACTIVE (VC)
                      </span>
                    )}
                  </div>
                </div>

                {/* Player Name & Club */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-base">
                    {item.player.teamObj?.short_name}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{item.player.web_name}</h3>
                    <p className="text-xs text-slate-400">
                      {item.player.first_name} {item.player.second_name} • £{(item.player.now_cost / 10).toFixed(1)}m
                    </p>
                  </div>
                </div>

                {/* Matchup Banner */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Upcoming Matchup</span>
                    <span className="text-xs font-bold text-emerald-400">
                      vs {item.opponent} ({item.isHome ? 'Home' : 'Away'})
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                    FDR {item.fdr}
                  </span>
                </div>

                {/* Score & Probability Matrix */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">xPoints Baseline</span>
                    <span className="text-base font-black text-white font-mono">{item.xPoints} pts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 uppercase font-bold block">Captain Score</span>
                    <span className="text-base font-black text-amber-400 font-mono">{item.captainScore}</span>
                  </div>
                </div>

                {/* Rationale */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6 text-xs text-slate-300 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><b>AI Rationale:</b> {item.verdict}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Ceiling Probability: <b className="text-slate-200">{item.ceilingProbability}</b>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    onSetCaptain(item.player.id);
                    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
                  }}
                  disabled={isCaptain}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isCaptain
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{isCaptain ? 'Captain' : 'Set (C)'}</span>
                </button>

                <button
                  onClick={() => {
                    onSetViceCaptain(item.player.id);
                  }}
                  disabled={isVice}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isVice
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isVice ? 'Vice' : 'Set (VC)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL SQUAD CAPTAINCY RANKINGS TABLE */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Complete Starters Captaincy Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3">Next Match</th>
                <th className="py-3 px-3">Form</th>
                <th className="py-3 px-3">xGI / 90</th>
                <th className="py-3 px-3">xPoints</th>
                <th className="py-3 px-3">Captain Index</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rankings.map((item, idx) => (
                <tr key={item.player.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-300">#{idx + 1}</td>
                  <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-2">
                    <span>{item.player.web_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.player.teamObj?.short_name})</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    vs {item.opponent} ({item.isHome ? 'H' : 'A'}) [FDR {item.fdr}]
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{item.player.form}</td>
                  <td className="py-3 px-3 text-cyan-400">{item.xGI}</td>
                  <td className="py-3 px-3 text-purple-400 font-bold">{item.xPoints}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{item.captainScore}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => onSetCaptain(item.player.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      Make (C)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
