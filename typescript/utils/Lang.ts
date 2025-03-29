

interface Lang {
    getShipName(id: number): string;
    getAttackersAttackingDescr(amount: number, damage: number): string;
    getDefendersDefendingDescr(damage: number): string;
    getDefendersAttackingDescr(amount: number, damage: number): string;
    getAttackersDefendingDescr(damage: number): string;
    getAttackerHasWon(): string;
    getDefendersHasWon(): string;
    getDraw(): string;
    getStoleDescr(metal: number, crystal: number, deuterium: number): string;
    getAttackersLostUnits(units: number): string;
    getDefendersLostUnits(units: number): string;
    getFloatingDebris(metal: number, crystal: number): string;
    getMoonProb(prob: number): string;
    getNewMoon(): string;
}