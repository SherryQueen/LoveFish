/**
 * Created by sherry on 15-12-26.
 */

var can1, can2;
var ctx1, ctx2;

var lastTime, deltaTime;

var bgPic = new Image();
var canWidth, canHeight;

var mx = 0, my = 0;

var data;
var wave, halo, dust;
var ane, fruit, mom, baby;

document.body.onload = game;

/**
 * js 入口
 */
function game() {
    init();
    lastTime = Date.now();
    deltaTime = 0;
    gameLoop();
}

/**
 * 初始化
 */
function init() {
    can1 = document.getElementById("canvas1");
    can2 = document.getElementById("canvas2");
    ctx1 = can1.getContext("2d");
    ctx2 = can2.getContext("2d");

    can1.addEventListener('mousemove', onMouseMove, false);

    bgPic.src = "./src/background.jpg";
    canWidth = can1.width;
    canHeight = can1.height;

    ane = new AneObj();
    ane.init();

    fruit = new FruitObj();
    fruit.init();

    mom = new MomObj();
    mom.init();

    baby = new BabyObj();
    baby.init();

    data = new DataObj();

    wave = new WaveObj();
    wave.init();

    halo = new HaloObj();
    halo.init();

    dust = new DustObj();
    dust.init();
}

/**
 * 定时循环执行
 */
function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    if (deltaTime > 40) deltaTime = 40;

    drawBackground();

    ane.draw();

    fruit.control();
    fruit.draw();

    ctx1.clearRect(0, 0, canWidth, canHeight);
    mom.draw();
    baby.draw();

    momFruitsCollision();
    momBabyCollision();

    data.draw();

    wave.draw();
    halo.draw();
    dust.draw();
}

/**
 * 绘制背景
 */
function drawBackground() {
    ctx2.drawImage(bgPic, 0, 0, canWidth, canHeight);
}

/**
 * 鼠标移动事件
 * @param e
 */
function onMouseMove(e) {
    if (!data.gameOver) {
        if (e.offsetX || e.layerX) {
            mx = e.offsetX == undefined ? e.layerX : e.offsetX;
            my = e.offsetY == undefined ? e.layerY : e.offsetY;
        }
    }
}