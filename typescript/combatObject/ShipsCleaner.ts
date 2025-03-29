import {threadId} from "worker_threads";
import {USE_BIEXPLOSION_SYSTEM, PROB_TO_REAL_MAGIC, MIN_PROB_TO_EXPLODE, USE_EXPLODED_LIMITATION} from "../constants/battle_constants";
import {ShipType} from "../models/ShipType";


/**
 * ShipsCleaner
 * conversion from php to ts done by scisneromam
 */
class ShipsCleaner
{
    //private shipType;
    private lastShipHit: number;
    private lastShots: number;
    private fighters: ShipType

    private exploded!: number;
    private remainLife!: number;
    /**
     * ShipsCleaner::__construct()
     * 
     * @param mixed shipType
     * @param int lastShipHit
     * @param int lastShot
     * @return ShipsCleaner
     */
    public constructor(shipType: ShipType, lastShipHit: number, lastShots: number)
    {
        if (lastShipHit < 0)
            throw new Error('Negative lastShipHit');
        if (lastShots < 0)
            throw new Error('Negative lastShots');
        this.fighters = shipType.cloneMe();
        this.lastShipHit = lastShipHit;
        this.lastShots = lastShots;
    }
    /**
     * ShipsCleaner::start()
     * Start the system
     * @return null
     */
    public start()
    {
        /*** calculating probability to explode ***/

        //the mean probably to explode based on damage
        let prob = 1 - this.fighters.getCurrentLife() / (this.fighters.getHull() * this.fighters.getCount());
        if (prob < 0 && prob > -Number.EPSILON)
        {
            prob = 0;
        }
        if (prob < 0)
        {
            throw new Error("Negative prob");
        }
        //if most of ships are hitten,then we can apply the more realistic way
        let probToExplode;
        if (USE_BIEXPLOSION_SYSTEM && this.lastShipHit >= this.fighters.getCount() / PROB_TO_REAL_MAGIC)
        {
            //log_comment('lastShipHit bigger than getCount()/magic');
            if (prob < MIN_PROB_TO_EXPLODE)
            {
                probToExplode = 0;
            }
            else
            {
                probToExplode = prob;
            }
        }
        //otherwise  statistically:
        else
        {
            //log_comment('lastShipHit smaller than getCount()/magic');
            probToExplode = prob * (1 - MIN_PROB_TO_EXPLODE);
        }


        /*** calculating the amount of exploded ships ***/

        let theoreticExploded = Math.round(this.fighters.getCount() * probToExplode);
        if (USE_EXPLODED_LIMITATION)
        {
            theoreticExploded = Math.min(theoreticExploded, this.lastShots);
        }
        this.exploded = theoreticExploded; //bounded by the total shots fired to simulate a real combat :)


        /*** calculating the life of destroyed ships ***/

        //this.remainLife = this.exploded * (1 - prob) * (this.fighters.getCurrentLife() / this.fighters.getCount());
        this.remainLife = this.fighters.getCurrentLife() / this.fighters.getCount();
        //log_var('prob',prob);
        //log_var('probToExplode',probToExplode);
        //log_var('teoricExploded',theoreticExploded);
        //log_var('exploded',this.exploded);
        //log_var('remainLife',this.remainLife);
    }
    /**
     * ShipsCleaner::getExplodeShips()
     * Return the number of exploded ships
     * @return int
     */
    public getExplodedShips()
    {
        if(!this.exploded) {
            return 0;
        }
        return this.exploded;
    }
    /**
     * ShipsCleaner::getRemainLife()
     * Return the life of exploded ships
     * @return float
     */
    public getRemainLife()
    {
        return this.remainLife;
    }

}

export {ShipsCleaner}