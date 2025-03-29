import {Fire} from "../combatObject/Fire";
import {FireManager} from "../combatObject/FireManager";
import {PhysicShot} from "../combatObject/PhysicShot";
import {ShipsCleaner} from "../combatObject/ShipsCleaner";
import {PlayerGroup} from "../models/PlayerGroup";

/**
 * Round
 * conversion from php to ts done by scisneromam
 * 
 * This class rappresent the round in a battle.
 * When it is started, the PlayerGroup objects inside it will be updated.
 * Then, this class offers some methods to retrive informations about the round and the updated players.
 */
class Round {
    private attackers: PlayerGroup; // PlayerGroup attackers, will be updated when round start
    private defenders: PlayerGroup; // PlayerGroup defenders, will be updated when round start

    private fire_attackers: FireManager; // a fire manager that rappresent all fires from attackers to defenders
    private fire_defenders: FireManager; // a fire manager that rappresent all fires from defenders to attackers

    private physicShotsToDefenders!: Map<number, Map<number, Map<number, PhysicShot[]>>>;
    private physicShotsToAttachers!: Map<number, Map<number, Map<number, PhysicShot[]>>>;

    private attackerShipsCleaner!: Map<number, Map<number, Map<number, ShipsCleaner>>>;
    private defenderShipsCleaner!: Map<number, Map<number, Map<number, ShipsCleaner>>>;

    private number; // this round number

    /**
     * Round::__construct()
     * Construct a new Round object. No side effects.
     * @param PlayerGroup: the attackers
     * @param PlayerGroup: the defenders
     * @param int: the round number 
     * @return void
     */
    public constructor(attackers: PlayerGroup, defenders: PlayerGroup, number: number) {
        this.number = number;
        this.fire_attackers = new FireManager();
        this.fire_defenders = new FireManager();

        this.attackers = attackers.cloneMe();
        this.defenders = defenders.cloneMe();
    }

    /**
     * Round::startRound()
     * Start the current round and update the players instance inside this object.
     * @return
     */
    public startRound() {
        //echo '--- Round ' . this.number . ' ---<br><br>';
        //---------------------- Generating the fire -------------------------------//
        //note that we don't need to check the order of fire, because we will order when splitting the fire later

        // here we add to fire manager each fire shotted from an attacker's ShipType to all defenders 
        const defendersMerged = this.defenders.getEquivalentFleetContent();

        for (const [playerId, player] of this.attackers) {
            for (const [fleetID, fleet] of player) {
                for (const [shipTypeId, shipType] of fleet) {
                    this.fire_attackers.add(new Fire(shipType, defendersMerged))
                }
            }
        }
        // here we add to fire manager each fire shotted from an defender's ShipType to all attackers
        const attackersMerged = this.attackers.getEquivalentFleetContent();
        for (const [playerId, player] of this.defenders) {
            for (const [fleetID, fleet] of player) {
                for (const [shipTypeId, shipType] of fleet) {
                    this.fire_defenders.add(new Fire(shipType, attackersMerged))
                }
            }
        }
        //--------------------------------------------------------------------------//

        //------------------------- Sending the fire -------------------------------//
        //echo "***** firing to defenders *****<br>";
        this.physicShotsToDefenders = this.defenders.inflictDamage(this.fire_attackers);
        //echo "***** firing to attackers *****<br>";
        this.physicShotsToAttachers = this.attackers.inflictDamage(this.fire_defenders);
        //--------------------------------------------------------------------------//

        //------------------------- Cleaning ships ---------------------------------//
        this.defenderShipsCleaner = this.defenders.cleanShips();
        this.attackerShipsCleaner = this.attackers.cleanShips();
        //--------------------------------------------------------------------------//

        //------------------------- Repairing shields ------------------------------//
        this.defenders.repairShields();
        this.attackers.repairShields();
        //--------------------------------------------------------------------------//
    }

    /**
     * Round::getAttackersFire()
     * Return the FireManager of the attacker
     * @return FireManager: attacker
     */
    public getAttackersFire() {
        return this.fire_attackers;
    }

    /**
     * Round::getDefendersFire()
     * Return the FireManager of the defender
     * @return FireManager: defender
     */
    public getDefendersFire() {
        return this.fire_defenders;
    }

    /**
     * Round::getAttachersPhysicShots()
     * Return an array of attacker PhysicShots (multidimensional)
     * @return array
     */
    public getAttackersPhysicShots() {
        return this.physicShotsToDefenders;
    }

    /**
     * Round::getDefendersPhysicShots()
     * Return an array of defender PhysicShots (multidimensional)
     * @return array
     */
    public getDefendersPhysicShots() {
        return this.physicShotsToAttachers;
    }

    /**
     * Round::getAttachersShipsCleaner()
     * Return an array of attacker ShipsCleaner (multidimensional)
     * @return array
     */
    public getAttachersShipsCleaner() {
        return this.attackerShipsCleaner;
    }

    /**
     * Round::getDefendersShipsCleaner()
     * Return an array of defender ShipsCleaner (multidimensional)
     * @return array
     */
    public getDefendersShipsCleaner() {
        return this.defenderShipsCleaner;
    }

    /**
     * Round::getAfterBattleAttackers()
     * Return the attackers after the round.
     * @return PlayerGroup: attackers
     */
    public getAfterBattleAttackers() {
        return this.attackers;
    }

    /**
     * Round::getAfterBattleDefenders()
     * Return the defenders after the round.
     * @return PlayerGroup: defenders
     */
    public getAfterBattleDefenders() {
        return this.defenders;
    }

    /**
     * Round::__toString()
     * An html rappresentation of this object
     * @return string
     */
    /*
    public __toString()
    {
        ob_start();
        _round = this;
        _i = this.number;
        require(OPBEPATH."views/round.html");
        return ob_get_clean();
    }
    */

    /**
     * Round::getNumber()
     * Return this round number
     * @return int: number
     */
    public getNumber() {
        return this.number;
    }

    public getAttackersFirePower() {
        return this.getAttackersFire().getAttackerTotalFire();
    }
    public getAttackersFireCount() {
        return this.getAttackersFire().getAttackerTotalShots();
    }
    public getDefendersFirePower() {
        return this.getDefendersFire().getAttackerTotalFire();
    }
    public getDefendersFireCount() {
        return this.getDefendersFire().getAttackerTotalShots();
    }
    public getAttackersAbsorbedDamage() {
        const playerGroupPS = this.getDefendersPhysicShots();
        return this.getPlayersAbsorbedDamage(playerGroupPS);
    }
    public getDefendersAbsorbedDamage() {
        const playerGroupPS = this.getAttackersPhysicShots();
        return this.getPlayersAbsorbedDamage(playerGroupPS);
    }
    private getPlayersAbsorbedDamage(playerGroupPS: Map<number, Map<number, Map<number, PhysicShot[]>>>) {
        if (!playerGroupPS) {
            return 0;
        }
        let ass = 0;
        for (let [_, playerPs] of playerGroupPS) {
            for (let [_, fleetPS] of playerPs) {
                for (let [_, typeDPS] of fleetPS) {
                    for (let typeAPS of typeDPS) {
                        ass += typeAPS.getAbsorbedDamage();
                    }
                }
            }
        }
        return ass;
    }
}

export {Round}