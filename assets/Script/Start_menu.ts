const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({ type: cc.AudioClip })
    BGM: cc.AudioClip = null;
    start() {
        cc.audioEngine.playMusic(this.BGM, true);
    }
    changeScene_select() {
        cc.director.loadScene("Select_menu");
    }
    // update (dt) {}
}
