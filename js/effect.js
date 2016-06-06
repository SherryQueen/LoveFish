/**
 * 实现效果
 * Created by sherry on 15-12-27.
 */
/**
 * 水波纹效果
 * @constructor
 */
var WaveObj = function () {
    this.x = [];
    this.y = [];
    this.alive = [];
    this.r = [];
};

WaveObj.prototype.num = 10;

WaveObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = false;
        this.r[i] = 0;
    }
};

/**
 * 初始化水波纹
 */
WaveObj.prototype.born = function (x, y) {
    for (var i = 0; i < this.num; i++) {
        if (!this.alive[i]) {
            this.alive[i] = true;
            this.x[i] = x;
            this.y[i] = y;
            this.r[i] = 20;
            return;
        }
    }
};

WaveObj.prototype.draw = function () {
    ctx1.save();
    ctx1.lineWidth = 2;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = 'white';
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) {
            this.r[i] += deltaTime * 0.05;
            if (this.r[i] > 60) {
                this.alive[i] = false;
                break;
            }
            var alpha = 1 - this.r[i] / 100;

            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
            ctx1.closePath();
            ctx1.strokeStyle = 'rgba(255, 255, 255,' + alpha + ')';
            ctx1.stroke();
        }
    }
    ctx1.restore();
};


/**
 * 大鱼喂小鱼
 * @constructor
 */
var HaloObj = function () {
    this.x = [];
    this.y = [];
    this.alive = [];
    this.r = [];
};

HaloObj.prototype.num = 5;

HaloObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.x[i] = 0;
        this.y[i] = 0;
        this.alive[i] = false;
        this.r[i] = 0;
    }
};

/**
 * 初始化效果
 */
HaloObj.prototype.born = function (x, y) {
    for (var i = 0; i < this.num; i++) {
        if (!this.alive[i]) {
            this.alive[i] = true;
            this.x[i] = x;
            this.y[i] = y;
            this.r[i] = 10;
            return;
        }
    }
};

HaloObj.prototype.draw = function () {
    ctx1.save();
    ctx1.lineWidth = 3;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = 'rgba(203, 91, 0, 1)';
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) {
            this.r[i] += deltaTime * 0.05;
            if (this.r[i] > 100) {
                this.alive[i] = false;
                break;
            }
            var alpha = 1 - this.r[i] / 100;

            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
            ctx1.closePath();
            ctx1.strokeStyle = 'rgba(203, 91, 0,' + alpha + ')';
            ctx1.stroke();
        }
    }
    ctx1.restore();
};


/**
 * 漂浮物效果
 * @constructor
 */
var DustObj = function () {
    this.x = [];
    this.y = [];
    this.amp = [];
    this.no = [];

    this.pic = [];
};

DustObj.prototype.num = 30;

DustObj.prototype.init = function () {
    var i;
    for (i = 0; i < 7; i++) {
        this.pic[i] = new Image();
        this.pic[i].src = './src/dust' + i + '.png';
    }

    for (i = 0; i < this.num; i++) {
        this.x[i] = Math.random() * canWidth;
        this.y[i] = Math.random() * canHeight;
        this.amp[i] = 20 + Math.random() * 15;
        this.no[i] = Math.floor(Math.random() * 7);
    }
    this.alpha = 0;
};

DustObj.prototype.draw = function () {
    this.alpha += deltaTime * 0.0008;
    var l = Math.sin(this.alpha);
    for (var i = 0; i < this.num; i++) {
        ctx1.drawImage(this.pic[this.no[i]], this.x[i] + this.amp[i] * l, this.y[i]);
    }
};