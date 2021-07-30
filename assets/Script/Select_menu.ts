
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.AudioClip })
    BGM: cc.AudioClip = null;

    start() {
        cc.audioEngine.playMusic(this.BGM, true)
    }
    changeScene_Stage1() {
        cc.director.loadScene("Stage1");
    }
    changeScene_Stage2() {
        cc.director.loadScene("Stage2");
    }
}
