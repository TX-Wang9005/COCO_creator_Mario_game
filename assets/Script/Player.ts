import GM from "./GM";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Node)
    GM: cc.Node = null;

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip[] = [];



    private playerSpeed: number = 0;

    private anim = null; //this will use to get animation component

    private animateState = null; //this will use to record animationState

    private zDown: boolean = false; // key for player to go left

    private xDown: boolean = false; // key for player to go right

    private kDown: boolean = false; // key for player to jump

    private jDown: boolean = false; // key for player to small jump

    private isDead: boolean = false;

    private onGround: boolean = true;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    start() {
        this.node.position = cc.v2(-377, -191);
    }
    onKeyDown(event) {
        cc.log("Key Down: " + event.keyCode);
        if (event.keyCode == cc.macro.KEY.z) {
            this.zDown = true;
            this.xDown = false;
        } else if (event.keyCode == cc.macro.KEY.x) {
            this.xDown = true;
            this.zDown = false;
        } else if (event.keyCode == cc.macro.KEY.k) {
            this.kDown = true;
            this.jDown = false;
        } else if (event.keyCode == cc.macro.KEY.j) {
            this.jDown = true;
            this.kDown = false;
        }
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.z)
            this.zDown = false;
        else if (event.keyCode == cc.macro.KEY.x)
            this.xDown = false;
        else if (event.keyCode == cc.macro.KEY.k)
            this.kDown = false;
        else if (event.keyCode == cc.macro.KEY.j)
            this.jDown = false;
    }

    private playerMovement(dt) {
        this.playerSpeed = 0;
        if (this.isDead) {
            cc.audioEngine.playEffect(this.soundEffect[1], false);
            this.GM.getComponent("GM").updateLife(-1);
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.node.position = cc.v2(-377, -191);
            this.isDead = false;
            return;
        }
        if (this.zDown) {
            this.playerSpeed = -300;
            this.node.scaleX = -1;
            if (this.onGround && (this.animateState == null || this.animateState.name != 'Mario_run')) // when first call or last animation is shoot or idle
                this.animateState = this.anim.play('Mario_run');
        }
        else if (this.xDown) {
            this.playerSpeed = 300;
            this.node.scaleX = 1;
            if (this.onGround && (this.animateState == null || this.animateState.name != 'Mario_run')) // when first call or last animation is shoot or idle
                this.animateState = this.anim.play('Mario_run');
        }
        else {
            if (this.animateState != null) {
                this.anim.play('Mario_defalut');

                this.animateState = null;

                cc.log('Animation finished.');
                this.playerSpeed = 0;
            }
        }

        this.node.x += this.playerSpeed * dt;

        if (this.kDown && this.onGround) {
            this.jump();
            cc.audioEngine.playEffect(this.soundEffect[0], false);
        }
        else if (this.jDown && this.onGround) {
            this.smalljump();
            cc.audioEngine.playEffect(this.soundEffect[0], false);
        }
    }

    private jump() {
        this.onGround = false;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1500);
        this.animateState = this.anim.play('Mario_jump');
    }
    private smalljump() {
        this.onGround = false;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
        this.animateState = this.anim.play('Mario_jump');
    }

    update(dt) {
        if (this.node.y < -350)
            this.isDead = true;
        this.playerMovement(dt);
    }

    onBeginContact(contact, self, other) {
        if (other.node.name == "ground") {
            this.onGround = true;
        } else if (other.node.name == "bound") {
            this.onGround = true;
        }
        else if (other.node.name == "question_block") {
            cc.log("Rockman hits the block");
            this.onGround = true;
        } else if (other.node.name == "monster_block") {
            cc.log("Rockman hits the block");
            this.onGround = true;
        }
        else if (other.node.name == "Goomba") {
            let normal = contact.getWorldManifold().normal;
            if (Math.abs(normal.x) < 0.01 && Math.abs(normal.y + 1) < 0.01) {
                this.isDead = false;
                this.GM.getComponent(GM).updateScore(100);
                this.jump();
            }
            else {
                this.isDead = true;
            }
        } else if (other.node.name == "Flower") {
            this.isDead = true;
        }
    }
}