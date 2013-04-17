function setCanvasSize(canvas_jq, width, height) {
    canvas_jq.css('width', width);
    canvas_jq.css('height', height);
    canvas_jq.attr('width', width);
    canvas_jq.attr('height', height);
    var canvas = canvas_jq.get(0);
    var context = canvas.getContext("2d");
    // make the h/w accessible from context obj as well
    context.width = width;
    context.height = height;

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    var ratio = devicePixelRatio / backingStoreRatio;

    // upscale the canvas if the two ratios don't match
    if(devicePixelRatio !== backingStoreRatio) {
        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        context.scale(ratio, ratio);
    }

}
    
function Canvas(jq_elem) {
    // create a canvas inside another element
    // and set the height&width to fill the element
    var canvas_jq = $('<canvas>');
    var width = jq_elem.innerWidth();
    var height = jq_elem.innerHeight();
    
    setCanvasSize(canvas_jq, width, height);

    canvas_jq.appendTo(jq_elem);
    return canvas_jq;
}

function background() {
    this.img = new Image();
    
}

function dude(xpos, ypos, move_speed, dude_height, dude_width) {
    // Instance variables
    this.xpos = xpos;
    this.ypos = ypos;
    this.dx = 0;
    this.dy = 0;
    this.move_speed = move_speed;
    this.dude_height = dude_height;
    this.dude_width = dude_width;
    
    // Methods
    character = function( ctx ) {
        
    }

    move = function( ctx, width, height ) {
    /*
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        xpos = xpos + dx;
        ypos = ypos + dy;
        if( xpos > width-dude_size )
            xpos = width-dude_size;
        if( xpos < dude_size )
            xpos = dude_size;
        if( ypos > height-dude_size )
            ypos = height-dude_size;
        if( ypos < dude_size )
            ypos = dude_size;
    */
        character(ctx);
    }

    talk = function( ctx, width, height, text ) {
        var x = xpos + dude_size + 5;
        var y = ypos - 5;

        var curvy_width = 20;
        var curvy_height = 20;
        var curviness = 10;

        // Draw curvy part
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x+curvy_width/2+curviness, y-curvy_height/2, x, y-curvy_height);
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x+curvy_width/2+curviness, y-curvy_height/2, x+curvy_height, y-curvy_height);
        
        //Draw Rectangular part
        var rect_x = x + curvy_width/2 - width/2;
        var rect_y = y - curvy_height - height;

        ctx.moveTo(rect_x, rect_y+radius);
        ctx.lineTo(rect_x, rect_y+height-radius);
        ctx.quadraticCurveTo(rect_x, rect_y+height, rect_x+radius, rect_y+height);
        ctx.lineTo(rect_x+width/2-curvy_width/2, rect_y+height);
        ctx.moveTo(rect_x+width/2+curvy_width/2, rect_y+height);
        ctx.lineTo(rect_x+width-radius, rect_y+height);
        ctx.quadraticCurveTo(rect_x+width, rect_y+height, rect_x+width, rect_y+height-radius);
        ctx.lineTo(rect_x+width, rect_y+radius);
        ctx.quadraticCurveTo(rect_x+width, rect_y, rect_x+width-radius, rect_y);
        ctx.lineTo(rect_x+radius, rect_y);
        ctx.quadraticCurveTo(rect_x, rect_y, rect_x, rect_y+radius);
        ctx.stroke();
    }

    move_start = function( keyCode ) {
        if( code == 37 ) {
            // Left
            dx = -move_speed;
        }
        else if( code == 38 ) {
            // Up
            dy = -move_speed;
        }
        else if( code == 39 ) {
            // Right
            dx = move_speed;
        }
        else if( code == 40 ) {
            // Down
            dy = move_speed;
        }
    }

    move_stop = function( keyCode ) {
        if( code == 37 && dx == -move_speed ) {
            // Left
            dx = 0;
        }
        else if( code == 38 && dy == -move_speed ) {
            // Up
            dy = 0;
        }
        else if( code == 39 && dx == move_speed ) {
            // Right
            dx = 0;
        }
        else if( code == 40 && dy == move_speed ) {
            // Down
            dy = 0;
        }
    }

    change_speed = function( speed ) {
        move_speed = speed
    }

    return this;
}
