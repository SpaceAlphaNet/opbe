import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";


class Fazi extends Test {
    setup() {
        let fleet = new Fleet(1, [ShipTypes.getShipType(205, 20), ShipTypes.getShipType(211, 30)]);
        let player = new Player(1, [fleet], 7, 6, 6);
        this.attackers = new PlayerGroup([player]);

        fleet = new Fleet(2, [ShipTypes.getShipType(401, 1), ShipTypes.getShipType(402, 2), ShipTypes.getShipType(403, 1), ShipTypes.getShipType(407, 1), ShipTypes.getShipType(408, 1)]);
        player = new Player(2, [fleet], 5, 5, 5);
        this.defenders = new PlayerGroup([player]);
    }
}
new Fazi().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);