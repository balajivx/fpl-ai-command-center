import React, { useState } from 'react';
import type { ChipStrategyPlan, SquadPlayer, ExpertPlaybook } from '../types/fpl';
import type { GameweekChipContext } from '../services/chipStrategy';
import { EXPERT_PLAYBOOKS } from '../services/chipStrategy';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ChipStrategyHubProps {
  plans: ChipStrategyPlan[];
  timeline: GameweekChipContext[];
  currentGW: number;
  squad: SquadPlayer[];
}

export const ChipStrategyHub: React.FC<ChipStrategyHubProps> = ({
  plans,
  timeline,
  currentGW,
  squad
}) => {
  const [activeSimulatorChip, setActiveSimulatorChip] = useState<'3xc' | 'freehit' | 'bboost' | 'wildcard'>('3xc');
  const [simulatedGW, setSimulatedGW] = useState<number>(25);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('ben_crellin_classic');

  const starters = squad.filter(p => p.isStarter);
  const bench = squad.filter(p => !p.isStarter);
  const captain = squad.find(p => p.isCaptain) || starters[0];

  // Base starter points
  const basePoints = starters.reduce((sum, p) => sum + (p.isCaptain ? p.xPointsNextGW * 2 : p.xPointsNextGW), 0);
  const benchPoints = bench.reduce((sum, p) => sum + p.xPointsNextGW, 0);
  const captainBasePoints = captain ? captain.xPointsNextGW : 8;

  // Simulator Projected Bonus Calculation
  let simulationBonus = 0;
  let simulationDescription = '';

  if (activeSimulatorChip === '3xc') {
    // 3xC adds an additional 1x captain points (total 3x) + double fixture multiplier if DGW
    const isDGW = simulatedGW === 25 || simulatedGW === 34 || simulatedGW === 37;
    simulationBonus = isDGW ? (captainBasePoints * 2.2) : captainBasePoints;
    simulationDescription = `Triple Captain multiplies ${captain?.web_name || 'Captain'}'s score from 2x to 3x. ${isDGW ? 'In a Double Gameweek, expected multiplier yields 24-36+ points!' : 'Standard single fixture returns ~8-15 extra points.'}`;
  } else if (activeSimulatorChip === 'bboost') {
    simulationBonus = benchPoints * (simulatedGW === 34 ? 1.8 : 1.0);
    simulationDescription = `Bench Boost brings all 4 bench players (GKP + 3 outfield subs) into your active scoring 15. Expected yield: ~${simulationBonus.toFixed(1)} additional points.`;
  } else if (activeSimulatorChip === 'freehit') {
    simulationBonus = simulatedGW === 29 ? 28 : 18;
    simulationDescription = `Free Hit lets you field a complete bespoke 11 for GW${simulatedGW} without taking hits or permanently changing your squad. Essential for Blank GW29!`;
  } else if (activeSimulatorChip === 'wildcard') {
    simulationBonus = 34;
    simulationDescription = `Wildcard gives unlimited permanent transfers to restructure deadwood, target green fixture runs, and prepare for upcoming Double Gameweeks.`;
  }

  const simulatedTotal = basePoints + simulationBonus;

  const getChipGradient = (chip: string) => {
    switch (chip) {
      case '3xc':
        return 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/30 text-amber-300';
      case 'freehit':
        return 'from-blue-500/20 via-indigo-500/10 to-transparent border-blue-500/30 text-blue-300';
      case 'bboost':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30 text-emerald-300';
      case 'wildcard':
        return 'from-purple-500/20 via-violet-500/10 to-transparent border-purple-500/30 text-purple-300';
      default:
        return 'from-slate-800 to-slate-900 border-slate-700 text-slate-300';
    }
  };

  const activePlaybook: ExpertPlaybook = EXPERT_PLAYBOOKS.find(p => p.id === selectedPlaybookId) || EXPERT_PLAYBOOKS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Analyst Chip Strategy & Roadmaps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Maximize your season points with proven chip strategies designed by Ben Crellin, FPL Harry, and Tom Freeman.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>DGW 25, 34, 37 & BGW 29 Radar Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Chip Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isPlayed = plan.status === 'PLAYED';

          return (
            <div
              key={plan.chip}
              className={`rounded-3xl p-5 border backdrop-blur-xl relative overflow-hidden transition-all ${
                isPlayed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : `bg-gradient-to-b ${getChipGradient(plan.chip)} shadow-xl`
              }`}
            >
              {/* Status Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center font-black text-sm text-white shadow-inner">
                  {plan.badge}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                  isPlayed 
                    ? 'bg-slate-800 text-slate-400 border-slate-700' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                }`}>
                  {isPlayed ? `PLAYED GW${plan.playedEvent}` : 'AVAILABLE'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{plan.name}</h3>
              
              {!isPlayed ? (
                <>
                  <div className="my-2 py-1.5 px-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Optimal Window</span>
                    <span className="font-bold text-emerald-400">Gameweek {plan.recommendedEvent}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                    {plan.rationale}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Est. Bonus:</span>
                    <span className="font-bold text-amber-400">+{plan.projectedBonusPoints} pts</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  Already activated in Gameweek {plan.playedEvent}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* SECTION 2: EXPERT PLAYBOOK COMPARISON (Ben Crellin vs FPL Harry vs Focal) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Expert Analyst Chip Playbooks</span>
            </h3>
            <p className="text-xs text-slate-400">Compare proven season-long chip roadmaps from legendary FPL creators</p>
          </div>

          {/* Playbook Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            {EXPERT_PLAYBOOKS.map(pb => (
              <button
                key={pb.id}
                onClick={() => setSelectedPlaybookId(pb.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedPlaybookId === pb.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{pb.avatar}</span>
                <span>{pb.analystName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Playbook Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activePlaybook.avatar}</span>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{activePlaybook.strategyTitle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                      {activePlaybook.badge}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">{activePlaybook.description}</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Projected Total Gain</span>
              <span className="text-xl font-black text-purple-300 font-mono">+{activePlaybook.projectedNetGain} pts</span>
            </div>
          </div>

          {/* Step-by-Step Chip Sequence */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Chronological Chip Sequence:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activePlaybook.chipSequence.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">GW {step.gw}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        step.chip === '3xc' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        step.chip === 'freehit' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        step.chip === 'bboost' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {step.chip.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1">{step.label}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{step.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Strategic Advantages</span>
              <div className="space-y-1">
                {activePlaybook.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">Risks / Watch-outs</span>
              <div className="space-y-1">
                {activePlaybook.cons.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Interactive "What-If" Chip Simulator */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Interactive "What-If" Chip Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">Test activating any chip on any future gameweek to see live point projections</p>
          </div>

          {/* Chip Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            {(['3xc', 'bboost', 'freehit', 'wildcard'] as const).map(chip => (
              <button
                key={chip}
                onClick={() => setActiveSimulatorChip(chip)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSimulatorChip === chip
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {chip === '3xc' ? 'Triple Captain' : chip === 'bboost' ? 'Bench Boost' : chip === 'freehit' ? 'Free Hit' : 'Wildcard'}
              </button>
            ))}
          </div>
        </div>

        {/* Gameweek Selector Slider / Buttons */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Target Simulation Gameweek: <span className="text-emerald-400 font-mono text-sm">GW {simulatedGW}</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(gw => {
              const isKey = gw === 25 || gw === 29 || gw === 34 || gw === 37;
              return (
                <button
                  key={gw}
                  onClick={() => setSimulatedGW(gw)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center min-w-[54px] ${
                    simulatedGW === gw
                      ? 'bg-emerald-500 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>GW{gw}</span>
                  {isKey && (
                    <span className={`text-[8px] font-bold ${simulatedGW === gw ? 'text-slate-950' : 'text-amber-400'}`}>
                      {gw === 29 ? 'BGW' : 'DGW'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulation Output Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Lineup</span>
            <span className="text-2xl font-black text-slate-200 font-mono">{basePoints.toFixed(1)} pts</span>
            <span className="text-[11px] text-slate-500 block mt-1">11 Starters + Normal Captain</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">Chip Bonus Multiplier</span>
            <span className="text-2xl font-black text-purple-400 font-mono">+{simulationBonus.toFixed(1)} pts</span>
            <span className="text-[11px] text-purple-300/80 block mt-1">Added point gain</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Simulated GW{simulatedGW} Total</span>
            <span className="text-3xl font-black text-emerald-300 font-mono">{simulatedTotal.toFixed(1)} pts</span>
            <span className="text-[11px] text-emerald-400/80 block mt-1">Projected Gameweek Score</span>
          </div>
        </div>

        {/* Tactical Explanation */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">AI Tactical Assessment for GW{simulatedGW}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{simulationDescription}</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: 38-Gameweek Schedule & Chip Roadmap */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Gameweek 23–38 Master Calendar & Radar</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">38 Total GWs</span>
        </div>

        <div className="space-y-3">
          {timeline.slice(0, 16).map((item) => (
            <div
              key={item.gw}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.gw === currentGW
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : item.isDGW
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : item.isBGW
                  ? 'bg-rose-500/10 border-rose-500/40'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs ${
                  item.gw === currentGW 
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-white border border-slate-700'
                }`}>
                  <span className="text-[10px] text-slate-400 leading-none">GW</span>
                  <span className="text-base">{item.gw}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Gameweek {item.gw}</span>
                    {item.isDGW && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⚡ Double GW ({item.dgwTeams.join(', ')})
                      </span>
                    )}
                    {item.isBGW && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        🛡️ Blank GW (FA Cup)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>

              {/* Recommended Chip Tags */}
              <div className="flex items-center gap-2">
                {item.recommendedChips.map(chip => (
                  <span
                    key={chip}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm"
                  >
                    Recommended: {chip === '3xc' ? '3xC' : chip === 'bboost' ? 'BB' : chip === 'freehit' ? 'FH' : 'WC'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
