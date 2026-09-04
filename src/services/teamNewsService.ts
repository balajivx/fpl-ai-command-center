import type { TeamNewsIntel, SquadPlayer, FPLPlayer } from '../types/fpl';
import { LIVE_TEAM_NEWS_INTEL, findLatestTeamNewsForPlayer } from '../data/teamNewsData';

export function getAllLiveTeamNews(): TeamNewsIntel[] {
  return LIVE_TEAM_NEWS_INTEL;
}

export function enrichPlayerWithTeamNews<T extends FPLPlayer | SquadPlayer>(player: T): T & { latestTeamNews?: TeamNewsIntel } {
  const intel = findLatestTeamNewsForPlayer(player.web_name, player.second_name);
  if (!intel) return player;

  return {
    ...player,
    latestTeamNews: intel
  };
}

export function getAvailabilityImpactAdjustment(news?: TeamNewsIntel): {
  sellUrgencyBoost: number;
  buyConfidenceBoost: number;
  adjustedChance: number;
} {
  if (!news) {
    return { sellUrgencyBoost: 0, buyConfidenceBoost: 0, adjustedChance: 100 };
  }

  switch (news.impact) {
    case 'RULED_OUT':
      return { sellUrgencyBoost: 130, buyConfidenceBoost: -50, adjustedChance: 0 };
    case 'MAJOR_DOUBT_50':
      return { sellUrgencyBoost: 70, buyConfidenceBoost: -25, adjustedChance: 50 };
    case 'DOUBT_75':
      return { sellUrgencyBoost: 35, buyConfidenceBoost: -10, adjustedChance: 75 };
    case 'BENCH_RISK':
      return { sellUrgencyBoost: 40, buyConfidenceBoost: -15, adjustedChance: 65 };
    case 'FIT_TO_START':
      return { sellUrgencyBoost: -20, buyConfidenceBoost: 15, adjustedChance: 100 };
    default:
      return { sellUrgencyBoost: 0, buyConfidenceBoost: 0, adjustedChance: news.playingChance };
  }
}
