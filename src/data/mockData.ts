import type { FPLBootstrap, FPLFixture } from '../types/fpl';

export const MOCK_TEAMS = [
  { id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 5, strength_overall_home: 1350, strength_overall_away: 1360, strength_attack_home: 1340, strength_attack_away: 1350, strength_defence_home: 1370, strength_defence_away: 1380 },
  { id: 2, name: 'Aston Villa', short_name: 'AVL', code: 7, strength: 4, strength_overall_home: 1200, strength_overall_away: 1220, strength_attack_home: 1230, strength_attack_away: 1210, strength_defence_home: 1180, strength_defence_away: 1190 },
  { id: 3, name: 'Bournemouth', short_name: 'BOU', code: 91, strength: 3, strength_overall_home: 1100, strength_overall_away: 1110, strength_attack_home: 1120, strength_attack_away: 1100, strength_defence_home: 1090, strength_defence_away: 1080 },
  { id: 4, name: 'Brentford', short_name: 'BRE', code: 94, strength: 3, strength_overall_home: 1120, strength_overall_away: 1100, strength_attack_home: 1150, strength_attack_away: 1110, strength_defence_home: 1080, strength_defence_away: 1070 },
  { id: 5, name: 'Brighton', short_name: 'BHA', code: 36, strength: 3, strength_overall_home: 1140, strength_overall_away: 1130, strength_attack_home: 1160, strength_attack_away: 1140, strength_defence_home: 1120, strength_defence_away: 1110 },
  { id: 6, name: 'Chelsea', short_name: 'CHE', code: 8, strength: 4, strength_overall_home: 1230, strength_overall_away: 1220, strength_attack_home: 1270, strength_attack_away: 1250, strength_defence_home: 1180, strength_defence_away: 1170 },
  { id: 7, name: 'Crystal Palace', short_name: 'CRY', code: 31, strength: 3, strength_overall_home: 1100, strength_overall_away: 1090, strength_attack_home: 1080, strength_attack_away: 1070, strength_defence_home: 1120, strength_defence_away: 1100 },
  { id: 8, name: 'Everton', short_name: 'EVE', code: 11, strength: 2, strength_overall_home: 1070, strength_overall_away: 1060, strength_attack_home: 1040, strength_attack_away: 1030, strength_defence_home: 1110, strength_defence_away: 1090 },
  { id: 9, name: 'Fulham', short_name: 'FUL', code: 54, strength: 3, strength_overall_home: 1110, strength_overall_away: 1100, strength_attack_home: 1120, strength_attack_away: 1090, strength_defence_home: 1100, strength_defence_away: 1090 },
  { id: 10, name: 'Ipswich', short_name: 'IPS', code: 40, strength: 2, strength_overall_home: 1020, strength_overall_away: 1010, strength_attack_home: 1030, strength_attack_away: 1010, strength_defence_home: 1010, strength_defence_away: 1000 },
  { id: 11, name: 'Leicester', short_name: 'LEI', code: 13, strength: 2, strength_overall_home: 1040, strength_overall_away: 1020, strength_attack_home: 1050, strength_attack_away: 1030, strength_defence_home: 1020, strength_defence_away: 1010 },
  { id: 12, name: 'Liverpool', short_name: 'LIV', code: 14, strength: 5, strength_overall_home: 1360, strength_overall_away: 1350, strength_attack_home: 1370, strength_attack_away: 1360, strength_defence_home: 1350, strength_defence_away: 1340 },
  { id: 13, name: 'Man City', short_name: 'MCI', code: 43, strength: 5, strength_overall_home: 1370, strength_overall_away: 1360, strength_attack_home: 1390, strength_attack_away: 1380, strength_defence_home: 1330, strength_defence_away: 1320 },
  { id: 14, name: 'Man Utd', short_name: 'MUN', code: 1, strength: 3, strength_overall_home: 1170, strength_overall_away: 1160, strength_attack_home: 1160, strength_attack_away: 1150, strength_defence_home: 1170, strength_defence_away: 1160 },
  { id: 15, name: 'Newcastle', short_name: 'NEW', code: 4, strength: 4, strength_overall_home: 1240, strength_overall_away: 1210, strength_attack_home: 1260, strength_attack_away: 1220, strength_defence_home: 1210, strength_defence_away: 1180 },
  { id: 16, name: 'Nott\'m Forest', short_name: 'NFO', code: 17, strength: 3, strength_overall_home: 1150, strength_overall_away: 1140, strength_attack_home: 1140, strength_attack_away: 1120, strength_defence_home: 1170, strength_defence_away: 1160 },
  { id: 17, name: 'Southampton', short_name: 'SOU', code: 20, strength: 2, strength_overall_home: 1010, strength_overall_away: 1000, strength_attack_home: 1010, strength_attack_away: 990, strength_defence_home: 1000, strength_defence_away: 990 },
  { id: 18, name: 'Spurs', short_name: 'TOT', code: 6, strength: 4, strength_overall_home: 1220, strength_overall_away: 1200, strength_attack_home: 1260, strength_attack_away: 1240, strength_defence_home: 1160, strength_defence_away: 1150 },
  { id: 19, name: 'West Ham', short_name: 'WHU', code: 21, strength: 3, strength_overall_home: 1110, strength_overall_away: 1100, strength_attack_home: 1130, strength_attack_away: 1110, strength_defence_home: 1090, strength_defence_away: 1080 },
  { id: 20, name: 'Wolves', short_name: 'WOL', code: 39, strength: 3, strength_overall_home: 1100, strength_overall_away: 1090, strength_attack_home: 1120, strength_attack_away: 1090, strength_defence_home: 1080, strength_defence_away: 1070 }
];

export const MOCK_PLAYERS = [
  // GKP
  { id: 101, web_name: 'Raya', first_name: 'David', second_name: 'Raya', team: 1, element_type: 1, now_cost: 56, selected_by_percent: '34.2', form: '5.8', total_points: 118, ep_next: '5.2', ep_this: '5.5', event_points: 6, points_per_game: '5.4', value_season: '21.1', minutes: 1980, goals_scored: 0, assists: 0, clean_sheets: 10, goals_conceded: 18, yellow_cards: 1, red_cards: 0, expected_goals: '0.00', expected_assists: '0.02', expected_goal_involvements: '0.02', expected_goals_conceded: '17.4', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 45000, transfers_out_event: 8200, cost_change_event: 1, cost_change_start: 6 },
  { id: 102, web_name: 'Sels', first_name: 'Matz', second_name: 'Sels', team: 16, element_type: 1, now_cost: 49, selected_by_percent: '21.5', form: '5.2', total_points: 106, ep_next: '4.8', ep_this: '5.0', event_points: 7, points_per_game: '4.8', value_season: '21.6', minutes: 1980, goals_scored: 0, assists: 0, clean_sheets: 8, goals_conceded: 21, yellow_cards: 2, red_cards: 0, expected_goals: '0.00', expected_assists: '0.00', expected_goal_involvements: '0.00', expected_goals_conceded: '22.1', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 32000, transfers_out_event: 5100, cost_change_event: 0, cost_change_start: 4 },
  { id: 103, web_name: 'Pickford', first_name: 'Jordan', second_name: 'Pickford', team: 8, element_type: 1, now_cost: 48, selected_by_percent: '14.8', form: '4.6', total_points: 94, ep_next: '4.2', ep_this: '4.5', event_points: 3, points_per_game: '4.3', value_season: '19.6', minutes: 1980, goals_scored: 0, assists: 0, clean_sheets: 7, goals_conceded: 28, yellow_cards: 1, red_cards: 0, expected_goals: '0.00', expected_assists: '0.04', expected_goal_involvements: '0.04', expected_goals_conceded: '29.3', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 14000, transfers_out_event: 12000, cost_change_event: 0, cost_change_start: -2 },
  { id: 104, web_name: 'Fabianski', first_name: 'Lukasz', second_name: 'Fabianski', team: 19, element_type: 1, now_cost: 40, selected_by_percent: '18.4', form: '2.5', total_points: 44, ep_next: '2.0', ep_this: '2.0', event_points: 2, points_per_game: '2.8', value_season: '11.0', minutes: 1250, goals_scored: 0, assists: 0, clean_sheets: 2, goals_conceded: 23, yellow_cards: 0, red_cards: 0, expected_goals: '0.00', expected_assists: '0.00', expected_goal_involvements: '0.00', expected_goals_conceded: '22.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 11000, transfers_out_event: 18000, cost_change_event: 0, cost_change_start: 0 },
  { id: 105, web_name: 'Turner', first_name: 'Matt', second_name: 'Turner', team: 7, element_type: 1, now_cost: 39, selected_by_percent: '7.8', form: '0.0', total_points: 0, ep_next: '0.0', ep_this: '0.0', event_points: 0, points_per_game: '0.0', value_season: '0.0', minutes: 0, goals_scored: 0, assists: 0, clean_sheets: 0, goals_conceded: 0, yellow_cards: 0, red_cards: 0, expected_goals: '0.00', expected_assists: '0.00', expected_goal_involvements: '0.00', expected_goals_conceded: '0.0', status: 'u', news: 'Reserve goalkeeper', chance_of_playing_next_round: 0, transfers_in_event: 100, transfers_out_event: 3000, cost_change_event: 0, cost_change_start: -1 },

  // DEF
  { id: 201, web_name: 'Alexander-Arnold', first_name: 'Trent', second_name: 'Alexander-Arnold', team: 12, element_type: 2, now_cost: 72, selected_by_percent: '31.2', form: '6.4', total_points: 122, ep_next: '6.0', ep_this: '6.2', event_points: 8, points_per_game: '5.8', value_season: '16.9', minutes: 1810, goals_scored: 2, assists: 7, clean_sheets: 9, goals_conceded: 16, yellow_cards: 2, red_cards: 0, expected_goals: '1.85', expected_assists: '6.42', expected_goal_involvements: '8.27', expected_goals_conceded: '17.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 62000, transfers_out_event: 14000, cost_change_event: 1, cost_change_start: 2 },
  { id: 202, web_name: 'Gabriel', first_name: 'Gabriel', second_name: 'dos Santos Magalhães', team: 1, element_type: 2, now_cost: 63, selected_by_percent: '28.9', form: '5.6', total_points: 114, ep_next: '5.3', ep_this: '5.5', event_points: 6, points_per_game: '5.2', value_season: '18.1', minutes: 1980, goals_scored: 4, assists: 1, clean_sheets: 10, goals_conceded: 18, yellow_cards: 3, red_cards: 0, expected_goals: '3.12', expected_assists: '0.54', expected_goal_involvements: '3.66', expected_goals_conceded: '17.4', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 41000, transfers_out_event: 11000, cost_change_event: 0, cost_change_start: 3 },
  { id: 203, web_name: 'Saliba', first_name: 'William', second_name: 'Saliba', team: 1, element_type: 2, now_cost: 60, selected_by_percent: '35.4', form: '5.0', total_points: 102, ep_next: '4.9', ep_this: '5.0', event_points: 6, points_per_game: '4.9', value_season: '17.0', minutes: 1890, goals_scored: 1, assists: 0, clean_sheets: 10, goals_conceded: 17, yellow_cards: 2, red_cards: 1, expected_goals: '0.88', expected_assists: '0.32', expected_goal_involvements: '1.20', expected_goals_conceded: '16.5', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 28000, transfers_out_event: 15000, cost_change_event: 0, cost_change_start: 0 },
  { id: 204, web_name: 'Gvardiol', first_name: 'Josko', second_name: 'Gvardiol', team: 13, element_type: 2, now_cost: 60, selected_by_percent: '32.1', form: '5.4', total_points: 108, ep_next: '5.1', ep_this: '5.2', event_points: 7, points_per_game: '5.1', value_season: '18.0', minutes: 1890, goals_scored: 3, assists: 1, clean_sheets: 7, goals_conceded: 22, yellow_cards: 3, red_cards: 0, expected_goals: '2.45', expected_assists: '1.10', expected_goal_involvements: '3.55', expected_goals_conceded: '21.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 38000, transfers_out_event: 22000, cost_change_event: 0, cost_change_start: 0 },
  { id: 205, web_name: 'Aina', first_name: 'Ola', second_name: 'Aina', team: 16, element_type: 2, now_cost: 49, selected_by_percent: '19.4', form: '4.8', total_points: 92, ep_next: '4.4', ep_this: '4.6', event_points: 6, points_per_game: '4.4', value_season: '18.8', minutes: 1870, goals_scored: 2, assists: 1, clean_sheets: 8, goals_conceded: 20, yellow_cards: 2, red_cards: 0, expected_goals: '1.12', expected_assists: '1.40', expected_goal_involvements: '2.52', expected_goals_conceded: '20.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 42000, transfers_out_event: 6500, cost_change_event: 1, cost_change_start: 4 },
  { id: 206, web_name: 'Robinson', first_name: 'Antonee', second_name: 'Robinson', team: 9, element_type: 2, now_cost: 48, selected_by_percent: '21.0', form: '4.2', total_points: 86, ep_next: '4.0', ep_this: '4.1', event_points: 2, points_per_game: '3.9', value_season: '17.9', minutes: 1980, goals_scored: 0, assists: 6, clean_sheets: 4, goals_conceded: 27, yellow_cards: 4, red_cards: 0, expected_goals: '0.35', expected_assists: '4.15', expected_goal_involvements: '4.50', expected_goals_conceded: '28.1', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 19000, transfers_out_event: 14000, cost_change_event: 0, cost_change_start: 3 },
  { id: 207, web_name: 'Hall', first_name: 'Lewis', second_name: 'Hall', team: 15, element_type: 2, now_cost: 45, selected_by_percent: '14.2', form: '4.5', total_points: 80, ep_next: '4.3', ep_this: '4.4', event_points: 5, points_per_game: '4.2', value_season: '17.8', minutes: 1650, goals_scored: 0, assists: 4, clean_sheets: 6, goals_conceded: 24, yellow_cards: 3, red_cards: 0, expected_goals: '0.40', expected_assists: '3.20', expected_goal_involvements: '3.60', expected_goals_conceded: '23.5', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 28000, transfers_out_event: 9000, cost_change_event: 0, cost_change_start: 1 },
  { id: 208, web_name: 'Mykolenko', first_name: 'Vitalii', second_name: 'Mykolenko', team: 8, element_type: 2, now_cost: 44, selected_by_percent: '9.3', form: '3.6', total_points: 68, ep_next: '3.4', ep_this: '3.5', event_points: 2, points_per_game: '3.4', value_season: '15.5', minutes: 1720, goals_scored: 0, assists: 1, clean_sheets: 6, goals_conceded: 25, yellow_cards: 2, red_cards: 0, expected_goals: '0.22', expected_assists: '1.10', expected_goal_involvements: '1.32', expected_goals_conceded: '26.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 8000, transfers_out_event: 11000, cost_change_event: 0, cost_change_start: -1 },
  { id: 209, web_name: 'Harwood-Bellis', first_name: 'Taylor', second_name: 'Harwood-Bellis', team: 17, element_type: 2, now_cost: 40, selected_by_percent: '8.7', form: '1.8', total_points: 48, ep_next: '1.5', ep_this: '1.8', event_points: 1, points_per_game: '2.3', value_season: '12.0', minutes: 1800, goals_scored: 1, assists: 0, clean_sheets: 2, goals_conceded: 42, yellow_cards: 4, red_cards: 0, expected_goals: '0.80', expected_assists: '0.15', expected_goal_involvements: '0.95', expected_goals_conceded: '43.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 3000, transfers_out_event: 12000, cost_change_event: 0, cost_change_start: 0 },
  { id: 210, web_name: 'Konsa', first_name: 'Ezri', second_name: 'Konsa', team: 2, element_type: 2, now_cost: 45, selected_by_percent: '11.8', form: '2.0', total_points: 58, ep_next: '0.0', ep_this: '0.0', event_points: 0, points_per_game: '3.1', value_season: '12.9', minutes: 1600, goals_scored: 1, assists: 0, clean_sheets: 4, goals_conceded: 26, yellow_cards: 2, red_cards: 0, expected_goals: '0.70', expected_assists: '0.20', expected_goal_involvements: '0.90', expected_goals_conceded: '25.8', status: 'i', news: 'Hamstring injury - Expected return GW24', chance_of_playing_next_round: 0, transfers_in_event: 1200, transfers_out_event: 65000, cost_change_event: -1, cost_change_start: 0 },

  // MID
  { id: 301, web_name: 'Salah', first_name: 'Mohamed', second_name: 'Salah', team: 12, element_type: 3, now_cost: 135, selected_by_percent: '62.4', form: '9.8', total_points: 198, ep_next: '9.2', ep_this: '9.5', event_points: 13, points_per_game: '9.4', value_season: '14.7', minutes: 1920, goals_scored: 18, assists: 13, clean_sheets: 9, goals_conceded: 16, yellow_cards: 1, red_cards: 0, expected_goals: '15.40', expected_assists: '9.80', expected_goal_involvements: '25.20', expected_goals_conceded: '17.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 120000, transfers_out_event: 15000, cost_change_event: 1, cost_change_start: 10 },
  { id: 302, web_name: 'Palmer', first_name: 'Cole', second_name: 'Palmer', team: 6, element_type: 3, now_cost: 114, selected_by_percent: '58.7', form: '8.4', total_points: 174, ep_next: '8.0', ep_this: '8.2', event_points: 11, points_per_game: '8.3', value_season: '15.3', minutes: 1840, goals_scored: 14, assists: 9, clean_sheets: 7, goals_conceded: 24, yellow_cards: 4, red_cards: 0, expected_goals: '11.80', expected_assists: '8.10', expected_goal_involvements: '19.90', expected_goals_conceded: '24.1', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 98000, transfers_out_event: 18000, cost_change_event: 1, cost_change_start: 9 },
  { id: 303, web_name: 'Saka', first_name: 'Bukayo', second_name: 'Saka', team: 1, element_type: 3, now_cost: 103, selected_by_percent: '34.0', form: '4.8', total_points: 128, ep_next: '6.5', ep_this: '6.8', event_points: 5, points_per_game: '7.1', value_season: '12.4', minutes: 1540, goals_scored: 6, assists: 11, clean_sheets: 7, goals_conceded: 14, yellow_cards: 2, red_cards: 0, expected_goals: '5.90', expected_assists: '8.70', expected_goal_involvements: '14.60', expected_goals_conceded: '14.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 45000, transfers_out_event: 19000, cost_change_event: 0, cost_change_start: 3 },
  { id: 304, web_name: 'Mbeumo', first_name: 'Bryan', second_name: 'Mbeumo', team: 4, element_type: 3, now_cost: 78, selected_by_percent: '38.2', form: '6.8', total_points: 132, ep_next: '6.4', ep_this: '6.6', event_points: 9, points_per_game: '6.3', value_season: '16.9', minutes: 1880, goals_scored: 11, assists: 4, clean_sheets: 3, goals_conceded: 31, yellow_cards: 3, red_cards: 0, expected_goals: '9.40', expected_assists: '4.80', expected_goal_involvements: '14.20', expected_goals_conceded: '31.5', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 74000, transfers_out_event: 21000, cost_change_event: 1, cost_change_start: 8 },
  { id: 305, web_name: 'Rogers', first_name: 'Morgan', second_name: 'Rogers', team: 2, element_type: 3, now_cost: 54, selected_by_percent: '26.5', form: '5.2', total_points: 98, ep_next: '4.8', ep_this: '5.0', event_points: 6, points_per_game: '4.7', value_season: '18.1', minutes: 1810, goals_scored: 6, assists: 4, clean_sheets: 4, goals_conceded: 28, yellow_cards: 4, red_cards: 0, expected_goals: '5.20', expected_assists: '4.10', expected_goal_involvements: '9.30', expected_goals_conceded: '28.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 56000, transfers_out_event: 14000, cost_change_event: 1, cost_change_start: 4 },
  { id: 306, web_name: 'Semenyo', first_name: 'Antoine', second_name: 'Semenyo', team: 3, element_type: 3, now_cost: 57, selected_by_percent: '16.3', form: '5.6', total_points: 96, ep_next: '5.1', ep_this: '5.4', event_points: 8, points_per_game: '4.6', value_season: '16.8', minutes: 1720, goals_scored: 7, assists: 3, clean_sheets: 3, goals_conceded: 26, yellow_cards: 4, red_cards: 0, expected_goals: '6.80', expected_assists: '2.90', expected_goal_involvements: '9.70', expected_goals_conceded: '26.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 48000, transfers_out_event: 11000, cost_change_event: 0, cost_change_start: 2 },
  { id: 307, web_name: 'Smith Rowe', first_name: 'Emile', second_name: 'Smith Rowe', team: 9, element_type: 3, now_cost: 57, selected_by_percent: '22.1', form: '4.0', total_points: 84, ep_next: '3.8', ep_this: '4.0', event_points: 2, points_per_game: '4.0', value_season: '14.7', minutes: 1480, goals_scored: 4, assists: 3, clean_sheets: 4, goals_conceded: 22, yellow_cards: 2, red_cards: 0, expected_goals: '3.40', expected_assists: '2.80', expected_goal_involvements: '6.20', expected_goals_conceded: '23.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 18000, transfers_out_event: 32000, cost_change_event: 0, cost_change_start: 0 },
  { id: 308, web_name: 'Foden', first_name: 'Phil', second_name: 'Foden', team: 13, element_type: 3, now_cost: 92, selected_by_percent: '8.4', form: '4.5', total_points: 62, ep_next: '5.0', ep_this: '5.2', event_points: 3, points_per_game: '4.4', value_season: '6.7', minutes: 1050, goals_scored: 3, assists: 3, clean_sheets: 3, goals_conceded: 16, yellow_cards: 1, red_cards: 0, expected_goals: '4.10', expected_assists: '3.50', expected_goal_involvements: '7.60', expected_goals_conceded: '15.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 22000, transfers_out_event: 16000, cost_change_event: 0, cost_change_start: -8 },
  { id: 309, web_name: 'Son', first_name: 'Heung-min', second_name: 'Son', team: 18, element_type: 3, now_cost: 98, selected_by_percent: '12.8', form: '5.2', total_points: 98, ep_next: '5.4', ep_this: '5.6', event_points: 7, points_per_game: '5.4', value_season: '10.0', minutes: 1490, goals_scored: 6, assists: 6, clean_sheets: 4, goals_conceded: 22, yellow_cards: 0, red_cards: 0, expected_goals: '5.60', expected_assists: '5.80', expected_goal_involvements: '11.40', expected_goals_conceded: '22.4', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 19000, transfers_out_event: 15000, cost_change_event: 0, cost_change_start: -2 },
  { id: 310, web_name: 'Gordon', first_name: 'Anthony', second_name: 'Gordon', team: 15, element_type: 3, now_cost: 74, selected_by_percent: '17.2', form: '5.8', total_points: 104, ep_next: '5.5', ep_this: '5.8', event_points: 8, points_per_game: '5.2', value_season: '14.1', minutes: 1720, goals_scored: 6, assists: 5, clean_sheets: 5, goals_conceded: 24, yellow_cards: 3, red_cards: 0, expected_goals: '6.40', expected_assists: '4.70', expected_goal_involvements: '11.10', expected_goals_conceded: '23.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 36000, transfers_out_event: 14000, cost_change_event: 0, cost_change_start: -1 },
  { id: 311, web_name: 'Bowen', first_name: 'Jarrod', second_name: 'Bowen', team: 19, element_type: 3, now_cost: 75, selected_by_percent: '11.4', form: '4.2', total_points: 92, ep_next: '4.4', ep_this: '4.5', event_points: 3, points_per_game: '4.4', value_season: '12.3', minutes: 1820, goals_scored: 6, assists: 4, clean_sheets: 2, goals_conceded: 34, yellow_cards: 2, red_cards: 0, expected_goals: '5.90', expected_assists: '3.60', expected_goal_involvements: '9.50', expected_goals_conceded: '34.2', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 14000, transfers_out_event: 24000, cost_change_event: 0, cost_change_start: 0 },
  { id: 312, web_name: 'Winks', first_name: 'Harry', second_name: 'Winks', team: 11, element_type: 3, now_cost: 45, selected_by_percent: '12.6', form: '2.2', total_points: 48, ep_next: '2.0', ep_this: '2.0', event_points: 2, points_per_game: '2.4', value_season: '10.7', minutes: 1650, goals_scored: 1, assists: 1, clean_sheets: 2, goals_conceded: 38, yellow_cards: 5, red_cards: 0, expected_goals: '0.60', expected_assists: '1.20', expected_goal_involvements: '1.80', expected_goals_conceded: '38.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 8000, transfers_out_event: 14000, cost_change_event: 0, cost_change_start: 0 },

  // FWD
  { id: 401, web_name: 'Haaland', first_name: 'Erling', second_name: 'Haaland', team: 13, element_type: 4, now_cost: 148, selected_by_percent: '54.6', form: '8.2', total_points: 178, ep_next: '8.5', ep_this: '8.8', event_points: 12, points_per_game: '8.5', value_season: '12.0', minutes: 1890, goals_scored: 21, assists: 2, clean_sheets: 7, goals_conceded: 22, yellow_cards: 2, red_cards: 0, expected_goals: '18.90', expected_assists: '2.10', expected_goal_involvements: '21.00', expected_goals_conceded: '21.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 88000, transfers_out_event: 32000, cost_change_event: 0, cost_change_start: -2 },
  { id: 402, web_name: 'Isak', first_name: 'Alexander', second_name: 'Isak', team: 15, element_type: 4, now_cost: 94, selected_by_percent: '49.1', form: '8.8', total_points: 146, ep_next: '8.2', ep_this: '8.4', event_points: 12, points_per_game: '7.7', value_season: '15.5', minutes: 1620, goals_scored: 15, assists: 4, clean_sheets: 5, goals_conceded: 21, yellow_cards: 1, red_cards: 0, expected_goals: '13.80', expected_assists: '3.10', expected_goal_involvements: '16.90', expected_goals_conceded: '21.5', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 110000, transfers_out_event: 12000, cost_change_event: 1, cost_change_start: 9 },
  { id: 403, web_name: 'Watkins', first_name: 'Ollie', second_name: 'Watkins', team: 2, element_type: 4, now_cost: 90, selected_by_percent: '28.4', form: '6.0', total_points: 124, ep_next: '5.8', ep_this: '6.0', event_points: 6, points_per_game: '5.9', value_season: '13.8', minutes: 1790, goals_scored: 10, assists: 7, clean_sheets: 4, goals_conceded: 28, yellow_cards: 3, red_cards: 0, expected_goals: '9.80', expected_assists: '5.40', expected_goal_involvements: '15.20', expected_goals_conceded: '28.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 34000, transfers_out_event: 28000, cost_change_event: 0, cost_change_start: 0 },
  { id: 404, web_name: 'Wood', first_name: 'Chris', second_name: 'Wood', team: 16, element_type: 4, now_cost: 68, selected_by_percent: '31.8', form: '7.2', total_points: 130, ep_next: '6.8', ep_this: '7.0', event_points: 9, points_per_game: '6.2', value_season: '19.1', minutes: 1750, goals_scored: 14, assists: 1, clean_sheets: 8, goals_conceded: 19, yellow_cards: 1, red_cards: 0, expected_goals: '11.60', expected_assists: '1.20', expected_goal_involvements: '12.80', expected_goals_conceded: '19.8', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 85000, transfers_out_event: 14000, cost_change_event: 1, cost_change_start: 8 },
  { id: 405, web_name: 'Cunha', first_name: 'Matheus', second_name: 'Santos Carneiro Da Cunha', team: 20, element_type: 4, now_cost: 67, selected_by_percent: '19.6', form: '5.4', total_points: 110, ep_next: '5.2', ep_this: '5.5', event_points: 7, points_per_game: '5.2', value_season: '16.4', minutes: 1780, goals_scored: 10, assists: 4, clean_sheets: 3, goals_conceded: 36, yellow_cards: 5, red_cards: 0, expected_goals: '8.40', expected_assists: '3.90', expected_goal_involvements: '12.30', expected_goals_conceded: '36.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 42000, transfers_out_event: 29000, cost_change_event: 0, cost_change_start: 2 },
  { id: 406, web_name: 'Joao Pedro', first_name: 'Joao Pedro', second_name: 'Junqueira de Jesus', team: 5, element_type: 4, now_cost: 56, selected_by_percent: '18.2', form: '4.8', total_points: 78, ep_next: '4.6', ep_this: '4.8', event_points: 5, points_per_game: '4.9', value_season: '13.9', minutes: 1250, goals_scored: 6, assists: 3, clean_sheets: 2, goals_conceded: 20, yellow_cards: 2, red_cards: 0, expected_goals: '5.40', expected_assists: '2.50', expected_goal_involvements: '7.90', expected_goals_conceded: '20.5', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 31000, transfers_out_event: 16000, cost_change_event: 0, cost_change_start: 1 },
  { id: 407, web_name: 'Delap', first_name: 'Liam', second_name: 'Delap', team: 10, element_type: 4, now_cost: 56, selected_by_percent: '9.4', form: '4.2', total_points: 76, ep_next: '3.9', ep_this: '4.0', event_points: 2, points_per_game: '3.8', value_season: '13.6', minutes: 1620, goals_scored: 7, assists: 1, clean_sheets: 1, goals_conceded: 39, yellow_cards: 6, red_cards: 0, expected_goals: '5.90', expected_assists: '0.80', expected_goal_involvements: '6.70', expected_goals_conceded: '40.0', status: 'a', news: '', chance_of_playing_next_round: 100, transfers_in_event: 12000, transfers_out_event: 19000, cost_change_event: 0, cost_change_start: 1 },
  { id: 408, web_name: 'Solanke', first_name: 'Dominic', second_name: 'Solanke', team: 18, element_type: 4, now_cost: 74, selected_by_percent: '10.8', form: '3.8', total_points: 74, ep_next: '0.0', ep_this: '0.0', event_points: 0, points_per_game: '4.6', value_season: '10.0', minutes: 1350, goals_scored: 6, assists: 3, clean_sheets: 3, goals_conceded: 19, yellow_cards: 2, red_cards: 0, expected_goals: '6.20', expected_assists: '2.10', expected_goal_involvements: '8.30', expected_goals_conceded: '19.5', status: 'd', news: 'Knock - 75% chance of playing', chance_of_playing_next_round: 75, transfers_in_event: 5000, transfers_out_event: 48000, cost_change_event: -1, cost_change_start: -1 }
];

export const MOCK_GAMEWEEKS = Array.from({ length: 38 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: `Gameweek ${id}`,
    deadline_time: new Date(Date.now() + (id - 22) * 7 * 86400000).toISOString(),
    is_previous: id === 21,
    is_current: id === 22,
    is_next: id === 23,
    finished: id < 22,
    average_entry_score: id < 22 ? 58 : null,
    highest_score: id < 22 ? 118 : null
  };
});

export const MOCK_FIXTURES: FPLFixture[] = [
  // GW23 fixtures
  { id: 221, event: 23, team_h: 1, team_a: 19, team_h_difficulty: 2, team_a_difficulty: 5, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 222, event: 23, team_h: 12, team_a: 10, team_h_difficulty: 2, team_a_difficulty: 5, finished: false, started: false, kickoff_time: '2026-09-06T16:30:00Z' },
  { id: 223, event: 23, team_h: 13, team_a: 6, team_h_difficulty: 4, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-07T19:00:00Z' },
  { id: 224, event: 23, team_h: 15, team_a: 17, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 225, event: 23, team_h: 16, team_a: 4, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 226, event: 23, team_h: 2, team_a: 7, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 227, event: 23, team_h: 5, team_a: 8, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 228, event: 23, team_h: 9, team_a: 14, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },
  { id: 229, event: 23, team_h: 18, team_a: 11, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-07T14:00:00Z' },
  { id: 230, event: 23, team_h: 20, team_a: 3, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-06T14:00:00Z' },

  // GW24 fixtures
  { id: 231, event: 24, team_h: 1, team_a: 13, team_h_difficulty: 4, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-13T16:30:00Z' },
  { id: 232, event: 24, team_h: 3, team_a: 12, team_h_difficulty: 4, team_a_difficulty: 2, finished: false, started: false, kickoff_time: '2026-09-13T14:00:00Z' },
  { id: 233, event: 24, team_h: 6, team_a: 19, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-13T14:00:00Z' },
  { id: 234, event: 24, team_h: 15, team_a: 9, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-13T14:00:00Z' },
  { id: 235, event: 24, team_h: 16, team_a: 5, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-13T14:00:00Z' },

  // GW25 fixtures (DGW for Arsenal & Man City!)
  { id: 241, event: 25, team_h: 11, team_a: 1, team_h_difficulty: 4, team_a_difficulty: 2, finished: false, started: false, kickoff_time: '2026-09-20T14:00:00Z' },
  { id: 242, event: 25, team_h: 17, team_a: 13, team_h_difficulty: 5, team_a_difficulty: 2, finished: false, started: false, kickoff_time: '2026-09-20T14:00:00Z' },
  { id: 243, event: 25, team_h: 1, team_a: 7, team_h_difficulty: 2, team_a_difficulty: 5, finished: false, started: false, kickoff_time: '2026-09-23T19:45:00Z' },
  { id: 244, event: 25, team_h: 13, team_a: 4, team_h_difficulty: 2, team_a_difficulty: 5, finished: false, started: false, kickoff_time: '2026-09-23T20:00:00Z' },
  { id: 245, event: 25, team_h: 12, team_a: 20, team_h_difficulty: 2, team_a_difficulty: 4, finished: false, started: false, kickoff_time: '2026-09-20T16:30:00Z' },

  // GW26 fixtures
  { id: 251, event: 26, team_h: 19, team_a: 12, team_h_difficulty: 4, team_a_difficulty: 2, finished: false, started: false, kickoff_time: '2026-09-27T14:00:00Z' },
  { id: 252, event: 26, team_h: 15, team_a: 16, team_h_difficulty: 3, team_a_difficulty: 3, finished: false, started: false, kickoff_time: '2026-09-27T14:00:00Z' },
  { id: 253, event: 26, team_h: 6, team_a: 17, team_h_difficulty: 2, team_a_difficulty: 5, finished: false, started: false, kickoff_time: '2026-09-27T14:00:00Z' }
];

export const MOCK_BOOTSTRAP: FPLBootstrap = {
  elements: MOCK_PLAYERS as any,
  teams: MOCK_TEAMS,
  events: MOCK_GAMEWEEKS
};

export const SAMPLE_MANAGERS = [
  {
    info: {
      id: 1234567,
      player_first_name: 'Balaji',
      player_last_name: 'Vankayala',
      name: 'Balaji XI',
      summary_overall_points: 1342,
      summary_overall_rank: 12450,
      summary_event_points: 78,
      summary_event_rank: 84300,
      current_event: 22,
      last_deadline_bank: 12,
      last_deadline_value: 1038,
      last_deadline_total_transfers: 21
    },
    picks: {
      active_chip: null,
      automatic_subs: [],
      entry_history: {
        event: 22,
        points: 78,
        total_points: 1342,
        rank: 84300,
        overall_rank: 12450,
        bank: 12,
        value: 1038,
        event_transfers: 1,
        event_transfers_cost: 0,
        points_on_bench: 11
      },
      picks: [
        { element: 101, position: 1, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 201, position: 2, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 202, position: 3, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 205, position: 4, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 301, position: 5, multiplier: 2, is_captain: true, is_vice_captain: false },
        { element: 302, position: 6, multiplier: 1, is_captain: false, is_vice_captain: true },
        { element: 304, position: 7, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 305, position: 8, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 401, position: 9, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 402, position: 10, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 404, position: 11, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 104, position: 12, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 206, position: 13, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 210, position: 14, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 312, position: 15, multiplier: 0, is_captain: false, is_vice_captain: false }
      ]
    },
    history: {
      current: [
        { event: 19, points: 64, total_points: 1198, rank: 410000, overall_rank: 18400, bank: 15, value: 1032, event_transfers: 1, event_transfers_cost: 0, points_on_bench: 4 },
        { event: 20, points: 66, total_points: 1264, rank: 320000, overall_rank: 15200, bank: 12, value: 1035, event_transfers: 1, event_transfers_cost: 0, points_on_bench: 6 },
        { event: 21, points: 78, total_points: 1342, rank: 84300, overall_rank: 12450, bank: 12, value: 1038, event_transfers: 1, event_transfers_cost: 0, points_on_bench: 11 }
      ],
      chips: [
        { name: 'wildcard', time: '2025-10-18T10:00:00Z', event: 8 }
      ]
    }
  },
  {
    info: {
      id: 88888,
      player_first_name: 'Template',
      player_last_name: 'Guru',
      name: 'Top 10k Elite',
      summary_overall_points: 1386,
      summary_overall_rank: 4120,
      summary_event_points: 82,
      summary_event_rank: 45000,
      current_event: 22,
      last_deadline_bank: 5,
      last_deadline_value: 1045,
      last_deadline_total_transfers: 19
    },
    picks: {
      active_chip: null,
      automatic_subs: [],
      entry_history: {
        event: 22,
        points: 82,
        total_points: 1386,
        rank: 45000,
        overall_rank: 4120,
        bank: 5,
        value: 1045,
        event_transfers: 1,
        event_transfers_cost: 0,
        points_on_bench: 8
      },
      picks: [
        { element: 102, position: 1, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 201, position: 2, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 202, position: 3, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 204, position: 4, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 301, position: 5, multiplier: 2, is_captain: true, is_vice_captain: false },
        { element: 302, position: 6, multiplier: 1, is_captain: false, is_vice_captain: true },
        { element: 303, position: 7, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 306, position: 8, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 402, position: 9, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 403, position: 10, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 404, position: 11, multiplier: 1, is_captain: false, is_vice_captain: false },
        { element: 104, position: 12, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 207, position: 13, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 208, position: 14, multiplier: 0, is_captain: false, is_vice_captain: false },
        { element: 312, position: 15, multiplier: 0, is_captain: false, is_vice_captain: false }
      ]
    },
    history: {
      current: [],
      chips: [
        { name: 'wildcard', time: '2025-09-28T10:00:00Z', event: 6 },
        { name: '3xc', time: '2025-11-23T10:00:00Z', event: 12 }
      ]
    }
  }
];
