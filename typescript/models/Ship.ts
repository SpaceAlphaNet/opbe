import {SHIP_REPAIR_PROB} from "../constants/battle_constants";
import {ShipType} from "./ShipType";

/**
 * Ship
 * conversion from php to ts done by scisneromam
 */
class Ship extends ShipType
{
    public getRepairProb()
    {
        return SHIP_REPAIR_PROB;
    }
}

export {Ship}
