const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    @property(cc.Node)
    Map: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;
    start() {
        this.node.x = this.player.width;
    }

    update(dt) {
        if (this.player.x <= 0) {
            this.node.x = 0;
            return;
        }
        else if (this.player.x >= this.Map.width * this.Map.scaleX / 2 + this.Map.x - 480) {
            this.node.x = this.Map.width * this.Map.scaleX / 2 + this.Map.x - 480;
            return;
        }
        this.node.x = this.player.x;
    }
}
