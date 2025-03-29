import {FireManager} from "../combatObject/FireManager";
import {PhysicShot} from "../combatObject/PhysicShot";
import {ShipsCleaner} from "../combatObject/ShipsCleaner";
import {Fleet} from "./Fleet";
import {Player} from "./Player";


/**
 * PlayerGroup
 * conversion from php to ts done by scisneromam
 */
class PlayerGroup
{

    protected players: Map<number, Player> = new Map();
    public battleResult: number | undefined;
    private static id_count = 0;
    private id;

    public constructor(players: Iterable<Player> = [])
    {
        this.id = ++PlayerGroup.id_count;
        for (let player of players) {
            this.addPlayer(player)
        }
    }
    [Symbol.iterator] =  () => {
        return this.players[Symbol.iterator]();
    }
    public getId()
    {
        return this.id;
    }
    public decrement(idPlayer: number, idFleet: number, idShipType: number, count: number)
    {
        if (!this.existPlayer(idPlayer))
        {
            throw new Error('Player with id : ' + idPlayer + ' does not exist');
        }
        this.players.get(idPlayer)!!.decrement(idFleet, idShipType, count);
        if (this.players.get(idPlayer)!!.isEmpty())
        {
            this.players.delete(idPlayer);
        }
    }
    public getPlayer(id: number): Player
    {
        return this.players.get(id)!!
    }
    public existPlayer(id: number)
    {
        return this.players.has(id);
    }
    public addPlayer(player: Player)
    {
        this.players.set(player.getId(), player.cloneMe());//avoid collateral effects: when the object or array is an argument && it's saved in a structure
    }
    public createPlayerIfNotExist(id: number, fleets: Iterable<Fleet>, weaponsTech: number, shieldTech: number, defenceTech: number)
    {
        if (!this.existPlayer(id))
        {
            this.addPlayer(new Player(id, fleets, weaponsTech, shieldTech, defenceTech));
        }
        return this.getPlayer(id);
    }
    public isEmpty()
    {
        for (let [id, player] of this.players) {
            if (!player.isEmpty()) {
                return false;
            }
        }
        return true;
    }
    /*
    public __toString()
    {
        ob_start();
        _playerGroup = this;
        _st = "";
        require(OPBEPATH."views/playerGroup.html");
        return ob_get_clean();
    }
    */
    /**
     * 
     * @param fire 
     * @returns Map<playerId: number, Map<fleetId: number, Map<defenderShipTypeId: number, physicShots: PhysicShot[]>>>
     */
    public inflictDamage(fire: FireManager): Map<number, Map<number, Map<number, PhysicShot[]>>>
    {
        const physicShots: Map<number, Map<number, Map<number, PhysicShot[]>>> = new Map();
        for (const [id, player] of this.players) {
            const ps = player.inflictDamage(fire);
            physicShots.set(id, ps)
        }
        return physicShots;
    }
    /**
     * 
     * @returns Map<playerId, Map<fleetId: number, Map<shipTypeId: number, ShipsCleaner>>>
     */
    public cleanShips(): Map<number, Map<number, Map<number, ShipsCleaner>>>
    {
        const shipsCleaners = new Map();
        for (const [id, player] of this.players) {
            const sc = player.cleanShips();
            shipsCleaners.set(id, sc)
            if (player.isEmpty()) {
                this.players.delete(id);
            } 
        }
        return shipsCleaners;
    }
    public repairShields()
    {
        for (const [id, player] of this.players)
        {
            player.repairShields();
        }
    }
    /**
     * 
     * @returns Merges all Players into a single fleet
     */
    public getEquivalentFleetContent(): Fleet
    {
        const merged = new Fleet(-1);
        for (const [id, player] of this.players) // cloning don't have any sense because we don't touch the array,maybe php bug :(
        {
            merged.mergeFleet(player.getEquivalentFleetContent());
        }
        return merged;
    }
    public getTotalCount()
    {
        let amount = 0;
        for (const [id, player] of this.players)
        {
            amount += player.getTotalCount();
        }
        return amount;

    }
    /*
    public getFleet(idFleet)
    {
        foreach (this.array as idPlayer => player)
        {
            fleet = player.getFleet(idFleet);
            if (fleet !== false)
            {
                return fleet;
            }
        }
        return false;
    }
    */
    public cloneMe()
    {
        const tmp = new PlayerGroup(this.players.values());
        tmp.battleResult = this.battleResult;
        tmp.id = this.id;
        PlayerGroup.id_count--;
        return tmp;
    }


}

export {PlayerGroup}
