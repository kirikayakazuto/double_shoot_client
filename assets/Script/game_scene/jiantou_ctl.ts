
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(Number)
    dir = -1;
    @property(Number)
    speed = 10;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init() {
        // 初始化箭头样式
    }

    start () {

    }
    set_shoot_rotation(dir: number, dt) {
        this.node.rotation += this.speed * dt * dir;
    }

    update (dt) {
        if(this.node.rotation <= -30) {
            this.dir = 1;
        }else if(this.node.rotation >= 120) {
            this.dir = -1;
        }
        this.set_shoot_rotation(this.dir, dt);
    }
}
