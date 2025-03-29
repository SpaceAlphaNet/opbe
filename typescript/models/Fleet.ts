import {FireManager} from "../combatObject/FireManager";
import {PhysicShot} from "../combatObject/PhysicShot";
import {ShipsCleaner} from "../combatObject/ShipsCleaner";
import {ShipType} from "./ShipType";


/**
 * Defense
 * conversion from php to ts done by scisneromam
 */
class Fleet //extends IterableUtil
{
    protected shipTypes: Map<number, ShipType> = new Map();
    private count;
    private id;
    // added but only used in report templates
    private weapons_tech = 0;
    private shields_tech = 0;
    private armour_tech = 0;
    private name;
    public constructor(id: number, shipTypes: Iterable<ShipType> | null = null, weapons_tech = null, shields_tech = null, armour_tech = null, name = "") {
        
        this.id = id;
        this.count = 0;
        this.name = name;
        if (this.id != -1) {
            this.setTech(weapons_tech, shields_tech, armour_tech);
        }
        if (shipTypes) {
            for (let shipType of shipTypes) {
                this.addShipType(shipType)
            }
        }
    }

    [Symbol.iterator] = () => {
        return this.shipTypes[Symbol.iterator]();
    }


    public getName() {
        return this.name;
    }
    public setName(name: string) {
        this.name = name;
    }
    public getId() {
        return this.id;
    }
    public setTech(weapons: number | string | null = null, shields: number | string | null = null, armour: number | string | null = null) {
        for (let [id, shipType] of this.shipTypes) {
            shipType.setWeaponsTech(weapons);
            shipType.setShieldsTech(shields);
            shipType.setArmourTech(armour);
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
    public addShipType(shipType: ShipType) {
        if (this.shipTypes.has(shipType.getId())) {
            this.shipTypes.get(shipType.getId())!!.increment(shipType.getCount());
        }
        else {
            shipType = shipType.cloneMe();//avoid collateral effects
            if (this.id != -1) {
                shipType.setWeaponsTech(this.weapons_tech);
                shipType.setShieldsTech(this.shields_tech);
                shipType.setArmourTech(this.armour_tech);
            }
            this.shipTypes.set(shipType.getId(), shipType);
        }
        this.count += shipType.getCount();
    }
    public decrement(id: number, count: number) {
        if (!this.shipTypes.has(id)) {
            return;
        }
        this.shipTypes.get(id)!!.decrement(count);
        
        this.count -= count;
        if (this.shipTypes.get(id)!!.getCount() <= 0) {
            this.shipTypes.delete(id)
        }
    }
    public mergeFleet(other: Fleet) {
        for (const [id, shipType] of other) {
            this.addShipType(shipType)
        }
    }
    public getShipType(id: number): ShipType {
        return this.shipTypes.get(id)!!;
    }
    public existShipType(id: number) {
        return this.shipTypes.has(id);
    }
    public getTypeCount(type: number) {
        return this.shipTypes.get(type)!!.getCount();
    }
    public getTotalCount() {
        
        return this.count;
    }
    /*
    public __toString() {
        ob_start();
        _fleet = this;
        _st = "";
        require(OPBEPATH."views/fleet.html");
        return ob_get_clean();
    }
        */
    /**
     * 
     * @param fires 
     * @returns Map<defenderShipTypeId: number, physicShots: PhysicShot[]>
     */
    public inflictDamage(fires: FireManager): Map<number, PhysicShot[]> {
        const physicShots: Map<number, PhysicShot[]> = new Map();
        //doesn't matter who shot first, but who receive first the damage
        for (let fire of fires) {
            const tmp: Map<number, number> = new Map();
            for (let [defenderId, defenderShipType] of this.shipTypes) {
                const attackerId = fire.getId();
                const xs = fire.getShotsFiredByAllToDefenderType(defenderShipType)
                const ps = defenderShipType.inflictDamage(fire.getPower(), Math.floor(xs))
                tmp.set(defenderId, xs % 1) //extract decimal portion
                if (ps) {
                    if (!physicShots.has(defenderId)) {
                        physicShots.set(defenderId, [])
                    }
                    physicShots.get(defenderId)!!.push(ps)
                }
            }

            //assign last shot the the more likely shipType
            let m = 0;
            let f = 0;
            for (let [k, v] of tmp) {
                if (v > m) {
                    f = k;
                }
            }
            if (f != 0) {
                const ps = this.getShipType(f).inflictDamage(fire.getPower(), 1);
                if (ps) {
                    if (!physicShots.has(f)) {
                        physicShots.set(f, [])
                    }
                    physicShots.get(f)!!.push(ps)
                }
            }
        }
        return physicShots;
    }


    public cleanShips(): Map<number, ShipsCleaner> {
        const shipsCleaners = new Map();
        for (let [id, shipType] of this.shipTypes) {
            const sc = shipType.cleanShips();
            
            this.count -= sc.getExplodedShips();
            if (shipType.isEmpty()) {
                this.shipTypes.delete(id)
            }
            shipsCleaners.set(id, sc)
        }
        return shipsCleaners;
    }
    public repairShields() {
        for (let [id, shipType_Defender] of this.shipTypes) {
            shipType_Defender.repairShields();
        }
    }
    public isEmpty() {
        for (let [id, shipType_Defender] of this.shipTypes) {
            if (!shipType_Defender.isEmpty()) {
                return false;
            }
        }
        return true;
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
    public cloneMe(): Fleet {
        const tmp: Fleet = Reflect.construct(Object.getPrototypeOf(this).constructor, [this.id, this.shipTypes.values(), this.weapons_tech, this.shields_tech, this.armour_tech]);
        return tmp
    }
}

export {Fleet}