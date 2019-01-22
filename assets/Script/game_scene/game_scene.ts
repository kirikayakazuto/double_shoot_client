import turn_button from "./turn_button"
import player_ctl from "./player_ctl"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(turn_button)
    turn_button: turn_button = null;

    @property(player_ctl)
    player_ctl: player_ctl = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        cc.director.getPhysicsManager().enabled = true;  
    }




    start () {
        this.turn_button.init(this);
        this.player_ctl.init(this);
    }
    /**
     * 玩家移动
     */
    turn_to_direction(index: number) {
        switch(index) {
            case 0:
                this.player_ctl.player_turn_stand();
            break;
            case -1:
                this.player_ctl.player_turn_left();
            break;
            case 1:
                this.player_ctl.player_turn_right();   
            break;
            case 2:
                this.player_ctl.player_turn_top();
            break;
        }
    }
    

   

    // update (dt) {}
}
