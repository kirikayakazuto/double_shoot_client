import game_scene from "./game_scene"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    game_clt: game_scene = null;

    onLoad () {
        this.add_touch_listen();
    }
    init(game_clt: any) {
        this.game_clt = game_clt;
    }

    start () {

    }

    turn_to_direction(data) {
        data = parseInt(data);
        this.game_clt.turn_to_direction(data);
    }

    add_touch_listen() {
        this.node.getChildByName("left").on(cc.Node.EventType.TOUCH_START, () => {
            
            this.turn_to_direction(-1);
            this.node.getChildByName("left").scale = 1.3;
            
        }, this);
        this.node.getChildByName("right").on(cc.Node.EventType.TOUCH_START, () => {
            
            this.turn_to_direction(1);
            this.node.getChildByName("right").scale = 1.3;
        }, this);
        this.node.getChildByName("top").on(cc.Node.EventType.TOUCH_START, () => {
            this.turn_to_direction(2);
            this.node.getChildByName("top").scale = 1.3;
            
        }, this);





        this.node.getChildByName("left").on(cc.Node.EventType.TOUCH_END, () => {
            this.turn_to_direction(0);
            this.node.getChildByName("left").scale = 1.2;
            
        }, this);
        this.node.getChildByName("right").on(cc.Node.EventType.TOUCH_END, () => {
            this.turn_to_direction(0);
            this.node.getChildByName("right").scale = 1.2;
            
        }, this);
        this.node.getChildByName("top").on(cc.Node.EventType.TOUCH_END, () => {
            this.node.getChildByName("top").scale = 1.2;
        }, this);
        

        this.node.getChildByName("left").on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.turn_to_direction(0);
            this.node.getChildByName("left").scale = 1.2;
            
        }, this);
        this.node.getChildByName("right").on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.turn_to_direction(0);
            this.node.getChildByName("right").scale = 1.2;
            
        }, this);
        this.node.getChildByName("top").on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.node.getChildByName("top").scale = 1.2;

        }, this);
    }

    

    // update (dt) {}
}
