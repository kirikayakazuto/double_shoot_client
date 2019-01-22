import QQLoginCtl from "../common/QQLoginCtl"
import ugame from "../ugame";
import websocket from "../modules/websocket";
import auth from "../protobufs/auth";
import Cmd from "../Cmd";
import response from "../response";
import Stype from "../Stype";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    wait_node: cc.Node = null;
    @property(cc.Node)
    tips: cc.Node = null;

    wait_label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    can_QQ_login = false;

    onLoad () {
        let service_handlers:{[key: string] : any} = {};
        service_handlers[Stype.Auth] = this.on_auth_server_return.bind(this);
        websocket.register_services_handler(service_handlers);

        this.wait_label = this.wait_node.getChildByName("str").getComponent(cc.Label);
    }

    start () {
        this.schedule(this.get_app_sig, 1);
    }

    get_app_sig() {
        if(!websocket.is_connected) {
            return ;
        }
        auth.get_app_a_data_sig();
        this.unschedule(this.get_app_sig);
    }

    /**
     * 点击登录按钮
     */
    login_button_click() {
        if(!this.can_QQ_login) {
            return ;
        }
        window["QBH5"].login(
            {
                appid: QQLoginCtl.appid,
                appsig: ugame.app_sig,
                appsigData: ugame.app_data_sig,
                loginType: "qq"
            }, (rsp) => {
                console.log("rsp: ", rsp);
                if(rsp.result === 0) {  // 登录成功
                    ugame.avatarUrl = rsp.avatarUrl;
                    ugame.nickName = rsp.nickName;
                    ugame.qbopenid = rsp.qbopenid;
                    ugame.qbopenkey = rsp.qbopenkey;
                    ugame.refreshToken = rsp.refreshToken;
                    let body = [
                        rsp.qbopenid
                    ];
                    auth.player_login(body);
                    this.show_tips("正在登录中...");
                }
        });
    }
    /**
     * 显示 文字信息, 2s后自动隐藏
     * @param str 
     */
    show_tips(str: string) {
        this.tips.getComponent(cc.Label).string = str;
        this.tips.active = true;

        this.scheduleOnce(() => {
            this.tips.active = false;
        }, 2);
    }

    openid_login() {
        let body = [
            ugame.qbopenid,
        ];
        auth.player_login(body);
    }
    /**
     * 自己的服务器登录回调
     * @param body 
     */
    on_openid_login(body: any) {
        if(body[0] != response.OK) {
            console.log("on_openid_login error: ", body[0]);
            return ;
        }
        this.wait_node.active = true;
        //onProgress可以查看到加载进度
        cc.loader["onProgress"] = function ( completedCount, totalCount,  item ){
            var per = Math.floor(completedCount*100/totalCount);
            this.wait_label.string = per + "%";
        }.bind(this);
        //使用preloadScene()预加载场景
        cc.director.preloadScene('home_scene',function(){
            cc.loader["onProgress"]= null;
            cc.director.loadScene('home_scene');
        });

    }
    /**
     * 获取到服务器上的签名
     * @param body 
     */
    on_get_app_and_data_sig(body: any) {
        if(body[0] != response.OK) {
            console.log("on_get_app_sig error: ", body[0]);
            return ;
        }
        ugame.app_sig = body[1];
        ugame.app_data_sig = body[2];
        this.can_QQ_login = true;
    }
    /**
     * ----------------------------------- 接收服务器上的信息  -----------------------
     * @param stype 
     * @param ctype 
     * @param body 
     */
    on_auth_server_return(stype: number, ctype: number, body: any) {
        console.log(stype, ctype, body);
        switch(ctype) {
            case Cmd.Auth.GET_APP_A_DATA_SIG:
                this.on_get_app_and_data_sig(body);
            break;
            case Cmd.Auth.OPENID_LOGIN:
                this.on_openid_login(body);
            break;
        }
    }


    

    

    

    // update (dt) {}
}
