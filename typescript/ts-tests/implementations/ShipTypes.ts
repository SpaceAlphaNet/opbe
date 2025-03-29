import {Defense} from "../../models/Defense";
import {Ship} from "../../models/Ship";
import {ShipType} from "../../models/ShipType";

class ShipTypes {

  static shipTypes: Map<number, ShipType> = new Map()

  /*
  $rf = self::$CombatCaps[$id]['sd'];
  $shield = self::$CombatCaps[$id]['shield'];
  $cost = array(self::$pricelist[$id]['metal'], self::$pricelist[$id]['crystal']);
  $power = self::$CombatCaps[$id]['attack'];
  if (in_array($id, self::$reslist['fleet']))
  {
      return new Ship($id, $count, $rf, $shield, $cost, $power);
  }
  return new Defense($id, $count, $rf, $shield, $cost, $power);
  SHIPS:
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  209,
  210,
  211,
  212,
  213,
  214,
  215,
  216,
  217
  */

  static {
    this.shipTypes.set(207, new Ship(207, 0, new Map([[210, 5], [212, 5]]), 200, [45_000, 15_000], 1000))
    this.shipTypes.set(215, new Ship(215, 0, new Map([[202, 3], [203, 3], [205, 4], [206, 4], [207, 7], [210, 5], [212, 5], [217, 2]]), 400, [30_000, 40_000], 700))
    this.shipTypes.set(202, new Ship(202, 0, new Map([[202, 3], [203, 3], [205, 4], [206, 4], [207, 7], [210, 5], [212, 5], [217, 2]]), 10, [2000, 2000], 5))
    this.shipTypes.set(203, new Ship(203, 0, new Map([[210, 5], [212, 5]]), 25, [6000, 6000], 5))
    this.shipTypes.set(204, new Ship(204, 0, new Map([[204, 6], [210, 5], [212, 5], [401, 10]]), 50, [3000, 1000], 400))
    this.shipTypes.set(205, new Ship(205, 0, new Map([[202, 3], [203, 3], [205, 4], [206, 4], [207, 7], [210, 5], [212, 5], [217, 2]]), 15, [6000, 4000], 150))
    this.shipTypes.set(206, new Ship(206, 0, new Map([[204, 6], [210, 5], [212, 5], [401, 10]]), 10, [20000, 7000], 50))
    this.shipTypes.set(209, new Ship(209, 0, new Map([[210, 5], [212, 5]]), 10, [10000, 6000], 1))
    this.shipTypes.set(210, new Ship(210, 0, new Map([]), 0, [0, 1000], 0))
    this.shipTypes.set(211, new Ship(211, 0, new Map([[202, 3], [203, 3], [205, 4], [206, 4], [207, 7], [210, 5], [212, 5], [217, 2]]), 500, [50000, 25000], 1000))
    this.shipTypes.set(214, new Ship(214, 0, new Map([[202, 3], [203, 3], [205, 4], [206, 4], [207, 7], [210, 5], [212, 5], [217, 2]]), 50000, [0, 2000], 200000))
    this.shipTypes.set(401, new Defense(401, 0, new Map([[210, 5]]), 20, [2000, 0], 80))
    this.shipTypes.set(402, new Defense(402, 0, new Map([[210, 5]]), 25, [1500, 500], 100))
    this.shipTypes.set(403, new Defense(403, 0, new Map([[210, 5]]), 100, [6000, 2000], 250))
    this.shipTypes.set(404, new Defense(404, 0, new Map([[210, 5]]), 200, [20000, 15000], 1100))
    this.shipTypes.set(405, new Defense(405, 0, new Map([[210, 5]]), 500, [2000, 6000], 150))
    this.shipTypes.set(407, new Defense(407, 0, new Map([[210, 5]]), 2000, [10000, 10000], 1))
    this.shipTypes.set(408, new Defense(408, 0, new Map([[210, 5]]), 10000, [50000, 50000], 1))
    this.shipTypes.set(409, new Defense(409, 0, new Map([[210, 5]]), 1000000, [10000000, 5000000], 10000))

  }

  static getShipType(id: number, count: number): ShipType {
    if (!ShipTypes.shipTypes.has(id)) {
      throw new Error("Missing ShipType id! " + id)
    }
    const ship = ShipTypes.shipTypes.get(id)!!.cloneMe()
    ship.increment(count)
    return ship;
  }

}


export {ShipTypes}