import { useState, useEffect } from 'react';
import type { 
  FPLBootstrap, 
  FPLFixture, 
  ManagerInfo, 
  ManagerHistoryResponse, 
  SquadPlayer, 
  SellCandidatePlan, 
  ChipStrategyPlan, 
  FPLPlayer, 
  AnalystModelType,
  LiveTeamProfile,
  LiveSyncStatus
} from './types/fpl';
import { 
  getBootstrapData, 
  getFixtures, 
  getManagerInfo, 
  getManagerPicks, 
  getManagerHistory, 
  buildSquadPlayers,
  getStoredTeamId,
  fetchFullLiveManagerSync
} from './services/fplApi';
import { generateHierarchicalTransferPlans } from './services/optimizer';
import { generateChipStrategy } from './services/chipStrategy';
import type { GameweekChipContext } from './services/chipStrategy';
import { Navbar } from './components/Navbar';
import { TransferAdvisor } from './components/TransferAdvisor';
import { ChipStrategyHub } from './components/ChipStrategyHub';
import { PitchView } from './components/PitchView';
import { PlayerExplorer } from './components/PlayerExplorer';
import { TeamSyncModal } from './components/TeamSyncModal';
import { ExecutiveAlertBanner } from './components/ExecutiveAlertBanner';
import { SAMPLE_MANAGERS } from './data/mockData';
import { Loader2, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'transfers' | 'chips' | 'pitch' | 'explorer'>('transfers');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Core Data
  const [bootstrap, setBootstrap] = useState<FPLBootstrap | null>(null);
  const [fixtures, setFixtures] = useState<FPLFixture[]>([]);
  const [manager, setManager] = useState<ManagerInfo>(SAMPLE_MANAGERS[0].info);
  const [history, setHistory] = useState<ManagerHistoryResponse>(SAMPLE_MANAGERS[0].history);
  const [profile, setProfile] = useState<LiveTeamProfile | null>(null);
  
  // Live Sync & Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<LiveSyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  // Dynamic State
  const [currentGW, setCurrentGW] = useState<number>(3);
  const [freeTransfers, setFreeTransfers] = useState<number>(1);
  const [bankBalanceTenths, setBankBalanceTenths] = useState<number>(15); // £1.5m
  const [teamValueTenths, setTeamValueTenths] = useState<number>(1018);
  const [squad, setSquad] = useState<SquadPlayer[]>([]);
  const [selectedAnalystModel, setSelectedAnalystModel] = useState<AnalystModelType>('consensus');

  // Derived Analytics
  const [sellPlans, setSellPlans] = useState<SellCandidatePlan[]>([]);
  const [chipPlans, setChipPlans] = useState<ChipStrategyPlan[]>([]);
  const [chipTimeline, setChipTimeline] = useState<GameweekChipContext[]>([]);

  // 1. Initial Load of Premier League Data & Saved Team ID
  useEffect(() => {
    async function initData() {
      setIsLoading(true);
      try {
        const [bsData, fixData] = await Promise.all([
          getBootstrapData(),
          getFixtures()
        ]);
        setBootstrap(bsData);
        setFixtures(fixData);

        const nextGWObj = bsData.events.find(e => e.is_next) || bsData.events.find(e => e.is_current) || bsData.events[2];
        const nextGWNum = nextGWObj ? nextGWObj.id : 3;
        setCurrentGW(nextGWNum);

        // Check if user has saved Team ID
        const storedId = getStoredTeamId();
        await performFullSync(storedId, nextGWNum, bsData, fixData, selectedAnalystModel);
      } catch (err) {
        console.error('Failed to initialize FPL data:', err);
        setErrorNotice('Loaded with cached Premier League 2026 data.');
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // 2. Full Live Manager Sync Orchestrator
  async function performFullSync(
    teamId: number,
    gw: number,
    bsData: FPLBootstrap,
    fixData: FPLFixture[],
    model: AnalystModelType = selectedAnalystModel
  ) {
    setSyncStatus('loading');
    setSyncError(null);
    try {
      const result = await fetchFullLiveManagerSync(teamId, gw, bsData, fixData);
      
      setProfile(result.profile);
      setHistory(result.historyResponse);
      setBankBalanceTenths(Math.round(result.profile.bank * 10));
      setTeamValueTenths(Math.round(result.profile.teamValue * 10));
      setFreeTransfers(result.profile.freeTransfers);
      setSquad(result.squad);

      // Manager fallback info
      setManager({
        id: result.profile.id,
        player_first_name: result.profile.managerName.split(' ')[0] || 'Manager',
        player_last_name: result.profile.managerName.split(' ').slice(1).join(' ') || '',
        name: result.profile.teamName,
        summary_overall_points: result.profile.overallPoints,
        summary_overall_rank: result.profile.overallRank,
        summary_event_points: result.profile.gameweekPoints,
        summary_event_rank: 0,
        current_event: gw,
        last_deadline_bank: Math.round(result.profile.bank * 10),
        last_deadline_value: Math.round(result.profile.teamValue * 10),
        last_deadline_total_transfers: 0
      });

      // Run analytics with live state
      runAnalytics(
        result.squad, 
        bsData.elements, 
        bsData.teams, 
        fixData, 
        result.historyResponse, 
        Math.round(result.profile.bank * 10), 
        gw, 
        model
      );

      setSyncStatus('success');
      setErrorNotice(null);
    } catch (err: any) {
      console.warn(`Sync failed for Team ID ${teamId}, using fallback:`, err);
      setSyncStatus('error');
      setSyncError(`Could not fetch live data for Team ID #${teamId}. Check the ID and try again.`);
      
      // Fallback cleanly to preset
      await loadManagerData(teamId, gw, bsData, fixData, model);
    }
  }

  // 3. Fallback Load Specific Manager
  async function loadManagerData(
    teamId: number, 
    gw: number, 
    bsData: FPLBootstrap, 
    fixData: FPLFixture[],
    model: AnalystModelType = selectedAnalystModel
  ) {
    setIsLoading(true);
    try {
      const [mInfo, mPicks, mHistory] = await Promise.all([
        getManagerInfo(teamId),
        getManagerPicks(teamId, Math.max(1, gw - 1)),
        getManagerHistory(teamId)
      ]);

      setManager(mInfo);
      setHistory(mHistory);
      const bank = mPicks.entry_history?.bank ?? mInfo.last_deadline_bank ?? 15;
      setBankBalanceTenths(bank);
      setTeamValueTenths(mPicks.entry_history?.value ?? mInfo.last_deadline_value ?? 1018);
      setFreeTransfers(1);

      const builtSquad = buildSquadPlayers(mPicks.picks, bsData.elements, bsData.teams, fixData, gw);
      setSquad(builtSquad);

      setProfile({
        id: teamId,
        teamName: mInfo.name,
        managerName: `${mInfo.player_first_name} ${mInfo.player_last_name}`,
        overallRank: mPicks.entry_history?.overall_rank ?? mInfo.summary_overall_rank ?? 24500,
        overallPoints: mPicks.entry_history?.total_points ?? mInfo.summary_overall_points ?? 148,
        gameweekPoints: mPicks.entry_history?.points ?? mInfo.summary_event_points ?? 78,
        bank: Number((bank / 10).toFixed(1)),
        teamValue: Number(((mPicks.entry_history?.value || 1018) / 10).toFixed(1)),
        freeTransfers: 1,
        activeChip: mPicks.active_chip,
        usedChips: (mHistory.chips || []).map(c => c.name),
        source: 'preset'
      });

      // Re-run analytics
      runAnalytics(builtSquad, bsData.elements, bsData.teams, fixData, mHistory, bank, gw, model);
    } catch (err) {
      console.warn('Error fetching team picks:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // 4. Run Analytics Engine
  function runAnalytics(
    currSquad: SquadPlayer[],
    allElements: FPLPlayer[],
    teams: FPLBootstrap['teams'],
    fixList: FPLFixture[],
    hist: ManagerHistoryResponse,
    bankTenths: number,
    gw: number,
    model: AnalystModelType = selectedAnalystModel
  ) {
    // 1. Hierarchical Transfer Plans (Sell Candidates -> Curated Alternatives) with chosen Analyst Model
    const plans = generateHierarchicalTransferPlans(currSquad, allElements, teams, fixList, bankTenths, gw, model);
    setSellPlans(plans);

    // 2. Chip Strategy
    const { plans: cPlans, timeline } = generateChipStrategy(hist.chips || [], gw, fixList);
    setChipPlans(cPlans);
    setChipTimeline(timeline);
  }

  // Handle Switch to preset sample manager
  const handleSelectSampleManager = async (managerId: number) => {
    if (!bootstrap) return;
    await loadManagerData(managerId, currentGW, bootstrap, fixtures, selectedAnalystModel);
  };

  // Handle Live Team Sync submission from Modal
  const handleSyncTeamId = async (teamId: number) => {
    if (!bootstrap) return;
    await performFullSync(teamId, currentGW, bootstrap, fixtures, selectedAnalystModel);
    if (syncStatus !== 'error') {
      setIsSyncModalOpen(false);
    }
  };

  // Handle Analyst Model Switch
  const handleSelectAnalystModel = (model: AnalystModelType) => {
    setSelectedAnalystModel(model);
    if (bootstrap) {
      runAnalytics(squad, bootstrap.elements, bootstrap.teams, fixtures, history, bankBalanceTenths, currentGW, model);
    }
  };

  // Handle Captain assignment
  const handleSetCaptain = (playerId: number) => {
    const updated = squad.map(p => ({
      ...p,
      isCaptain: p.id === playerId,
      isViceCaptain: p.isViceCaptain && p.id === playerId ? false : p.isViceCaptain
    }));
    setSquad(updated);
  };

  // Handle Vice Captain assignment
  const handleSetViceCaptain = (playerId: number) => {
    const updated = squad.map(p => ({
      ...p,
      isViceCaptain: p.id === playerId,
      isCaptain: p.isCaptain && p.id === playerId ? false : p.isCaptain
    }));
    setSquad(updated);
  };

  // Handle Squad Swaps (Starters <-> Bench)
  const handleSwapPlayers = (p1Id: number, p2Id: number) => {
    const p1 = squad.find(p => p.id === p1Id);
    const p2 = squad.find(p => p.id === p2Id);
    if (!p1 || !p2) return;

    const updated = squad.map(p => {
      if (p.id === p1Id) {
        return { ...p, positionIndex: p2.positionIndex, isStarter: p2.isStarter };
      }
      if (p.id === p2Id) {
        return { ...p, positionIndex: p1.positionIndex, isStarter: p1.isStarter };
      }
      return p;
    });

    setSquad(updated);
    if (bootstrap) {
      runAnalytics(updated, bootstrap.elements, bootstrap.teams, fixtures, history, bankBalanceTenths, currentGW, selectedAnalystModel);
    }
  };

  // Handle Applying a Transfer
  const handleApplyTransfer = (playerOutId: number, playerIn: SquadPlayer) => {
    const playerOut = squad.find(p => p.id === playerOutId);
    if (!playerOut || !bootstrap) return;

    const costDiff = playerIn.now_cost - playerOut.now_cost;
    const newBank = Math.max(0, bankBalanceTenths - costDiff);
    setBankBalanceTenths(newBank);
    setFreeTransfers(prev => Math.max(0, prev - 1));

    const updated = squad.map(p => {
      if (p.id === playerOutId) {
        return {
          ...playerIn,
          positionIndex: playerOut.positionIndex,
          isStarter: playerOut.isStarter,
          isCaptain: playerOut.isCaptain,
          isViceCaptain: playerOut.isViceCaptain
        };
      }
      return p;
    });

    setSquad(updated);
    runAnalytics(updated, bootstrap.elements, bootstrap.teams, fixtures, history, newBank, currentGW, selectedAnalystModel);
  };

  const handleSelectPlayerForTransfer = () => {
    setActiveTab('transfers');
  };

  if (isLoading && !bootstrap) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 mb-4 shadow-xl shadow-emerald-500/10">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Connecting Live Premier League &amp; Analyst Data</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Fetching live player rosters, club fixtures, and expert transfer matrices...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        manager={manager}
        profile={profile}
        currentGW={currentGW}
        gameweeks={bootstrap?.events || []}
        freeTransfers={freeTransfers}
        bankBalanceTenths={bankBalanceTenths}
        teamValueTenths={teamValueTenths}
        isLoading={isLoading}
        syncStatus={syncStatus}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onSelectSampleManager={handleSelectSampleManager}
        onRefresh={() => {
          if (bootstrap) {
            performFullSync(profile?.id || manager.id, currentGW, bootstrap, fixtures, selectedAnalystModel);
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Notice alert banner if any */}
        {errorNotice && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Executive Squad Health & Action Briefing */}
        {squad.length > 0 && (
          <ExecutiveAlertBanner
            squad={squad}
            transferCandidates={sellPlans}
            profile={profile}
            onNavigateToTransfers={() => setActiveTab('transfers')}
            onNavigateToPitch={() => setActiveTab('pitch')}
          />
        )}

        {/* Dynamic Tab Views */}
        {activeTab === 'transfers' && (
          <TransferAdvisor
            sellPlans={sellPlans}
            bankBalanceTenths={bankBalanceTenths}
            freeTransfers={freeTransfers}
            currentGW={currentGW}
            selectedModel={selectedAnalystModel}
            onSelectModel={handleSelectAnalystModel}
            onApplyTransfer={handleApplyTransfer}
            onNavigateToChips={() => setActiveTab('chips')}
          />
        )}

        {activeTab === 'chips' && (
          <ChipStrategyHub
            plans={chipPlans}
            timeline={chipTimeline}
            currentGW={currentGW}
            squad={squad}
          />
        )}

        {activeTab === 'pitch' && (
          <PitchView
            squad={squad}
            currentGW={currentGW}
            onSetCaptain={handleSetCaptain}
            onSetViceCaptain={handleSetViceCaptain}
            onSwapPlayers={handleSwapPlayers}
            onSelectPlayerForTransfer={handleSelectPlayerForTransfer}
          />
        )}

        {activeTab === 'explorer' && (
          <PlayerExplorer
            players={bootstrap?.elements || []}
            teams={bootstrap?.teams || []}
            fixtures={fixtures}
            currentGW={currentGW}
          />
        )}
      </main>

      {/* Team Sync Modal */}
      <TeamSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentProfile={profile}
        syncStatus={syncStatus}
        syncError={syncError}
        onSyncTeamId={handleSyncTeamId}
        onSelectPreset={(idx) => {
          const sample = SAMPLE_MANAGERS[idx];
          if (sample) handleSelectSampleManager(sample.info.id);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026/27 FPL AI Command Center • Modeled on FPL Harry, Tom Freeman, Ben Crellin &amp; Algorithmic Engines</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Rolling 3-GW Tickers</span>
            <span>•</span>
            <span>Underlying xGI/90 &amp; npxG</span>
            <span>•</span>
            <span>-4 Hit Justification</span>
            <span>•</span>
            <span>DGW/BGW Sequencing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
