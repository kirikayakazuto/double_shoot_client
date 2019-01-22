
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    
    @property(Number)
    gravity = 100;


    @property([cc.Prefab])
    stop_arms: Array<cc.Prefab> = [];

    self_stop_arms: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    /**
     * 获取地上的斧头
     */
    get_who_stop_arms(who: string) {
        if(who == "self") {
            return this.self_stop_arms;
        }
        return null;
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {
        
        if(otherCollider.tag == 22) {  // 打在了墙上
            
            // 显示墙上的斧头
            let pos = otherCollider.node.position;
            // 判断斧头是否可以碰撞
            let node = cc.instantiate(this.stop_arms[1])
            node.x = pos.x;
            node.y = pos.y -6;
            node.parent = otherCollider.node.parent;

            if(otherCollider.node["who"] == "self") {
                this.self_stop_arms = node;
            }

            otherCollider.node.removeFromParent();
        }
    }

    

    // update (dt) {}
}
