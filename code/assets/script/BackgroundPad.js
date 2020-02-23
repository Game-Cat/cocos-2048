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
        blockOffset: 20,
        backColor: new cc.Color(206,194,178, 255),
        spriteFrame: cc.SpriteFrame,
        blockRow: 4,
        blockCol: 4,
    },

    onLoad () {
        this.node.height = this.node.width;
        let blockWidth = (this.node.width - (this.blockRow + 1) * this.blockOffset) / this.blockRow;
        let blockHigh = (this.node.height - (this.blockCol + 1) * this.blockOffset) / this.blockCol;
        let startPosX = this.blockOffset - this.node.width / 2 + blockWidth / 2;
        let startPosY = this.node.height / 2 - this.blockOffset - blockHigh / 2;
        for (let i = 0; i < this.blockRow; i++) {
            for (let j = 0; j < this.blockCol; j++) {
                let backNode = new cc.Node();
                let backSprite = backNode.addComponent(cc.Sprite);
                backSprite.spriteFrame = this.spriteFrame;
                backNode.color = this.backColor;
                backNode.width = blockWidth;
                backNode.height = blockHigh;
                backNode.parent = this.node;
                backNode.x = startPosX + i * blockWidth + i * this.blockOffset;
                backNode.y = startPosY - j * blockHigh - j * this.blockOffset;
            }
        }
    },
});
