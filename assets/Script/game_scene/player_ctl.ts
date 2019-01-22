import game_scene from "./game_scene"
import playerSP_ctl from "./playerSp_ctl"
import map_ctl from "./map_ctl"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    
    @property(playerSP_ctl)
    playerSP_ctl: playerSP_ctl = null;
    @property(cc.Prefab)
    runArms: cc.Prefab = null;
    @property(cc.Prefab)
    reciveRunArms: cc.Prefab = null;
    @property(map_ctl)
    map_ctl: map_ctl = null;

    @property(Number)
    player_speed = 100;
    @property(Number)
    jump_speed = 550;
    @property(Number)
    futou_speed = 50;

    @property(Number)
    gravity = 100;

    @property(Number)
    friction = 100;


    has_arms = true;    // 玩家是否拥有武器

    ridybody: cc.RigidBody = null;  // 刚体组件

    game_ctl: game_scene = null;

    run_arms: cc.Node = null;   // 运动中的斧头

    status = 0; // 0, 站在原地, -1向左移动中, 1, 向右移动中, 2 跳跃状态

    turn_dir = 1;   // 1表示朝向是右

    can_jump = false;   // 是否可以跳跃

    can_recycle = false;    // 是否可以回收斧头
    can_shoot = true;       // 是否可以发射斧头
    // LIFE-CYCLE CALLBACKS:

    init(game_ctl) {
        this.game_ctl = game_ctl;
    }

    onLoad () {
        this.ridybody = this.node.getComponent(cc.RigidBody);
        this.ridybody.gravityScale = this.gravity;
        
    }

    start () {
        
    }

    recycle_flag = false;

    // 点击发射按钮
    shoot_button_click() {
        // 判断手上是否有斧头
        if(this.has_arms) { //有斧头, 发射斧头
            this._shoot_futou();
            this.has_arms = false;
            this.recycle_flag = true;
        }else if(!this.has_arms && this.recycle_flag){             // 没有斧头, 并且 只能点击一次
            this.recycle_flag = false;
            this._recycle_futou();
        }
    }

    /**
     * 发射斧头
     */
    _shoot_futou() {
        this.playerSP_ctl.hide_armSp();
        let node = cc.instantiate(this.runArms);
        node["status"] = 1; // 1表示扔出去的, 2表示收回来的
        node["who"] = "self";
        let rigidBody = node.getComponent(cc.RigidBody);
        let v = rigidBody.linearVelocity;
        let p = this.playerSP_ctl.get_jiantou_rotation();
        v.x = p.x * this.turn_dir;
        v.y = p.y;
        rigidBody.linearVelocity = v;
        node.parent = this.node.parent;
        node.x = this.node.x;
        node.y = this.node.y;
    }
    /**
     * 回收斧头
     */
    _recycle_futou() {
        let self_stop_arms = this.map_ctl.get_who_stop_arms("self");
        let pos = self_stop_arms.position;
        self_stop_arms.removeFromParent();
        let node = cc.instantiate(this.reciveRunArms);
        node["status"] = 2; // 1表示扔出去的, 2表示收回来的
        node.parent = this.node.parent;
        node.x = pos.x;
        node.y = pos.y;
        this.set_run_arms(node);        
    }
    /**
     * 设置 
     * @param node 
     */
    set_run_arms(node: cc.Node) {
        this.run_arms = node;
        this.can_recycle = true;
    }
    /**
     * 回收斧头成功
     */
    recyle_futou_success() {
        this.run_arms.removeFromParent();
        this.run_arms = null;
        this.playerSP_ctl.show_armSp();
        this.can_recycle = false;

        this.has_arms = true;
    }

    

    /**
     * ---------------------------------- 碰撞事件处理 ---------------------------------
     */
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {
        if(selfCollider.tag == 11 && otherCollider.tag == 0) {
            this.can_jump = true;
            // 玩家触地
            if(this.status == 0) {
                this.playerSP_ctl._play_player_anim_by_index( 0);
            }else if(this.status  == -1 || this.status == 1) {
                this.playerSP_ctl._play_player_anim_by_index( 1);
            }
            
        }
    }

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider){
    }


    /**
     * ---------------------------------------------- end ---------------------
     */
    

    /**
     * 玩家站在原地不动
     */
    player_turn_stand() {
        this.status = 0;    // 

        let v = this.ridybody.linearVelocity;
        v.x = 0;
        this.ridybody.linearVelocity = v;
        
        this.playerSP_ctl._play_player_anim_by_index( 0);
    }
    /**
     * 玩家 向左移动
     */
    player_turn_left() {
        this.status = -1;    // 
        this.turn_dir = -1;

        this.playerSP_ctl.node.scaleX = -1;
        let v = this.ridybody.linearVelocity;
        v.x = -this.player_speed;
        this.ridybody.linearVelocity = v;

        this.playerSP_ctl._play_player_anim_by_index( 1);
    }
    /**
     * 玩家 向右移动
     */
    player_turn_right() {
        this.status = 1;
        this.turn_dir = 1;
        
        this.playerSP_ctl.node.scaleX = 1;
        let v = this.ridybody.linearVelocity;
        v.x = this.player_speed;
        this.ridybody.linearVelocity = v;

        this.playerSP_ctl._play_player_anim_by_index( 1);
    }
    /**
     * 玩家上跳
     */
    player_turn_top() {
        // 判断玩家是否站在地面上
        if(!this.can_jump) {
            return ;
        }
        this.can_jump = false;
        // this.status = 2;

        let v = this.ridybody.linearVelocity;
        v.y = this.jump_speed;
        this.ridybody.linearVelocity = v;

        this.playerSP_ctl._play_player_anim_by_index( 2);
    }

    /**
     * 设置run_arms的位置
     * @param dt 
     */
    set_run_arms_position(dt: number) {
        let psub = cc.pSub(this.run_arms.position, this.node.position);
        let len = Math.sqrt(psub.x * psub.x + psub.y * psub.y);
        if(Math.abs(psub.x) < 50 && Math.abs(psub.y) < 50) {
            this.recyle_futou_success();
            return ;
        }
        this.run_arms.x += -psub.x/len * this.futou_speed * dt;
        this.run_arms.y += -psub.y/len * this.futou_speed * dt;
    }

    update (dt) {
        if(this.can_recycle) {
            this.set_run_arms_position(dt);
        }
    }
}
