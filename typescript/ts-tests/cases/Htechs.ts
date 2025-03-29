import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class Htechs extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(207, 400)]);
        let player = new Player(1, [fleet],16,16,16);
        this.attackers = new PlayerGroup([player]);
    
        fleet = new Fleet(2,[ShipTypes.getShipType(215, 300)]);
        player = new Player(2, [fleet],16,16,16);
        this.defenders = new PlayerGroup([player]);
    }
}
new Htechs().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);


