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

function dude(player_id, xpos, ypos, dx, dy, move_speed, has_hat) {
    // Instance variables
    this.player_id = player_id
    this.xpos = xpos;
    this.ypos = ypos;
    this.dx = dx;
    this.dy = dy;
    this.move_speed = move_speed;
    this.has_hat = has_hat;
    this.guy = 1;

    // Methods
    character = function( tile_num ) {
        var img = new Image();
        var mirror = false;
        var hat_text = this.has_hat ? 'HAT_' : '';
        var guy_text = this.guy.toString();
        var tile_text = tile_num.toString();
        if( tile_num < 10 ) {
            tile_text = '0'+ tile_text;
        }

        if( this.dx > 0 ) {
            img.src = '../GUY'+guy_text+'_WALK_SIDE_'+hat_text+tile_text+'.png';
            mirror = true;
        }
        else if( this.dx < 0) {
            img.src = '../GUY'+guy_text+'_WALK_SIDE_'+hat_text+tile_text+'.png';
        }
        else if( this.dy > 0 ) {
            img.src = '../GUY'+guy_text+'_WALK_FRONT_'+hat_text+tile_text+'.png';
        }
        else if( this.dy < 0 ) {
            img.src = '../GUY'+guy_text+'_WALK_BACK_'+hat_text+tile_text+'.png';
        }
        else {
            img.src = '../GUY'+guy_text+'_IDLE_'+hat_text+tile_text+'.png';
        }

        return [img, mirror];
    }

    get_player = function() {
        return player_id;
    }

    get_position = function() {
        return [this.xpos, this.ypos];
    }

    set_position = function(xpos, ypos) {
        this.xpos = xpos;
        this.ypos = ypos;
    }

    get_movement = function() {
        return[this.dx, this.dy];
    }

    set_movement = function(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

/*
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
    */

}

function gameCanvas(jq_elem, xpos, ypos, move_speed, max_x, max_y) {
    this.jq_elem = jq_elem;
    this.state = 'stopped';
    this.anim_frame = null;
    this.xpos = xpos;
    this.ypos = ypos;
    this.max_x = max_x;
    this.max_y = max_y;
    this.dx = 0;
    this.dy = 0;
    this.move_speed = move_speed;

    this.your_dude = null;
    this.other_dudes = null;

    // Methods
    this.init = function() {
        this.game_canvas = new Canvas(jq_elem);
        this.context = this.game_canvas.get(0).getContext('2d');

        this.background = $('#game_background');
        this.background_height = this.background.height();
        this.background_width = this.background.width();
        this.background_img = this.background[0];

        this.xpos_img = this.background_width/2;
        this.ypos_img = this.background_height/2;
    }

    this.resetGameCanvas = function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
    }

    this.move = function() {
        // Actual x and y positions
        this.context.clearRect(0, 0, this.context.width, this.context.height);
        this.xpos = this.xpos + this.dx;
        if( Math.abs(this.xpos) > max_x ) {
            this.xpos = this.xpos < 0 ? (max_x + (this.xpos % max_x)) : ((this.xpos % max_x) - max_x);
        }
        this.ypos = this.ypos + this.dy;
        if( Math.abs(this.ypos) > max_y ) {
            this.ypos = this.ypos < 0 ? (max_y + (this.ypos % max_y)) : ((this.ypos % max_y) - max_y);
        }

        // x and y relative to background
        this.xpos_img = (this.xpos_img + this.dx) % this.background_width;
        this.xpos_img = this.xpos_img < 0 ? this.background_width + this.xpos_img : this.xpos_img;
        this.ypos_img = (this.ypos_img + this.dy) % this.background_height;
        this.ypos_img = this.ypos_img < 0 ? this.background_height + this.ypos_img : this.ypos_img;

        // Draw background - Wrap around if too big
        var sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;

        if( this.xpos_img + this.context.width/2 > this.background_width ) {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
                
            }
            else if ( this.ypos_img - this.context.height/2 < this.background_height ) {
            }
            else {
            }
        }
        else if ( this.xpos_img - this.context.width/2 < 0 ) {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
            }
            else if ( this.ypos_img - this.context.height/2 < this.background_height ) {
            }
            else {
            }
        }
        else {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
            }
            else if ( this.ypos_img - this.context.height/2 < this.background_height ) {
            }
            else {
                sx = xpos_img - context.width/2;
                sy = ypos_img - context.height/2;
                sWidth = context.width;
                sHeight = context.height;
                dx = 0;
                dy = 0;
                dWidth = context.width;
                dHeight = context.height;
                drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
    }

    this.move_start = function( keyCode ) {
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

    this.move_stop = function( keyCode ) {
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

    this.change_speed = function( speed ) {
        move_speed = speed
    }

    this.animLoop = function() {
        if(this.state == 'running') {
            this.anim_frame = requestAnimFrame(this.animLoop.bind(this));
            move();
        }
    }

    this.start = function() {
        if( this.state != 'running') {
            this.state = 'running';
            this.animLoop();
        }
    }

    this.stop = function() {
        this.state = 'stopped';
        cancelAnimFrame(this.anim_frame);
    }
}
