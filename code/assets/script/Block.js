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
        numLable: cc.Label,
        num: 2,
        colorNode: {
            default:[],
            type: cc.Color,
        },
        colorText: {
            default:[],
            type: cc.Color,
        },
        scaleDelay: 0.2,
    },

    ResetPara(number) {
        this.num = number;
        this.numLable.string = number.toString();
        let idx = Math.log2(this.num) - 1;
        if (idx >= 0 && idx < this.colorText.length && idx < this.colorNode.length) {
            this.numLable.node.color = this.colorText[idx];
            this.node.color = this.colorNode[idx];
        }
    },

    reuse(width, height) {
        this.node.width = width;
        this.node.height = height;
        let number = Math.round(Math.random() + 1);
        this.SetNum(number * 2);
        this.node.scale = 0.2;
        this.node.opacity = 255;
        let actionFade = cc.scaleTo(this.scaleDelay, 1.0);
        this.node.runAction(actionFade);
    },

    GetNum() {
        return this.num;
    },

    SetNum(number) {
        this.ResetPara(number);
    },
});
