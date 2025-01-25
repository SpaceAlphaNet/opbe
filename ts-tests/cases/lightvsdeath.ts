import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class lightvsdeath extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(204, 1111)]);
        let player = new Player(1, [fleet],10,10,10);
        this.attackers = new PlayerGroup([player]);
    
        fleet = new Fleet(2,[ShipTypes.getShipType(209, 11),ShipTypes.getShipType(214, 1)]);
        player = new Player(2, [fleet],11,11,11);
        this.defenders = new PlayerGroup([player]);
    }
}
new lightvsdeath().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);
