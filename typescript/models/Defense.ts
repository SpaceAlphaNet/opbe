import {DEFENSE_REPAIR_PROB} from "../constants/battle_constants";
import {ShipType} from "./ShipType";

/**
 * Defense
 * conversion from php to ts done by scisneromam
 */
class Defense extends ShipType
{
    public getRepairProb()
    {
        return DEFENSE_REPAIR_PROB;
    }
}

export {Defense}

