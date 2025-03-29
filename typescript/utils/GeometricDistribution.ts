

/**
 * GeometricDistribution
 * conversion from php to ts done by scisneromam
 */

abstract class GeometricDistribution
{
    /**
     * GeometricDistribution::getProbabilityFromMean()
     * 
     * @param int m: the mean
     * @return int
     */
    public static getProbabilityFromMean(m: number): number 
    {
        if (m <= 1 )
        {
            return 1;
        }
        return 1 / m;
    }

    /**
     * GeometricDistribution::getMeanFromProbability()
     * 
     * @param int p: the probability
     * @return int
     */
    public static getMeanFromProbability(p: number): number
    {
        if (p == 0)
        {
            return Infinity;
        }
        return 1 / p;
    }

    /**
     * GeometricDistribution::getVarianceFromProbability()
     * 
     * @param int p: the probability
     * @return int
     */
    public static getVarianceFromProbability(p: number): number
    {
        if (p == 0)
        {
            return Infinity;
        }
        return (1 - p) / (p * p);
    }
    
    /**
     * GeometricDistribution::getStandardDeviationFromProbability()
     * 
     * @param int p: the probability
     * @return int
     */
    public static getStandardDeviationFromProbability(p: number): number
    {
        return Math.sqrt(GeometricDistribution.getVarianceFromProbability(p));        
    }

}

export {GeometricDistribution}