import {GeometricDistribution} from "../utils/GeometricDistribution";
import {Gauss} from "../utils/Gauss";
import { MAX_RF_BUFF, MAX_RF_NERF, USE_RANDOMIC_RF, USE_RF } from "../constants/battle_constants";
import {Fleet} from "../models/Fleet";
import {ShipType} from "../models/ShipType";

/**
 *
 * Fire
 * conversion from php to ts done by scisneromam
 *  
 * This class rappresent the fire shotted by attackers to defenders or viceversa.
 * Using probabilistic theory, this class will help you in RF(Rapid Fire) calculation with O(1) time and memory functions.
 * Sometime i think that SpeedSim's RF calculation is bugged, so you can choose if return its result or not setting "SPEEDSIM" constant to true/false.
 */
class Fire {
    private attackerShipType: ShipType;
    private defenderFleet: Fleet;

    /* old way
    const SPEEDSIM = true;
    const RAPIDFIRE = true;
    private shots = null;
    private power = null;
    */

    private shots = 0;
    private power = 0;

    /**
     * Fire::__construct()
     * 
     * @param ShipType attackerShipType
     * @param Fleet defenderFleet
     * @param bool attacking
     * @return
     */
    public constructor(attackerShipType: ShipType, defenderFleet: Fleet) {
        //log_comment('calculating fire from attacker '.attackerShipType.getId());
        this.attackerShipType = attackerShipType;
        this.defenderFleet = defenderFleet;
        this.calculateTotal();
    }
    public getPower() {
        return this.attackerShipType.getPower();
    }
    public getId() {
        return this.attackerShipType.getId();
    }
    //----------- SENDED FIRE -------------

    /**
     * Fire::getAttackerTotalFire()
     * Return the total fire
     * @return int
     */
    public getAttackerTotalFire() {
        return this.power;
    }

    /**
     * Fire::getAttackerTotalShots()
     * Return the total shots
     * @return int
     */
    public getAttackerTotalShots() {
        return this.shots;
    }

    /**
     * Fire::calculateTotal()
     * Calculate the total power and shots amount of attacker, including RF and standart fire
     * @return void
     */
    private calculateTotal() {
        this.shots += this.attackerShipType.getCount();
        this.power += this.getNormalPower();

        if (USE_RF) {
            this.calculateRf();
        }
        //log_var('this->shots', this.shots);
        /*  old way
        this->shots = 0;
        this->power = 0;          
        if (self::RAPIDFIRE)
        {
        this->calculateRf();
        }
        if (!self::SPEEDSIM || !self::RAPIDFIRE)
        {
        this->shots += this->attackerShipType->getCount();
        this->power += this->getNormalPower();
        }
        */
    }

    /**
     * Fire::calculateRf()
     * This function implement the RF component of above function
     * @return void
     */
    private calculateRf() {
        //rapid fire
        let tmpshots = Math.round(this.getShotsFromOneAttackerShipOfType(this.attackerShipType) * this.attackerShipType.getCount());
        //log_var('tmpshots', tmpshots);
        this.power += tmpshots * this.attackerShipType.getPower();
        this.shots += tmpshots;

        /* old way
        tmpshots = round(this->getShotsFromOneAttackerShipOfType(this->attackerShipType) * this->attackerShipType->getCount());
        if (self::SPEEDSIM && tmpshots == 0)
        {
        tmpshots = this->attackerShipType->getCount();
        }
        this->power += tmpshots * this->attackerShipType->getPower();
        this->shots += tmpshots;
        */
    }

    /**
     * Fire::getShotsFromOneAttackerShipOfType()
     * This function return the number of shots caused by RF from one ShipType to all defenders
     * @param ShipType shipType_A
     * @return int
     */
    private getShotsFromOneAttackerShipOfType(shipType_Attacker: ShipType) {
        const p = this.getProbabilityToShotAgainForAttackerShipOfType(shipType_Attacker);
        const meanShots = GeometricDistribution.getMeanFromProbability(1 - p) - 1;
        if (USE_RANDOMIC_RF) {
            const max = meanShots * (1 + MAX_RF_BUFF);
            const min = meanShots * (1 - MAX_RF_NERF);
            //log_var('max', max);
            //log_var('min', min);
            //log_var('mean', meanShots);
            return Gauss.getNextMsBetween(meanShots, GeometricDistribution.getStandardDeviationFromProbability(1 - p), min, max);
        }
        return meanShots;
    }

    /**
     * Fire::getProbabilityToShotAgainForAttackerShipOfType()
     * This function return the probability of a ShipType to shot thanks RF
     * @param ShipType shipType_A
     * @return int
     */
    private getProbabilityToShotAgainForAttackerShipOfType(shipType_Attacker: ShipType) {
        let p = 0;
        for (const [id, shipType_Defender] of this.defenderFleet)
        {
            const RF = shipType_Attacker.getRfTo(shipType_Defender);
            const probabilityToShotAgain = 1 - GeometricDistribution.getProbabilityFromMean(RF);
            const probabilityToHitThisType = shipType_Defender.getCount() / this.defenderFleet.getTotalCount();
            p += probabilityToShotAgain * probabilityToHitThisType;
        }
        return p;

        /* old way
        p = 0;
        foreach (this->defenderFleet->getIterator() as idFleet => shipType_D)
        {
        RF = shipType_A->getRfTo(shipType_D);
        if (!self::SPEEDSIM)
        {
        RF = max(0, RF - 1);
        }
        probabilityToShotAgain = (RF != 0) ? 1 - GeometricDistribution::getProbabilityFromMean(RF) : 0;
        probabilityToHitThisType = shipType_D->getCount() / this->defenderFleet->getTotalCount();
        p += probabilityToShotAgain * probabilityToHitThisType;
        }
        return p;
        */
    }

    /**
     * Fire::getNormalPower()
     * Return the total fire shotted from attacker ShipType to all defenders without RF
     * @return int
     */
    private getNormalPower() {
        return this.attackerShipType.getCurrentPower();
    }
    //------- INCOMING FIRE------------

    public getShotsFiredByAttackerTypeToDefenderType(shipType_A: ShipType, shipType_D: ShipType): number {
        const first = this.getShotsFiredByAttackerToOne(shipType_A);
        const second = shipType_D.getCount();
        return first * second;
    }
    public getShotsFiredByAttackerToOne(shipType_A: ShipType): number {
        const num = this.getShotsFiredByAttackerToAll(shipType_A);
        const denum = this.defenderFleet.getTotalCount();
        return num / denum;
    }
    public getShotsFiredByAllToDefenderType(shipType_D: ShipType): number {
        const first = this.getShotsFiredByAllToOne();
        const second = shipType_D.getCount();
        return first * second;
    }
    public getShotsFiredByAttackerToAll(shipType_A: ShipType): number {
        const num = this.getAttackerTotalShots() * shipType_A.getCount();
        const denum = this.attackerShipType.getTotalCount(); //TODO check if correct getTotalCount was not implemented for ShipType
        return num / denum;
    }
    public getShotsFiredByAllToOne(): number {
        const num = this.getAttackerTotalShots();
        const denum = this.defenderFleet.getTotalCount();
        return num / denum;
    }
    /**
     * Fire::__toString()
     * Rappresentation of this object
     * @return
     */
    /*
    public __toString() {
        #global resource;
        #        shots = this.getAttackerTotalShots();
        #        power = this.getAttackerTotalFire();
        #        iter = this.attackerShipType.getIterator();
        #        page = "<center><table bgcolor='#ADC9F4' border='1' ><body><tr><tr><td colspan='".count(iter). "'><center><font color='red'>Attackers</font></center></td></tr>";
        #        foreach(iter as attacher)
        #            page.= "<td>".resource[attacher.getId()]. "</td>";
        #        page.= "</tr><tr>";
        #        foreach(iter as attacher)
        #            page.= "<td><center>".attacher.getCount(). "</center></td>";
        #        iter = this.defenderFleet.getIterator();
        #        page.= "</tr></body></table><br><table bgcolor='#ADC9F4' border='1'><body><tr><td colspan='".count(iter). "'><center><font color='red'>Defenders</font></center></td></tr></tr>";
        #        foreach(iter as defender)
        #            page.= "<td>".resource[defender.getId()]. "</td>";
        #        page.= "<tr>";
        #        foreach(iter as defender)
        #            page.= "<td><center>".defender.getCount(). "</center></td>";
        #        page.= "</tr></body></table><br>";
        #        page.= "The attacking fleet fires a total of shots times with the power of power upon the defenders.<br>";
        #        page.= "</center>";
        #        return page;
        return this.getAttackerTotalFire(). '';
    }
    */
    public cloneMe() {
        return new Fire(this.attackerShipType, this.defenderFleet);
    }

}


export {Fire}