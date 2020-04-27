function startBuild() {
    myArea.start();
    $('#upload_btn').hide();
    $('#create_btn').hide();
    $('.map_container').append('<button onclick="changePiece(0)">Square</button>' +
    '<button onclick="changePiece(1)">Rectangle</button>' +
    '<button onclick="changePiece(2)">Circle</button>' +
    '<br><button onclick="rotate()">Rotate</button>' + 
    '<button onclick="rescale(1)">Scale Up</button>' +
    '<button onclick="rescale(0)">Scale Down</button>' +
    '<button onclick="undo()">Undo</button>' +
    '<button onclick="wipe()">Wipe</button>' +
    '<br><input width="15" height="10" class="labelText"></input>' +
    '<button onclick="addLabel()">Add Label</button>' +
    '<select id="labels" size="5"></select>')
}

function changePiece(code) {
    piece = code;
}

function wipe() {
    components = [];
}

function makeLabel(label) {
    piece = 3;
    pieces[piece].label = label;
}

var labels = [];
function addLabel() {
    var label = $(".labelText").val();
    if (label !== "") {
        labels.push(label);
        $("#labels").append("<option onclick='makeLabel(\"" + label + "\")' value='" + label + "' id='" + label + "'>" + label + "</option>");
    }
}

function undo() {
    var c = components.pop();
    if (c.type === "Text") {
        labels.pop();
        $('#'+c.label).remove();

    }
}

function rectangle(width, height, color, x, y) {
    this.type = "Rectangle";
    this.width = width;
    this.height = height; 
    this.x = x;
    this.y = y;
    this.color = color;
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
    this.type = "Circle";
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
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

function text(color, x, y, label) {
    this.type = "Text";
    this.x = x;
    this.y = y;
    this.label = label;
    this.color = color;
    this.size = scale;
    this.update = function() {
        ctx = myArea.context;
        ctx.font = this.size + "px Arial";
        ctx.fillStyle = this.color
        ctx.fillText(this.label, this.x+10, this.y+10);
    }
    this.rescale = function() {
        this.size = scale;
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
pieces.push(new text("black", 0, 0, "")); // text


var myArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = $('div.map').width();
        this.canvas.height = $('div.map').height();
        this.canvas.style.cursor = "none";  // hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.getElementsByClassName("map")[0].append(this.canvas);
        this.interval = setInterval(updateArea, 20);
        document.getElementsByTagName("canvas")[0].classList.add("can");
        document.addEventListener('mousemove', function (e) {
            myArea.x = Math.ceil(e.pageX/10)*10 - 10 - $(".can").offset().left;
            myArea.y = Math.ceil(e.pageY/10)*10 - 10 - $(".can").offset().top;
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
