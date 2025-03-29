import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class CrusherVsSpy extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(206, 150)]);
        let player = new Player(1, [fleet]);
        this.attackers = new PlayerGroup([player]);
    
        fleet = new Fleet(2,[ShipTypes.getShipType(210, 1250)]);
        player = new Player(2, [fleet]);
        this.defenders = new PlayerGroup([player]);
    }
}
new CrusherVsSpy().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

