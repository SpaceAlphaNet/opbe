import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";


/**
 * you need to increase the max ram of the nodeprocess
 */
class HugeAmount extends Test {
  setup() {
    let playerCount = 5
    let fleetCount = 10
    let fleetId = 1;
    let playerId = 1;
    let keys = Array.from(ShipTypes.shipTypes.keys());
    let players = []
    let shipCount = 1_000_000 //1 million ships
    for (let k = 0; k < playerCount; k++) {
      let fleets = []
      for (let i = 0; i< fleetCount; i++) {
        let ships = []
        for (let j = 0; j < keys.length; j++) {
          let typeId = keys[j]
          ships.push(ShipTypes.getShipType(typeId, shipCount))
        }
        fleets.push(new Fleet(fleetId++, ships))
      }
      players.push(new Player(playerId++, fleets));
    }
    this.attackers = new PlayerGroup(players);

    players = []
    for (let k = 0; k < playerCount; k++) {
      let fleets = []
      for (let i = 0; i< fleetCount; i++) {
        let ships = []
        for (let j = 0; j < keys.length; j++) {
          let typeId = keys[j]
          ships.push(ShipTypes.getShipType(typeId, shipCount))
        }
        fleets.push(new Fleet(fleetId++, ships))
      }
      players.push(new Player(playerId++, fleets));
    }
    this.defenders = new PlayerGroup(players);
  }
}
new HugeAmount().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

