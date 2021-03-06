var canvas, context, canvaso, contexto;

// The active tool instance.
var tool;
var tool_default = 'line';

function init() {
    // Find the canvas element.
    canvaso = document.getElementById('imageView');
    if (!canvaso) {
        alert('Error: I cannot find the canvas element!');
        return;
    }

    if (!canvaso.getContext) {
        alert('Error: no canvas.getContext!');
        return;
    }

    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
        alert('Error: failed to getContext!');
        return;
    }

    // Add the temporary canvas.
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
        alert('Error: I cannot create a new canvas element!');
        return;
    }

    canvas.id = 'imageTemp';
    canvas.width = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');

    // Get the tool select input.
    var tool_select = document.getElementById('dtool');
    if (!tool_select) {
        alert('Error: failed to get the dtool element!');
        return;
    }
    tool_select.addEventListener('change', ev_tool_change, false);

    // Activate the default tool.
    if (tools[tool_default]) {
        tool = new tools[tool_default]();
        tool_select.value = tool_default;
    }

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);

}

// The general-purpose event handler. This function just determines the mouse 
// position relative to the canvas element.
function ev_canvas(ev) {
    ev._x = ev.layerX;
    ev._y = ev.layerY;

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

// The event handler for any changes made to the tool selector.
function ev_tool_change(ev) {
    if (tools[this.value]) {
        tool = new tools[this.value]();
    }
}

// This function draws the #imageTemp canvas on top of #imageView, after which 
// #imageTemp is cleared. This function is called each time when the user 
// completes a drawing operation.
function img_update() {
    contexto.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// This object holds the implementation of each drawing tool.
var tools = {};

// The drawing pencil.
tools.pencil = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {

        context.beginPath();

        // pencil properties
        context.lineWidth = 10; // width of pencil
        context.lineCap = "round"; // rounded end cap
        context.strokeStyle = colors; // color of pencil
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    // This function is called every time you move the mouse. 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
        if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
        }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// The rectangle tool.
tools.rect = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!w || !h) {
            return;
        }

        // line properties
        context.lineWidth = 10; // width of line
        context.lineCap = "round"; // rounded end cap
        context.strokeStyle = colors; //color of line
        context.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// The line tool.
tools.line = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();

        // line properties
        context.lineWidth = 10; // width of line
        context.lineCap = "round"; // rounded end cap
        context.strokeStyle = colors; //color of line

        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x, ev._y);
        context.stroke();
        context.closePath();
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

//Color palette
var colors;
function changeColors(palette) {
    switch (palette.id) {
        case "red":
            colors = "red";
            break;
        case "red1":
            colors = "#F16161";
            break;
        case "red2":
            colors = "#F69FA0";
            break;
        case "orange":
            colors = "orange";
            break;
        case "orange1":
            colors = "#F99F62";
            break;
        case "orange2":
            colors = "#FBB57B";
            break;
        case "blue":
            colors = "#09C2DB";
            break;
        case "blue1":
            colors = "#8BD3DC";
            break;
        case "blue2":
            colors = "#B9E3E8";
            break;
        case "indigo":
            colors = "#0E38AD";
            break;
        case "indigo1":
            colors = "#546AB2";
            break;
        case "indigo2":
            colors = "#9C96C9";
            break;
        case "green":
            colors = "green";
            break;
        case "green1":
            colors = "#97CD7E";
            break;
        case "green2":
            colors = "#C6E2BB";
            break;
        case "black":
            colors = "black";
            break;
        case "black1":
            colors = "#545454";
            break;
        case "black2":
            colors = "#B2B2B2";
            break;
        case "yellow":
            colors = "yellow";
            break;
        case "yellow1":
            colors = "#F7F754";
            break;
        case "yellow2":
            colors = "#F7F4B1";
            break;
        case "purple":
            colors = "#B9509E";
            break;
        case "purple1":
            colors = "#D178B1";
            break;
        case "purple2":
            colors = "#E3ABCE";
            break;
        // case "erase":
        // 	colors = "white";
        // 	break;
    }

    //     console.log(colors);

    //return colors;
};

//Clear canvas
function erase() {
    contexto.clearRect(0, 0, canvaso.width, canvaso.height);
};

//Save image
var button = document.getElementById('dwnld');
button.addEventListener('click', function (e) {
    var dataURL = canvaso.toDataURL('image/png');
    button.href = dataURL;
});

init();
