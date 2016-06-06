/**
 * 游戏控制函数
 * Created by sherry on 15-12-27.
 */
/**
 * 大鱼吃果实
 */
function momFruitsCollision() {
    if (!data.gameOver) {
        for (var i = 0; i < fruit.num; i++) {
            if (fruit.alive[i]) {
                var len = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
                if (len < 900) {
                    fruit.dead(i);
                    data.fruitNum++;
                    mom.bodyCount++;
                    if (mom.bodyCount > 7) {
                        mom.bodyCount = 7;
                    }
                    if (!fruit.type[i]) {// 如果是蓝色果实
                        data.double = 2;
                    }
                    wave.born(fruit.x[i], fruit.y[i]);
                }
            }
        }
    }
}

/**
 * 大鱼喂小鱼
 */
function momBabyCollision() {
    if (data.fruitNum > 0 && !data.gameOver) {

        var len = calLength2(mom.x, mom.y, baby.x, baby.y);
        if (len < 900) {
            halo.born(baby.x, baby.y);
            baby.bodyCount = 0;
            data.addScore();
            mom.bodyCount = 0;
        }
    }
}


/**
 * 游戏积分
 * @constructor
 */
var DataObj = function () {
    this.fruitNum = 0;
    this.double = 1;
    this.score = 0;

    this.alpha = 0;
    this.gameOver = false;
};

/**
 * 绘积分表
 */
DataObj.prototype.draw = function () {
    ctx1.save();

    ctx1.fillStyle = 'white';
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = 'white';
    ctx1.font = '20px Verdana';
    ctx1.textAlign = 'center';
    ctx1.fillText('得分:' + this.score, canWidth * 0.5, canHeight - 20);

    if (this.gameOver) {
        this.alpha += deltaTime * 0.0001;
        if (this.alpha > 1)this.alpha = 1;
        ctx1.fillStyle = 'rgba(255, 255, 255,' + this.alpha + ')';
        ctx1.font = '30px Verdana';
        ctx1.fillText('游戏结束', canWidth * 0.5, canHeight * 0.5)
    }

    ctx1.restore();
};

/**
 * 增加得分
 */
DataObj.prototype.addScore = function () {
    this.score += this.fruitNum * 100 * this.double;
    this.fruitNum = 0;
    this.double = 1;
};