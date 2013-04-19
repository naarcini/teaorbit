function Networking(game) {
    this.game = game;
    var that = this;

    this.sock = new SockJS('/updates');
    this.sock.onopen = function() {
        console.log('Connected');
        that.game.connect(that.sock);
    };
    this.sock.onmessage = function(e) {
        //console.log('message', e.data);
        var message = JSON.parse(e.data);

        // initial login
        if(message.action == 'session') {
            window.session_id = message.body.session_id;
            console.log("Logged in, session ID: " + window.session_id);
        }

        // game state
        if(message.action == 'state') {
            var state = message.body;
            // update positions of existing players
            $.each(state.players, function(session, player) {
                if(session != window.session_id) {
                    if(session in that.game.other_dudes && that.game.other_dudes[session]) {
                        var prev_x = that.game.other_dudes[session].xpos;
                        var prev_y = that.game.other_dudes[session].ypos;
                        var dx = player.position.x - prev_x;
                        var dy = player.position.y - prev_y;
                        that.game.update_dude(that.game.other_dudes[session], player.position.x, player.position.y, dx, dy, 0);
                    } else {
                        that.game.other_dudes[session] = new dude(session, 0, 0, 0, 0, that.game.move_speed, 0);
                        console.log('Added player ' + session);
                    }
                }
            });
            // delete players that left
            $.each(that.game.other_dudes, function(session, player) {
                if(!(session in state.players)) {
                    delete that.game.other_dudes[session];
                }
            });
        }

        // general activity log
        if(message.action == 'log') {
            console.log("Log: " + message.body.message);
        }
    };
    this.sock.onclose = function() {
        console.log('Connection closed');
    };
    return this;
}
