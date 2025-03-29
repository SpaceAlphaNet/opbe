import {ONLY_FIRST_AND_LAST_ROUND, BATTLE_WIN, BATTLE_DRAW, MOON_UNIT_PROB, MAX_MOON_PROB, REPAIRED_DO_DEBRIS, DEBRIS_FACTORS, DEFAULT_DEBRIS_FACTOR} from "../constants/battle_constants";
import {PlayerGroup} from "../models/PlayerGroup";
import {Events} from "../utils/Events";
import {Round} from "./Round";


/**
 * BattleReport
 * conversion from php to ts done by scisneromam
 */
class BattleReport {
    private rounds: Round[];
    private roundsCount: number;
    private steal: number[];
    //private attackersLostUnits;
    //private defendersLostUnits;

    public css = '../../';

    public constructor() {
        this.rounds = [];
        this.roundsCount = 0;
        this.steal = [];
    }

    /**
     * BattleReport::addRound()
     * Store a round
     * @param Round round
     * @return void
     */
    public addRound(round: Round) {
        if (ONLY_FIRST_AND_LAST_ROUND && this.roundsCount == 2) {
            this.rounds[0] = round;
            return;
        }
        this.rounds[this.roundsCount++] = round;
    }

    /**
     * BattleReport::getRound()
     * Retrive a round.
     * @param mixed number: "START" to get the first round, "END" to get the last one, an integer(from zero) to get the corrispective round
     * @return Round
     */
    public getRound(number: number | string): Round {
        if (typeof number == "string") {
            if (number === 'END') {
                return this.rounds[this.roundsCount - 1];
            }
            else if (number === 'START') {
                return this.rounds[0];
            }
        }
        else if (number < 0 || number > this.getLastRoundNumber()) {
            throw new Error('Invalid round number');
        }
        else {
            return this.rounds[Math.floor(number)];
        }
        throw new Error("getRound Unreachable state: " + number)
    }

    /**
     * BattleReport::getResultRound()
     * Alias of getRound(). Get the round after it was processed
     * @param int number: the corrispective round number(from 0)
     * @return
     */
    private getResultRound(number: number | string) {
        return this.getRound(number);
    }

    /**
     * BattleReport::getPresentationRound()
     * Get the round before it was processed.
     * @param int number: the corrispective round (from 1)
     * @return
     */
    private getPresentationRound(number: number | string) {
        if (typeof number == "number") {
            number -= 1;
        }
        return this.getRound(number);
    }

    /**
     * BattleReport::setBattleResult()
     * Set the result of a battle
     * @param int att (BATTLE_WIN ,BATTLE_LOSE, BATTLE_DRAW)
     * @param int def (BATTLE_WIN ,BATTLE_LOSE, BATTLE_DRAW)
     * @return void
     */
    public setBattleResult(att: number, def: number) {
        this.getRound('END').getAfterBattleAttackers().battleResult = att;
        this.getRound('END').getAfterBattleDefenders().battleResult = def;
    }


    /**
     * BattleReport::attackerHasWin()
     * Check if attackers won the battle
     * @return boolean
     */
    public attackerHasWin() {
        return this.getRound('END').getAfterBattleAttackers().battleResult === BATTLE_WIN;
    }


    /**
     * BattleReport::defenderHasWin()
     * Check if defenders won the battle
     * @return boolean
     */
    public defenderHasWin() {
        return this.getRound('END').getAfterBattleDefenders().battleResult === BATTLE_WIN;
    }


    /**
     * BattleReport::isAdraw()
     * Check if the battle ended with a draw
     * @return boolean
     */
    public isADraw() {
        return this.getRound('END').getAfterBattleAttackers().battleResult === BATTLE_DRAW;
    }


    public getPresentationAttackersFleetOnRound(number: number | string) {
        return this.getPresentationRound(number).getAfterBattleAttackers();
    }
    public getPresentationDefendersFleetOnRound(number: number | string) {
        return this.getPresentationRound(number).getAfterBattleDefenders();
    }
    public getResultAttackersFleetOnRound(number: number | string) {
        return this.getResultRound(number).getAfterBattleAttackers();
    }
    public getResultDefendersFleetOnRound(number: number | string) {
        return this.getResultRound(number).getAfterBattleDefenders();
    }

    //-------------------  Lost units functions -------------------
    public getTotalAttackersLostUnits() {
        let sum = 0;
        for (const [playerId, player] of this.getAttackersLostUnits()) {
            for (const [fleetId, fleet] of player) {
                for (const [typeName, shipType] of fleet) {
                    for (const [shipTypeId, costs] of shipType) {
                        for (const cost of costs) {
                            sum += cost
                        }
                        //TODO do i sum the costs or how do i count the units?
                    }
                }
            }
        }
        return sum;
    }
    public getTotalDefendersLostUnits() {
        let sum = 0;
        for (const [playerId, player] of this.getDefendersLostUnits()) {
            for (const [fleetId, fleet] of player) {
                for (const [typeName, shipType] of fleet) {
                    for (const [shipTypeId, costs] of shipType) {
                        for (const cost of costs) {
                            sum += cost
                        }
                        //TODO do i sum the costs or how do i count the units?
                    }
                }
            }
        }
        return sum;
    }
    public getAttackersLostUnits(repair = true) {
        const attackersBefore = this.getRound('START').getAfterBattleAttackers();
        const attackersAfter = this.getRound('END').getAfterBattleAttackers();
        return this.getPlayersLostUnits(attackersBefore, attackersAfter, repair);
    }
    public getDefendersLostUnits(repair = true) {
        const defendersBefore = this.getRound('START').getAfterBattleDefenders();
        const defendersAfter = this.getRound('END').getAfterBattleDefenders();
        return this.getPlayersLostUnits(defendersBefore, defendersAfter, repair);
    }
    private getPlayersLostUnits(playersBefore: PlayerGroup, playersAfter: PlayerGroup, repair: boolean = true): Map<number, Map<number, Map<string, Map<number, number[]>>>> {
        const lostShips = this.getPlayersLostShips(playersBefore, playersAfter);
        const defRepaired = this.getPlayerRepaired(playersBefore, playersAfter);
        const ret: Map<number, Map<number, Map<string, Map<number, number[]>>>> = new Map();
        for (const [playerId, player] of lostShips) {
            for (const [fleetId, fleet] of player) {
                for (const [shipTypeId, shipType] of fleet) {
                    const cost = shipType.getCost();
                    let repairedAmount = 0;
                    if (repair && defRepaired.existPlayer(playerId) && defRepaired.getPlayer(playerId).existFleet(fleetId) && defRepaired.getPlayer(playerId).getFleet(fleetId).existShipType(shipTypeId)) {
                        repairedAmount = defRepaired.getPlayer(playerId).getFleet(fleetId).getShipType(shipTypeId).getCount()
                    }
                    const count = shipType.getCount() - repairedAmount
                    if (count > 0) {
                        if (!ret.has(playerId)) {
                            ret.set(playerId, new Map())
                        }
                        if (!ret.get(playerId)!!.has(fleetId)) {
                            ret.get(playerId)!!.set(fleetId, new Map())
                        }
                        if (!ret.get(playerId)!!.get(fleetId)!!.has(shipType.constructor.name.toUpperCase())) {
                            ret.get(playerId)!!.get(fleetId)!!.set(shipType.constructor.name.toUpperCase(), new Map())
                        }
                        ret.get(playerId)!!.get(fleetId)!!.get(shipType.constructor.name.toUpperCase())!!.set(shipTypeId, cost.map(it => (it * count)))
                    } else if (count < 0) {
                        throw new Error("Count negative")
                    }
                }
            }
        }
        return ret;
    }
    //--------------------------------------------------------------
    public tryMoon() {
        const prob = this.getMoonProb();
        if (Math.random() * 100 < prob) {
            return Events.event_moon(prob)
        }
        return false;
    }
    public getMoonProb() {
        return Math.min(Math.floor(this.getDebris().reduce(function (a, b) {return a + b;}, 0) / MOON_UNIT_PROB), MAX_MOON_PROB);
    }
    public getAttackerDebris(): number[] {
        let costs: number[] = [];
        for (const [idPlayer, player] of this.getAttackersLostUnits(!REPAIRED_DO_DEBRIS)) {
            for (const [idFleet, fleet] of player) {
                for (const [role, values] of fleet) {
                    let fleetLost: number[] = [];
                    for (const [idShipType, lost] of values) {
                        if (fleetLost.length == 0) {
                            fleetLost = lost
                        } else {
                            for (const [i, value] of fleetLost.entries()) {
                                fleetLost[i] = value + lost[i]
                            }
                        }
                    }
                    const factor: number = DEBRIS_FACTORS[role + "_DEBRIS_FACTOR"] || DEFAULT_DEBRIS_FACTOR;
                    if (costs.length == 0) {
                        costs = fleetLost.map(a => a * factor)
                    } else {
                        for (const [i, value] of fleetLost.entries()) {
                            costs[i] = value * factor + costs[i]
                        }
                    }
                }
            }
        }
        return costs;
    }
    public getDefenderDebris(): number[] {
        let costs: number[] = [];
        for (const [idPlayer, player] of this.getDefendersLostUnits(!REPAIRED_DO_DEBRIS)) {
            for (const [idFleet, fleet] of player) {
                for (const [role, values] of fleet) {
                    let fleetLost: number[] = [];
                    for (const [idShipType, lost] of values) {
                        if (fleetLost.length == 0) {
                            fleetLost = lost
                        } else {
                            for (const [i, value] of fleetLost.entries()) {
                                fleetLost[i] = value + lost[i]
                            }
                        }
                    }
                    const factor = DEBRIS_FACTORS[role + "_DEBRIS_FACTOR"] || DEFAULT_DEBRIS_FACTOR;
                    if (costs.length == 0) {
                        costs = fleetLost.map(a => a * factor)
                    } else {
                        for (const [i, value] of fleetLost.entries()) {
                            costs[i] = value * factor + costs[i]
                        }
                    }
                }
            }
        }
        return costs;
    }
    public getDebris(): number[] {
        const aDebris = this.getAttackerDebris();
        const dDebris = this.getDefenderDebris();
        return aDebris.map((a, i) => a + dDebris[i]);
    }

    public getAttackersTech() {
        const techs = new Map();
        const players = this.getRound('START').getAfterBattleAttackers();
        for (const [id, player] of players) {
            techs.set(id, [player.getWeaponsTech(), player.getShieldsTech(), player.getArmourTech()])
        }
        return techs;
    }
    public getDefendersTech() {
        const techs = new Map();
        const players = this.getRound('START').getAfterBattleDefenders();
        for (const [id, player] of players) {
            techs.set(id, [player.getWeaponsTech(), player.getShieldsTech(), player.getArmourTech()])
        }
        return techs;
    }
    public getLastRoundNumber() {
        return this.roundsCount - 1;
    }
    /*
    public __toString() {
        ob_start();
        css = this.css;
        require(OPBEPATH. "views/report.html");
        return ob_get_clean();
    }
    */
    public getDefendersRepaired() {
        const defendersBefore = this.getRound('START').getAfterBattleDefenders();
        const defendersAfter = this.getRound('END').getAfterBattleDefenders();
        return this.getPlayerRepaired(defendersBefore, defendersAfter);
    }
    public getAttackersRepaired() {
        const attackersBefore = this.getRound('START').getAfterBattleAttackers();
        const attackersAfter = this.getRound('END').getAfterBattleAttackers();
        return this.getPlayerRepaired(attackersBefore, attackersAfter);
    }
    public getAfterBattleAttackers() {
        const players = this.getResultAttackersFleetOnRound('END').cloneMe();
        const playersRepaired = this.getAttackersRepaired();
        return this.getAfterBattlePlayerGroup(players, playersRepaired);
    }
    public getAfterBattleDefenders() {
        const players = this.getResultDefendersFleetOnRound('END').cloneMe();
        const playersRepaired = this.getDefendersRepaired();
        return this.getAfterBattlePlayerGroup(players, playersRepaired);
    }
    private getAfterBattlePlayerGroup(players: PlayerGroup, playersRepaired: PlayerGroup): PlayerGroup {
        for (const [idPlayer, player] of playersRepaired) {
            if (!players.existPlayer(idPlayer)) {
                players.addPlayer(player);
                continue
            }
            const endPlayer = players.getPlayer(idPlayer);
            for (const [idFleet, fleet] of player) {
                if (!endPlayer.existFleet(idFleet)) {
                    endPlayer.addFleet(fleet);
                    continue;
                }
                const endFleet = endPlayer.getFleet(idFleet);
                for (const [idShipType, shipType] of fleet) {
                    endFleet.addShipType(shipType);
                }
            }
        }
        return players;
    }

    private getPlayerRepaired(playersBefore: PlayerGroup, playersAfter: PlayerGroup): PlayerGroup {
        const lostShips = this.getPlayersLostShips(playersBefore, playersAfter);
        for (const [idPlayer, player] of lostShips) {
            for (const [idFleet, fleet] of player) {
                for (const [idShipType, shipType] of fleet) {
                    lostShips.decrement(idPlayer, idFleet, idShipType, Math.round(shipType.getCount() * (1 - shipType.getRepairProb())));
                }
            }
        }
        return lostShips;
    }
    private getPlayersLostShips(playersBefore: PlayerGroup, playersAfter: PlayerGroup) {
        let playersBefore_clone = playersBefore.cloneMe();

        for (const [idPlayer, playerAfter] of playersAfter) {
            for (const [idFleet, fleet] of playerAfter) {
                for (const [idShipType, shipType] of fleet) {
                    playersBefore_clone.decrement(idPlayer, idFleet, idShipType, shipType.getCount());
                }
            }
        }
        return playersBefore_clone;
    }
    public getAttackersId(): number[] {
        const array: number[] = [];
        for (const [id, group] of this.getPresentationAttackersFleetOnRound('START')) {
            array.push(id);
        }
        return array;
    }
    public getDefendersId(): number[] {
        const array: number[] = [];
        for (const [id, group] of this.getPresentationDefendersFleetOnRound('START')) {
            array.push(id);
        }
        return array;
    }
    public setSteal(array: number[]) {
        this.steal = array;
    }
    public getSteal() {
        return this.steal;
    }
}

export {BattleReport}