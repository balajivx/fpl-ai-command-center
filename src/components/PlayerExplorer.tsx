import React, { useState } from 'react';
import type { FPLPlayer, FPLTeam, FPLFixture, PositionType } from '../types/fpl';
import { Search, ArrowUpDown } from 'lucide-react';
import { POSITION_NAMES } from '../services/fplApi';

interface PlayerExplorerProps {
  players: FPLPlayer[];
  teams: FPLTeam[];
  fixtures: FPLFixture[];
  currentGW: number;
}

export const PlayerExplorer: React.FC<PlayerExplorerProps> = ({
  players,
  teams,
  fixtures,
  currentGW
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'fixtures'>('players');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<number>(0); // 0 = all
  const [selectedTeam, setSelectedTeam] = useState<number>(0); // 0 = all
  const [sortBy, setSortBy] = useState<'form' | 'total_points' | 'now_cost' | 'ep_next' | 'selected_by_percent'>('form');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const teamMap = new Map(teams.map(t => [t.id, t]));

  // Filter players
  const filteredPlayers = players
    .filter(player => {
      if (selectedPosition !== 0 && player.element_type !== selectedPosition) return false;
      if (selectedTeam !== 0 && player.team !== selectedTeam) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = player.web_name.toLowerCase().includes(query) ||
          player.first_name.toLowerCase().includes(query) ||
          player.second_name.toLowerCase().includes(query);
        const club = teamMap.get(player.team)?.name.toLowerCase() || '';
        if (!matchesName && !club.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'form') {
        valA = parseFloat(a.form) || 0;
        valB = parseFloat(b.form) || 0;
      } else if (sortBy === 'total_points') {
        valA = a.total_points;
        valB = b.total_points;
      } else if (sortBy === 'now_cost') {
        valA = a.now_cost;
        valB = b.now_cost;
      } else if (sortBy === 'ep_next') {
        valA = parseFloat(a.ep_next) || 0;
        valB = parseFloat(b.ep_next) || 0;
      } else if (sortBy === 'selected_by_percent') {
        valA = parseFloat(a.selected_by_percent) || 0;
        valB = parseFloat(b.selected_by_percent) || 0;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

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

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Search className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Player Database & Fixture Ticker
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect all ~600 Premier League assets, compare xGI stats, and analyze club fixture difficulty runs.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'players' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Player Explorer
            </button>
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fixtures' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fixture Ticker
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'players' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search player name or club (e.g. Salah, Arsenal)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Position Filter */}
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPosition === pos
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pos === 0 ? 'ALL' : POSITION_NAMES[pos as PositionType]}
                </button>
              ))}
            </div>

            {/* Club Filter */}
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(parseInt(e.target.value, 10))}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={0}>All 20 Clubs</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="form">Sort by Form</option>
                <option value="total_points">Sort by Total Points</option>
                <option value="now_cost">Sort by Price</option>
                <option value="ep_next">Sort by xPoints Next GW</option>
                <option value="selected_by_percent">Sort by Ownership %</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                title="Toggle sort direction"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-3">Player</th>
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Form</th>
                  <th className="py-3 px-3">xGI</th>
                  <th className="py-3 px-3">xPoints</th>
                  <th className="py-3 px-3">Total Pts</th>
                  <th className="py-3 px-3">Selected %</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredPlayers.slice(0, 30).map((player) => {
                  const team = teamMap.get(player.team);
                  const isInjured = player.status !== 'a';

                  return (
                    <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-2">
                        <span>{player.web_name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {player.first_name} {player.second_name}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                          {POSITION_NAMES[player.element_type]}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-300">{team?.short_name || 'PL'}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">£{(player.now_cost / 10).toFixed(1)}m</td>
                      <td className="py-3 px-3 text-cyan-300 font-bold">{player.form}</td>
                      <td className="py-3 px-3 text-purple-300">{player.expected_goal_involvements || '0.0'}</td>
                      <td className="py-3 px-3 text-amber-300 font-bold">{player.ep_next}</td>
                      <td className="py-3 px-3 text-white font-bold">{player.total_points}</td>
                      <td className="py-3 px-3 text-slate-400">{player.selected_by_percent}%</td>
                      <td className="py-3 px-3 font-sans">
                        {isInjured ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            {player.status === 'd' ? 'Knock' : 'Injured'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Fit
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Fixture Ticker View for all 20 Clubs */
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">20-Club Upcoming Fixture Matrix</h3>
            <span className="text-xs text-slate-400">Color coded by Fixture Difficulty Rating (FDR 2 = Easy, FDR 5 = Hard)</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3 font-sans">Club</th>
                {[currentGW, currentGW + 1, currentGW + 2, currentGW + 3, currentGW + 4].map(gw => (
                  <th key={gw} className="py-3 px-3 text-center">GW {gw}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teams.map(team => {
                const teamFixtures = fixtures
                  .filter(f => f.event !== null && f.event >= currentGW && (f.team_h === team.id || f.team_a === team.id))
                  .sort((a, b) => (a.event || 0) - (b.event || 0))
                  .slice(0, 5);

                return (
                  <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px]">
                        {team.short_name}
                      </span>
                      <span>{team.name}</span>
                    </td>

                    {teamFixtures.map((fix, idx) => {
                      const isHome = fix.team_h === team.id;
                      const oppId = isHome ? fix.team_a : fix.team_h;
                      const opp = teamMap.get(oppId);
                      const fdr = isHome ? fix.team_h_difficulty : fix.team_a_difficulty;

                      return (
                        <td key={idx} className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg border font-bold text-[11px] ${getFDRBadgeColor(fdr)}`}>
                            {opp?.short_name || 'TBD'} ({isHome ? 'H' : 'A'})
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
