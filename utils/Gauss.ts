

/**
 * Gauss
 * conversion from php to ts done by scisneromam
 */

class Gauss
{
    /**
     * Random::getNext()
     * Return an random normal number
     * @return int 
     */
    public static getNext(): number
    {
        const x = Math.random();
        const y = Math.random();
        const u = Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);
        //v = sqrt(-2 * log(x)) * sin(2 * pi() * y);
        return u;
    }

    /**
     * Random::getNextMs()
     * Generates a random number from the normal distribution with specific mean and standard deviation
     * @param int m: mean
     * @param int s: standard deviation
     * @return int
     */
    public static getNextMs(m: number, s: number): number
    {
        return Gauss.getNext() * s + m;
    }

    /**
     * Random::getNextMsBetween()
     * Generates a random number from the normal distribution with specific mean and standard deviation.
     * The number must be between min and max.
     * @param int m: mean
     * @param int s: standard deviation
     * @param int min: the minimum
     * @param int max: the maximum
     * @return int
     */
    public static getNextMsBetween(m: number, s: number, min: number, max: number): number  
    {
        let i = 0;
        if (min > m || max < m)
        {
            throw new Error("Mean is not bounded by min and max");
        }
        while (true)
        {
            const n = Gauss.getNextMs(m, s);
            if (n >= min && n <= max)
            {
                return n;
            }
            i++;
            if (i > 10)
            {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        }
    }
}

/**

 * //--------------------------- testing -----------------------

 * //--------edit only these!----------
 * define('MEAN', 55);
 * define('DEV', sqrt(7));
 * define('SIMULATIONS', 1000);
 * //----------------------------------


 * a = array();
 * for (i = 0; i < SIMULATIONS; i++)
 * {
 *     a[] = Gauss::getNextMs(MEAN, DEV);
 * }

 * l = array();
 * foreach (a as v)
 * {
 *     if (isset(l[v]))
 *         l[v]++;
 *     else
 *         l[v] = 1;
 * }
 * ksort(l);
 * foreach (l as id => v)
 * {
 *     s = '';
 *     for (i = 0; i < v; i++)
 *     {
 *         s .= '-';
 *     }
 *     echo s . id . '(' . v . ')' . '<br>';
 * }
 */

export {Gauss}