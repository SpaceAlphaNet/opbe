import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class LowAmount extends Test {
    setup() {
        let fleet = new Fleet(1, [ShipTypes.getShipType(202, 1), ShipTypes.getShipType(203, 1), ShipTypes.getShipType(204, 1), ShipTypes.getShipType(205, 1)]);
        let player = new Player(1, [fleet]);
        this.attackers = new PlayerGroup([player]);

        fleet = new Fleet(2, [ShipTypes.getShipType(401, 1), ShipTypes.getShipType(402, 1), ShipTypes.getShipType(403, 1), ShipTypes.getShipType(404, 1), ShipTypes.getShipType(405, 1), ShipTypes.getShipType(409, 1)]);
        player = new Player(2, [fleet]);
        this.defenders = new PlayerGroup([player]);
    }
}
new LowAmount().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);