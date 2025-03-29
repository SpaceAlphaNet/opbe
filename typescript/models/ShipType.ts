

/**
 * ShipType
 * conversion from php to ts done by scisneromam
 */

import {PhysicShot} from "../combatObject/PhysicShot";
import {ShipsCleaner} from "../combatObject/ShipsCleaner";
import {COST_TO_ARMOUR, WEAPONS_TECH_INCREMENT_FACTOR, SHIELDS_TECH_INCREMENT_FACTOR, ARMOUR_TECH_INCREMENT_FACTOR, SHIELD_CELLS, EPSILON} from "../constants/battle_constants";
import {Type} from "./Type";

class ShipType extends Type {

    private originalPower: number;
    private originalShield: number;

    private singleShield: number;
    private singleLife: number;
    private singlePower: number;

    private fullShield: number = 0;
    private fullLife: number = 0;
    private fullPower: number = 0;

    protected currentShield: number = 0;
    protected currentLife: number = 0;


    private weapons_tech: number = 0;
    private shields_tech: number = 0;
    private armour_tech: number = 0;

    private rf: Map<number, number>;
    protected lastShots: number;
    protected lastShipHit: number;
    private cost: number[];

    /**
     * ShipType::__construct()
     * 
     * @param int id
     * @param int count
     * @param Map<number, number> rf
     * @param int shield
     * @param number[] cost
     * @param int power
     * @param int weapons_tech
     * @param int shields_tech
     * @param int armour_tech
     * @return
     */
    public constructor(id: number, count: number, rf: Map<number, number> | RfMap, shield: number, cost: number[], power: number, weapons_tech: number | null = null, shields_tech: number | null = null, armour_tech: number | null = null) {
        super(id, 0);
        if (rf instanceof Map) {
            this.rf = rf
        } else {
            this.rf = new Map()
            for (let [k, v] of Object.entries(rf)) {
                this.rf.set(+k, v)
            }
        }
        this.lastShots = 0;
        this.lastShipHit = 0;
        this.cost = cost;

        this.originalShield = shield;
        this.originalPower = power;

        this.singleShield = shield;
        this.singleLife = COST_TO_ARMOUR * cost.reduce(function (a, b) {return a + b;}, 0); //sums cost
        this.singlePower = power;

        this.increment(count);
        this.setWeaponsTech(weapons_tech);
        this.setArmourTech(armour_tech);
        this.setShieldsTech(shields_tech);
    }


    /**
     * ShipType::setWeaponsTech()
     * Set new weapon techs level.
     * @param int level
     * @return void
     */
    public setWeaponsTech(level: number | string | null) {
        if (!level || !Number(level))
            return;
        level = Number(level);
        const diff = level - this.weapons_tech;
        if (diff < 0)
            throw new Error('Trying to decrease tech');
        this.weapons_tech = level;
        const incr = 1 + WEAPONS_TECH_INCREMENT_FACTOR * diff;
        this.singlePower *= incr;
        this.fullPower *= incr;
    }


    /**
     * ShipType::setShieldsTech()
     * Set new shield techs level.
     * @param int level
     * @return void
     */
    public setShieldsTech(level: number | string | null) {
        if (!level || !Number(level))
            return;
        level = Number(level);
        const diff = level - this.shields_tech;
        if (diff < 0)
            throw new Error('Trying to decrease tech');
        this.shields_tech = level;
        const incr = 1 + SHIELDS_TECH_INCREMENT_FACTOR * diff;
        this.singleShield *= incr;
        this.fullShield *= incr;
        this.currentShield *= incr;
    }


    /**
     * ShipType::setArmourTech()
     * Set new armour techs level
     * @param int level
     * @return void
     */
    public setArmourTech(level: number | string | null) {
        if (!level || !Number(level))
            return;
        
        level = Number(level);
        const diff = level - this.armour_tech;
        if (diff < 0)
            throw new Error('Trying to decrease tech');
        this.armour_tech = level;
        const incr = 1 + ARMOUR_TECH_INCREMENT_FACTOR * diff;
        this.singleLife *= incr;
        this.fullLife *= incr;
        this.currentLife *= incr;
        
    }


    /**
     * ShipType::increment()
     * Increment the amount of ships of this type.
     * @param int number : the amount of ships to add.
     * @param mixed newLife : the life of new ships added, default = full health
     * @param mixed newShield : the shield of new ships added, default = full shield
     * @return void
     */
    public increment(number: number, newLife: number | null = null, newShield: number | null = null) {
        super.increment(number);
        
        if (newLife == null) {
            newLife = this.singleLife;
        }
        if (newShield == null) {
            newShield = this.singleShield;
        }
        this.fullLife += this.singleLife * number;
        this.fullPower += this.singlePower * number;
        this.fullShield += this.singleShield * number;

        this.currentLife += newLife!! * number;
        this.currentShield += newShield!! * number;
    }


    /**
     * ShipType::decrement()
     * Decrement the amount of ships of this type.
     * @param int number : the amount of ships to be removed. 
     * @param mixed remainLife : the life of removed ships, default = full health
     * @param mixed remainShield : the shield of removed ships, default = full shield
     * @return void
     */
    public decrement(number: number, remainLife: number | null = null, remainShield: number | null = null) {
        super.decrement(number);
        
        if (remainLife == null) {
            remainLife = this.singleLife;
        }
        if (remainShield == null) {
            remainShield = this.singleShield;
        }
        this.fullLife -= this.singleLife * number;
        this.fullPower -= this.singlePower * number;
        this.fullShield -= this.singleShield * number;

        this.currentLife -= remainLife!! * number;
        this.currentShield -= remainShield!! * number;
        
    }


    /**
     * ShipType::setCount()
     * Set the amount of ships of this type.
     * @param int number : the amount of ships.
     * @param mixed life : the life of ships, default = full health
     * @param mixed shield : the life of ships, default = full health
     * @return void
     */
    public setCount(number: number, life: number | null = null, shield: number | null = null) {
        super.setCount(number);
        const diff = number - this.getCount();
        if (diff > 0) {
            this.increment(diff, life, shield);
        }
        else if (diff < 0) {
            this.decrement(diff, life, shield);
        }
    }


    /**
     * ShipType::getCost()
     * Get the array of cost to build this type of ship.
     * @return array
     */
    public getCost() {
        return this.cost;
    }


    /**
     * ShipType::getWeaponsTech()
     * Get the level of current weapon tech.
     * @return int
     */
    public getWeaponsTech() {
        return this.weapons_tech;
    }


    /**
     * ShipType::getShieldsTech()
     * Get the level of current shield tech.
     * @return int
     */
    public getShieldsTech() {
        return this.shields_tech;
    }


    /**
     * ShipType::getArmourTech()
     * Get the level of current armour tech.
     * @return int
     */
    public getArmourTech() {
        return this.armour_tech;
    }


    /**
     * ShipType::getRfTo()
     * Get the propability of this shipType to shot again given shipType
     * @param ShipType other
     * @return int
     */
    public getRfTo(other: ShipType): number {
        if (this.rf.has(other.getId())) {
            return this.rf.get(other.getId())!!
        }
        return 0;
    }


    /**
     * ShipType::getRF()
     * Get an array of rapid fire
     * @return Map<id, rapidfire_count>
     */
    public getRF(): Map<number, number> {
        return this.rf;
    }


    /**
     * ShipType::getShield()
     * Get the shield value of a single ship of this type. 
     * @return int
     */
    public getShield() {
        return this.singleShield;
    }


    /**
     * ShipType::getShieldCellValue()
     * Get the shield cell value of a single ship of this type.
     * @return int
     */
    public getShieldCellValue() {
        if (this.isShieldDisabled()) {
            return 0;
        }
        return this.singleShield / SHIELD_CELLS;
    }


    /**
     * ShipType::getHull()
     * Get the hull value of a single ship of this type. 
     * @return int
     */
    public getHull() {
        return this.singleLife;
    }


    /**
     * ShipType::getPower()
     * Get the power value of a single ship of this type.
     * @return int
     */
    public getPower() {
        return this.singlePower;
    }


    /**
     * ShipType::getCurrentShield()
     * Get the current shield value of a all ships of this type.
     * @return int
     */
    public getCurrentShield() {
        return this.currentShield;
    }


    /**
     * ShipType::getCurrentLife()
     * Get the current hull value of a all ships of this type.
     * @return int
     */
    public getCurrentLife() {
        return this.currentLife;
    }


    /**
     * ShipType::getCurrentPower()
     * Get the current attack power value of a all ships of this type.
     * @return int
     */
    public getCurrentPower() {
        return this.fullPower;
    }


    /**
     * ShipType::inflictDamage()
     * Inflict damage to all ships of this type.
     * @param int damage
     * @param int shotsToThisShipType
     * @return void
     */
    public inflictDamage(damage: number, shotsToThisShipType: number) {
        if (shotsToThisShipType == 0)
            return;
        if (shotsToThisShipType < 0)
            throw new Error("Negative amount of shotsToThisShipType!");

        

        
        const pre_life = this.currentLife
        const pre_shield = this.currentShield
        //log_var('Defender single hull', this.singleLife);
        //log_var('Defender count', this.getCount());
        //log_var('currentShield before', this.currentShield);
        //log_var('currentLife before', this.currentLife);

        this.lastShots += shotsToThisShipType;
        const ps = new PhysicShot(this, damage, shotsToThisShipType);
        ps.start();
        //log_var('ps.getAssorbedDamage()', ps.getAssorbedDamage());
        this.currentShield -= ps.getAbsorbedDamage();
        if (this.currentShield < 0 && this.currentShield > -EPSILON) {
            //log_comment('fixing double number currentshield');
            this.currentShield = 0;
        }
        this.currentLife -= ps.getHullDamage();
        if (this.currentLife < 0 && this.currentLife > -EPSILON) {
            //log_comment('fixing double number currentlife');
            this.currentLife = 0;
        }
        
        //log_var('currentShield after', this.currentShield);
        //log_var('currentLife after', this.currentLife);
        this.lastShipHit += ps.getHitShips();
        //log_var('lastShipHit after', this.lastShipHit);
        //log_var('lastShots after', this.lastShots);

        if (this.currentLife < 0) {
            throw new Error('Negative currentLife! ' + this.currentLife + "/" + (-EPSILON) + "|" + pre_life + " " + damage);
        }
        if (this.currentShield < 0) {
            throw new Error('Negative currentShield!' + this.currentShield+ "/" + (-EPSILON) + "|" + pre_shield + " " + damage);
        }
        if (this.lastShipHit < 0) {
            throw new Error('Negative lastShipHit!' + this.lastShipHit);
        }
        return ps; //for web
    }


    /**
     * ShipType::cleanShips()
     * Start the task of explosion system.
     * @return ShipsCleaner
     */
    public cleanShips() {
        //log_var('lastShipHit after', this.lastShipHit);
        //log_var('lastShots after', this.lastShots);
        //log_var('currentLife before', this.currentLife);

        const sc = new ShipsCleaner(this, this.lastShipHit, this.lastShots);
        sc.start();
        this.decrement(sc.getExplodedShips(), sc.getRemainLife(), 0);
        this.lastShipHit = 0;
        this.lastShots = 0;
        //log_var('currentLife after', this.currentLife);
        return sc;
    }


    /**
     * ShipType::repairShields()
     * Repair all shields.
     * @return void
     */
    public repairShields() {
        this.currentShield = this.fullShield;
    }


    /**
     * ShipType::__toString()
     * 
     * @return null
     */
    /*
    public __toString() {
        return = parent:: __toString();
        //return .= "hull:" . this.hull . "<br>Shield:" . this.shield . "<br>CurrentLife:" . this.currentLife . "<br>CurrentShield:" . this.currentShield;
        return return;
    }
    */


    /**
     * ShipType::isShieldDisabled()
     * Return true if the current shield of each ships are almost zero.
     * @return boolean
     */
    public isShieldDisabled() {
        return this.currentShield / this.getCount() < 0.01;
    }

    /**
     * ShipType::getRepairProb()
     * Returns the probability for ship repairs
     * @returns number
     */
    public getRepairProb() {
        return 0;
    }


    /**
     * ShipType::cloneMe()
     * 
     * @return ShipType
     */
    public cloneMe(): ShipType {
        
        const tmp: ShipType = Reflect.construct(Object.getPrototypeOf(this).constructor, [this.getId(), this.getCount(), this.rf, this.originalShield, this.cost, this.originalPower, this.weapons_tech, this.shields_tech, this.armour_tech])
        tmp.currentShield = this.currentShield;
        tmp.currentLife = this.currentLife;
        tmp.lastShots = this.lastShots;
        tmp.lastShipHit = this.lastShipHit;
        
        
        return tmp;
    }
}


export {ShipType}