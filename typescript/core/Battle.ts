import {ROUNDS, BATTLE_LOSE, BATTLE_WIN, BATTLE_DRAW} from "../constants/battle_constants";
import {Round} from "./Round";
import {BattleReport} from "./BattleReport";
import {PlayerGroup} from "../models/PlayerGroup";

/**
 * Battle
 * conversion from php to ts done by scisneromam
 */
class Battle {
    private attackers: PlayerGroup;
    private defenders: PlayerGroup;
    private report: BattleReport;
    private battleStarted: boolean;

    /**
     * Battle::__construct()
     * 
     * @param PlayerGroup attackers
     * @param PlayerGroup defenders
     * @return Battle
     */
    public constructor(attackers: PlayerGroup, defenders: PlayerGroup) {
        this.attackers = attackers;
        this.defenders = defenders;
        this.battleStarted = false;
        this.report = new BattleReport();
    }
    /**
     * Battle::startBattle()
     * 
     * @return null
     */
    public startBattle(debug = false) {
        //if (!debug)
        //    ob_start();
        this.battleStarted = true;
        //only for initial fleets presentation
        //log_var('attackers', this.attackers);
        //log_var('defenders', this.defenders);
        let round = new Round(this.attackers, this.defenders, 0);
        this.report.addRound(round);
        for (let i = 1;i <= ROUNDS;i++) {
            const att_lose = this.attackers.isEmpty();
            const deff_lose = this.defenders.isEmpty();
            //if one of they are empty then battle is ended, so update the status
            if (att_lose || deff_lose) {
                this.checkWhoWon(att_lose, deff_lose);
                this.report.setBattleResult(this.attackers.battleResult!!, this.defenders.battleResult!!);
                //if (!debug)
                //    ob_get_clean();
                return;
            }
            //initialize the round
            round = new Round(this.attackers, this.defenders, i);
            round.startRound();
            //add the round to the combatReport
            this.report.addRound(round);
            //if(i==2) die('Round: '.this.report.getRound(0).getNumber()); // ERRORE
            //update the attackers and defenders after round
            this.attackers = round.getAfterBattleAttackers();
            this.defenders = round.getAfterBattleDefenders();
        }
        //check status after all rounds
        this.checkWhoWon(this.attackers.isEmpty(), this.defenders.isEmpty());
        //if (!debug)
        //    ob_get_clean();
        return true;
    }
    /**
     * Battle::checkWhoWon()
     * Assign to groups the status win,lose or draw
     * @param boolean att_lose
     * @param boolean deff_lose
     * @return null
     */
    private checkWhoWon(att_lose: boolean, deff_lose: boolean) {
        if (att_lose && !deff_lose) {
            this.attackers.battleResult = BATTLE_LOSE;
            this.defenders.battleResult = BATTLE_WIN;
        }
        else if (!att_lose && deff_lose) {
            this.attackers.battleResult = BATTLE_WIN;
            this.defenders.battleResult = BATTLE_LOSE;
        }
        else {
            this.attackers.battleResult = BATTLE_DRAW;
            this.defenders.battleResult = BATTLE_DRAW;
        }
    }

    /**
     * Battle::__toString()
     * 
     * @return
     */
    /*
    public __toString() {
        return this.report.__toString();
    }
    */
    /**
     * Battle::getReport()
     * Start the battle if not and return the report.
     * @return BattleReport
     */
    public getReport() {
        if (!this.battleStarted) {
            this.startBattle();
        }
        return this.report;
    }
}

export {Battle}
