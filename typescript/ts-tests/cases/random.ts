import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";



class Random extends Test {
  setup() {
    let fleetCount = Math.floor(Math.random() * 4 + 2) //between 2 and 5
    let fleetId = 1;
    let keys = Array.from(ShipTypes.shipTypes.keys());
    let fleets = []
    for (let i = 0; i< fleetCount; i++) {
      let typeCount = Math.floor(Math.random() * 4 + 2)
      let ships = []
      for (let j = 0; j < typeCount; j++) {
        let typeId = keys[Math.floor(Math.random() * keys.length)]
        let shipCount = Math.floor(Math.random() * 31 + 20) //between 50 and 20
        ships.push(ShipTypes.getShipType(typeId, shipCount))
      }
      fleets.push(new Fleet(fleetId++, ships))
    }
    let player = new Player(1, fleets);
    this.attackers = new PlayerGroup([player]);

    fleets = []
    for (let i = 0; i< fleetCount; i++) {
      let typeCount = Math.floor(Math.random() * 4 + 2)
      let ships = []
      for (let j = 0; j < typeCount; j++) {
        let typeId = keys[Math.floor(Math.random() * keys.length)]
        let shipCount = Math.floor(Math.random() * 31 + 20) //between 50 and 20
        ships.push(ShipTypes.getShipType(typeId, shipCount))
      }
      fleets.push(new Fleet(fleetId++, ships))
    }
    player = new Player(2, fleets);
    this.defenders = new PlayerGroup([player]);
  }
}
new Random().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

