const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property({ type: cc.AudioClip })
    getMonster: cc.AudioClip = null;
    private anim = null; //this will use to get animation component

    private animateState = null; //this will use to record animationState
    private isMonster = true;

    @property(cc.Prefab)
    private MonsterPrefab: cc.Prefab = null;

    private monsterPool = null; // this is a monster manager, and it control the monster resource

    onLoad() {
        this.anim = this.getComponent(cc.Animation);

        cc.director.getPhysicsManager().enabled = true;

        this.monsterPool = new cc.NodePool('Enemy');
        let maxMonsterNum = 5;
        for (let i: number = 0; i < maxMonsterNum; i++) {
            let monster = cc.instantiate(this.MonsterPrefab);
            this.monsterPool.put(monster);
        }
    }

    update(dt) {

        this.playerAnimation();
    }

    private playerAnimation() {
        if (!this.isMonster) {
            this.animateState = this.anim.play('no_money');
        }
        else {
            if (this.animateState != null) {
                this.anim.play('have_money');
                this.animateState = null;
            }

        }
    }

    onBeginContact(contact, self, other) {
        if (other.node.name == "player") {
            let normal = contact.getWorldManifold().normal;
            if ((Math.abs(normal.x) < 0.01 && Math.abs(normal.y + 1) < 0.01) && this.isMonster) {
                this.createBullet();
                cc.audioEngine.playEffect(this.getMonster, false);
                this.isMonster = false;
            }
        }
    }
    private createBullet() {  // create monster
        let monster = null;

        if (this.monsterPool.size() > 0)
            monster = this.monsterPool.get(this.monsterPool);

        if (monster != null)
            monster.getComponent('Enemy').init(this.node);
    }
}