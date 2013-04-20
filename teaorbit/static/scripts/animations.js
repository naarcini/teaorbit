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

    pixelRatio = ratio;

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

function Hat(owner, xpos, ypos) {
    this.owner = owner;
    this.xpos = xpos;
    this.ypos = ypos;

    this.get_image = function( tile_num ) {
        return $('#Hat_pic');
    }

    this.get_position = function() {
        return [this.xpos, this.ypos];
    }

    this.set_position = function(xpos, ypos) {
        this.xpos = xpos;
        this.ypos = ypos;
    }

    this.get_owner = function() {
        return this.owner;
    }

    this.set_owner = function(owner) {
        if( !owner ) {
            this.owner = null;
        }
        else {
            this.owner = owner;
        }
    }
}

function dude(player_id, xpos, ypos, dx, dy, move_speed, has_hat, guy) {
    // Instance variables
    this.player_id = player_id;
    this.xpos = xpos;
    this.ypos = ypos;
    this.dx = dx;
    this.dy = dy;
    this.move_speed = move_speed;
    this.has_hat = has_hat;
    this.guy = guy;

    // Methods
    this.get_image = function( tile_num ) {
        var img = null;
        var selector = null;
        var hat_text = this.has_hat ? 'HAT_' : '';
        var guy_text = this.guy.toString();
        var tile_text = tile_num.toString();
        if( tile_num < 10 ) {
            tile_text = '0'+ tile_text;
        }

        if( this.dx > 0 ) {
            selector = 'GUY'+guy_text+'_WALK_RIGHT_'+hat_text+tile_text;
        }
        else if( this.dx < 0) {
            selector = 'GUY'+guy_text+'_WALK_LEFT_'+hat_text+tile_text
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
        return img;
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

    this.set_guy = function(guy) {
        this.guy = guy;
    }

    this.get_guy = function() {
        return this.guy;
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
    this.other_dudes = {};

    var that = this;
    this.network = null
    this.hat = new Hat(null, 700, 700);

    // Methods
    this.init = function() {
        this.game_canvas = new Canvas(jq_elem);
        this.context = this.game_canvas.get(0).getContext('2d');

        this.background = $('#game_background');
        this.background_height = this.background.height();
        this.background_width = this.background.width();
        this.background_img = this.background.get(0);

        this.xpos_img = this.background_width/2;
        this.ypos_img = this.background_height/2;

        // dude(player_id, xpos, ypos, dx, dy, move_speed, has_hat)
        this.your_dude = new dude("you", this.xpos, this.ypos, this.dx, this.dy, this.move_speed, 0, 1);
        //this.other_dudes["not_you"] = new dude("not_you", this.test_dude_x, 0, 10, 0, this.move_speed, 1);
        //this.hat = new Hat(null, 700, 700);

        this.tile_num = 1;
        this.total_tiles = 2;
        this.frame_counter = 1;
        this.tile_interval = 10;

    }

    this.connect = function(network) {
        this.network = network;
    }

    this.resetGameCanvas = function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
    }

    this.move = function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
        this.update_locations();

        // Draw background - Wrap around if too big
        this.draw_background();

        // Update player
        this.your_dude = this.update_dude(this.your_dude, this.xpos, this.ypos, this.dx, this.dy, this.your_dude.get_hat_status(), this.your_dude.get_guy());

        // Update and draw other dudes
        $.each(this.other_dudes, function(session_id, dude) {
            //var dude = that.update_dude(dude, dude.posx, dude.posy, dude.dx, 0, 1);
            that.draw_object(dude);
        });

        // Update and draw hat
        this.update_hat();

        // Send information
        var json_message = JSON.stringify({'action': 'move', 'body': {'session': window.session_id, 'x': this.xpos, 'y': this.ypos, 'dx': this.dx, 'dy': this.dy, 'hat_owner': this.your_dude.get_hat_status()}});
        if(this.network !== null) {
            //console.log(json_message);
            this.network.send(json_message);
        }

        // Draw player
        this.draw_object(this.your_dude);

    }

    this.set_hat_owner = function(owner) {
        this.hat.set_owner(owner);
    }

    this.update_hat = function() {
        var image_jq, img, img_height, img_width, x_off, x_off_other, y_off, y_off_other, hat_x, hat_y;

        if( !this.hat.get_owner() ) {
            hat_x = this.hat.get_position()[0];
            hat_y = this.hat.get_position()[1];

            image_jq = this.hat.get_image(this.tile_num);
            img = image_jq.get(0);
            img_height = image_jq.height()/2;
            img_width = image_jq.width()/2;

            x_off = (hat_x - this.xpos);
            x_off_other = x_off < 0 ? (2*this.max_x - Math.abs(x_off)) : (2*this.max_x - x_off)*(-1);
            x_off_other = (x_off == 0) ? 0 : x_off_other;
            y_off = (hat_y - this.ypos);
            y_off_other = y_off < 0 ? (2*this.max_y - Math.abs(y_off)) : (2*this.max_y - y_off)*(-1);
            y_off_other = (y_off == 0) ? 0 : y_off_other;

            if( (Math.abs(x_off) < 50 || Math.abs(x_off_other) < 50) && (Math.abs(y_off) < 50 || Math.abs(y_off_other) < 50) ) {
                this.hat.set_owner(window.session_id);
                this.your_dude.set_hat_status(1);
            }
        }
        else if ( this.hat.get_owner() != window.session_id ){
            this.your_dude.set_hat_status(0);
        }
        else {
            this.hat.set_position(this.your_dude.get_position()[0], this.your_dude.get_position()[1]);
        }

        if( !this.hat.get_owner() ) {
            this.draw_object(this.hat);
        }
    }

    this.update_dude = function(dude, xpos, ypos, dx, dy, has_hat, guy) {
        dude.set_position(xpos, ypos);
        dude.set_movement(dx, dy);
        dude.set_hat_status(has_hat);
        dude.set_guy(guy);

        return dude;
    }

    this.draw_object = function(object) {
        var image_jq, img, img_height, img_width, obj_x, obj_y, x_off, x_off_other, y_off, y_off_other;
        var draw_locations = new Array();
        obj_x = object.get_position()[0];
        obj_y = object.get_position()[1];

        if( false ) {
            console.log([object.get_position()[0], object.get_position()[1], this.xpos, this.ypos]);
        }

        image_jq = object.get_image(this.tile_num);
        img = image_jq.get(0);
        img_height = image_jq.height()/2;
        img_width = image_jq.width()/2;

        x_off = (obj_x - this.xpos);
        x_off_other = x_off < 0 ? (2*this.max_x - Math.abs(x_off)) : (2*this.max_x - x_off)*(-1);
        x_off_other = (x_off == 0) ? 0 : x_off_other;
        y_off = (obj_y - this.ypos);
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
                draw_x = this.context.width/2 - img_width/2 + x_off;
                draw_y = this.context.height/2 - img_height/2 - y_off;
                draw_locations.push([draw_x, draw_y]);
            }
            if( Math.abs(x_off_other) < this.context.width/2 && Math.abs(y_off_other) < this.context.height/2) {
                draw_x = this.context.width/2 - img_width/2 + x_off_other;
                draw_y = this.context.height/2 - img_height/2 - y_off_other;
                draw_locations.push([draw_x, draw_y]);
            }
        }

        for( var i=0; i<draw_locations.length; i++ ) {
            this.context.drawImage(img, draw_locations[i][0], draw_locations[i][1], img_width, img_height);
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
