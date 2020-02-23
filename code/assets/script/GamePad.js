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
        score: cc.Label,
        bestScore: cc.Label,
        blockPrefab: cc.Prefab,
        blockOffset: 20,
        blockRow: 4,
        blockCol: 4,
        clickAudio: {
            default: null,
            type: cc.AudioClip,
        },
        moveAudio: {
            default: null,
            type: cc.AudioClip,
        },
        winAudio: {
            default: null,
            type: cc.AudioClip,
        },
        lostAudio: {
            default: null,
            type: cc.AudioClip,
        },
        moveDelay: 0.1,
    },

    ResetGame() {
        this.NewGame();
        this.PlayAudio(this.clickAudio);
    },

    NewGame() {
        while (this.node.childrenCount > 0) {
            this.blockPool.put(this.node.children[0]);
        }
        this.noneBlockPos = [];
        this.blockNum = [];
        for (let i = 0; i < this.blockRow * this.blockCol; i++) {
            this.noneBlockPos.push(i);
            this.blockNum.push(null);
        }
        this.maxScore = 0;
        for (let i = 0; i < 2; i++) {
            let num = this.CreateBlock();
            if (num > this.maxScore) {
                this.maxScore = num;
            }
        }
        this.score.string = this.maxScore.toString();
        let scoreBest = cc.sys.localStorage.getItem("best");
        if (scoreBest === null || scoreBest === "") {
            this.bestScore.string = this.maxScore.toString();
            this.gameBestScore = this.maxScore;
            cc.sys.localStorage.setItem('best', this.gameBestScore);
        } else {
            this.bestScore.string = scoreBest.toString();
            this.gameBestScore = scoreBest;
        }
    },
    
    CreateBlock() {
        if (this.noneBlockPos.length <= 0) {
            return 0;
        }

        var block= null;
        if (this.blockPool.size() > 0) {
            block = this.blockPool.get(this.blockWidth, this.blockHigh);
        } else {
            block = cc.instantiate(this.blockPrefab);
            block.getComponent("Block").reuse(this.blockWidth, this.blockHigh);
        }
        block.parent = this.node;

        let idx = Math.floor(this.noneBlockPos.length * Math.random());
        let posNum = this.noneBlockPos[idx];
        this.noneBlockPos.splice(idx, 1);
        this.blockNum[posNum] = block.getComponent("Block");
        let posX = posNum % this.blockCol;
        let posY = Math.floor(posNum / this.blockCol);
        block.x = this.startPosX + posX * this.blockWidth + posX * this.blockOffset;
        block.y = this.startPosY - posY * this.blockHigh - posY * this.blockOffset;
        return this.blockNum[posNum].GetNum();
    },

    onLoad() {
        this.blockPool = new cc.NodePool("Block");
        this.blockWidth = (this.node.width - (this.blockRow + 1) * this.blockOffset) / this.blockRow;
        this.blockHigh = (this.node.height - (this.blockCol + 1) * this.blockOffset) / this.blockCol;
        this.startPosX = this.blockOffset - this.node.width / 2 + this.blockWidth / 2;
        this.startPosY = this.node.height / 2 - this.blockOffset - this.blockHigh / 2;

        this.NewGame();
        this.targetSocre = 2048;
    },

    PlayAudio(audio) {
        if (audio !== null){
            cc.audioEngine.playEffect(audio, false);
        }
    },

    MoveFinish(moveNode) {
        this.blockPool.put(moveNode);
    },

    MoveBlock(curRow, curCol, nextRow, nextCol) {
        let result = 0;
        if (this.blockNum[curRow * this.blockCol + curCol] === null) {
            let posX = this.startPosX + curCol * this.blockWidth + curCol * this.blockOffset;
            let posY = this.startPosY - curRow * this.blockHigh - curRow * this.blockOffset;
            let nextNode = this.blockNum[nextRow * this.blockCol + nextCol].node;
            let moveAction = cc.moveTo(this.moveDelay, posX, posY);
            nextNode.runAction(moveAction);

            this.blockNum[curRow * this.blockCol + curCol] = this.blockNum[nextRow * this.blockCol + nextCol];
            this.blockNum[nextRow * this.blockCol + nextCol] = null;
            this.noneBlockPos.push(nextRow * this.blockCol + nextCol);
            let idx = this.noneBlockPos.indexOf(curRow * this.blockCol + curCol);
            if (idx >= 0) {
                this.noneBlockPos.splice(idx, 1);
            }
            result = 1;
        } else if (this.blockNum[curRow * this.blockCol + curCol].GetNum() === this.blockNum[nextRow * this.blockCol + nextCol].GetNum()) {
            let posX = this.startPosX + curCol * this.blockWidth + curCol * this.blockOffset;
            let posY = this.startPosY - curRow * this.blockHigh - curRow * this.blockOffset;
            let nextNode = this.blockNum[nextRow * this.blockCol + nextCol].node;
            let moveAction = cc.spawn(cc.moveTo(this.moveDelay, posX, posY), cc.fadeOut(this.moveDelay));
            let callAction = cc.callFunc(this.MoveFinish, this, nextNode);
            nextNode.runAction(cc.sequence(moveAction, callAction));

            let number = this.blockNum[curRow * this.blockCol + curCol].GetNum() * 2;
            this.blockNum[curRow * this.blockCol + curCol].SetNum(number);
            this.blockNum[nextRow * this.blockCol + nextCol] = null;
            this.noneBlockPos.push(nextRow * this.blockCol + nextCol);
            if (this.maxScore < number) {
                if (number >= this.targetSocre) {
                    this.PlayAudio(this.winAudio);
                }
                this.maxScore = number;
                this.score.string = number.toString();
                if (this.gameBestScore < number) {
                    this.bestScore.string = number.toString();
                    this.gameBestScore = number;
                    cc.sys.localStorage.setItem('best', this.gameBestScore);
                }
            }
            result = 2;
        }
        return result;
    },

    CheckGameOver() {
        if (this.noneBlockPos.length <= 0) {
            for (let i = 0; i < this.blockRow - 1; i++) {
                for (let j = 0; j < this.blockCol - 1; j++) {
                    if (this.blockNum[i * this.blockCol + j].GetNum() == this.blockNum[i * this.blockCol + j + 1].GetNum()) {
                        return false;
                    }
                    if (this.blockNum[(i + 1) * this.blockCol + j].GetNum() == this.blockNum[(i + 1) * this.blockCol + j + 1].GetNum()) {
                        return false;
                    }
                    if (this.blockNum[i * this.blockCol + j].GetNum() == this.blockNum[(i + 1) * this.blockCol + j].GetNum()) {
                        return false;
                    }
                    if (this.blockNum[i * this.blockCol + j + 1].GetNum() == this.blockNum[(i + 1) * this.blockCol + j + 1].GetNum()) {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
        return true;
    },

    MoveLeft() {
        let moveFlag = 0;
        for (let row = 0; row < this.blockRow; row++) {
            for (let i = 0; i < this.blockCol; i++) {
                let next = -1;
                for (let j = i + 1; j < this.blockCol; j++) {
                    if (this.blockNum[row * this.blockCol + j] !== null) {
                        next = j;
                        break;
                    }
                }
                if (next !== -1) {
                    let flag = this.MoveBlock(row, i, row, next);
                    moveFlag = flag + moveFlag;
                    if (flag === 1) {
                        i--;
                    }
                }
            }
        }
        if (moveFlag > 0) {
            this.CreateBlock();
        }
        if (this.CheckGameOver()) {
            this.PlayAudio(this.lostAudio);
            return;
        }
        this.PlayAudio(this.moveAudio);
    },

    MoveRight() {
        let moveFlag = 0;
        for (let row = 0; row < this.blockRow; row++) {
            for (let i = this.blockCol - 1; i >= 0; i--) {
                let next = -1;
                for (let j = i - 1; j >= 0; j--) {
                    if (this.blockNum[row * this.blockCol + j] !== null) {
                        next = j;
                        break;
                    }
                }
                if (next !== -1) {
                    let flag = this.MoveBlock(row, i, row, next);
                    moveFlag = flag + moveFlag;
                    if (flag === 1) {
                        i++;
                    }
                }
            }
        }
        if (moveFlag > 0) {
            this.CreateBlock();
        }
        if (this.CheckGameOver()) {
            this.PlayAudio(this.lostAudio);
            return;
        }
        this.PlayAudio(this.moveAudio);
    },

    MoveDown() {
        let moveFlag = 0;
        for (let col = 0; col < this.blockCol; col++) {
            for (let i = this.blockRow - 1; i >= 0; i--) {
                let next = -1;
                for (let j = i - 1; j >= 0; j--) {
                    if (this.blockNum[j * this.blockCol + col] !== null) {
                        next = j;
                        break;
                    }
                }
                if (next !== -1) {
                    let flag = this.MoveBlock(i, col, next, col);
                    moveFlag = flag + moveFlag;
                    if (flag == 1) {
                        i++;
                    }
                }
            }
        }
        if (moveFlag > 0) {
            this.CreateBlock();
        }
        if (this.CheckGameOver()) {
            this.PlayAudio(this.lostAudio);
            return;
        }
        this.PlayAudio(this.moveAudio);
    },

    MoveUp() {
        let moveFlag = 0;
        for (let col = 0; col < this.blockCol; col++) {
            for (let i = 0; i < this.blockRow; i++) {
                let next = -1;
                for (let j = i + 1; j < this.blockRow; j++) {
                    if (this.blockNum[j * this.blockCol + col] !== null) {
                        next = j;
                        break;
                    }
                }
                if (next !== -1) {
                    let flag = this.MoveBlock(i, col, next, col);
                    moveFlag = flag + moveFlag;
                    if (flag == 1) {
                        i--;
                    }
                }
            }
        }
        if (moveFlag > 0) {
            this.CreateBlock();
        }
        if (this.CheckGameOver()) {
            this.PlayAudio(this.lostAudio);
            return;
        }
        this.PlayAudio(this.moveAudio);
    },
});
