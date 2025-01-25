import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class RcVsHf extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(205, 30)]);
        let player = new Player(1, [fleet]);
        this.attackers = new PlayerGroup([player]);
    
        fleet = new Fleet(2,[ShipTypes.getShipType(209, 30)]);
        player = new Player(2, [fleet]);
        this.defenders = new PlayerGroup([player]);
    }
}
new RcVsHf().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

