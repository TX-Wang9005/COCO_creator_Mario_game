import GM from "./GM";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Node)
    GM: cc.Node = null;
    @property({ type: cc.AudioClip })
    getMoney: cc.AudioClip = null;

    private anim = null; //this will use to get animation component

    private animateState = null; //this will use to record animationState
    private isMoney = true;

    @property(cc.Prefab)
    private MoneyPrefab: cc.Prefab = null;

    private moneyPool = null; // this is a bullet manager, and it control the bullet resource

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.isMoney = true;
        cc.director.getPhysicsManager().enabled = true;

        this.moneyPool = new cc.NodePool('money');
        let maxMoneyNum = 1;

        for (let i: number = 0; i < maxMoneyNum; i++) {
            let money = cc.instantiate(this.MoneyPrefab);

            this.moneyPool.put(money);
        }
    }
    update(dt) {
        this.playerAnimation()

    }

    private playerAnimation() {
        if (!this.isMoney) {
            this.animateState = this.anim.play('no_money');
        }
        else {
            if (this.animateState != null) {
                this.anim.play('have_money');

                this.animateState = null;

                cc.log('Animation finished.');
            }

        }

    }

    onBeginContact(contact, self, other) {
        if (other.node.name == "player") {
            let normal = contact.getWorldManifold().normal;
            if ((Math.abs(normal.x) < 0.01 && Math.abs(normal.y + 1) < 0.01) && this.isMoney) {
                this.GM.getComponent(GM).updateCoin(1);
                this.createBullet();
                cc.audioEngine.playEffect(this.getMoney, false);
                this.isMoney = false;
            }
        }
    }
    private createBullet() {     // create money
        let money = null;

        if (this.moneyPool.size() > 0)
            money = this.moneyPool.get(this.moneyPool);

        if (money != null)
            money.getComponent('money').init(this.node);
    }
}