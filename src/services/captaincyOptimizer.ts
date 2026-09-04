import type { SquadPlayer, CaptaincyRank } from '../types/fpl';

export function calculateCaptaincyRankings(starters: SquadPlayer[]): CaptaincyRank[] {
  const attackingStarters = starters.filter(p => p.element_type >= 2 && p.status === 'a');

  return attackingStarters.map(player => {
    const form = parseFloat(player.form) || 3.0;
    const epNext = parseFloat(player.ep_next) || (form * 0.9);
    const xG = parseFloat(player.expected_goals) || 0;
    const xA = parseFloat(player.expected_assists) || 0;
    const xGI = parseFloat(player.expected_goal_involvements) || (xG + xA);
    const mins = Math.max(1, player.minutes);
    const xGI90 = (xGI / (mins / 90));

    const nextFixture = player.upcomingFixtures[0];
    const fdr = nextFixture ? nextFixture.difficulty : 3;
    const isHome = nextFixture ? nextFixture.isHome : true;
    const opponentName = nextFixture ? (nextFixture.opponent.short_name || nextFixture.opponent.name) : 'TBD';

    // Captaincy scoring model
    const fixtureBonus = (5.5 - fdr) * 1.8;
    const homeBonus = isHome ? 2.0 : 0;
    const positionMultiplier = player.element_type === 4 ? 1.4 : player.element_type === 3 ? 1.3 : 0.8;
    const formScore = form * 2.2;
    const xGIScore = xGI90 * 6.5;
    const ownership = parseFloat(player.selected_by_percent) || 10;

    const rawScore = (formScore + epNext * 2.0 + fixtureBonus + homeBonus + xGIScore) * positionMultiplier;
    const captainScore = Math.max(1, Number(rawScore.toFixed(1)));
    const xPoints = Number((epNext * 1.1 + (isHome ? 0.8 : 0) + (5 - fdr) * 0.6).toFixed(1));

    // Probabilities and tactical notes
    let ceilingProbability = 'Moderate (25-40%)';
    if (captainScore > 35) ceilingProbability = 'Ultra High (65%+)';
    else if (captainScore > 28) ceilingProbability = 'High (45-60%)';

    let cleanSheetOdds = 'Low (20%)';
    if (fdr <= 2) cleanSheetOdds = isHome ? 'High (55%)' : 'Moderate (42%)';

    let verdict = 'Reliable pick with strong floor';
    if (player.web_name === 'Salah' || player.web_name === 'Haaland' || player.web_name === 'Palmer') {
      verdict = 'Premier Explosive Asset - Highest Captaincy Ceiling & Penalty Talisman';
    } else if (fdr <= 2 && isHome) {
      verdict = `Prime Home Matchup vs ${opponentName} - Outstanding Expected Returns`;
    } else if (ownership < 20) {
      verdict = `High-Reward Differential Armband (${ownership}% ownership)`;
    }

    // Analyst custom verdicts
    const harryVerdict = player.isPenaltyTaker && player.minutesSecurity === 'NAILED_90'
      ? `Harry: "Primary captaincy target. 90m nailed on penalties with unmatched goal threat."`
      : `Harry: "Viable armband alternative, but secondary to the main penalty talismans."`;

    const tomVerdict = xGI90 >= 0.55
      ? `Tom: "Underlying numbers (${xGI90.toFixed(2)} xGI/90) point to massive haul potential."`
      : `Tom: "Solid floor against ${opponentName}, but ceiling relies on set piece deliveries."`;

    return {
      player,
      captainScore,
      xPoints,
      xGI: Number(xGI90.toFixed(2)),
      opponent: opponentName,
      isHome,
      fdr,
      cleanSheetOdds,
      ceilingProbability,
      verdict,
      harryVerdict,
      tomVerdict
    };
  }).sort((a, b) => b.captainScore - a.captainScore);
}
