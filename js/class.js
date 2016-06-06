/**
 * Created by sherry on 15-12-27.
 */

/**
 * 海葵
 */
var AneObj = function () {
    // 每个海葵的横坐标和纵坐标,和控制点坐标
    this.rootx = [];
    this.headx = [];
    this.heady = [];
    this.amp = [];
    this.alpha = 0;
};

AneObj.prototype.num = 50; // 海葵最大数目

AneObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.rootx[i] = i * 16 + Math.random() * 20;
        this.headx[i] = this.rootx[i];
        this.heady[i] = canHeight - 200 + Math.random() * 50;
        this.amp[i] = Math.random() * 50 + 70;
    }
};

AneObj.prototype.draw = function () {
    this.alpha += deltaTime * 0.0008;
    var l = Math.sin(this.alpha);

    ctx2.save();
    ctx2.globalAlpha = 0.6;
    for (var i = 0; i < this.num; i++) {
        ctx2.beginPath();
        // 路径
        ctx2.moveTo(this.rootx[i], canHeight);
        this.headx[i] = this.rootx[i] + l * this.amp[i];
        ctx2.quadraticCurveTo(this.rootx[i], canHeight - 150, this.headx[i], this.heady[i]);

        // 画笔属性
        ctx2.lineWidth = 20;
        ctx2.lineCap = "round";
        ctx2.strokeStyle = "#3b154e";

        ctx2.stroke();
    }
    ctx2.restore();
};


/**
 * 果实
 */
var FruitObj = function () {
    this.alive = []; // 是否存在 true, false

    // 横竖坐标
    this.x = [];
    this.y = [];

    this.aneNo = [];
    this.width = []; // 宽度
    this.spd = []; // 成长速度
    this.type = []; // 类型

    this.blue = new Image();
    this.orange = new Image();
};

FruitObj.prototype.num = 30; // 果实最大数目
FruitObj.prototype.max = 10; // 屏幕上最多显示的果实数目

FruitObj.prototype.init = function () {

    this.blue.src = './src/blue.png';
    this.orange.src = './src/fruit.png';

    for (var i = 0; i < this.num; i++) {
        this.alive[i] = false;
        this.aneNo[i] = 0;
        this.x[i] = 0;
        this.y[i] = 0;
    }
};

/**
 * 控制器,控制果实生成
 */
FruitObj.prototype.control = function () {
    var num = 0;
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) num++;
    }

    if (num < this.max) {
        for (var j = 0; j < this.num; j++) {
            if (!this.alive[j]) {
                this.born(j);
                break;
            }
        }
    }
};

/**
 * 根据控制器生成果实
 * @param i
 */
FruitObj.prototype.born = function (i) {
    this.aneNo[i] = Math.floor(Math.random() * ane.num);
    this.width[i] = 0;
    this.alive[i] = true;
    this.spd[i] = Math.random() * 0.017 + 0.003;
    this.type[i] = Math.random() > 0.3;
};

/**
 * 果实被吃掉即死亡
 * @param i
 */
FruitObj.prototype.dead = function (i) {
    this.alive[i] = false;
};

FruitObj.prototype.draw = function () {
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) {
            if (this.width[i] <= 15) {
                var no = this.aneNo[i];
                this.x[i] = ane.headx[no];
                this.y[i] = ane.heady[no];
                this.width[i] += this.spd[i] * deltaTime;
            } else {
                this.y[i] -= this.spd[i] * 7 * deltaTime;
            }

            if (this.type[i]) {
                ctx2.drawImage(this.orange, this.x[i] - this.width[i] * 0.5, this.y[i] - this.width[i] * 0.5, this.width[i], this.width[i]);
            } else {
                ctx2.drawImage(this.blue, this.x[i] - this.width[i] * 0.5, this.y[i] - this.width[i] * 0.5, this.width[i], this.width[i]);
            }

            if (this.y[i] < 10) {
                this.alive[i] = false;
            }
        }
    }
};


/**
 * 大鱼
 */
var MomObj = function () {
    // 鱼尾巴摆动
    this.tail = [];
    this.tailTimer = 0; // 计时器
    this.tailCount = 0; // 显示第几张图片
    this.tailInterval = 50; // 变化阈值

    // 鱼眼
    this.eye = [];
    this.eyeTimer = 0;
    this.eyeCount = 0;
    this.eyeInterval = 1000; // 变化阈值

    // 鱼身体
    this.bodyOrg = [];
    this.bodyBlue = [];
    this.bodyTimer = 0; // 计时器
    this.bodyCount = 0; // 显示第几张图片
    this.bodyInterval = 300; // 变化阈值
};

MomObj.prototype.init = function () {
    this.x = canWidth * 0.5;
    this.y = canHeight * 0.5;
    this.angle = 0;

    var i;
    for (i = 0; i < 8; i++) {
        this.tail[i] = new Image();
        this.tail[i].src = './src/bigTail' + i + '.png';
    }

    for (i = 0; i < 2; i++) {
        this.eye[i] = new Image();
        this.eye[i].src = './src/bigEye' + i + '.png';
    }

    for (i = 0; i < 8; i++) {
        this.bodyOrg[i] = new Image();
        this.bodyBlue[i] = new Image();
        this.bodyOrg[i].src = './src/bigSwim' + i + '.png';
        this.bodyBlue[i].src = './src/bigSwimBlue' + i + '.png';
    }
};

MomObj.prototype.draw = function () {

    // 计算大鱼跟随鼠标移动的位置
    this.x = lerpDistance(mx, this.x, 0.99);
    this.y = lerpDistance(my, this.y, 0.99);

    // 计算角度差
    var deltaX = mx - this.x;
    var deltaY = my - this.y;
    var beta = Math.atan2(deltaY, deltaX) + Math.PI;

    // 计算翻转角度
    this.angle = lerpAngle(beta, this.angle, 0.6);

    // 鱼尾巴变化
    this.tailTimer += deltaTime;
    if (this.tailTimer > this.tailInterval) {
        this.tailCount = (this.tailCount + 1) % 8;
        this.tailTimer %= this.tailInterval;
    }

    // 鱼眼睛变化
    this.eyeTimer += deltaTime;
    if (this.eyeTimer > this.eyeInterval) {
        this.eyeCount = (this.eyeCount + 1) % 2;
        this.eyeTimer %= this.eyeInterval;

        if (this.eyeCount == 1) {
            this.eyeInterval = Math.random() * 1500 + 2000;
        } else {
            this.eyeInterval = 200;
        }
    }

    var body;
    if (data.double == 1) {
        body = this.bodyOrg[this.bodyCount];
    } else {
        body = this.bodyBlue[this.bodyCount];
    }

    ctx1.save();
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);

    var tail = this.tail[this.tailCount];
    ctx1.drawImage(tail, -tail.width * 0.5 + 30, -tail.height * 0.5);

    ctx1.drawImage(body, -body.width * 0.5, -body.height * 0.5);

    var eye = this.eye[this.eyeCount];
    ctx1.drawImage(eye, -eye.width * 0.5, -eye.height * 0.5);

    ctx1.restore();
};


/**
 * 小鱼
 */
var BabyObj = function () {
    // 鱼尾巴摆动
    this.tail = [];
    this.tailTimer = 0; // 计时器
    this.tailCount = 0; // 显示第几张图片
    this.tailInterval = 50; // 变化阈值

    // 鱼眼
    this.eye = [];
    this.eyeTimer = 0;
    this.eyeCount = 0;
    this.eyeInterval = 1000; // 变化阈值

    // 鱼身体
    this.body = [];
    this.bodyTimer = 0; // 计时器
    this.bodyCount = 0; // 显示第几张图片
    this.bodyInterval = 300; // 变化阈值
};

BabyObj.prototype.init = function () {
    this.angle = 0;
    this.x = canWidth * 0.5 - 50;
    this.y = canHeight * 0.5 + 50;

    var i;
    for (i = 0; i < 8; i++) {
        this.tail[i] = new Image();
        this.tail[i].src = './src/babyTail' + i + '.png';
    }

    for (i = 0; i < 2; i++) {
        this.eye[i] = new Image();
        this.eye[i].src = './src/babyEye' + i + '.png';
    }

    for (i = 0; i < 20; i++) {
        this.body[i] = new Image();
        this.body[i].src = './src/babyFade' + i + '.png';
    }
};

BabyObj.prototype.draw = function () {

    // 跟着大鱼移动, 速度比大鱼略慢
    this.x = lerpDistance(mom.x, this.x, 0.98);
    this.y = lerpDistance(mom.y, this.y, 0.98);

    // 根据大鱼的位置进行移动
    var deltaX = mom.x - this.x;
    var deltaY = mom.y - this.y;
    var beta = Math.atan2(deltaY, deltaX) + Math.PI;

    this.angle = lerpAngle(beta, this.angle, 0.6);

    // 鱼尾巴变化
    this.tailTimer += deltaTime;
    if (this.tailTimer > this.tailInterval) {
        this.tailCount = (this.tailCount + 1) % 8;
        this.tailTimer %= this.tailInterval;
    }

    // 鱼眼睛变化
    this.eyeTimer += deltaTime;
    if (this.eyeTimer > this.eyeInterval) {
        this.eyeCount = (this.eyeCount + 1) % 2;
        this.eyeTimer %= this.eyeInterval;

        if (this.eyeCount == 1) {
            this.eyeInterval = Math.random() * 1500 + 2000;
        } else {
            this.eyeInterval = 200;
        }
    }

    // 鱼身体变化
    this.bodyTimer += deltaTime;
    if (this.bodyTimer > this.bodyInterval) {
        this.bodyCount++;
        this.bodyTimer %= this.bodyInterval;

        if (this.bodyCount > 19) {
            this.bodyCount = 19;
            data.gameOver = true;
        }
    }

    ctx1.save();
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);

    var tail = this.tail[this.tailCount];
    ctx1.drawImage(tail, -tail.width * 0.5 + 23, -tail.height * 0.5);

    var body = this.body[this.bodyCount];
    ctx1.drawImage(body, -body.width * 0.5, -body.height * 0.5);

    var eye = this.eye[this.eyeCount];
    ctx1.drawImage(eye, -eye.width * 0.5, -eye.height * 0.5);

    ctx1.restore();
};