import {MOON_MIN_START_SIZE, MOON_MIN_FACTOR, MOON_MAX_START_SIZE, MOON_MAX_FACTOR} from "../constants/battle_constants";

/**
 * Events
 * conversion from php to ts done by scisneromam
 */
abstract class Events
{

    public static event_moon(moonProb: number)
    {
        const SizeMin = MOON_MIN_START_SIZE + (moonProb * MOON_MIN_FACTOR);
        const SizeMax = MOON_MAX_START_SIZE + (moonProb * MOON_MAX_FACTOR);
        const size = Math.floor(Math.random() * (SizeMax - SizeMin + 1) + SizeMin)
        const fields = Math.floor(Math.pow(size / 1000, 2));
        return {size: size, fields: fields}
    }
}

export {Events}