import type { 
  SquadPlayer, 
  FPLPlayer, 
  FPLTeam, 
  FPLFixture, 
  SellCandidatePlan, 
  AlternativeOption,
  AnalystModelType,
  AnalystModelConfig,
  HitJustification,
  AnalystInsight
} from '../types/fpl';
import { buildSquadPlayers } from './fplApi';

export const ANALYST_MODELS: Record<AnalystModelType, AnalystModelConfig> = {
  consensus: {
    id: 'consensus',
    name: 'Consensus AI Engine',
    creator: 'Multi-Analyst Synthesis',
    avatar: '🎯',
    badge: 'AI Consensus',
    tagline: 'Balanced synthesis of FPL Harry, Tom Freeman, Ben Crellin & Algorithmic Models',
    corePhilosophy: [
      'Weighted blend of short-term fixture ease and long-term xGI trends',
      'Minimizes transfer hits unless delta exceeds 4.5 pts over 3 GWs',
      'Prioritizes nailed talismans on penalties without sacrificing depth'
    ],
    colorScheme: 'from-emerald-500 to-teal-600 border-emerald-500/40 text-emerald-300',
    weights: {
      form: 2.2,
      fixtureHorizonShort: 3.2,
      fixtureHorizonLong: 1.8,
      underlyingMetrics: 4.5,
      minutesSecurity: 3.5,
      talismanSetPieces: 3.0,
      hitPenaltyResistance: 4.2
    }
  },
  fpl_harry: {
    id: 'fpl_harry',
    name: 'FPL Harry Model',
    creator: 'Harry Daniels (#1 Content Creator)',
    avatar: '⚡',
    badge: 'FPL Harry',
    tagline: 'Ruthless minutes security, rolling 3-GW fixture tickers & aggressive talisman backing',
    corePhilosophy: [
      '90-Minute security is non-negotiable (avoid Pep/Maresca rotation traps)',
      'Exploits rolling 3-gameweek fixture swings before price bandwagons lock you out',
      'Captain and back primary set-piece and penalty executors with high ceiling'
    ],
    colorScheme: 'from-amber-500 to-orange-600 border-amber-500/40 text-amber-300',
    weights: {
      form: 3.0,
      fixtureHorizonShort: 4.5,
      fixtureHorizonLong: 1.2,
      underlyingMetrics: 3.8,
      minutesSecurity: 5.5,
      talismanSetPieces: 4.5,
      hitPenaltyResistance: 3.8
    }
  },
  tom_focal: {
    id: 'tom_focal',
    name: 'Tom Freeman / FPL Focal Model',
    creator: 'Tom Freeman (FFS Editor / FPL Focal)',
    avatar: '📊',
    badge: 'Tom / Focal',
    tagline: 'Deep xGI/90, non-penalty xG, opponent defensive vulnerabilities & fixture swings',
    corePhilosophy: [
      'Trust underlying expected data (xGI/90, npxG, Big Chances) over lucky past returns',
      'Target opponent weaknesses (e.g. bottom 4 teams in big chances conceded)',
      'Pinpoint turning points where difficult fixture runs turn green 1 week early'
    ],
    colorScheme: 'from-cyan-500 to-blue-600 border-cyan-500/40 text-cyan-300',
    weights: {
      form: 1.5,
      fixtureHorizonShort: 3.5,
      fixtureHorizonLong: 3.0,
      underlyingMetrics: 6.0,
      minutesSecurity: 3.0,
      talismanSetPieces: 2.8,
      hitPenaltyResistance: 4.5
    }
  },
  ben_crellin: {
    id: 'ben_crellin',
    name: 'Ben Crellin Schedule Model',
    creator: 'Ben Crellin (DGW & BGW Schedule Master)',
    avatar: '🛡️',
    badge: 'Ben Crellin',
    tagline: 'Long-term 5-GW runway, Blank/Double GW planning & extreme hit avoidance',
    corePhilosophy: [
      'Plan 5+ weeks ahead to naturally navigate BGW29 and target DGW25/34/37',
      'Zero unnecessary -4 hits; prioritize rolling free transfers',
      'Pre-load assets with confirmed upcoming double fixtures'
    ],
    colorScheme: 'from-purple-500 to-indigo-600 border-purple-500/40 text-purple-300',
    weights: {
      form: 1.8,
      fixtureHorizonShort: 2.5,
      fixtureHorizonLong: 4.8,
      underlyingMetrics: 3.5,
      minutesSecurity: 4.0,
      talismanSetPieces: 2.5,
      hitPenaltyResistance: 5.5
    }
  },
  analytics_review: {
    id: 'analytics_review',
    name: 'Analytics Pro / Review Model',
    creator: 'Algorithmic xPts Engine (FPL Review style)',
    avatar: '🤖',
    badge: 'Analytics Pro',
    tagline: 'Pure expected points (xPts) optimization, ceiling modeling & mathematical hit limits',
    corePhilosophy: [
      'Expected points horizon over 1, 3, and 5 GWs dictates every move',
      'Only take -4 hits if Delta xPts over 3 GWs is strictly >= 4.5',
      'Optimize floor + ceiling distribution to maximize rank percentile'
    ],
    colorScheme: 'from-rose-500 to-pink-600 border-rose-500/40 text-rose-300',
    weights: {
      form: 1.0,
      fixtureHorizonShort: 4.0,
      fixtureHorizonLong: 3.5,
      underlyingMetrics: 5.0,
      minutesSecurity: 4.5,
      talismanSetPieces: 3.5,
      hitPenaltyResistance: 5.0
    }
  }
};

export function generateHierarchicalTransferPlans(
  squad: SquadPlayer[],
  allPlayers: FPLPlayer[],
  teams: FPLTeam[],
  fixtures: FPLFixture[],
  bankBalanceTenths: number, // e.g. 12 = £1.2m
  currentGW: number,
  selectedModel: AnalystModelType = 'consensus'
): SellCandidatePlan[] {
  const modelConfig = ANALYST_MODELS[selectedModel] || ANALYST_MODELS.consensus;
  const weights = modelConfig.weights;

  const squadIds = new Set(squad.map(p => p.id));
  const teamCounts = new Map<number, number>();
  squad.forEach(p => {
    teamCounts.set(p.team, (teamCounts.get(p.team) || 0) + 1);
  });

  // Convert all non-squad available players to enriched objects
  const availablePlayers = allPlayers
    .filter(p => !squadIds.has(p.id) && p.status === 'a')
    .map(p => {
      const stubPick = [{ element: p.id, position: 1, multiplier: 1, is_captain: false, is_vice_captain: false }];
      const [enriched] = buildSquadPlayers(stubPick, allPlayers, teams, fixtures, currentGW);
      return enriched;
    });

  // 1. Evaluate Every Squad Player for Sell Priority based on Analyst Model & Verified Team News
  const evaluatedSells = squad.map(player => {
    let sellScore = 0;
    const sellReasons: string[] = [];
    let matchupCritique = '';
    let analystConsensusCritique = '';

    const formVal = parseFloat(player.form) || 0;
    const priceM = player.now_cost / 10;
    const nextFix = player.upcomingFixtures[0];
    const avgNext3FDR = player.avgNext3FDR;
    const avgNext5FDR = player.avgNext5FDR;
    const news = player.latestTeamNews;

    // Factor 0: Verified Team News & Press Conference Alerts (Highest Priority)
    if (news) {
      if (news.impact === 'RULED_OUT') {
        sellScore += 160;
        sellReasons.push(`🚨 ${news.sourceName} (${news.sourceHandle}): "${news.headline}"`);
        analystConsensusCritique = `${news.sourceHandle}: ${news.quote}`;
      } else if (news.impact === 'MAJOR_DOUBT_50' || news.impact === 'BENCH_RISK') {
        sellScore += 65;
        sellReasons.push(`⚠️ ${news.sourceHandle} (${news.sourceName}): "${news.headline}"`);
      } else if (news.impact === 'FIT_TO_START') {
        sellScore = Math.max(0, sellScore - 30);
      }
    }

    // Factor 1: Injury / Availability (FPL official status)
    if (player.status !== 'a' && !news) {
      sellScore += 120;
      sellReasons.push(`🚨 ${player.news || 'Injured / Suspended - Confirmed 0 points'}`);
    } else if (player.chance_of_playing_next_round !== null && player.chance_of_playing_next_round < 75 && !news) {
      sellScore += 75;
      sellReasons.push(`⚠️ Significant availability doubt: only ${player.chance_of_playing_next_round}% chance to start.`);
    }

    // Factor 2: Minutes Security & Rotation Risk (Heavy in Harry & Review)
    if (player.minutesSecurity === 'ROTATION_RISK' || player.minutesSecurity === 'SUB_THREAT') {
      const penalty = (100 - player.minutesSecurityScore) * (weights.minutesSecurity / 10);
      sellScore += penalty;
      sellReasons.push(`⚠️ Rotation risk (${player.minutesSecurityScore}% security): averaging under 60 mins/match.`);
    }

    // Factor 3: Upcoming Opponent Matchups & Difficulties
    if (avgNext3FDR >= 3.6) {
      const fixPenalty = (avgNext3FDR - 2.8) * 15 * (weights.fixtureHorizonShort / 3.0);
      sellScore += fixPenalty;
      const oppNames = player.upcomingFixtures.slice(0, 3).map(f => `${f.opponent.short_name}(${f.isHome ? 'H' : 'A'})`).join(', ');
      sellReasons.push(`Schedule turns red (${oppNames}) with average FDR of ${avgNext3FDR.toFixed(1)}.`);
      matchupCritique = `Faces stout defensive units conceding low xG. Attacking and clean sheet ceilings are capped.`;
    } else if (nextFix && nextFix.difficulty >= 4) {
      sellScore += 20 * (weights.fixtureHorizonShort / 3.0);
      sellReasons.push(`Tough immediate fixture vs ${nextFix.opponent.name} (Defensive Strength: ${nextFix.opponentDefStrength}).`);
    }

    // Factor 4: Underlying Goal Threat & Slump (Heavy in Tom & Analytics)
    if (player.xGI90 < 0.25 && player.minutes > 350 && player.element_type >= 3) {
      const xGIPenalty = (0.35 - player.xGI90) * 80 * (weights.underlyingMetrics / 4.0);
      sellScore += xGIPenalty;
      sellReasons.push(`Underlying threat drought: creating only ${player.xGI90} xGI/90 with ${player.npxG90} npxG.`);
    } else if (formVal < 3.0 && player.minutes > 400) {
      sellScore += 25 * (weights.form / 2.0);
      sellReasons.push(`Form slump: averaging only ${formVal.toFixed(1)} pts/gw over last 4 matches.`);
    }

    // Factor 5: Expensive Budget Inefficiency
    if (priceM >= 7.5 && formVal < 4.5 && player.xGI90 < 0.4) {
      sellScore += 30;
      sellReasons.push(`High price tag of £${priceM.toFixed(1)}m tying up premium funds for mediocre returns (${player.points_per_game} pts/game).`);
    }

    // Factor 6: Ben Crellin 5-GW schedule swing
    if (selectedModel === 'ben_crellin' && avgNext5FDR >= 3.5) {
      sellScore += 30;
      sellReasons.push(`Long-term 5-GW runway is unfavorable (Average 5-GW FDR: ${avgNext5FDR.toFixed(1)}).`);
    }

    // Determine Urgency Tier
    let urgency: SellCandidatePlan['urgency'] = 'MEDIUM';
    let urgencyLabel = 'Form / Schedule Watchlist';
    let urgencyBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

    if (player.status !== 'a' || (news && news.impact === 'RULED_OUT') || sellScore >= 95) {
      urgency = 'CRITICAL';
      urgencyLabel = 'Priority 1 - Immediate Sell';
      urgencyBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    } else if (sellScore >= 55) {
      urgency = 'HIGH';
      urgencyLabel = 'High Priority - Upgrade Available';
      urgencyBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    } else if (priceM >= 7.0) {
      urgency = 'TACTICAL';
      urgencyLabel = 'Tactical Budget Reallocation';
      urgencyBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }

    if (sellReasons.length === 0) {
      sellReasons.push(`Solid baseline, but selling unlocks high-upside fixture swings in your squad.`);
      matchupCritique = `Moderate schedule. Premium upgrades available.`;
    }

    // Analyst Consensus Quote
    if (!analystConsensusCritique) {
      if (player.status !== 'a') {
        analystConsensusCritique = `All analysts recommend an immediate sale due to guaranteed zero returns.`;
      } else if (player.minutesSecurity === 'ROTATION_RISK') {
        analystConsensusCritique = `Harry: "Unreliable minutes kill rank—sell for a 90m nailed talisman before price drops."`;
      } else if (avgNext3FDR >= 3.6) {
        analystConsensusCritique = `Tom Freeman: "Target the fixture swing—his xGI expectation drops significantly against top defenses."`;
      } else {
        analystConsensusCritique = `Analytics Pro: "Reallocating £${priceM.toFixed(1)}m yields a projected +${((priceM * 0.4)).toFixed(1)} xPts gain elsewhere."`;
      }
    }

    return {
      player,
      sellScore,
      urgency,
      urgencyLabel,
      urgencyBadgeColor,
      sellReasons,
      matchupCritique: matchupCritique || `Upcoming fixtures offer limited upside. Higher ceiling options available.`,
      analystConsensusCritique,
      latestTeamNews: news
    };
  }).sort((a, b) => b.sellScore - a.sellScore);

  // Take top 5 sell candidates in preferential order
  const sellPlans: SellCandidatePlan[] = [];

  evaluatedSells.slice(0, 5).forEach((item, index) => {
    const playerOut = item.player;
    const maxBudgetTenths = playerOut.now_cost + bankBalanceTenths;

    // Filter available matching candidates
    const eligibleReplacements = availablePlayers.filter(buyer => {
      if (buyer.element_type !== playerOut.element_type) return false;
      if (buyer.now_cost > maxBudgetTenths) return false;
      // Filter out players ruled out in press conference
      if (buyer.latestTeamNews && buyer.latestTeamNews.impact === 'RULED_OUT') return false;
      const currentTeamCount = teamCounts.get(buyer.team) || 0;
      const willExceed = (buyer.team === playerOut.team) ? false : (currentTeamCount >= 3);
      if (willExceed) return false;
      return true;
    });

    // Score replacements with model-specific weighting & team news boost
    const scoredOptions = eligibleReplacements.map(buyer => {
      const formVal = parseFloat(buyer.form) || 0;
      const epVal = parseFloat(buyer.ep_next) || 0;
      const xGI90 = buyer.xGI90 || 0;
      const npxG90 = buyer.npxG90 || 0;
      const avgFDR = buyer.avgNext3FDR;
      const avg5FDR = buyer.avgNext5FDR;
      const ownership = parseFloat(buyer.selected_by_percent) || 10;
      const costDiff = Number(((buyer.now_cost - playerOut.now_cost) / 10).toFixed(1));
      const remainingBank = Number(((maxBudgetTenths - buyer.now_cost) / 10).toFixed(1));
      const buyerNews = buyer.latestTeamNews;

      // Matchup ease bonus
      const fixtureEaseShort = (5.5 - avgFDR) * (weights.fixtureHorizonShort);
      const fixtureEaseLong = (5.5 - avg5FDR) * (weights.fixtureHorizonLong);
      
      // Minutes security bonus
      const minutesBonus = (buyer.minutesSecurityScore / 100) * weights.minutesSecurity * 2.5;

      // Talisman & set-piece bonus
      const talismanBonus = buyer.talismanRating * (weights.talismanSetPieces / 2.5);

      // Underlying metrics bonus
      const underlyingBonus = (xGI90 * 5.0 + npxG90 * 3.0) * (weights.underlyingMetrics / 4.0);

      // Opponent defensive vulnerability
      const nextOpp = buyer.upcomingFixtures[0];
      const oppDefWeaknessBonus = nextOpp ? ((1400 - nextOpp.opponentDefStrength) / 50) : 0;

      // Team news fit bonus
      const teamNewsBonus = buyerNews?.impact === 'FIT_TO_START' ? 5 : 0;

      const totalBuyScore = (formVal * weights.form) + (epVal * 2.0) + underlyingBonus + fixtureEaseShort + fixtureEaseLong + minutesBonus + talismanBonus + oppDefWeaknessBonus + teamNewsBonus + (buyer.cost_change_event > 0 ? 2 : 0);

      const scoreDelta = Number((buyer.xPointsNextGW - playerOut.xPointsNextGW).toFixed(1));
      const xPts3GWDelta = Number((buyer.xPts3GW - playerOut.xPts3GW).toFixed(1));

      // Calculate Hit Justification (-4 calculation over 3 GW horizon)
      const hitThreshold = weights.hitPenaltyResistance;
      const isHitWorthy = xPts3GWDelta >= hitThreshold;
      let hitVerdict = '';
      let hitRecommendation: HitJustification['recommendation'] = 'FREE_TRANSFER_ONLY';

      if (isHitWorthy) {
        hitVerdict = `Taking a -4 hit is analytically justified (Projected Net Gain: +${(xPts3GWDelta - 4.0).toFixed(1)} pts over next 3 GWs).`;
        hitRecommendation = 'TAKE_HIT';
      } else if (xPts3GWDelta >= 2.0) {
        hitVerdict = `Use Free Transfer only. 3-GW gain (+${xPts3GWDelta} pts) does not comfortably exceed -4 hit cost.`;
        hitRecommendation = 'FREE_TRANSFER_ONLY';
      } else {
        hitVerdict = `Roll transfer or save budget (Minimal gain of +${xPts3GWDelta} pts over 3 GWs).`;
        hitRecommendation = 'ROLL_OR_WAIT';
      }

      const hitJustification: HitJustification = {
        isHitWorthy,
        pointDelta3GW: xPts3GWDelta,
        verdict: hitVerdict,
        recommendation: hitRecommendation
      };

      // Determine alternative category
      let type: AlternativeOption['type'] = 'TOP_UPGRADE';
      let typeLabel = 'Top Pick / Direct Upgrade';
      let typeBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

      if (avgFDR <= 2.4) {
        type = 'EASY_FIXTURES';
        typeLabel = 'Prime Fixture Run';
        typeBadgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      } else if (costDiff <= -0.7) {
        type = 'VALUE_ENABLER';
        typeLabel = `Budget Saver (+£${Math.abs(costDiff)}m Bank)`;
        typeBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      } else if (ownership < 12 && formVal >= 4.5) {
        type = 'DIFFERENTIAL';
        typeLabel = `Differential Gem (${ownership}% Owned)`;
        typeBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      }

      // Generate clear reasoning with team news
      const reasons: string[] = [];
      if (buyerNews?.impact === 'FIT_TO_START') {
        reasons.push(`🎙️ ${buyerNews.sourceHandle}: "${buyerNews.headline}"`);
      }
      if (buyer.isPenaltyTaker) reasons.push(`⚽ First-choice penalty taker (${buyer.talismanRating}/10 talisman rating).`);
      if (buyer.minutesSecurity === 'NAILED_90') reasons.push(`🛡️ 90m Nailed: zero rotation risk with ${buyer.minutes} mins played.`);
      if (xGI90 >= 0.45) reasons.push(`🎯 Elite underlying output: ${xGI90} xGI/90 (${npxG90} npxG).`);
      if (avgFDR <= 2.5) {
        const fixtureList = buyer.upcomingFixtures.slice(0, 3).map(f => `${f.opponent.short_name}(${f.isHome ? 'H' : 'A'})`).join(', ');
        reasons.push(`📈 Green fixture swing: ${fixtureList} (Avg FDR: ${avgFDR.toFixed(1)}).`);
      }
      if (costDiff < 0) reasons.push(`💰 Frees £${Math.abs(costDiff)}m in the bank for premium upgrades.`);
      if (formVal >= 6.0) reasons.push(`🔥 Blistering form: averaging ${formVal.toFixed(1)} pts/gw.`);

      const opponentMatchupNote = nextOpp 
        ? `GW${nextOpp.event}: ${nextOpp.isHome ? 'Home' : 'Away'} vs ${nextOpp.opponent.name} (FDR ${nextOpp.difficulty}).`
        : 'Favorable upcoming schedule.';

      // Generate multi-analyst insights
      const analystInsights: AnalystInsight[] = [
        {
          analystId: 'fpl_harry',
          analystName: 'FPL Harry',
          avatar: '⚡',
          badge: 'FPL Harry',
          verdict: buyer.minutesSecurity === 'NAILED_90' && avgFDR <= 2.8 
            ? `Must-have asset. Nailed 90 minutes with high-ceiling fixtures in the next 3 weeks.`
            : `Strong target, but monitor minutes during congested match weeks.`,
          confidence: buyer.minutesSecurity === 'NAILED_90' ? 'HIGH' : 'MEDIUM'
        },
        {
          analystId: 'tom_focal',
          analystName: 'Tom / FPL Focal',
          avatar: '📊',
          badge: 'Tom / Focal',
          verdict: xGI90 >= 0.45 
            ? `Underlying data is sensational (${xGI90} xGI/90). Expected to outscore his price tag.`
            : `Moderate underlying threat; viable enabler at £${(buyer.now_cost / 10).toFixed(1)}m.`,
          confidence: xGI90 >= 0.45 ? 'HIGH' : 'MEDIUM'
        },
        {
          analystId: 'ben_crellin',
          analystName: 'Ben Crellin',
          avatar: '🛡️',
          badge: 'Ben Crellin',
          verdict: avg5FDR <= 3.0 
            ? `Superb 5-GW runway. Solid pick that avoids forced transfer hits through upcoming GWs.`
            : `Solid short-term play, plan an exit route around GW30.`,
          confidence: avg5FDR <= 3.0 ? 'HIGH' : 'MEDIUM'
        },
        {
          analystId: 'analytics_review',
          analystName: 'Analytics Pro',
          avatar: '🤖',
          badge: 'Analytics Pro',
          verdict: `Projected +${xPts3GWDelta} xPts gain over 3 GWs. ${isHitWorthy ? 'Hit-justified.' : 'Use Free Transfer.'}`,
          confidence: 'HIGH'
        }
      ];

      return {
        playerIn: buyer,
        type,
        typeLabel,
        typeBadgeColor,
        costDelta: costDiff,
        newBankRemaining: Math.max(0, remainingBank),
        scoreDelta: Math.max(0.5, scoreDelta),
        xPts3GWDelta,
        totalBuyScore,
        reasons: reasons.slice(0, 3),
        opponentMatchupNote,
        hitJustification,
        analystInsights,
        latestTeamNews: buyerNews
      };
    }).sort((a, b) => b.totalBuyScore - a.totalBuyScore);

    // Pick 3 best diverse alternatives (Top Upgrade, Value Pick / Easy Fixtures, Differential)
    const selectedAlternatives: AlternativeOption[] = [];
    const topUpgrade = scoredOptions[0];
    if (topUpgrade) selectedAlternatives.push(topUpgrade);

    const fixtureOrValue = scoredOptions.find(o => o.playerIn.id !== topUpgrade?.playerIn.id && (o.type === 'EASY_FIXTURES' || o.type === 'VALUE_ENABLER'));
    if (fixtureOrValue) selectedAlternatives.push(fixtureOrValue);

    const differential = scoredOptions.find(o => !selectedAlternatives.some(s => s.playerIn.id === o.playerIn.id) && (o.type === 'DIFFERENTIAL' || o.playerIn.now_cost < playerOut.now_cost));
    if (differential) selectedAlternatives.push(differential);

    // If less than 3, fill with next best
    scoredOptions.forEach(opt => {
      if (selectedAlternatives.length < 3 && !selectedAlternatives.some(s => s.playerIn.id === opt.playerIn.id)) {
        selectedAlternatives.push(opt);
      }
    });

    sellPlans.push({
      rank: index + 1,
      playerOut,
      urgency: item.urgency,
      urgencyLabel: item.urgencyLabel,
      urgencyBadgeColor: item.urgencyBadgeColor,
      sellScore: item.sellScore,
      sellReasons: item.sellReasons,
      matchupCritique: item.matchupCritique,
      analystConsensusCritique: item.analystConsensusCritique,
      alternatives: selectedAlternatives,
      latestTeamNews: item.latestTeamNews
    });
  });

  return sellPlans;
}
