import frame_anim from "../common/frame_anim"
const {ccclass, property} = cc._decorator;
/**
 * 控制player结点下的图片动画
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    jiantou: cc.Node = null;
    @property(cc.Node)
    armsSp: cc.Node = null;
    @property(Number)
    shoot_speed = 1000;

    playerSpArray: Array<frame_anim> = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerSpArray = this.node.getChildByName("playerSp").getComponents(frame_anim);
    }

    start () {
        this.playerSpArray[0].play_loop();
    }

    hide_armSp() {
        this.armsSp.active = false;
    }
    show_armSp() {
        this.armsSp.active = true;
    }

    get_jiantou_rotation() {
        let v = cc.p(0, 0);
        v.y = Math.sin(-(this.jiantou.rotation - 90) * 0.017453293) * this.shoot_speed;
        v.x = Math.cos(-(this.jiantou.rotation - 90) * 0.017453293) * this.shoot_speed;
        return v;
    }

    /**
     * 播放某一个动画
     * @param index 
     */
    _play_player_anim_by_index(index: number) {
        if(this.playerSpArray[2].is_playing) {
            return ;
        }
        for(let i=0; i<this.playerSpArray.length; i++) {
            if(i == index) {
                continue;
            }
            this.playerSpArray[i].no_play_anim();
        }
        if(!this.playerSpArray[index].is_playing) {
            if(index == 2) {
                this.playerSpArray[index].play_once(null);
            }else {
                this.playerSpArray[index].play_loop();
            }
        }
        
    }

    // update (dt) {}
}
