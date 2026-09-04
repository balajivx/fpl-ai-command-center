import React, { useState } from 'react';
import type { SquadPlayer } from '../types/fpl';
import { 
  Crown, 
  Award, 
  ArrowRightLeft, 
  Sparkles, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PitchViewProps {
  squad: SquadPlayer[];
  currentGW: number;
  onSetCaptain: (playerId: number) => void;
  onSetViceCaptain: (playerId: number) => void;
  onSwapPlayers: (player1Id: number, player2Id: number) => void;
  onSelectPlayerForTransfer: (player: SquadPlayer) => void;
}

export const PitchView: React.FC<PitchViewProps> = ({
  squad,
  currentGW,
  onSetCaptain,
  onSetViceCaptain,
  onSwapPlayers,
  onSelectPlayerForTransfer
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<SquadPlayer | null>(null);
  const [swapSourcePlayer, setSwapSourcePlayer] = useState<SquadPlayer | null>(null);

  const starters = squad.filter(p => p.isStarter);
  const bench = squad.filter(p => !p.isStarter).sort((a, b) => a.positionIndex - b.positionIndex);

  // Group starters by position
  const gkps = starters.filter(p => p.element_type === 1);
  const defs = starters.filter(p => p.element_type === 2);
  const mids = starters.filter(p => p.element_type === 3);
  const fwds = starters.filter(p => p.element_type === 4);

  const formation = `${defs.length}-${mids.length}-${fwds.length}`;

  // Total projected expected points
  const totalStartersXPoints = starters.reduce((acc, p) => acc + (p.isCaptain ? p.xPointsNextGW * 2 : p.xPointsNextGW), 0);
  const totalBenchXPoints = bench.reduce((acc, p) => acc + p.xPointsNextGW, 0);

  const handlePlayerCardClick = (player: SquadPlayer) => {
    if (swapSourcePlayer) {
      if (swapSourcePlayer.id === player.id) {
        setSwapSourcePlayer(null);
        return;
      }
      onSwapPlayers(swapSourcePlayer.id, player.id);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      setSwapSourcePlayer(null);
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
    }
  };

  const getFDRBadgeColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 3:
        return 'bg-slate-700/60 text-slate-300 border-slate-600/40';
      case 4:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 5:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const renderPlayerCard = (player: SquadPlayer, isBench = false) => {
    const isSelected = selectedPlayer?.id === player.id;
    const isSwapSource = swapSourcePlayer?.id === player.id;
    const isInjured = player.status !== 'a';
    const isKnock = player.status === 'd';

    return (
      <div
        key={player.id}
        onClick={() => handlePlayerCardClick(player)}
        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 transform ${
          isSwapSource
            ? 'scale-105 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 z-30'
            : isSelected
            ? 'scale-105 ring-2 ring-emerald-400 z-20'
            : 'hover:scale-105 hover:z-10'
        }`}
      >
        {/* Armband Badges */}
        {player.isCaptain && (
          <div className="absolute -top-2.5 -right-2 z-20 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-lg shadow-amber-500/40 border border-amber-100">
            C
          </div>
        )}
        {player.isViceCaptain && (
          <div className="absolute -top-2.5 -right-2 z-20 w-6 h-6 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-md border border-white">
            V
          </div>
        )}

        {/* Status Injury Icon */}
        {isInjured && (
          <div className={`absolute -top-2 -left-2 z-20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md ${
            isKnock ? 'bg-amber-500' : 'bg-rose-600 animate-pulse'
          }`}>
            !
          </div>
        )}

        {/* Player Jersey / Visual Icon */}
        <div className="relative mb-1">
          <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shadow-lg border transition-all ${
            player.element_type === 1
              ? 'bg-gradient-to-b from-amber-500/30 to-amber-700/50 border-amber-400/40'
              : player.element_type === 2
              ? 'bg-gradient-to-b from-blue-500/30 to-blue-700/50 border-blue-400/40'
              : player.element_type === 3
              ? 'bg-gradient-to-b from-emerald-500/30 to-emerald-700/50 border-emerald-400/40'
              : 'bg-gradient-to-b from-rose-500/30 to-rose-700/50 border-rose-400/40'
          }`}>
            <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white">
              {player.teamObj?.short_name || 'PL'}
            </span>
          </div>

          {/* Position Index tag for bench */}
          {isBench && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 text-slate-300 font-mono text-[9px] border border-slate-700">
              {player.positionIndex === 12 ? 'GK' : `Sub ${player.positionIndex - 12}`}
            </span>
          )}
        </div>

        {/* Player Details Pill */}
        <div className="w-24 sm:w-28 text-center rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 p-1.5 shadow-xl transition-colors group-hover:border-slate-700">
          <div className="text-[11px] sm:text-xs font-bold text-white truncate px-1 flex items-center justify-center gap-1">
            <span>{player.web_name}</span>
            {player.isPenaltyTaker && <span className="text-[9px]">⚽</span>}
            {player.talismanRating >= 8 && <span className="text-[9px]">👑</span>}
          </div>

          <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400 font-mono border-t border-slate-800/60 pt-1">
            <span className="text-emerald-400 font-semibold">£{(player.now_cost / 10).toFixed(1)}m</span>
            <span className="font-bold text-slate-200">{player.xPointsNextGW} xP</span>
          </div>

          {/* Next Fixture with FDR */}
          {player.upcomingFixtures[0] && (
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border font-mono ${getFDRBadgeColor(player.upcomingFixtures[0].difficulty)}`}>
                {player.upcomingFixtures[0].opponent.short_name} ({player.upcomingFixtures[0].isHome ? 'H' : 'A'})
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Stat & Controls Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Tactical Pitch</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                GW {currentGW} Lineup
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Current Formation: <span className="font-bold text-slate-200 font-mono">{formation}</span> • Click any player to manage captaincy, swap, or find AI transfer upgrades.
          </p>
        </div>

        {/* Points Projection Strip */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starters Projected</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {totalStartersXPoints.toFixed(1)} <span className="text-xs font-medium text-slate-400">xPts</span>
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Bench Backup</span>
            <span className="text-lg font-black text-slate-300 font-mono">
              {totalBenchXPoints.toFixed(1)} <span className="text-xs font-medium text-slate-400">xPts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Pitch Graphic */}
      <div className="relative rounded-3xl overflow-hidden fpl-pitch-bg border border-emerald-600/30 shadow-2xl p-4 sm:p-8 min-h-[560px] flex flex-col justify-between">
        
        {/* Pitch Stripes & Markings */}
        <div className="absolute inset-0 pitch-stripes pointer-events-none" />
        
        {/* Center Line & Center Circle */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full border-2 border-white/10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        {/* Penalty Boxes */}
        <div className="absolute top-0 left-1/2 w-64 h-24 border-2 border-t-0 border-white/10 pointer-events-none -translate-x-1/2 rounded-b-xl" />
        <div className="absolute bottom-0 left-1/2 w-64 h-24 border-2 border-b-0 border-white/10 pointer-events-none -translate-x-1/2 rounded-t-xl" />

        {/* Swap Mode Alert Banner */}
        {swapSourcePlayer && (
          <div className="relative z-30 mb-4 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Select any player on pitch or bench to swap with <b>{swapSourcePlayer.web_name}</b></span>
            </div>
            <button
              onClick={() => setSwapSourcePlayer(null)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white text-[11px]"
            >
              Cancel Swap
            </button>
          </div>
        )}

        {/* Starters: Goalkeepers Line */}
        <div className="relative z-10 flex justify-center items-center py-2">
          {gkps.map(p => renderPlayerCard(p))}
        </div>

        {/* Starters: Defenders Line */}
        <div className="relative z-10 flex justify-around items-center py-2 px-2 sm:px-8">
          {defs.map(p => renderPlayerCard(p))}
        </div>

        {/* Starters: Midfielders Line */}
        <div className="relative z-10 flex justify-around items-center py-2 px-2 sm:px-6">
          {mids.map(p => renderPlayerCard(p))}
        </div>

        {/* Starters: Forwards Line */}
        <div className="relative z-10 flex justify-around items-center py-2 px-4 sm:px-12">
          {fwds.map(p => renderPlayerCard(p))}
        </div>
      </div>

      {/* Bench Section */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Bench Substitutes</h3>
            <span className="text-xs text-slate-400">(In auto-sub priority order)</span>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-400">
            {bench.length} Active Reserves
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center py-2">
          {bench.map(p => renderPlayerCard(p, true))}
        </div>
      </div>

      {/* Selected Player Interactive Modal / Action Sheet */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-lg">
                  {selectedPlayer.teamObj?.short_name || 'PL'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedPlayer.first_name} {selectedPlayer.second_name}</span>
                    {selectedPlayer.isCaptain && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                        Captain
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedPlayer.teamObj?.name} • £{(selectedPlayer.now_cost / 10).toFixed(1)}m • {selectedPlayer.selected_by_percent}% Owned
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlayer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Player Performance Stats HUD */}
            <div className="grid grid-cols-4 gap-2 my-4">
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Form</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{selectedPlayer.form}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">xGI / 90</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{selectedPlayer.xGI90 || '0.0'}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">3-GW xPts</span>
                <span className="text-sm font-bold text-purple-400 font-mono">{selectedPlayer.xPts3GW || '0.0'}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Minutes</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{selectedPlayer.minutesSecurityScore}%</span>
              </div>
            </div>

            {/* Analyst Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {selectedPlayer.analystBadges?.map((b, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                  {b}
                </span>
              ))}
            </div>

            {/* Verified Team News Intel if present */}
            {selectedPlayer.latestTeamNews && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span>🎙️ {selectedPlayer.latestTeamNews.sourceName}</span>
                    <span className="text-[10px] text-cyan-300 font-mono">({selectedPlayer.latestTeamNews.sourceHandle})</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedPlayer.latestTeamNews.playingChance}% Available
                  </span>
                </div>
                <p className="italic text-[11px] text-slate-300">
                  "{selectedPlayer.latestTeamNews.quote}"
                </p>
              </div>
            )}

            {/* Injury/Status Note if present */}
            {selectedPlayer.news && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span><b>Status News:</b> {selectedPlayer.news}</span>
              </div>
            )}

            {/* Upcoming Fixture Run */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next 5 Fixtures & Difficulty (FDR)</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {selectedPlayer.upcomingFixtures.map((fix, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded-xl border text-center font-mono ${getFDRBadgeColor(fix.difficulty)}`}
                  >
                    <div className="text-[10px] font-bold">{fix.opponent.short_name}</div>
                    <div className="text-[9px] text-slate-400">{fix.isHome ? '(H)' : '(A)'}</div>
                    <div className="text-[9px] font-black mt-0.5">FDR {fix.difficulty}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onSetCaptain(selectedPlayer.id);
                  confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4" />
                <span>Make Captain</span>
              </button>

              <button
                onClick={() => {
                  onSetViceCaptain(selectedPlayer.id);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-400" />
                <span>Make Vice Captain</span>
              </button>

              <button
                onClick={() => {
                  setSwapSourcePlayer(selectedPlayer);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <span>Swap Position</span>
              </button>

              <button
                onClick={() => {
                  onSelectPlayerForTransfer(selectedPlayer);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Buy Upgrade</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
