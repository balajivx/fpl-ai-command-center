import React, { useState } from 'react';
import type { SellCandidatePlan, SquadPlayer, AnalystModelType, TeamNewsIntel } from '../types/fpl';
import { ANALYST_MODELS } from '../services/optimizer';
import { LIVE_TEAM_NEWS_INTEL } from '../data/teamNewsData';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowRightLeft, 
  Flame, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Award,
  AlertTriangle,
  Info,
  Radio,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { POSITION_NAMES } from '../services/fplApi';

interface TransferAdvisorProps {
  sellPlans: SellCandidatePlan[];
  bankBalanceTenths: number;
  freeTransfers: number;
  currentGW: number;
  selectedModel: AnalystModelType;
  onSelectModel: (model: AnalystModelType) => void;
  onApplyTransfer: (playerOutId: number, playerIn: SquadPlayer) => void;
  onNavigateToChips: () => void;
}

export const TransferAdvisor: React.FC<TransferAdvisorProps> = ({
  sellPlans,
  bankBalanceTenths,
  freeTransfers,
  currentGW,
  selectedModel,
  onSelectModel,
  onApplyTransfer,
  onNavigateToChips
}) => {
  const [expandedRank, setExpandedRank] = useState<number | null>(1); // default expand #1 priority
  const [showAnalystNotes, setShowAnalystNotes] = useState<boolean>(true);
  const [showNewsWire, setShowNewsWire] = useState<boolean>(true);
  const [selectedNewsFilter, setSelectedNewsFilter] = useState<'ALL' | 'RULED_OUT' | 'FIT_TO_START'>('ALL');

  const currentModelConfig = ANALYST_MODELS[selectedModel] || ANALYST_MODELS.consensus;
  const bankFormatted = (bankBalanceTenths / 10).toFixed(1);

  const getFDRBadgeColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 3:
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 4:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 5:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getMinutesSecurityBadge = (player: SquadPlayer) => {
    switch (player.minutesSecurity) {
      case 'NAILED_90':
        return {
          label: '🛡️ 90m Nailed',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'SAFE_STARTER':
        return {
          label: '🟢 Regular Starter',
          color: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
        };
      case 'ROTATION_RISK':
        return {
          label: '⚠️ Rotation Risk',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'SUB_THREAT':
        return {
          label: '🔴 Bench / Sub Risk',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      default:
        return {
          label: 'Active',
          color: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  const filteredNews: TeamNewsIntel[] = LIVE_TEAM_NEWS_INTEL.filter(item => {
    if (selectedNewsFilter === 'ALL') return true;
    return item.impact === selectedNewsFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. ANALYST MODEL SELECTOR & WAR ROOM HEADER */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 relative overflow-hidden border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Analyst Transfer Engine & Team News</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    GW {currentGW}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Integrated with live official press conferences, Ben Dinnery injury intel & top analyst models
                </p>
              </div>
            </div>
          </div>

          {/* Manager Financial & Transfer HUD */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Budget</span>
              <span className="text-sm sm:text-base font-black text-cyan-300 font-mono">£{bankFormatted}m</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Free Transfers</span>
              <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">{freeTransfers} FT</span>
            </div>
          </div>
        </div>

        {/* 2. ANALYST MODEL SWITCHER TABS */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Select Active Analyst Model Philosophy:</span>
            </span>
            <button
              onClick={() => setShowAnalystNotes(!showAnalystNotes)}
              className="text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showAnalystNotes ? 'Hide Analyst Details' : 'Show Analyst Details'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(Object.keys(ANALYST_MODELS) as AnalystModelType[]).map((key) => {
              const model = ANALYST_MODELS[key];
              const isSelected = selectedModel === key;

              return (
                <button
                  key={key}
                  onClick={() => onSelectModel(key)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg leading-none">{model.avatar}</span>
                    <span className="text-xs font-bold text-white truncate">{model.badge}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {model.creator}
                  </div>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Model Description Banner */}
          {showAnalystNotes && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">{currentModelConfig.name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 italic">{currentModelConfig.tagline}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  {currentModelConfig.corePhilosophy.map((p, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Chip Roadmap Prompt */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span><b>Chip Synergy Alert:</b> DGW 25 (Haaland/Saka Triple Captain) & BGW 29 (Free Hit) radar active.</span>
          </div>
          <button
            onClick={onNavigateToChips}
            className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View Ben Crellin & Harry Chip Playbooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. VERIFIED PRESS CONFERENCE & INTEL WIRE */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">LIVE</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Verified Press Conference & Intel Wire</span>
              <span className="text-xs text-slate-400 font-normal hidden md:inline">• Official Club Media & Premier Injuries (@BenDinnery)</span>
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'RULED_OUT', 'FIT_TO_START'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedNewsFilter(filter)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  selectedNewsFilter === filter
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All Updates' : filter === 'RULED_OUT' ? '🚨 Ruled Out' : '✅ Confirmed Fit'}
              </button>
            ))}
            <button
              onClick={() => setShowNewsWire(!showNewsWire)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 ml-1"
            >
              {showNewsWire ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showNewsWire && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {filteredNews.slice(0, 6).map((news) => {
              const isRuledOut = news.impact === 'RULED_OUT';
              const isFit = news.impact === 'FIT_TO_START';

              return (
                <div
                  key={news.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isRuledOut 
                      ? 'bg-rose-950/20 border-rose-500/30' 
                      : isFit 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1">
                        <span>{news.playerName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({news.teamName})</span>
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        isRuledOut
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {news.playingChance}% Available
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 leading-snug mb-1.5">
                      {news.headline}
                    </p>

                    <p className="text-[11px] text-slate-400 italic bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 mb-2 leading-relaxed">
                      {news.quote}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                    <span className="flex items-center gap-1 text-cyan-300 font-bold">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>{news.sourceHandle}</span>
                    </span>
                    <span>{news.timeAgo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. RANKED SELL CANDIDATES & CURATED ALTERNATIVES STACK */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Sell Recommendations (Ranked by {currentModelConfig.badge} Priority)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {sellPlans.length} Flagged Moves
          </span>
        </div>

        {sellPlans.map((plan) => {
          const isExpanded = expandedRank === plan.rank;
          const playerOut = plan.playerOut;
          const maxAffordable = ((playerOut.now_cost + bankBalanceTenths) / 10).toFixed(1);
          const outMinsSec = getMinutesSecurityBadge(playerOut);
          const outNews = plan.latestTeamNews || playerOut.latestTeamNews;

          return (
            <div
              key={plan.rank}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/95 border-slate-700 shadow-2xl'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* ACCORDION HEADER: SELL CANDIDATE */}
              <div
                onClick={() => setExpandedRank(isExpanded ? null : plan.rank)}
                className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
              >
                {/* Left: Player Info & Priority Badge */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex flex-col items-center justify-center font-black text-sm shrink-0 border ${
                    plan.urgency === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : plan.urgency === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400">SELL</span>
                    <span className="text-sm sm:text-base leading-none">#{plan.rank}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-white">
                        {playerOut.web_name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-semibold font-mono">
                        {POSITION_NAMES[playerOut.element_type]} • {playerOut.teamObj?.short_name}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${plan.urgencyBadgeColor}`}>
                        {plan.urgencyLabel}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${outMinsSec.color}`}>
                        {outMinsSec.label}
                      </span>
                      {outNews && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          outNews.impact === 'RULED_OUT'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}>
                          🎙️ {outNews.sourceHandle} Update
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Price: <b className="text-rose-400">£{(playerOut.now_cost / 10).toFixed(1)}m</b> • Form: <b>{playerOut.form}</b> • xGI/90: <b className="text-slate-300">{playerOut.xGI90 || '0.0'}</b> • Next 3 FDR: <b className="text-amber-300">{playerOut.avgNext3FDR}</b>
                    </p>
                  </div>
                </div>

                {/* Right: Quick Expand Trigger & Budget */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Replacement Budget</span>
                    <span className="font-bold text-emerald-400 font-mono">Up to £{maxAffordable}m</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT: WHY SELL & 3 CURATED ALTERNATIVES */}
              {isExpanded && (
                <div className="px-4 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-6 animate-fadeIn">
                  
                  {/* WHY SELL BOX */}
                  <div className="p-4 rounded-2xl bg-rose-950/25 border border-rose-500/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>Why Transfer Out {playerOut.web_name}?</span>
                      </div>
                      <span className="text-[10px] font-mono text-rose-400/80 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/20">
                        Sell Score: {plan.sellScore.toFixed(0)}/100
                      </span>
                    </div>

                    {/* Verified Team News Highlight if Available */}
                    {outNews && (
                      <div className="p-3 rounded-xl bg-rose-900/30 border border-rose-500/30 text-xs text-rose-200">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <Radio className="w-3.5 h-3.5 text-rose-400" />
                          <span>{outNews.sourceName} ({outNews.sourceHandle}):</span>
                        </div>
                        <p className="italic text-[11px] leading-relaxed">
                          "{outNews.quote}"
                        </p>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1">
                      {plan.sellReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Analyst Consensus Critique */}
                    {plan.analystConsensusCritique && (
                      <div className="mt-2.5 pt-2.5 border-t border-rose-500/20 flex items-start gap-2 text-xs text-slate-300 italic">
                        <span className="text-amber-400 font-bold not-italic shrink-0">💡 Analyst View:</span>
                        <span>{plan.analystConsensusCritique}</span>
                      </div>
                    )}
                  </div>

                  {/* CURATED ALTERNATIVES SECTION */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Curated Alternatives for {playerOut.web_name} (Same Position • Up to £{maxAffordable}m)</span>
                      </h4>
                    </div>

                    {plan.alternatives.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">
                        No viable alternatives found within your available budget. Consider freeing up bank funds first.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plan.alternatives.map((alt) => {
                          const candidate = alt.playerIn;
                          const isDirectUpgrade = alt.type === 'TOP_UPGRADE';
                          const candidateMinsSec = getMinutesSecurityBadge(candidate);
                          const hit = alt.hitJustification;
                          const buyerNews = alt.latestTeamNews || candidate.latestTeamNews;

                          return (
                            <div
                              key={candidate.id}
                              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all relative ${
                                isDirectUpgrade
                                  ? 'bg-gradient-to-b from-emerald-500/10 via-slate-900/90 to-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                                  : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div>
                                {/* Type Badge & Points Horizon */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${alt.typeBadgeColor}`}>
                                    {alt.typeLabel}
                                  </span>

                                  <div className="text-right">
                                    <span className="text-xs font-black text-emerald-400 font-mono block">
                                      +{alt.scoreDelta} xPts (GW{currentGW})
                                    </span>
                                    <span className="text-[10px] font-semibold text-cyan-400 font-mono">
                                      +{alt.xPts3GWDelta} xPts / 3GWs
                                    </span>
                                  </div>
                                </div>

                                {/* Player Info */}
                                <div className="flex items-center gap-2.5 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                                    {candidate.teamObj?.short_name || 'PL'}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                                      <span>{candidate.web_name}</span>
                                      {candidate.isPenaltyTaker && (
                                        <span className="text-[10px]" title="First choice penalty taker">⚽</span>
                                      )}
                                      {candidate.talismanRating >= 8 && (
                                        <span className="text-[10px]" title="Team talisman">👑</span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono">
                                      £{(candidate.now_cost / 10).toFixed(1)}m • {candidate.teamObj?.name}
                                    </div>
                                  </div>
                                </div>

                                {/* Verified Team News Status Pill */}
                                {buyerNews && (
                                  <div className="mb-3 p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-300">
                                    <div className="flex items-center justify-between font-bold mb-0.5">
                                      <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        <span>{buyerNews.sourceHandle} Verified</span>
                                      </span>
                                      <span>{buyerNews.playingChance}% Fit</span>
                                    </div>
                                    <p className="italic text-slate-300 line-clamp-2">
                                      "{buyerNews.quote}"
                                    </p>
                                  </div>
                                )}

                                {/* Rich Underlying Stat Grid (FPL Analysts HUD) */}
                                <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-3 text-center text-xs font-mono">
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">Form</span>
                                    <span className="font-bold text-emerald-400">{candidate.form}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">xGI / 90</span>
                                    <span className="font-bold text-cyan-300">{candidate.xGI90 || '0.0'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">npxG / 90</span>
                                    <span className="font-bold text-purple-300">{candidate.npxG90 || '0.0'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">3-GW FDR</span>
                                    <span className="font-bold text-amber-300">{candidate.avgNext3FDR}</span>
                                  </div>
                                </div>

                                {/* Minutes Security & Talisman Badges */}
                                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${candidateMinsSec.color}`}>
                                    {candidateMinsSec.label}
                                  </span>
                                  {candidate.fixtureSwingIndex > 0 && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      <span>+{candidate.fixtureSwingIndex}% Swing</span>
                                    </span>
                                  )}
                                </div>

                                {/* Next 3 Fixtures Strip */}
                                <div className="mb-3">
                                  <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>Next 3 Fixtures</span>
                                  </span>
                                  <div className="grid grid-cols-3 gap-1">
                                    {candidate.upcomingFixtures.slice(0, 3).map((fix, idx) => (
                                      <div
                                        key={idx}
                                        className={`px-1.5 py-1 rounded-lg border text-center font-mono text-[10px] ${getFDRBadgeColor(fix.difficulty)}`}
                                      >
                                        <div className="font-bold truncate">{fix.opponent.short_name}</div>
                                        <div className="text-[9px] opacity-80">{fix.isHome ? 'H' : 'A'} • FDR {fix.difficulty}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Why This Alternative */}
                                <div className="space-y-1 mb-3">
                                  {alt.reasons.map((r, rIdx) => (
                                    <div key={rIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span>{r}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* -4 Hit Justification Box */}
                                <div className={`p-2.5 rounded-xl border mb-3 text-[11px] ${
                                  hit.isHitWorthy
                                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                                }`}>
                                  <div className="flex items-center justify-between mb-1 font-bold">
                                    <span className="flex items-center gap-1">
                                      {hit.isHitWorthy ? (
                                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                      )}
                                      <span>-4 Hit Analysis</span>
                                    </span>
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                      hit.recommendation === 'TAKE_HIT'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                      {hit.recommendation === 'TAKE_HIT' ? 'HIT WORTHY' : 'FREE TRANSFER'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] opacity-90 leading-tight">
                                    {hit.verdict}
                                  </p>
                                </div>

                                {/* Analyst Quote Snippet */}
                                {alt.analystInsights.length > 0 && (
                                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 text-[11px] text-slate-300">
                                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                                      <span>{alt.analystInsights[0].avatar}</span>
                                      <span>{alt.analystInsights[0].analystName}:</span>
                                    </div>
                                    <p className="italic text-[10px] text-slate-300">
                                      "{alt.analystInsights[0].verdict}"
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action: 1-Click Make Transfer */}
                              <div className="pt-2 border-t border-slate-800/80">
                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
                                  <span>Cost Delta: <b className={alt.costDelta > 0 ? 'text-amber-400' : 'text-cyan-400'}>{alt.costDelta > 0 ? `+£${alt.costDelta}m` : `Saved £${Math.abs(alt.costDelta)}m`}</b></span>
                                  <span>Bank Left: <b className="text-white">£{alt.newBankRemaining}m</b></span>
                                </div>

                                <button
                                  onClick={() => {
                                    onApplyTransfer(playerOut.id, candidate);
                                    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
                                  }}
                                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                                    isDirectUpgrade
                                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
                                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                                  }`}
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                  <span>Transfer In {candidate.web_name}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
