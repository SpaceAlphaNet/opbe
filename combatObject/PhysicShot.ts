import {USE_HITSHIP_LIMITATION} from "../constants/battle_constants";
import {ShipType} from "../models/ShipType";

/**
 * PhysicShot
 * conversion from php to ts done by scisneromam
 */
class PhysicShot
{
    //private shipType;
    private damage : number;
    private count: number;
    private fighters: ShipType;

    private absorbedDamage: number = 0;
    private bouncedDamage: number = 0;
    private hullDamage: number = 0;
    private cellDestroyed: number = 0;


    /**
     * PhysicShot::__construct()
     * 
     * @param ShipType shipType
     * @param int damage
     * @param int count
     * @return
     */
    public constructor(shipType: ShipType, damage: number, count: number)
    {
        //log_var('damage', damage);
        //log_var('count', count);
        if (damage < 0)
            throw new Error('Negative damage');
        if (count < 0)
            throw new Error('Negative amount of shots');
        this.fighters = shipType.cloneMe();
        this.damage = damage;
        this.count = count;
    }


    /**
     * PhysicShot::getAssorbedDamage()
     * Return the damage assorbed by shield
     * @return float
     */
    public getAbsorbedDamage(cell = false)
    {
        return this.absorbedDamage;
    }


    /**
     * PhysicShot::getBouncedDamage()
     * Return the bounced damage
     * @return float
     */
    public getBouncedDamage()
    {
        return this.bouncedDamage;
    }


    /**
     * PhysicShot::getHullDamage()
     * Return the damage assorbed by hull
     * @return float
     */
    public getHullDamage()
    {
        return this.hullDamage;
    }


    /**
     * PhysicShot::getPureDamage()
     * Return the total amount of damage from enemy
     * @return int
     */
    public getPureDamage()
    {
        return this.damage * this.count;
    }


    /**
     * PhysicShot::getHitShips()
     * Return the number of hitten ships.
     * @return
     */
    public getHitShips()
    {
        return Math.min(this.count, this.fighters.getCount());
    }


    /**
     * PhysicShot::start()
     * Start the system
     * @return
     */
    public start()
    {     
        this.bounce();
        this.absorb();
        this.inflict();
    }
    
    
    /**
     * PhysicShot::bounce()
     * If the shield is disabled, then bounced damaged is zero.
     * If the damage is exactly a multipler of the needed to destroy one shield's cell then bounced damage is zero. 
     * If damage is more than shield,then bounced damage is zero.
     * 
     * @param int currentCellsCount
     * @param int cellsDestroyedInOneShot
     * @param float bouncedDamageForOneShot
     * @return null
     */
    private bounce()
    {
        const count = this.count;
        const damage = this.damage;
        const shieldCellValue = this.fighters.getShieldCellValue();
        const unbouncedDamage = this.clamp(damage, shieldCellValue);
        this.bouncedDamage = (damage - unbouncedDamage) * count;
    }

    /**
     * PhysicShot::assorb()
     * If the shield is disabled, then assorbed damaged is zero.
     * If the total damage is more than shield, than the assorbed damage should equal the shield value.
     * @param int currentCellsCount
     * @param int cellsDestroyedInOneShot
     * @return null
     */
    private absorb()
    {
        const count = this.count;
        const damage = this.damage;
        const shieldCellValue = this.fighters.getShieldCellValue();
        const unbouncedDamage = this.clamp(damage, shieldCellValue);
        let currentShield = this.fighters.getCurrentShield();
        if (USE_HITSHIP_LIMITATION)
        {
            currentShield = currentShield * this.getHitShips() / this.fighters.getCount();
        }
        this.absorbedDamage = Math.min(unbouncedDamage * count, currentShield);
    }

    /**
     * PhysicShot::inflict()
     * HullDamage should be more than zero and less than shiplife.
     * Expecially, it should be less than the life of hitten ships.
     * @return null
     */
    private inflict()
    {
        let hullDamage = this.getPureDamage() - this.absorbedDamage - this.bouncedDamage;
        hullDamage = Math.min(hullDamage, this.fighters.getCurrentLife() * this.getHitShips() / this.fighters.getCount());
        this.hullDamage = Math.max(0, hullDamage);
    }

    /**
     * PhysicShot2::clamp()
     * Return a if greater than b, zero otherwise
     * @param mixed a
     * @param mixed b
     * @return mized
     */
    private clamp(a: number, b: number)
    {
        if (a > b)
        {
            return a;
        }
        return 0;
    }

}

export {PhysicShot}
