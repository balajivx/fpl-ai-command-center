export type PositionType = 1 | 2 | 3 | 4; // 1: GKP, 2: DEF, 3: MID, 4: FWD

export type AnalystModelType = 
  | 'consensus'        // Multi-Analyst Weighted Blend
  | 'fpl_harry'        // Fixture Tickers, Nailed 90m, Talisman Focus & Momentum
  | 'tom_focal'        // Deep Underlying xGI/90, Opponent Conceding Profile & Fixture Swings
  | 'ben_crellin'      // Schedule Runway, DGW/BGW Sequencing & Hit Minimization
  | 'analytics_review';// Pure xPts Probability Horizon & 3-GW Hit Thresholds

export interface AnalystModelConfig {
  id: AnalystModelType;
  name: string;
  creator: string;
  avatar: string;
  badge: string;
  tagline: string;
  corePhilosophy: string[];
  colorScheme: string;
  weights: {
    form: number;
    fixtureHorizonShort: number; // Next 1-3 GWs
    fixtureHorizonLong: number;  // Next 5 GWs
    underlyingMetrics: number;   // xGI, npxG, xA
    minutesSecurity: number;     // xMins & rotation risk
    talismanSetPieces: number;   // Penalties & direct FKs
    hitPenaltyResistance: number;// Threshold to justify -4 hit
  };
}

export type NewsSourceTier = 'TIER_1_OFFICIAL' | 'TIER_1_JOURNALIST' | 'PRESS_CONFERENCE' | 'TRAINING_INTEL';
export type NewsImpactType = 'RULED_OUT' | 'FIT_TO_START' | 'DOUBT_75' | 'MAJOR_DOUBT_50' | 'BENCH_RISK' | 'SUSPENDED';

export interface TeamNewsIntel {
  id: string;
  playerId?: number;
  playerName: string;
  teamId?: number;
  teamName: string;
  sourceName: string;
  sourceHandle: string;
  sourceTier: NewsSourceTier;
  headline: string;
  quote: string;
  impact: NewsImpactType;
  playingChance: number; // 0-100%
  timeAgo: string;
  verified: boolean;
  actionRecommendation: string;
}

export interface FPLPlayer {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number; // team ID
  element_type: PositionType;
  now_cost: number; // in tenths (e.g. 150 = 15.0m)
  selected_by_percent: string;
  form: string;
  total_points: number;
  ep_next: string;
  ep_this: string;
  event_points: number;
  points_per_game: string;
  value_season: string;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  yellow_cards: number;
  red_cards: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  status: 'a' | 'd' | 'i' | 's' | 'u' | string;
  news: string;
  chance_of_playing_next_round: number | null;
  transfers_in_event: number;
  transfers_out_event: number;
  cost_change_event: number;
  cost_change_start: number;
  photo?: string;
  [key: string]: any;
}

export interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number | null;
  strength_overall_home: number | null;
  strength_overall_away: number | null;
  strength_attack_home: number | null;
  strength_attack_away: number | null;
  strength_defence_home: number | null;
  strength_defence_away: number | null;
  [key: string]: any;
}

export interface FPLGameweek {
  id: number;
  name: string;
  deadline_time: string;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  finished: boolean;
  average_entry_score: number | null;
  highest_score: number | null;
  [key: string]: any;
}

export interface FPLFixture {
  id: number;
  code?: number;
  event: number | null;
  team_h: number;
  team_a: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  team_h_score?: number | null;
  team_a_score?: number | null;
  finished: boolean;
  finished_provisional?: boolean;
  started?: boolean;
  minutes?: number;
  provisional_start_time?: boolean;
  kickoff_time: string;
  pulse_id?: number;
  stats?: any[];
}

export interface FPLBootstrap {
  elements: FPLPlayer[];
  teams: FPLTeam[];
  events: FPLGameweek[];
  [key: string]: any;
}

export interface ManagerPick {
  element: number;
  position: number; // 1-15 (1-11 starter, 12-15 bench)
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface ManagerPicksResponse {
  active_chip: string | null;
  automatic_subs: Array<{
    entry: number;
    element_in: number;
    element_out: number;
    event: number;
  }>;
  entry_history: {
    event: number;
    points: number;
    total_points: number;
    rank: number;
    overall_rank: number;
    bank: number;
    value: number;
    event_transfers: number;
    event_transfers_cost: number;
    points_on_bench: number;
  };
  picks: ManagerPick[];
}

export interface ManagerInfo {
  id: number;
  player_first_name: string;
  player_last_name: string;
  name: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  current_event: number;
  last_deadline_bank: number;
  last_deadline_value: number;
  last_deadline_total_transfers: number;
}

export interface ManagerHistoryChip {
  name: 'wildcard' | 'freehit' | '3xc' | 'bboost' | string;
  time: string;
  event: number;
}

export interface ManagerHistoryResponse {
  current: Array<{
    event: number;
    points: number;
    total_points: number;
    rank: number;
    overall_rank: number;
    bank: number;
    value: number;
    event_transfers: number;
    event_transfers_cost: number;
    points_on_bench: number;
  }>;
  chips: ManagerHistoryChip[];
}

export interface UpcomingMatchDetail {
  opponent: FPLTeam;
  isHome: boolean;
  difficulty: number;
  event: number;
  opponentDefStrength: number;
  opponentAttStrength: number;
}

export type MinutesSecurityTier = 'NAILED_90' | 'SAFE_STARTER' | 'ROTATION_RISK' | 'SUB_THREAT';

export interface SquadPlayer extends FPLPlayer {
  positionIndex: number;
  isStarter: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
  teamObj?: FPLTeam;
  upcomingFixtures: UpcomingMatchDetail[];
  compositeScore: number;
  xPointsNextGW: number;
  xGI90: number;
  npxG90: number;
  xA90: number;
  avgNext3FDR: number;
  avgNext5FDR: number;
  fixtureSwingIndex: number; // Positive = improving fixtures, Negative = worsening
  minutesSecurity: MinutesSecurityTier;
  minutesSecurityScore: number; // 0-100
  isPenaltyTaker: boolean;
  isSetPieceTaker: boolean;
  talismanRating: number; // 1-10
  xPts3GW: number; // Projected points over next 3 GWs
  xPts5GW: number; // Projected points over next 5 GWs
  analystBadges: string[];
  latestTeamNews?: TeamNewsIntel;
}

export interface HitJustification {
  isHitWorthy: boolean;
  pointDelta3GW: number;
  verdict: string;
  recommendation: 'TAKE_HIT' | 'ROLL_OR_WAIT' | 'FREE_TRANSFER_ONLY';
}

export interface AnalystInsight {
  analystId: AnalystModelType;
  analystName: string;
  avatar: string;
  badge: string;
  verdict: string;
  confidence: 'HIGH' | 'MEDIUM' | 'CAUTION';
}

export interface AlternativeOption {
  playerIn: SquadPlayer;
  type: 'TOP_UPGRADE' | 'EASY_FIXTURES' | 'VALUE_ENABLER' | 'DIFFERENTIAL';
  typeLabel: string;
  typeBadgeColor: string;
  costDelta: number; // in millions
  newBankRemaining: number;
  scoreDelta: number; // projected points boost
  xPts3GWDelta: number;
  reasons: string[];
  opponentMatchupNote: string;
  hitJustification: HitJustification;
  analystInsights: AnalystInsight[];
  latestTeamNews?: TeamNewsIntel;
}

export interface SellCandidatePlan {
  rank: number;
  playerOut: SquadPlayer;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'TACTICAL';
  urgencyLabel: string;
  urgencyBadgeColor: string;
  sellScore: number;
  sellReasons: string[];
  matchupCritique: string;
  analystConsensusCritique: string;
  alternatives: AlternativeOption[];
  latestTeamNews?: TeamNewsIntel;
}

export interface ExpertPlaybook {
  id: string;
  analystName: string;
  creator: string;
  avatar: string;
  strategyTitle: string;
  badge: string;
  description: string;
  chipSequence: Array<{
    gw: number;
    chip: 'wildcard' | 'freehit' | '3xc' | 'bboost';
    label: string;
    rationale: string;
  }>;
  pros: string[];
  cons: string[];
  projectedNetGain: number;
}

export interface ChipStrategyPlan {
  chip: 'wildcard' | 'freehit' | '3xc' | 'bboost';
  name: string;
  badge: string;
  status: 'AVAILABLE' | 'PLAYED';
  playedEvent?: number;
  recommendedEvent: number;
  confidence: 'MAXIMUM' | 'HIGH' | 'TACTICAL';
  projectedBonusPoints: number;
  rationale: string;
  targetKeyPlayers: string[];
  optimalTimingNote: string;
  analystConsensus: string;
}

export interface CaptaincyRank {
  player: SquadPlayer;
  captainScore: number;
  xPoints: number;
  xGI: number;
  opponent: string;
  isHome: boolean;
  fdr: number;
  cleanSheetOdds: string;
  ceilingProbability: string;
  verdict: string;
  harryVerdict: string;
  tomVerdict: string;
}

export interface ManagerTransfer {
  element_in: number;
  element_in_cost: number;
  element_out: number;
  element_out_cost: number;
  entry: number;
  event: number;
  time: string;
}

export type LiveSyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LiveTeamProfile {
  id: number;
  teamName: string;
  managerName: string;
  overallRank: number;
  overallPoints: number;
  gameweekPoints: number;
  bank: number; // in £m, e.g. 1.5
  teamValue: number; // in £m, e.g. 101.2
  freeTransfers: number; // 1-5
  activeChip: string | null;
  usedChips: Array<'wildcard' | 'freehit' | '3xc' | 'bboost' | string>;
  lastSyncedAt?: string;
  source: 'live_api' | 'cached' | 'preset';
}

