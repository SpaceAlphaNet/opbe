/**
 * BattleConstants
 * conversion from php to ts done by scisneromam
 */

/*** System constants, do not edit! ***/
export const BATTLE_WIN = 1;
export const BATTLE_LOSE = -1;
export const BATTLE_DRAW = 0;
export const SHIELD_CELLS = 100; //how many cells a ship's shield should contain. Carefull to edit: more cells = better accuracy but less bounces in some cases.
export const USE_BIEXPLOSION_SYSTEM = true; // enable below system value
export const PROB_TO_REAL_MAGIC = 2; //value used to adapt probability theory to critical cases.
export const EPSILON = 1.2e-5; //tolerance to floating point errors

/*** Battle constants, default as Ogame ***/
export const ROUNDS = 6; //how many rounds a battle have, no limits.
export const SHIELDS_TECH_INCREMENT_FACTOR = 0.1; //how much a level increase the shield, in percentage from 0 to 1.
export const ARMOUR_TECH_INCREMENT_FACTOR = 0.1; //how much a level increase the armour, in percentage from 0 to 1.
export const WEAPONS_TECH_INCREMENT_FACTOR = 0.1; //how much a level increase the weapon, in percentage from 0 to 1.
export const COST_TO_ARMOUR = 0.1; //how much cost equal the armour, from 0 to 1. 1 means the ships/defenses armour equal its cost.
export const MIN_PROB_TO_EXPLODE = 0.3; //minimum probability at one the ships/defenses can explode, from 0 to 1. 1 means that the ship/def can explode only when they lost all hp.
export const DEFENSE_REPAIR_PROB = 0.7; //probability to repair defenses. From 0 to 1, 1 means that defenses are always rebuilt.
export const SHIP_REPAIR_PROB = 0; //same as below but for ships.
export const USE_HITSHIP_LIMITATION = true; //this option will limit the number of exploding ships to the number of total shots received by all defender's ships.
export const USE_EXPLODED_LIMITATION = true; //if true the number of exploded ships each round are limited to the damaged ships amount. 
export const USE_RF = true; // enable rapid fire
export const USE_RANDOMIC_RF = true; // enable below system values
export const MAX_RF_BUFF = 0.2; // how much the rapid fire can be randomically increased.
export const MAX_RF_NERF = 0.2; // how much the rapid fire can be randomically decreased.

/*** Views and optimization options ***/
export const ONLY_FIRST_AND_LAST_ROUND = false; //This option is usefull to decrease RAM usage, but the battle report will not contain all rounds.

/*** After-battle constants, default as Ogame ***/
export const REPAIRED_DO_DEBRIS = true;

//Percentage of debrigs generated from destroyed things if not specified
export const DEFAULT_DEBRIS_FACTOR = 0.3;

//Percentage of debris generated from destroyed ships. 
export const SHIP_DEBRIS_FACTOR = 0.3;
//Percentage of debris generated from destroyed defenses.  
export const DEFENSE_DEBRIS_FACTOR = 0.3;

//all debris factors in an object
export const DEBRIS_FACTORS: any = {"SHIP_DEBRIS_FACTOR": SHIP_DEBRIS_FACTOR, "DEFENSE_DEBRIS_FACTOR": DEFENSE_DEBRIS_FACTOR}

export const POINT_UNIT = 1000; //Ogame point = 1000 resources.
export const MOON_UNIT_PROB = 100000;
export const MAX_MOON_PROB = 20; //max probability to moon creation.
export const MOON_MIN_START_SIZE = 2000;
export const MOON_MAX_START_SIZE = 6000;
export const MOON_MIN_FACTOR = 100;
export const MOON_MAX_FACTOR = 200;
export const MOON_MAX_HIGHT_TEMP_DIFFERENCE_FROM_PLANET = 30;
export const MOON_MAX_LOW_TEMP_DIFFERENCE_FROM_PLANET = 10;
export const DEFAULT_MOON_NAME = 'moon';

export const TIMEZONE = 'Europe/Vatican';

