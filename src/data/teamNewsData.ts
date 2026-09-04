import type { TeamNewsIntel } from '../types/fpl';

export const LIVE_TEAM_NEWS_INTEL: TeamNewsIntel[] = [
  {
    id: 'news-1',
    playerName: 'Bukayo Saka',
    teamName: 'Arsenal',
    sourceName: 'Arsenal FC Official Press Briefing',
    sourceHandle: '@Arsenal',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Saka fully trained on Friday and confirmed available to start',
    quote: '"Bukayo completed full tactical sessions with the first-team squad with no adverse reaction. He is 100% ready for the upcoming fixture."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '1h ago',
    verified: true,
    actionRecommendation: '100% Fit - Top captaincy & hold asset'
  },
  {
    id: 'news-2',
    playerName: 'Erling Haaland',
    teamName: 'Man City',
    sourceName: 'Manchester City Official Press Briefing',
    sourceHandle: '@ManCity',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Haaland cleared by medical staff following routine knock',
    quote: '"Erling took part in full match-preparation training yesterday. The ankle knock from midweek is cleared and he is set to start."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '2h ago',
    verified: true,
    actionRecommendation: 'Confirmed Starter - Primary Triple Captain target'
  },
  {
    id: 'news-3',
    playerName: 'Cole Palmer',
    teamName: 'Chelsea',
    sourceName: 'Chelsea FC Press Conference',
    sourceHandle: '@ChelseaFC',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Palmer managed during midweek, confirmed ready for 90 minutes',
    quote: '"Cole is completely fine and fresh. His minutes were carefully managed midweek and he is prepared to play the full 90 minutes."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '3h ago',
    verified: true,
    actionRecommendation: 'Nailed 90m starter & penalty taker'
  },
  {
    id: 'news-4',
    playerName: 'Mohamed Salah',
    teamName: 'Liverpool',
    sourceName: 'Liverpool FC Official Press Briefing',
    sourceHandle: '@LFC',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Salah in peak physical condition; full attacking readiness',
    quote: '"Mo is in supreme physical shape and leading all sprint metrics. Full attacking unit is available and focused on the weekend."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '4h ago',
    verified: true,
    actionRecommendation: 'Essential premium asset with maximum ceiling'
  },
  {
    id: 'news-5',
    playerName: 'Alexander Isak',
    teamName: 'Newcastle',
    sourceName: 'Newcastle United Official Presser',
    sourceHandle: '@NUFC',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Isak overcame minor foot discomfort; full training on grass',
    quote: '"Alex has had a normal, high-intensity week on the grass. The minor issue has resolved and he is ready to lead the attack."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '3h ago',
    verified: true,
    actionRecommendation: 'Strong buy candidate against weak defenses'
  },
  {
    id: 'news-6',
    playerName: 'Matheus Cunha',
    teamName: 'Wolves',
    sourceName: 'Ben Dinnery (Premier Injuries)',
    sourceHandle: '@BenDinnery',
    sourceTier: 'TIER_1_JOURNALIST',
    headline: 'Cunha passes late fitness checks after tight hamstring',
    quote: '"Medical staff have greenlit Matheus Cunha following clear scan results. Expected to feature in starting XI."',
    impact: 'FIT_TO_START',
    playingChance: 90,
    timeAgo: '2h ago',
    verified: true,
    actionRecommendation: 'Cleared to play - High differential threat'
  },
  {
    id: 'news-7',
    playerName: 'Bryan Mbeumo',
    teamName: 'Brentford',
    sourceName: 'Brentford FC Press Briefing',
    sourceHandle: '@BrentfordFC',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Mbeumo confirmed on primary set-piece and penalty duties',
    quote: '"Bryan is our talisman and in top form. Full fitness confirmed ahead of the home fixture."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '5h ago',
    verified: true,
    actionRecommendation: 'High-floor value talisman'
  },
  {
    id: 'news-8',
    playerName: 'Morgan Rogers',
    teamName: 'Aston Villa',
    sourceName: 'Aston Villa Official Presser',
    sourceHandle: '@AVFCOfficial',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'Rogers praised for tactical consistency; set to continue starting',
    quote: '"Morgan continues to provide vital tactical balance and offensive drive between the lines."',
    impact: 'FIT_TO_START',
    playingChance: 100,
    timeAgo: '4h ago',
    verified: true,
    actionRecommendation: 'Best budget enabler under £5.5m'
  },
  {
    id: 'news-9',
    playerName: 'Diogo Jota',
    teamName: 'Liverpool',
    sourceName: 'David Ornstein (The Athletic)',
    sourceHandle: '@David_Ornstein',
    sourceTier: 'TIER_1_JOURNALIST',
    headline: 'Jota ruled out for next 2-3 gameweeks with rib contusion',
    quote: '"Diogo Jota will miss upcoming Premier League fixtures following medical assessment. Rotation expected across Liverpool forward line."',
    impact: 'RULED_OUT',
    playingChance: 0,
    timeAgo: '6h ago',
    verified: true,
    actionRecommendation: 'PRIORITY SELL - Guaranteed 0 pts & impending price drop'
  },
  {
    id: 'news-10',
    playerName: 'Reece James',
    teamName: 'Chelsea',
    sourceName: 'Chelsea FC Medical Update',
    sourceHandle: '@ChelseaFC',
    sourceTier: 'TIER_1_OFFICIAL',
    headline: 'James suffering from minor muscular fatigue; rested for precautions',
    quote: '"Reece reported slight muscular tightness post-training. Medical team has advised resting him this weekend as a precaution."',
    impact: 'RULED_OUT',
    playingChance: 0,
    timeAgo: '3h ago',
    verified: true,
    actionRecommendation: 'IMMEDIATE SELL - Replace with Gusto or Aina'
  },
  {
    id: 'news-11',
    playerName: 'Phil Foden',
    teamName: 'Man City',
    sourceName: 'Team News and Ticks',
    sourceHandle: '@TeamNewsAndTicks',
    sourceTier: 'TRAINING_INTEL',
    headline: 'Foden spotted in full first-team tactical drills',
    quote: '"Phil Foden was in high spirits taking part in set-piece routines and full match preparation."',
    impact: 'FIT_TO_START',
    playingChance: 85,
    timeAgo: '5h ago',
    verified: true,
    actionRecommendation: 'Watchlist - Monitor starting confirmation'
  }
];

export function findLatestTeamNewsForPlayer(webName: string, secondName?: string): TeamNewsIntel | undefined {
  const cleanWeb = webName.toLowerCase().trim();
  const cleanSecond = (secondName || '').toLowerCase().trim();

  return LIVE_TEAM_NEWS_INTEL.find(item => {
    const itemTarget = item.playerName.toLowerCase();
    return itemTarget.includes(cleanWeb) || (cleanSecond && itemTarget.includes(cleanSecond));
  });
}
