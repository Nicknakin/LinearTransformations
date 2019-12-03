var canvas = document.createElement("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 800;
canvas.height = 800;
// canvas.style = "position: fixed; top: 0; left: 0;";
canvas.style = "position:center;";

document.body.append(canvas); 

var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var drawing = false;
var range = [[-1, 1], [1, -1]];

let bkgrnd = "#000000";

let points = [];

var NG;
var octaves = 2;

let noiseScale;

let time = 0;
let drawInterval;
const adjustment = Math.PI*255/2;

const TWO_PI = Math.PI*2;

(function init(){
    ctx.fillStyle = "#000000";
    rect(-1, -1, 2, 2);
    ctx.fillStyle = "#FFFFFF";
    start(60);
})();

function draw(){
    let temp = ctx.fillStyle;
    ctx.fillStyle = bkgrnd;
    rect(-1, -1, 2, 2);
    ctx.fillStyle = temp;
    points.forEach((point) => {
        circle(point[0], point[1], 0.03);
    })
}

function fillPage(){
    time += 0.05;
    const s = 1;
    let temp = 0;
    let imgData = ctx.createImageData(canvas.width/s, canvas.height/s);
    let vals = new Uint8ClampedArray(canvas.width*canvas.height*4/s/s)
    .map((_, index) => (index%4==0)? temp = Math.floor(map(NG.noise([((index/4)%(canvas.width/s))*noiseScale[0], Math.floor(index/4/canvas.width/s)*noiseScale[1], time]), -1, 1, 0, 255)): temp)
    .map((val, index) => (index%4 == 3)? 255: val);
    imgData.data.set(vals);
    ctx.putImageData(imgData, 0, 0);
}

function start(Hz){
    stop();
    Hz = Hz? Hz : 1;
    drawInterval = setInterval(draw, 1000/Hz);
}

function stop(){
    clearInterval(drawInterval);
}

function rect(x, y, w, h){
    x = map(x, range[0][0], range[0][1], 0, width);
    y = map(y, range[1][0], range[1][1], 0, height);
    
    w = map(w, 0, range[0][1]-range[0][0], 0, width);
    h = map(h, 0, range[1][1]-range[1][0], 0, height);

    ctx.fillRect(x, y, w, h);
}

function circle(x, y, r){
    x = map(x, range[0][0], range[0][1], 0, width);
    y = map(y, range[1][0], range[1][1], 0, height);
    
    rX = map(r, 0, range[0][1]-range[0][0], 0, width);
    rY = map(r, 0, range[1][1]-range[1][0], 0, height);

    ctx.beginPath();
    ctx.arc(x, y, rX, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath(); 
}

canvas.onmousedown = ((e) => {
    drawing = true;
    let x = map(e.pageX-canvas.offsetLeft, 0, width, range[0][0], range[0][1]);
    let y = map(e.pageY-canvas.offsetTop, 0, height, range[1][0], range[1][1]);

    points.push([x,y]);
})

const lerp = (a, b, c) => (a*(1-c)+b*(c));