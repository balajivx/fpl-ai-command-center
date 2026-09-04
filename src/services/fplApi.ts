import type {
  FPLBootstrap,
  FPLFixture,
  ManagerInfo,
  ManagerPicksResponse,
  ManagerHistoryResponse,
  FPLPlayer,
  FPLTeam,
  SquadPlayer,
  PositionType,
  UpcomingMatchDetail
} from '../types/fpl';
import { SAMPLE_MANAGERS, MOCK_BOOTSTRAP, MOCK_FIXTURES } from '../data/mockData';
import { findLatestTeamNewsForPlayer } from '../data/teamNewsData';

const CACHE_PREFIX = 'fpl_cache_';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (e) {
    console.warn('Session storage full or disabled', e);
  }
}

async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  const urls = [
    `/api/fpl${endpoint}`,
    `https://corsproxy.io/?url=${encodeURIComponent(`https://fantasy.premierleague.com/api${endpoint}`)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://fantasy.premierleague.com/api${endpoint}`)}`
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error(`Failed to fetch ${endpoint}`);
}

export async function getBootstrapData(): Promise<FPLBootstrap> {
  const cached = getCached<FPLBootstrap>('bootstrap');
  if (cached) return cached;

  try {
    const data = await fetchWithFallback<FPLBootstrap>('/bootstrap-static/');
    setCache('bootstrap', data);
    return data;
  } catch (err) {
    console.warn('Using fallback mock bootstrap data:', err);
    return MOCK_BOOTSTRAP;
  }
}

export async function getFixtures(): Promise<FPLFixture[]> {
  const cached = getCached<FPLFixture[]>('fixtures');
  if (cached) return cached;

  try {
    const data = await fetchWithFallback<FPLFixture[]>('/fixtures/');
    setCache('fixtures', data);
    return data;
  } catch (err) {
    console.warn('Using fallback mock fixtures data:', err);
    return MOCK_FIXTURES;
  }
}

export async function getManagerInfo(teamId: number): Promise<ManagerInfo> {
  const sample = SAMPLE_MANAGERS.find(m => m.info.id === teamId);
  const cacheKey = `manager_info_${teamId}`;
  const cached = getCached<ManagerInfo>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchWithFallback<ManagerInfo>(`/entry/${teamId}/`);
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    if (sample) return sample.info;
    console.warn(`Manager ${teamId} fetch failed, using fallback info:`, err);
    return {
      id: teamId,
      player_first_name: 'FPL',
      player_last_name: 'Manager',
      name: `Team #${teamId}`,
      summary_overall_points: 1240,
      summary_overall_rank: 45210,
      summary_event_points: 68,
      summary_event_rank: 128900,
      current_event: 22,
      last_deadline_bank: 15,
      last_deadline_value: 1025,
      last_deadline_total_transfers: 18
    };
  }
}

export async function getManagerPicks(teamId: number, event: number): Promise<ManagerPicksResponse> {
  const sample = SAMPLE_MANAGERS.find(m => m.info.id === teamId);
  const cacheKey = `manager_picks_${teamId}_${event}`;
  const cached = getCached<ManagerPicksResponse>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchWithFallback<ManagerPicksResponse>(`/entry/${teamId}/event/${event}/picks/`);
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    if (sample) return sample.picks;
    console.warn(`Manager picks ${teamId} event ${event} failed, using default:`, err);
    return SAMPLE_MANAGERS[0].picks;
  }
}

export async function getManagerHistory(teamId: number): Promise<ManagerHistoryResponse> {
  const sample = SAMPLE_MANAGERS.find(m => m.info.id === teamId);
  const cacheKey = `manager_history_${teamId}`;
  const cached = getCached<ManagerHistoryResponse>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchWithFallback<ManagerHistoryResponse>(`/entry/${teamId}/history/`);
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    if (sample) return sample.history;
    return SAMPLE_MANAGERS[0].history;
  }
}

// Premier League Penalty & Set-piece taker dictionary for analyst models
const KNOWN_PENALTY_TAKERS = new Set([
  'Haaland', 'Salah', 'Palmer', 'Saka', 'Fernandes', 'Mbeumo', 'Isak', 
  'Wood', 'Cunha', 'Mateta', 'Eze', 'Tielemans', 'Watkins', 'Son', 
  'Solanke', 'Bowen', 'Vardy', 'Delap', 'Armstrong', 'Pedro', 'Calvert-Lewin'
]);

const KNOWN_SET_PIECE_TAKERS = new Set([
  'Alexander-Arnold', 'Trippier', 'Hall', 'Rice', 'Ødegaard', 'Porro', 
  'Maddison', 'Gibbs-White', 'Pereira', 'McNeil', 'Digne', 'Gross', 
  'De Bruyne', 'Foden', 'Eze', 'Palmer', 'Saka', 'Fernandes'
]);

export function buildSquadPlayers(
  picks: ManagerPicksResponse['picks'],
  allElements: FPLPlayer[],
  teams: FPLTeam[],
  fixtures: FPLFixture[],
  currentGW: number
): SquadPlayer[] {
  const teamMap = new Map(teams.map(t => [t.id, t]));
  const elementMap = new Map(allElements.map(e => [e.id, e]));

  return picks.map(pick => {
    const player = elementMap.get(pick.element) || allElements[0];
    const teamObj = teamMap.get(player.team);

    // Get next 5 upcoming fixtures with opponent strength details
    const upcomingFixtures: UpcomingMatchDetail[] = fixtures
      .filter(f => f.event !== null && f.event >= currentGW && (f.team_h === player.team || f.team_a === player.team))
      .sort((a, b) => (a.event || 0) - (b.event || 0))
      .slice(0, 5)
      .map(f => {
        const isHome = f.team_h === player.team;
        const opponentId = isHome ? f.team_a : f.team_h;
        const opponent = teamMap.get(opponentId) || {
          id: opponentId,
          name: 'Unknown',
          short_name: 'UNK',
          code: 0,
          strength: 3,
          strength_overall_home: 3,
          strength_overall_away: 3,
          strength_attack_home: 3,
          strength_attack_away: 3,
          strength_defence_home: 3,
          strength_defence_away: 3
        };
        const difficulty = isHome ? f.team_h_difficulty : f.team_a_difficulty;
        const opponentDefStrength = isHome ? opponent.strength_defence_away : opponent.strength_defence_home;
        const opponentAttStrength = isHome ? opponent.strength_attack_away : opponent.strength_attack_home;

        return {
          opponent,
          isHome,
          difficulty: difficulty || 3,
          event: f.event || currentGW,
          opponentDefStrength: opponentDefStrength || 1150,
          opponentAttStrength: opponentAttStrength || 1150
        };
      });

    // 1. Basic Stats & Per-90 underlying data
    const formVal = parseFloat(player.form) || 3.0;
    const epNextVal = parseFloat(player.ep_next) || (formVal * 0.9);
    const xGVal = parseFloat(player.expected_goals) || 0;
    const xAVal = parseFloat(player.expected_assists) || 0;
    const xGIVal = parseFloat(player.expected_goal_involvements) || (xGVal + xAVal);
    const mins = Math.max(1, player.minutes);
    const xGI90 = Number((xGIVal / (mins / 90)).toFixed(2));
    
    // Penalties & Set Pieces
    const isPenaltyTaker = KNOWN_PENALTY_TAKERS.has(player.web_name) || KNOWN_PENALTY_TAKERS.has(player.second_name);
    const isSetPieceTaker = KNOWN_SET_PIECE_TAKERS.has(player.web_name) || KNOWN_SET_PIECE_TAKERS.has(player.second_name);
    
    // Non-penalty xG estimation
    const npxGVal = isPenaltyTaker ? xGVal * 0.75 : xGVal;
    const npxG90 = Number((npxGVal / (mins / 90)).toFixed(2));
    const xA90 = Number((xAVal / (mins / 90)).toFixed(2));

    // 2. Fixture FDR Horizons & Swing Index
    const next3Fix = upcomingFixtures.slice(0, 3);
    const next5Fix = upcomingFixtures.slice(0, 5);
    const avgNext3FDR = next3Fix.length > 0
      ? Number((next3Fix.reduce((acc, f) => acc + f.difficulty, 0) / next3Fix.length).toFixed(1))
      : 3.0;
    const avgNext5FDR = next5Fix.length > 0
      ? Number((next5Fix.reduce((acc, f) => acc + f.difficulty, 0) / next5Fix.length).toFixed(1))
      : 3.0;

    // Fixture swing: if next 3 FDR is much easier (lower) than standard 3.2 baseline -> positive swing %
    const fixtureSwingIndex = Number(((3.2 - avgNext3FDR) * 25).toFixed(0));

    // 3. Minutes Security / Rotation Risk Engine (Harry & Analytics criteria)
    const estGames = Math.max(1, Math.round(mins / 75));
    const avgMinsPerGame = Math.round(mins / estGames);
    let minutesSecurity: SquadPlayer['minutesSecurity'] = 'SAFE_STARTER';
    let minutesSecurityScore = 80;

    if (player.status !== 'a') {
      minutesSecurity = 'ROTATION_RISK';
      minutesSecurityScore = player.chance_of_playing_next_round || 0;
    } else if (avgMinsPerGame >= 82 && mins > 500) {
      minutesSecurity = 'NAILED_90';
      minutesSecurityScore = 95;
    } else if (avgMinsPerGame >= 60 && mins > 300) {
      minutesSecurity = 'SAFE_STARTER';
      minutesSecurityScore = 80;
    } else if (avgMinsPerGame >= 30) {
      minutesSecurity = 'ROTATION_RISK';
      minutesSecurityScore = 50;
    } else {
      minutesSecurity = 'SUB_THREAT';
      minutesSecurityScore = 25;
    }

    // 4. Talisman Score (1-10)
    let talismanRating = 5;
    if (isPenaltyTaker) talismanRating += 2.5;
    if (isSetPieceTaker) talismanRating += 1.0;
    if (xGI90 >= 0.5) talismanRating += 1.5;
    if (formVal >= 6.0) talismanRating += 1.0;
    talismanRating = Math.min(10, Math.max(1, Math.round(talismanRating)));

    // 5. Multi-GW Expected Points Horizon (FPL Review / Analytics algorithm)
    const baseMatchXp = epNextVal > 0 ? epNextVal : (formVal * 0.85);
    const xPts3GW = Number((next3Fix.reduce((sum, f) => {
      const fixMultiplier = (5.5 - f.difficulty) / 2.5;
      return sum + (baseMatchXp * 0.7 + fixMultiplier * 1.5);
    }, 0)).toFixed(1));

    const xPts5GW = Number((next5Fix.reduce((sum, f) => {
      const fixMultiplier = (5.5 - f.difficulty) / 2.5;
      return sum + (baseMatchXp * 0.7 + fixMultiplier * 1.5);
    }, 0)).toFixed(1));

    // 6. Latest Team News & Press Conference Intel
    const latestTeamNews = findLatestTeamNewsForPlayer(player.web_name, player.second_name);
    if (latestTeamNews) {
      if (latestTeamNews.impact === 'RULED_OUT') {
        minutesSecurity = 'ROTATION_RISK';
        minutesSecurityScore = 0;
      } else if (latestTeamNews.impact === 'FIT_TO_START') {
        minutesSecurityScore = Math.max(minutesSecurityScore, 95);
      }
    }

    // 7. Analyst Badges
    const analystBadges: string[] = [];
    if (talismanRating >= 8) analystBadges.push('👑 Talisman');
    if (isPenaltyTaker) analystBadges.push('⚽ Penalty Taker');
    if (minutesSecurity === 'NAILED_90') analystBadges.push('🛡️ 90m Nailed');
    if (avgNext3FDR <= 2.4) analystBadges.push('📈 Green Fixture Run');
    if (xGI90 >= 0.55) analystBadges.push('🎯 Elite xGI/90');
    if (parseFloat(player.selected_by_percent) < 10 && formVal >= 5.0) analystBadges.push('💎 Differential');
    if (latestTeamNews?.impact === 'FIT_TO_START') analystBadges.push('🎙️ Presser Confirmed');

    const fdrBonus = (5.0 - avgNext3FDR) * 1.5;
    const injuryPenalty = player.status === 'a' ? 0 : player.status === 'd' ? -3 : -10;
    const compositeScore = Math.max(0, formVal * 1.5 + epNextVal * 1.2 + xGI90 * 4.0 + fdrBonus + injuryPenalty);

    return {
      ...player,
      positionIndex: pick.position,
      isStarter: pick.position <= 11,
      isCaptain: pick.is_captain,
      isViceCaptain: pick.is_vice_captain,
      teamObj,
      upcomingFixtures,
      compositeScore: Number(compositeScore.toFixed(2)),
      xPointsNextGW: Number(epNextVal.toFixed(1)),
      xGI90,
      npxG90,
      xA90,
      avgNext3FDR,
      avgNext5FDR,
      fixtureSwingIndex,
      minutesSecurity,
      minutesSecurityScore,
      isPenaltyTaker,
      isSetPieceTaker,
      talismanRating,
      xPts3GW,
      xPts5GW,
      analystBadges,
      latestTeamNews
    };
  });
}

export const POSITION_NAMES: Record<PositionType, string> = {
  1: 'GKP',
  2: 'DEF',
  3: 'MID',
  4: 'FWD'
};
