const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    private anim = null;
    private moneyManager = null;

    // when created, the bullet need to be placed at correct position and play animation.
    public init(node: cc.Node) {
        this.anim = this.getComponent(cc.Animation);
        this.setInitPos(node);
        this.anim.play('money');
    }

    // this function is called when the bullet manager calls "get" API.
    reuse(moneyManager) {
        this.moneyManager = moneyManager;
    }

    //this function sets the bullet's initial position when it is reused.
    private setInitPos(node: cc.Node) {
        this.node.parent = node.parent; // don't mount under the player, otherwise it will change direction when player move
        this.node.position = cc.v2(8, 62);
        this.node.scaleX = 1;
        this.node.position = this.node.position.addSelf(node.position);
    }

    //make the bullet move from current position
    private moneyMove() {
        let moveDir = null;

        // move bullet to 500 far from current position in 0.8s
        moveDir = cc.moveBy(0.8, 0, 100);
        let finished = cc.callFunc(() => {
            this.moneyManager.put(this.node);
        });

        // after playing animation, the bullet move 0.8s and destroy itself(put back to the bullet manager)
        this.scheduleOnce(() => {
            this.node.runAction(cc.sequence(moveDir, finished));
        });
    }
}