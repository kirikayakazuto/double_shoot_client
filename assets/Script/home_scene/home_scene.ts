import ugame from "../ugame";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    head_img: cc.Node = null;

    @property(cc.Label)
    nameNick: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initUserInfo();
    }

    start () {

    }
    /**
     * 初始化玩家信息
     */
    initUserInfo() {
        this.load_head_image();
        this.nameNick.string = ugame.nickName;
    }

    load_head_image() {
        cc.loader.load({url: ugame.avatarUrl, type: 'jpg'}, (err, texture) => {
            if(err) {
                console.log(err);
                return ;
            }
            var sprite  = new cc.SpriteFrame(texture);
            this.head_img.getComponent(cc.Sprite).spriteFrame = sprite;
        });
    }

    // update (dt) {}
}
