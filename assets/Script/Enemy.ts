import GM from "./GM";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    private anim = null; //this will use to get animation component

    private animateState = null; //this will use to record animationState

    private rebornPos = null;

    protected isTouched = false;
    private monsterManager = null;


    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
        if (this.node.name == "Goomba") {
            this.rebornPos = this.node.position;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-100, 0);
        }
        if (this.node.name == "Flower") {
            this.rebornPos = this.node.position;
            cc.tween(this.node).repeatForever(cc.tween()
                .by(2, { position: cc.v2(0, -30) }).delay(1)
                .by(2, { position: cc.v2(0, 30) }).delay(1)
            ).start();

        }
    }

    update(dt) {
        if (this.node.y < -350)
            this.node.destroy();
    }
    public init(node: cc.Node) {
        this.setInitPos(node);
    }
    private setInitPos(node: cc.Node) {
        this.node.parent = node.parent; // don't mount under the player, otherwise it will change direction when player move
        this.node.position = cc.v2(8, 62);
        this.node.scaleX = 1;
        this.node.position = this.node.position.addSelf(node.position);
    }
    reuse(monsterManager) {
        this.monsterManager = monsterManager;
    }

    playSoundEffect() {
        if (this.soundEffect != null)
            cc.audioEngine.playEffect(this.soundEffect, false);
    }
    onBeginContact(contact, self, other) {
        if (other.node.name == "LeftBound") {
            this.node.scaleX = -1;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(100, 0);
        }
        else if (other.node.name == "RightBound") {
            this.node.scaleX = 1;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-100, 0);
        }
        else if (other.node.name == "bound") {
            let normal = contact.getWorldManifold().normal;
            if (self.node.name == "Goomba") {
                if (Math.abs(normal.y) < 0.01) {
                    if (this.node.getComponent(cc.RigidBody).linearVelocity.x < 0) {
                        this.node.scaleX = -1;
                        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(100, 0);
                    }
                    else if (this.node.getComponent(cc.RigidBody).linearVelocity.x > 0) {
                        this.node.scaleX = 1;
                        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-100, 0);
                    }
                }
            }
        }
        else if (other.node.name == "player") {
            let normal = contact.getWorldManifold().normal;
            if (self.node.name == "Goomba") {
                if (Math.abs(normal.x) < 0.01 && Math.abs(normal.y - 1) < 0.01) {
                    this.playSoundEffect();
                    this.animateState = this.anim.play('Goomba_dead');
                    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    this.scheduleOnce(function () {
                        this.node.destroy();
                    }, 0.5)
                }
            }
        }
    }
}
