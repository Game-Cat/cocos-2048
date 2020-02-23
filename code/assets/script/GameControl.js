// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gamePad: cc.Node,
    },

    onLoad() {
        this.node.on('touchstart', this.onTouchDown, this);
        this.node.on('touchend', this.onTouchUp, this);

        this.gamePadScripter = this.gamePad.getComponent("GamePad");
    },

    onTouchDown (e) {
        this.posDown = cc.v2(e.touch._point);
    },

    onTouchUp (e) {
        let moveX = e.touch._point.x - this.posDown.x;
        let moveY = e.touch._point.y - this.posDown.y;
        if (Math.abs(moveX) > Math.abs(moveY)) {
            if (moveX > 50) {
                this.gamePadScripter.MoveRight();
            } else if (moveX < -50){
                this.gamePadScripter.MoveLeft();
            }
        } else {
            if (moveY > 50) {
                this.gamePadScripter.MoveUp();
            } else if (moveY < -50){
                this.gamePadScripter.MoveDown();
            }
        }
    },
});
