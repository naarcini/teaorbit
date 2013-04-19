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
    this.character = function( tile_num ) {
        var img = null;
        var selector = null;
        var mirror = false;
        var hat_text = this.has_hat ? 'HAT_' : '';
        var guy_text = this.guy.toString();
        var tile_text = tile_num.toString();
        if( tile_num < 10 ) {
            tile_text = '0'+ tile_text;
        }

        if( this.dx > 0 ) {
            selector = 'GUY'+guy_text+'_WALK_SIDE_'+hat_text+tile_text;
            mirror = true;
        }
        else if( this.dx < 0) {
            selector = 'GUY'+guy_text+'_WALK_SIDE_'+hat_text+tile_text
        }
        else if( this.dy > 0 ) {
            selector = 'GUY'+guy_text+'_WALK_FRONT_'+hat_text+tile_text;
        }
        else if( this.dy < 0 ) {
            selector = 'GUY'+guy_text+'_WALK_BACK_'+hat_text+tile_text;
        }
        else {
            selector = 'GUY'+guy_text+'_IDLE_'+hat_text+tile_text;
        }

        img = $('#'+selector);
        return [img, mirror];
    }

    this.get_player = function() {
        return player_id;
    }

    this.get_position = function() {
        return [this.xpos, this.ypos];
    }

    this.set_position = function(xpos, ypos) {
        this.xpos = xpos;
        this.ypos = ypos;
    }

    this.get_movement = function() {
        return[this.dx, this.dy];
    }

    this.set_movement = function(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    this.get_hat_status = function() {
        return this.has_hat;
    }

    this.set_hat_status = function(has_hat) {
        this.has_hat = has_hat;
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
    this.test_dude_x = 0;

    // Methods
    this.init = function() {
        this.game_canvas = new Canvas(jq_elem);
        this.context = this.game_canvas.get(0).getContext('2d');

        this.background = $('#game_background');
        this.background_height = this.background.height();
        this.background_width = this.background.width();
        this.background_img = this.background.get(0);
        /*
        console.log(this.background);
        console.log(this.background_width);
        console.log(this.background_height);
        console.log(this.background_img);
        console.log(this.jq_elem);
        console.log(this.context.width);
        console.log(this.context.height);
        */

        this.xpos_img = this.background_width/2;
        this.ypos_img = this.background_height/2;

        // dude(player_id, xpos, ypos, dx, dy, move_speed, has_hat)
        this.your_dude = new dude("you", this.xpos, this.ypos, this.dx, this.dy, this.move_speed, 0);
        this.other_dudes = [new dude("not_you", this.test_dude_x, 0, 10, 0, this.move_speed, 1)];
        this.hat_position = null;

        this.tile_num = 1;
        this.total_tiles = 2;
        this.frame_counter = 1;
        this.tile_interval = 10;
    }

    this.resetGameCanvas = function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
    }

    this.move = function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
        this.update_locations();

        // Draw background - Wrap around if too big
        this.draw_background();

        // Update and draw other dudes
        for( var i=0; i<this.other_dudes.length; i++ ) {
            this.other_dudes[i] = this.update_dude(this.other_dudes[i], this.test_dude_x, 0, 10, 0, 1);
            this.draw_dude(this.other_dudes[i]);
        }

        // Update and Draw the player - mirror if necessary.
        // dude(player_id, xpos, ypos, dx, dy, move_speed, has_hat)
        this.your_dude = this.update_dude(this.your_dude, this.xpos, this.ypos, this.dx, this.dy, 0);
        this.draw_dude(this.your_dude);
        /*
        this.your_dude.set_position(this.xpos, this.ypos);
        this.your_dude.set_movement(this.dx, this.dy);
        var image_info, img, img_height, img_width, ctx;

        image_info = this.your_dude.character(this.tile_num);
        img = image_info[0].get(0);
        img_height = image_info[0].height()/2;
        img_width = image_info[0].width()/2;

        if( image_info[1] ) {
            this.context.save();
            this.context.translate(this.context.canvas.width, 0);
            this.context.scale(-1, 1);
            this.context.drawImage(img, this.context.width/2 - img_width/2, this.context.height/2 - img_height/2, img_width, img_height);
            this.context.restore();
        }
        else {
            this.context.drawImage(img, this.context.width/2 - img_width/2, this.context.height/2 - img_height/2, img_width, img_height);
        }
        */
    }

    this.update_dude = function(dude, xpos, ypos, dx, dy, has_hat) {
        dude.set_position(xpos, ypos);
        dude.set_movement(dx, dy);
        dude.set_hat_status(has_hat);

        return dude;
    }

    this.draw_dude = function(dude) {
        var image_info, img, img_height, img_width, dude_x, dude_y, x_off, x_off_other, y_off, y_off_other;
        var draw_locations = new Array();
        dude_x = dude.get_position()[0];
        dude_y = dude.get_position()[1];

        if( false ) {
            console.log([dude.get_position()[0], dude.get_position()[1], this.xpos, this.ypos]);
        }

        image_info = dude.character(this.tile_num);
        img = image_info[0].get(0);
        img_height = image_info[0].height()/2;
        img_width = image_info[0].width()/2;

        x_off = (dude_x - this.xpos);
        x_off_other = x_off < 0 ? (2*this.max_x - Math.abs(x_off)) : (2*this.max_x - x_off)*(-1);
        x_off_other = (x_off == 0) ? 0 : x_off_other;
        y_off = (dude_y - this.ypos);
        y_off_other = y_off < 0 ? (2*this.max_y - Math.abs(y_off)) : (2*this.max_y - y_off)*(-1);
        y_off_other = (y_off == 0) ? 0 : y_off_other;

        var draw_x, draw_y;
        if( x_off == 0 && y_off == 0 ) {
            draw_x = this.context.width/2 - img_width/2;
            draw_y = this.context.height/2 - img_height/2;
            draw_locations.push([draw_x, draw_y])
        }
        else {
            if( Math.abs(x_off) < this.context.width/2 && Math.abs(y_off) < this.context.height/2) {
                draw_x = this.context.width/2 - img_width/2 - x_off;
                draw_y = this.context.height/2 - img_height/2 - y_off;
                draw_locations.push([draw_x, draw_y]);
            }
            if( Math.abs(x_off_other) < this.context.width/2 && Math.abs(y_off_other) < this.context.height/2) {
                draw_x = this.context.width/2 - img_width/2 - x_off_other;
                draw_y = this.context.height/2 - img_height/2 - y_off_other;
                draw_locations.push([draw_x, draw_y]);
            }
        }

        for( var i=0; i<draw_locations.length; i++ ) {
            if( image_info[1] ) {
                // Mirror the image
                this.context.save();
                this.context.translate(this.context.canvas.width, 0);
                this.context.scale(-1, 1);
                this.context.drawImage(img, draw_locations[i][0], draw_locations[i][1], img_width, img_height);
                this.context.restore();
            }
            else {
                this.context.drawImage(img, draw_locations[i][0], draw_locations[i][1], img_width, img_height);
            }
        }
    }

    this.move_start = function( keyCode ) {
        if( keyCode == 37 ) {
            // Left
            this.dx = -this.move_speed;
        }
        else if( keyCode == 38 ) {
            // Up
            this.dy = -this.move_speed;
        }
        else if( keyCode == 39 ) {
            // Right
            this.dx = this.move_speed;
        }
        else if( keyCode == 40 ) {
            // Down
            this.dy = this.move_speed;
        }
    }

    this.move_stop = function( keyCode ) {
        if( keyCode == 37 && this.dx == -this.move_speed ) {
            // Left
            this.dx = 0;
        }
        else if( keyCode == 38 && this.dy == -this.move_speed ) {
            // Up
            this.dy = 0;
        }
        else if( keyCode == 39 && this.dx == this.move_speed ) {
            // Right
            this.dx = 0;
        }
        else if( keyCode == 40 && this.dy == this.move_speed ) {
            // Down
            this.dy = 0;
        }
    }

    this.change_speed = function( speed ) {
        move_speed = speed;
    }

    this.update_locations = function() {
        // Actual x and y positions
        this.xpos = this.xpos + this.dx;
        if( Math.abs(this.xpos) >= this.max_x ) {
            this.xpos = this.xpos < 0 ? (this.max_x - Math.abs(this.xpos + this.max_x)) : (Math.abs(this.xpos - this.max_x) - this.max_x);
        }
        this.ypos = this.ypos - this.dy;
        if( Math.abs(this.ypos) >= this.max_y ) {
            this.ypos = this.ypos < 0 ? (this.max_y - Math.abs(this.ypos + this.max_y)) : (Math.abs(this.ypos - this.max_y) - this.max_y);
        }

        this.test_dude_x = this.test_dude_x + 10;
        if( Math.abs(this.test_dude_x) >= this.max_x ) {
            this.test_dude_x = this.test_dude_x < 0 ? (this.max_x - Math.abs(this.test_dude_x + this.max_x)) : (Math.abs(this.test_dude_x - this.max_x) - this.max_x);
        }

        // x and y relative to background
        this.xpos_img = (this.xpos_img + this.dx) % this.background_width;
        this.xpos_img = this.xpos_img < 0 ? this.background_width + this.xpos_img : this.xpos_img;
        this.ypos_img = (this.ypos_img + this.dy) % this.background_height;
        this.ypos_img = this.ypos_img < 0 ? this.background_height + this.ypos_img : this.ypos_img;

        // Update frame
        this.frame_counter = (this.frame_counter + 1) % this.tile_interval;
        if( this.frame_counter == 0 ) {
            this.tile_num = (this.tile_num + 1) > this.total_tiles ? 1 : this.tile_num + 1;
        }
    }

    this.draw_background = function() {
        var sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;

        if( this.xpos_img + this.context.width/2 > this.background_width ) {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
                // Bottom right

                sx = this.xpos_img - this.context.width/2;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 + (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 + (this.background_height - this.ypos_img);
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 - (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 + (this.background_height - this.ypos_img);
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.xpos_img - this.context.width/2;
                sy = 0;
                sWidth = this.context.width/2 + (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 - (this.background_height - this.ypos_img);
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = 0;
                sWidth = this.context.width/2 - (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 - (this.background_height - this.ypos_img);
                dx = this.context.width - sWidth;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            else if ( this.ypos_img - this.context.height/2 < 0 ) {
                // Top right

                sx = this.xpos_img - this.context.width/2;
                sy = this.background_height - (this.context.height/2 - this.ypos_img);
                sWidth = this.context.width/2 + (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 - this.ypos_img;
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.background_height - (this.context.height/2 - this.ypos_img);
                sWidth = this.context.width/2 - (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 - this.ypos_img;
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.xpos_img - this.context.width/2;
                sy = 0;
                sWidth = this.context.width/2 + (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 + this.ypos_img;
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = 0;
                sWidth = this.context.width/2 - (this.background_width - this.xpos_img);
                sHeight = this.context.height/2 + this.ypos_img;
                dx = this.context.width - sWidth;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            else {
                // Far right

                sx = this.xpos_img - this.context.width/2;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 + (this.background_width - this.xpos_img);
                sHeight = this.context.height;
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 - (this.background_width - this.xpos_img);
                sHeight = this.context.height;
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
        else if ( this.xpos_img - this.context.width/2 < 0 ) {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
                // Bottom left

                sx = this.background_width - (this.context.width/2 - this.xpos_img);
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 - this.xpos_img;
                sHeight = this.context.height/2 + (this.background_height - this.ypos_img);
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 + this.xpos_img;
                sHeight = this.context.height/2 + (this.background_height - this.ypos_img);
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.background_width - (this.context.width/2 - this.xpos_img);
                sy = 0;
                sWidth = this.context.width/2 - this.xpos_img;
                sHeight = this.context.height/2 - (this.background_height - this.ypos_img);
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = 0;
                sWidth = this.context.width/2 + this.xpos_img;
                sHeight = this.context.height/2 - (this.background_height - this.ypos_img);
                dx = this.context.width - sWidth;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                
            }
            else if ( this.ypos_img - this.context.height/2 < 0) {
                // Top left

                sx = this.background_width - (this.context.width/2 - this.xpos_img);
                sy = this.background_height - (this.context.height/2 - this.ypos_img);
                sWidth = this.context.width/2 - this.xpos_img;
                sHeight = this.context.height/2 - this.ypos_img;
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.background_height - (this.context.height/2 - this.ypos_img);
                sWidth = this.context.width/2 + this.xpos_img;
                sHeight = this.context.height/2 - this.ypos_img;
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.background_width - (this.context.width/2 - this.xpos_img);
                sy = 0;
                sWidth = this.context.width/2 - this.xpos_img;
                sHeight = this.context.height/2 + this.ypos_img;
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = 0;
                sWidth = this.context.width/2 + this.xpos_img;
                sHeight = this.context.height/2 + this.ypos_img;
                dx = this.context.width - sWidth;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            else {
                // Far left

                sx = this.background_width - (this.context.width/2 - this.xpos_img);
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 - this.xpos_img;
                sHeight = this.context.height;
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = 0;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width/2 + this.xpos_img;
                sHeight = this.context.height;
                dx = this.context.width - sWidth;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
        else {
            if( this.ypos_img + this.context.height/2 > this.background_height ) {
                // Bottom

                sx = this.xpos_img - this.context.width/2;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width;
                sHeight = this.context.height/2 + (this.background_height - this.ypos_img);
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.xpos_img - this.context.width/2;
                sy = 0;
                sWidth = this.context.width;
                sHeight = this.context.height/2 - (this.background_height - this.ypos_img);
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            else if ( this.ypos_img - this.context.height/2 < 0 ) {
                // Top

                sx = this.xpos_img - this.context.width/2;
                sy = this.background_height - (this.context.height/2 - this.ypos_img);
                sWidth = this.context.width;
                sHeight = this.context.height/2 - this.ypos_img;
                dx = 0;
                dy = 0;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                sx = this.xpos_img - this.context.width/2;
                sy = 0;
                sWidth = this.context.width;
                sHeight = this.context.height/2 + this.ypos_img;
                dx = 0;
                dy = this.context.height - sHeight;
                dWidth = sWidth;
                dHeight = sHeight;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            else {
                // Middle

                sx = this.xpos_img - this.context.width/2;
                sy = this.ypos_img - this.context.height/2;
                sWidth = this.context.width;
                sHeight = this.context.height;
                dx = 0;
                dy = 0;
                dWidth = this.context.width;
                dHeight = this.context.height;
                this.context.drawImage(this.background_img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
    }

    this.animLoop = function() {
        if(this.state == 'running') {
            this.anim_frame = requestAnimFrame(this.animLoop.bind(this));
            this.move();
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
