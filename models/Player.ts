import {FireManager} from "../combatObject/FireManager";
import {PhysicShot} from "../combatObject/PhysicShot";
import {ShipsCleaner} from "../combatObject/ShipsCleaner";
import {Fleet} from "./Fleet";


/**
 * Player
 * conversion from php to ts done by scisneromam
 */
class Player {
    private id;
    protected fleets: Map<number, Fleet> = new Map();

    private weapons_tech = 0;
    private shields_tech = 0;
    private armour_tech = 0;
    private name;

    public constructor(id: number, fleets: Iterable<Fleet> | null = null, weapons_tech: number | null = null, shields_tech: number | null = null, armour_tech: number | null = null, name = "") {
        this.id = id;
        this.name = name;
        this.setTech(weapons_tech, shields_tech, armour_tech);
        if (fleets) {
            for (const fleet of fleets) {
                this.addFleet(fleet);
            }
        }
    }
    [Symbol.iterator] = () => {
        return this.fleets[Symbol.iterator]();
    }

    public getName() {
        return this.name;
    }
    public setName(name: string) {
        this.name = name;
        for (const [id, fleet] of this.fleets) {
            fleet.setName(name);
        }
    }
    public addFleet(fleet: Fleet) {
        fleet = fleet.cloneMe();
        fleet.setTech(this.weapons_tech, this.shields_tech, this.armour_tech);
        fleet.setName(this.name);
        this.fleets.set(fleet.getId(), fleet); //avoid collateral effects: when the object or array is an argument && it's saved in a structure
    }
    public setTech(weapons: number | null = null, shields: number | null = null, armour: number | null = null) {
        for (const [id, fleet] of this.fleets) {
            fleet.setTech(weapons, shields, armour)
        }
        if (weapons) {
            this.weapons_tech = Math.floor(Number(weapons)) || this.weapons_tech
        }
        if (shields) {
            this.shields_tech = Math.floor(Number(shields)) || this.shields_tech
        }
        if (armour) {
            this.armour_tech = Math.floor(Number(armour)) || this.armour_tech
        }
    }
    public getId() {
        return this.id;
    }
    public decrement(idFleet: number, idShipType: number, count: number) {
        
        this.fleets.get(idFleet)!!.decrement(idShipType, count);
        if (this.fleets.get(idFleet)!!.isEmpty()) {
            this.fleets.delete(idFleet);
        }
    }
    public getWeaponsTech() {
        return this.weapons_tech;
    }
    public getShieldsTech() {
        return this.shields_tech;
    }
    public getArmourTech() {
        return this.armour_tech;
    }
    public getFleet(id: number) {
        return this.fleets.get(id)!!;
    }
    public existFleet(idFleet: number) {
        return this.fleets.has(idFleet);
    }
    public isEmpty() {
        for (const [id, fleet] of this.fleets) {
            if (!fleet.isEmpty()) {
                return false;
            }
        }
        return true;
    }
    /*
    public __toString() {
        ob_start();
        _player = this;
        _st = "";
        require(OPBEPATH."views/player2.html");
        return ob_get_clean();
    }
    */
    /**
     * 
     * @param fire 
     * @returns Map<fleetId: number, Map<defenderShipTypeId: number, physicShots: PhysicShot[]>>
     */
    public inflictDamage(fire: FireManager): Map<number, Map<number, PhysicShot[]>> {
        const physicShots: Map<number, Map<number, PhysicShot[]>> = new Map();
        for (const [id, fleet] of this.fleets) {
            const ps = fleet.inflictDamage(fire);
            physicShots.set(id, ps);
        }
        return physicShots;
    }
    /**
     * 
     * @returns Map<fleetId: number, Map<shipTypeId: number, ShipsCleaner>>
     */
    public cleanShips(): Map<number, Map<number, ShipsCleaner>> {
        const shipsCleaners: Map<number, Map<number, ShipsCleaner>> = new Map();
        for (const [id, fleet] of this.fleets) {
            const sc = fleet.cleanShips();
            shipsCleaners.set(id, sc);
            //original line: shipsCleaners[this.getId()] = sc; but im pretty sure it should be fleet id not player id
            if (fleet.isEmpty()) {
                this.fleets.delete(id);
            }
        }
        return shipsCleaners;
    }
    public repairShields() {
        for (let [id, fleet] of this.fleets) {
            fleet.repairShields();
        }
    }
    /**
     * Merges all fleets into a single one
     * @returns Merged fleet
     */
    public getEquivalentFleetContent(): Fleet {
        const merged = new Fleet(-1);
        for (let [id, fleet] of this.fleets) {
            merged.mergeFleet(fleet);
        }
        return merged;
    }

    public addDefense(fleetDefender: Fleet) {
        fleetDefender = fleetDefender.cloneMe();
        fleetDefender.setTech(this.weapons_tech, this.shields_tech, this.armour_tech);
        if (this.fleets.has(fleetDefender.getId())) {
            this.fleets.get(fleetDefender.getId())!!.mergeFleet(fleetDefender);
        } else if (this.fleets.size == 0) {
            this.fleets.set(fleetDefender.getId(), fleetDefender);
        } else {
            //merge into first fleet (idk why)
            const id = this.fleets.keys().next().value!!
            this.fleets.get(id)!!.mergeFleet(fleetDefender)
        }
    }

    public mergePlayerFleets(player: Player) {
        for (const [id, fleet] of player) {
            //TODO determine if override is intendet
            this.fleets.set(id, fleet.cloneMe());
        }
    }
    public getTotalCount() {
        let amount = 0;
        for (let [id, fleet] of this.fleets) {
            
            
            
            amount += fleet.getTotalCount();
        }
        return amount;

    }
    public cloneMe(): Player {
        return new Player(this.id, this.fleets.values(), this.weapons_tech, this.shields_tech, this.armour_tech, this.name);
    }
}

export {Player}
