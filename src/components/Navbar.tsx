import React, { useState } from 'react';
import type { ManagerInfo, FPLGameweek, LiveTeamProfile, LiveSyncStatus } from '../types/fpl';
import { SAMPLE_MANAGERS } from '../data/mockData';
import { 
  Trophy, 
  Coins, 
  ArrowLeftRight, 
  RefreshCw, 
  Sparkles,
  Users,
  ChevronDown,
  Flame,
  LayoutGrid,
  Radio
} from 'lucide-react';

interface NavbarProps {
  manager: ManagerInfo;
  profile: LiveTeamProfile | null;
  currentGW: number;
  gameweeks: FPLGameweek[];
  freeTransfers: number;
  bankBalanceTenths: number;
  teamValueTenths: number;
  isLoading: boolean;
  syncStatus: LiveSyncStatus;
  onOpenSyncModal: () => void;
  onSelectSampleManager: (managerId: number) => void;
  onRefresh: () => void;
  activeTab: 'transfers' | 'chips' | 'pitch' | 'explorer';
  setActiveTab: (tab: 'transfers' | 'chips' | 'pitch' | 'explorer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  manager,
  profile,
  currentGW,
  freeTransfers,
  bankBalanceTenths,
  teamValueTenths,
  isLoading,
  syncStatus,
  onOpenSyncModal,
  onSelectSampleManager,
  onRefresh,
  activeTab,
  setActiveTab
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const bankFormatted = profile ? profile.bank.toFixed(1) : (bankBalanceTenths / 10).toFixed(1);
  const valueFormatted = profile ? profile.teamValue.toFixed(1) : (teamValueTenths / 10).toFixed(1);
  const teamDisplayName = profile ? profile.teamName : manager.name;
  const rankDisplayName = profile 
    ? `#${profile.overallRank.toLocaleString()}` 
    : manager.summary_overall_rank ? `#${manager.summary_overall_rank.toLocaleString()}` : '#Top 10k';
  const managerDisplayName = profile ? profile.managerName : `${manager.player_first_name} ${manager.player_last_name}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  FPL ADVISOR
                </span>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  GW {currentGW}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                Smart Transfer Recommendations & Alternatives
              </p>
            </div>
          </div>

          {/* Manager Stat Strip & Live Pill */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Manager Live Badge / Sync trigger */}
            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all text-left group cursor-pointer shadow-sm"
              title="Click to Connect or Change FPL Team ID"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20 group-hover:scale-105 transition-transform">
                {managerDisplayName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white leading-none group-hover:text-emerald-300 transition-colors">
                    {teamDisplayName}
                  </p>
                  <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-0.5 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    ID {profile?.id || manager.id}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="font-medium text-slate-200">OR: {rankDisplayName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{managerDisplayName}</span>
                </div>
              </div>
            </button>

            {/* Bank Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">In Bank</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">£{bankFormatted}m</span>
              </div>
            </div>

            {/* Squad Value */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Team Value</span>
                <span className="text-xs font-bold text-purple-300 font-mono">£{valueFormatted}m</span>
              </div>
            </div>

            {/* Free Transfers */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Free Transfers</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{freeTransfers} FT</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Manager Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Preset Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Presets</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Preset FPL Teams
                  </div>
                  {SAMPLE_MANAGERS.map(sample => (
                    <button
                      key={sample.info.id}
                      onClick={() => {
                        onSelectSampleManager(sample.info.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        manager.id === sample.info.id 
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white">{sample.info.name}</div>
                        <div className="text-[11px] text-slate-400">{sample.info.player_first_name} {sample.info.player_last_name}</div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{sample.info.id}
                      </span>
                    </button>
                  ))}
                  
                  <div className="my-1 border-t border-slate-800" />
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSyncModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    Connect Live FPL Team ID...
                  </button>
                </div>
              )}
            </div>

            {/* Live Sync Team ID Button */}
            <button
              onClick={onOpenSyncModal}
              className="px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Connect any FPL Team ID"
            >
              <Radio className={`w-3.5 h-3.5 text-emerald-400 ${syncStatus === 'loading' ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="hidden sm:inline font-bold">Connect Team ID</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading || syncStatus === 'loading'}
              className="p-2 sm:p-2.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              title="Refresh FPL Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || syncStatus === 'loading' ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Streamlined Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'transfers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>🎯 Transfer Recommendations</span>
          </button>

          <button
            onClick={() => setActiveTab('chips')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chips'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-1 ring-purple-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>⚡ Chip Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pitch'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚽</span>
            <span>My Squad Lineup</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Player Explorer</span>
          </button>
        </div>
      </div>
    </header>
  );
};

