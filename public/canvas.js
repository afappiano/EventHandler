function startBuild() {
    myArea.start();
}

function changePiece(code) {
    piece = code;
}

function wipe() {
    components = [];
}

function rectangle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myArea.context;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
    this.rescale = function() {
        if (this.width !== this.height) this.width = scale*2;
        else this.width = scale;
        this.height = scale;
    }
}

function circle(radius, color, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }
    this.rescale = function() {
        this.radius = scale/2;
    }
}

function updateArea() {
    myArea.clear();
    
    if (myArea.x && myArea.y) {
        pieces[piece].x = myArea.x;
        pieces[piece].y = myArea.y;
    }
    for (i = 0; i < components.length; i++) {
        components[i].update();
    }
    pieces[piece].update();
}

function rotate() {
    var temp = pieces[piece].width;
    pieces[piece].width = pieces[piece].height;
    pieces[piece].height = temp;
}

function rescale(x) {
    if (x) {
        scale *= 2;
        for (i = 0; i < pieces.length; i++) {
            pieces[i].rescale();
        }
    }
    else {
        scale /= 2;
        for (i = 0; i < pieces.length; i++) {
            pieces[i].rescale();
        }
    }
}

var components = [];    // pieces on the canvas
var pieces = [];    // possible pieces 0: square, 1: rectangle, 2: circle
var piece = 0;
var scale = 20;
pieces.push(new rectangle(scale, scale, "white", 0, 0));   // square
pieces.push(new rectangle(scale*2, scale, "white", 0, 0));   // rectangle
pieces.push(new circle(scale/2, "white", 0, 0));  // circle


var myArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 300;
        this.canvas.style.cursor = "none";  // hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateArea, 20);
        window.addEventListener('mousemove', function (e) {
            myArea.x = Math.ceil(e.pageX/10)*10 - 10;
            myArea.y = Math.ceil(e.pageY/10)*10 - 10;
        })
        document.getElementsByTagName("canvas")[0].addEventListener('click', function (e) {
            var clone = Object.assign({}, pieces[piece]);
            components.push(clone);
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
