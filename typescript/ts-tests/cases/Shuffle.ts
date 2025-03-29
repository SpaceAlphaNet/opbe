import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class Shuffle extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(206, 50),ShipTypes.getShipType(207, 50),ShipTypes.getShipType(204, 150)]);
        let player = new Player(1, [fleet]);
        this.attackers = new PlayerGroup([player]);
    
        fleet = new Fleet(2,[ShipTypes.getShipType(210, 150),ShipTypes.getShipType(215, 50),ShipTypes.getShipType(207, 20)]);
        player = new Player(2, [fleet]);
        this.defenders = new PlayerGroup([player]);
    }
}
new Shuffle().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

