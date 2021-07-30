
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {




    start() {
        this.scheduleOnce(function () {
            cc.director.loadScene("Select_menu");
        }, 3.5);

    }

    // update (dt) {}
}
