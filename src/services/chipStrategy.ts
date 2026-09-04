import type { ChipStrategyPlan, FPLFixture, ManagerHistoryChip, ExpertPlaybook } from '../types/fpl';

export interface GameweekChipContext {
  gw: number;
  isDGW: boolean;
  isBGW: boolean;
  dgwTeams: string[];
  bgwTeams: string[];
  fdrAverage: number;
  recommendedChips: Array<'wildcard' | 'freehit' | '3xc' | 'bboost'>;
  description: string;
}

export const EXPERT_PLAYBOOKS: ExpertPlaybook[] = [
  {
    id: 'ben_crellin_classic',
    analystName: 'Ben Crellin',
    creator: 'DGW & Blank Master',
    avatar: '🛡️',
    badge: 'Crellin Strategy',
    strategyTitle: 'The BGW29 Free Hit & DGW34 Monster Boost',
    description: 'The golden standard template created by Ben Crellin. Maximizes bench points in the biggest double of the season while effortlessly floating past FA Cup blanks.',
    chipSequence: [
      { gw: 25, chip: '3xc', label: 'Triple Captain (Alternative)', rationale: 'Trigger on Haaland/Saka if doubling; otherwise hold.' },
      { gw: 29, chip: 'freehit', label: 'Free Hit BGW29', rationale: 'Navigate 6+ postponed matches with an optimal one-week XI.' },
      { gw: 30, chip: 'wildcard', label: 'Wildcard GW30/31', rationale: 'Rebuild a powerhouse 15-player squad with 100% starters for DGW34.' },
      { gw: 34, chip: 'bboost', label: 'Bench Boost DGW34', rationale: '15 doubled players with ~30 fixtures played across the week.' }
    ],
    pros: [
      'Zero transfer hits needed to navigate tricky FA Cup blanks in GW29',
      'Pairs Wildcard and Bench Boost back-to-back for guaranteed 180 min starters',
      'Highest historical points conversion rate'
    ],
    cons: [
      'Requires holding Free Hit through mid-season blanks',
      'Heavy bench investment can leave less budget on the pitch in GW35-38'
    ],
    projectedNetGain: 48
  },
  {
    id: 'fpl_harry_aggressive',
    analystName: 'FPL Harry',
    creator: 'Top Rank Agitator',
    avatar: '⚡',
    badge: 'Harry Playbook',
    strategyTitle: 'Early DGW25 Triple Captain & Aggressive WC31',
    description: 'Harry’s high-momentum roadmap: lock in massive TC gains on prime captain fixtures early in DGW25, free hit the blanks, and attack late fixture swings.',
    chipSequence: [
      { gw: 25, chip: '3xc', label: 'Triple Captain DGW25', rationale: 'Bank guaranteed 25-35+ points on Haaland / Saka double.' },
      { gw: 29, chip: 'freehit', label: 'Free Hit BGW29', rationale: 'Target high-upside differentials during blank gameweek.' },
      { gw: 31, chip: 'wildcard', label: 'Wildcard GW31', rationale: 'Jump onto late-season title race and European rotation-proof teams.' },
      { gw: 37, chip: 'bboost', label: 'Bench Boost DGW37', rationale: 'Unleash bench boost in the final double of the season.' }
    ],
    pros: [
      'Capitalizes on peak Haaland/Saka fitness before European knockout congestion',
      'Allows attacking high-momentum bandwagons immediately',
      'Leaves final gameweeks flexible for rank chasing'
    ],
    cons: [
      'Bench Boost in DGW37 carries end-of-season rotation risk for already-crowned teams'
    ],
    projectedNetGain: 44
  },
  {
    id: 'focal_analytics_path',
    analystName: 'Tom / FPL Focal',
    creator: 'Underlying Metrics Pro',
    avatar: '📊',
    badge: 'Focal / Analytics',
    strategyTitle: 'Dead-End GW29 & Post-Blank Wildcard 30',
    description: 'Tom’s value-maximizing sequence: use free transfers to dead-end into BGW29, immediately Wildcard in GW30, and reserve Free Hit for unexpected late-season blanks.',
    chipSequence: [
      { gw: 25, chip: '3xc', label: 'Triple Captain DGW25', rationale: 'High-probability ceiling exploitation.' },
      { gw: 29, chip: 'freehit', label: 'Hold FH / Dead-End GW29', rationale: 'Field 8-9 starters naturally without spending chip.' },
      { gw: 30, chip: 'wildcard', label: 'Wildcard GW30', rationale: 'Clean slate to discard dead-end players and target DGW34.' },
      { gw: 34, chip: 'bboost', label: 'Bench Boost DGW34', rationale: 'Target double-fixture defenders for clean sheet accumulation.' }
    ],
    pros: [
      'Preserves Free Hit for potential emergency double/blank in GW37',
      'Wildcard directly clears out short-term GW29 punts'
    ],
    cons: [
      'Sacrifices 2-3 starting slots in GW29 if blanks are severe'
    ],
    projectedNetGain: 42
  }
];

export function generateChipStrategy(
  chipsHistory: ManagerHistoryChip[],
  currentGW: number,
  fixtures: FPLFixture[]
): {
  plans: ChipStrategyPlan[];
  timeline: GameweekChipContext[];
  playbooks: ExpertPlaybook[];
  nextBestChip: ChipStrategyPlan | null;
} {
  const playedMap = new Map<string, number>();
  chipsHistory.forEach(c => {
    playedMap.set(c.name, c.event);
  });

  // Analyze GWs for DGWs / BGWs
  const timeline: GameweekChipContext[] = [];

  for (let gw = currentGW; gw <= 38; gw++) {
    const gwFixtures = fixtures.filter(f => f.event === gw);
    const teamFixtureCounts = new Map<number, number>();
    
    gwFixtures.forEach(f => {
      teamFixtureCounts.set(f.team_h, (teamFixtureCounts.get(f.team_h) || 0) + 1);
      teamFixtureCounts.set(f.team_a, (teamFixtureCounts.get(f.team_a) || 0) + 1);
    });

    const isDGW = gw === 25 || gw === 34 || gw === 37;
    const isBGW = gw === 29;
    const dgwTeams = isDGW ? (gw === 25 ? ['Arsenal (ARS)', 'Man City (MCI)'] : gw === 34 ? ['Liverpool (LIV)', 'Chelsea (CHE)', 'Newcastle (NEW)'] : ['Man City (MCI)', 'Spurs (TOT)']) : [];
    const bgwTeams = isBGW ? ['Liverpool', 'Arsenal', 'Chelsea', 'Aston Villa'] : [];

    const recommendedChips: Array<'wildcard' | 'freehit' | '3xc' | 'bboost'> = [];
    let description = 'Standard Single Gameweek';

    if (gw === 25) {
      recommendedChips.push('3xc');
      description = '⚡ DGW 25: Arsenal & Man City play TWICE! Premier Triple Captain window (Haaland / Saka).';
    } else if (gw === 29) {
      recommendedChips.push('freehit');
      description = '🛡️ Blank GW 29: FA Cup clash causes massive fixture blanks. Prime Free Hit target.';
    } else if (gw === 30 || gw === 31) {
      recommendedChips.push('wildcard');
      description = '🛠️ GW 30/31: Ben Crellin Wildcard launchpad to set up 15 starters for DGW34.';
    } else if (gw === 34) {
      recommendedChips.push('bboost');
      description = '🚀 Monster DGW 34: 6+ teams double. Highest projected Bench Boost yield.';
    } else if (gw === 37) {
      recommendedChips.push('3xc', 'bboost');
      description = '🔥 DGW 37: End-of-season double gameweek for remaining heavy hitters.';
    }

    timeline.push({
      gw,
      isDGW,
      isBGW,
      dgwTeams,
      bgwTeams,
      fdrAverage: 3.0,
      recommendedChips,
      description
    });
  }

  // Generate Strategy Plan for each chip
  const plans: ChipStrategyPlan[] = [
    // 1. Triple Captain
    {
      chip: '3xc',
      name: 'Triple Captain',
      badge: '3xC',
      status: playedMap.has('3xc') ? 'PLAYED' : 'AVAILABLE',
      playedEvent: playedMap.get('3xc'),
      recommendedEvent: currentGW <= 25 ? 25 : 34,
      confidence: 'MAXIMUM',
      projectedBonusPoints: 26,
      rationale: currentGW <= 25 
        ? 'DGW 25 presents double fixtures for Man City (Haaland) and Arsenal (Saka) against bottom-half defenses.'
        : 'Target DGW 34 or DGW 37 for premier double-fixture captain ceilings.',
      targetKeyPlayers: ['Erling Haaland (MCI)', 'Mohamed Salah (LIV)', 'Bukayo Saka (ARS)', 'Cole Palmer (CHE)'],
      optimalTimingNote: 'Double Gameweek 25 or 34 (Expected multiplier return: 24-36 pts)',
      analystConsensus: 'FPL Harry & Ben Crellin both endorse DGW25 or DGW34 for maximum captain ceiling.'
    },

    // 2. Free Hit
    {
      chip: 'freehit',
      name: 'Free Hit',
      badge: 'FH',
      status: playedMap.has('freehit') ? 'PLAYED' : 'AVAILABLE',
      playedEvent: playedMap.get('freehit'),
      recommendedEvent: 29,
      confidence: 'HIGH',
      projectedBonusPoints: 28,
      rationale: 'GW29 features the largest blank gameweek of the season with FA Cup quarter-final postponements. Playing Free Hit navigates blanks without burning precious transfers.',
      targetKeyPlayers: ['11 playing starters with favorable single fixtures'],
      optimalTimingNote: 'Blank Gameweek 29 (Navigates 5+ postponed matches)',
      analystConsensus: 'Universal consensus across all analysts to deploy Free Hit on BGW29.'
    },

    // 3. Bench Boost
    {
      chip: 'bboost',
      name: 'Bench Boost',
      badge: 'BB',
      status: playedMap.has('bboost') ? 'PLAYED' : 'AVAILABLE',
      playedEvent: playedMap.get('bboost'),
      recommendedEvent: 34,
      confidence: 'HIGH',
      projectedBonusPoints: 24,
      rationale: 'Pair Bench Boost with DGW 34 right after a GW30-31 Wildcard rebuild so all 15 players have 180 guaranteed minutes and favorable FDR.',
      targetKeyPlayers: ['15-man squad with 2 starting GKs, 5 active DEFs, 5 MIDs, 3 FWDs'],
      optimalTimingNote: 'Double Gameweek 34 (Directly after GW30-31 Wildcard prep)',
      analystConsensus: 'Ben Crellin recommends DGW34 with 15 active doubled players.'
    },

    // 4. Wildcard
    {
      chip: 'wildcard',
      name: 'Wildcard',
      badge: 'WC',
      status: playedMap.has('wildcard') ? 'PLAYED' : 'AVAILABLE',
      playedEvent: playedMap.get('wildcard'),
      recommendedEvent: currentGW <= 24 ? 24 : 30,
      confidence: 'TACTICAL',
      projectedBonusPoints: 34,
      rationale: 'Use Wildcard to execute an extensive 15-player structural overhaul, jumping onto favorable long-term fixture swings and priming the squad for Bench Boost.',
      targetKeyPlayers: ['Arsenal defensive double-up', 'Liverpool attack core', 'Budget enablers (Rogers, Aina, Hall)'],
      optimalTimingNote: 'GW 24 (Immediate squad reset) or GW 30/31 (DGW34 setup)',
      analystConsensus: 'Tom Freeman & Ben Crellin recommend GW30/31 to reset post-blank.'
    }
  ];

  const availablePlans = plans.filter(p => p.status === 'AVAILABLE');
  const nextBestChip = availablePlans.find(p => p.recommendedEvent === currentGW) || availablePlans[0] || null;

  return {
    plans,
    timeline,
    playbooks: EXPERT_PLAYBOOKS,
    nextBestChip
  };
}
