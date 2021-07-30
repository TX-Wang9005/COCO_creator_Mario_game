import Player from "./Player";
import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GM extends cc.Component {

    @property(cc.Node)
    scoreNode: cc.Node = null;

    @property(cc.Node)
    clearScore: cc.Node = null;

    @property(cc.Node)
    lifeNode: cc.Node = null;

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Node)
    coinNode: cc.Node = null;

    @property(cc.Node)
    Stageclear: cc.Node = null;

    @property(cc.Node)
    Stagestart: cc.Node = null;

    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.Node)
    Enemy: cc.Node = null;

    @property(cc.Node)
    Flag: cc.Node = null;

    @property({ type: cc.AudioClip })
    clearSound: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    BGM: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    gameover: cc.AudioClip = null;


    private score: number = 0;
    private life: number = 5;
    private coin: number = 0;
    private clear: boolean = false;
    private time: number = 500;


    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        cc.audioEngine.playMusic(this.BGM, true);
        this.updateScore(0);
        this.updateLife(10);
        this.updateCoin(0);
        this.Stageclear.active = false;
        this.scheduleOnce(function () {
            this.Stagestart.active = false;
        }, 1)
        this.schedule(function () {
            this.updateTime(-1);
        }, 1);

    }
    update(dt) {
        if (this.Player.x > this.Flag.x && this.clear == false) {
            this.clear = true;
            this.stage_clear();
        }
        else if (this.life == 0 || this.time == 0) {
            this.updateLife(15);
            this.updateTime(500);
            this.game_over();
        }
    }
    updateTime(time: number) {
        this.time += time;
        this.timeNode.getComponent(cc.Label).string = this.time.toString();
    }
    updateScore(score: number) {
        this.score += score;
        this.scoreNode.getComponent(cc.Label).string = (Array(6).join("0") + this.score.toString()).slice(-6);
        this.clearScore.getComponent(cc.Label).string = (Array(6).join("0") + this.score.toString()).slice(-6);
    }
    updateLife(life: number) {
        this.life += life;
        this.lifeNode.getComponent(cc.Label).string = this.life.toString();
    }
    updateCoin(coin: number) {
        this.coin = coin;
        this.coinNode.getComponent(cc.Label).string = this.coin.toString();
    }
    changeScene_select() {
        cc.director.loadScene("Select_menu");
    }
    game_over() {
        this.clear = true;
        cc.audioEngine.pauseMusic();
        cc.audioEngine.playEffect(this.gameover, false);
        cc.director.loadScene("Game_over");
    }
    stage_clear() {
        this.updateScore(this.time * 10);
        cc.audioEngine.pauseMusic();
        cc.audioEngine.playEffect(this.clearSound, false);
        this.Stageclear.active = true;
        this.scheduleOnce(function () {
            this.Stageclear.active = false;
            cc.director.loadScene("Select_menu");
        }, 4)

    }
}
