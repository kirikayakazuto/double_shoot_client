import websocket from "../modules/websocket"
import Stype from "../Stype"
import Cmd from "../Cmd"

/**
 *  -------------------- 用户登录验证  中心 -----------------
 */
export default class auth {
    
    static get_app_a_data_sig() {
        websocket.send_cmd(Stype.Auth, Cmd.Auth.GET_APP_A_DATA_SIG, null)
    }

    static player_login(body: any) {
        websocket.send_cmd(Stype.Auth, Cmd.Auth.OPENID_LOGIN, body);
    }
}