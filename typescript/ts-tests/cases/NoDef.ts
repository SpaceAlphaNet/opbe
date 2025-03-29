import {Fleet} from "../../models/Fleet";
import {Player} from "../../models/Player";
import {PlayerGroup} from "../../models/PlayerGroup";
import {ShipTypes} from "../implementations/ShipTypes";
import {Test} from "../test";

class NoDef extends Test
{
    setup() {
        let fleet = new Fleet(1,[ShipTypes.getShipType(207, 50)]);
        let player = new Player(1, [fleet]);
        this.attackers = new PlayerGroup([player]);
    
        player = new Player(2, []);
        this.defenders = new PlayerGroup([player]);
    }
}
new NoDef().benchmark(process.argv.length > 2 ? Number(process.argv[2]) || 1 : 1);

