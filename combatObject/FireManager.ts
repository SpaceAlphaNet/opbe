import {Fire} from "./Fire"

/**
 * FireManager
 * conversion from php to ts done by scisneromam
 *  
 */
class FireManager {
    protected array: Fire[] = [];
    public add(fire: Fire) {
        this.array.push(fire);
    }
    public getAttackerTotalShots() {
        let tmp = 0;
        for (let fire of this.array) {
            tmp += fire.getAttackerTotalShots()
        }
        return tmp;
    }
    public getAttackerTotalFire() {
        let tmp = 0;
        for (let fire of this.array) {
            tmp += fire.getAttackerTotalFire()
        }
        return tmp;
    }
    [Symbol.iterator]() {
        return this.array[Symbol.iterator]();
    }

}

export {FireManager}