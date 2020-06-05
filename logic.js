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
    ctx.strokeStyle = "#FFFFFF";
    start(60);
})();

function draw(){
    let temp = ctx.fillStyle;
    ctx.fillStyle = bkgrnd;
    rect(-1, -1, 2, 2);
    ctx.fillStyle = temp;

    rect(0, -1, 2/width, 2);
    rect(-1, 0, 2, 2/height);
    let last = points[0];
    points.forEach((point) => {
        if(last != null && point!= null)
            line(...last.vals, ...point.vals);
        last = point;
    })
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

function line(x1, y1, x2, y2){
    x1 = map(x1, range[0][0], range[0][1], 0, width);
    y1 = map(y1, range[1][0], range[1][1], 0, height);
    
    x2 = map(x2, range[0][0], range[0][1], 0, width);
    y2 = map(y2, range[1][0], range[1][1], 0, height);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

canvas.onmousedown = ((e) => {
    drawing = true;
    let x = map(e.pageX-canvas.offsetLeft, 0, width, range[0][0], range[0][1]);
    let y = map(e.pageY-canvas.offsetTop, 0, height, range[1][0], range[1][1]);

    points.push(new Matrix([x,y], [2,1]));
})

canvas.onmousemove = ((e) => {
    if(drawing){
        let x = map(e.pageX-canvas.offsetLeft, 0, width, range[0][0], range[0][1]);
        let y = map(e.pageY-canvas.offsetTop, 0, height, range[1][0], range[1][1]);

        points.push(new Matrix([x,y], [2,1]));
    }
})

canvas.onmouseup = ((e) => {
    drawing = false;
    points.push(null);
})

const lerp = (a, b, c) => (a*(1-c)+b*(c));

const transform = (matrix) => {
    points = points.map((point) => matrix.dot(point))
}