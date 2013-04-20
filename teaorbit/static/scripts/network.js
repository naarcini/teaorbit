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
            var hat_owner = state.hat.owner;
            that.game.hat.set_owner(hat_owner);
            that.game.hat.set_position(state.hat.x, state.hat.y);

            // update positions of existing players
            $.each(state.players, function(session, player) {
                if(session != window.session_id) {
                    var has_hat = 0 | (hat_owner == session);
                    if(session in that.game.other_dudes && that.game.other_dudes[session]) {
                        that.game.update_dude(that.game.other_dudes[session], player.position.x, player.position.y, player.movement.dx, player.movement.dy, has_hat, player.character);
                    } else {
                        that.game.other_dudes[session] = new dude(session, 0, 0, 0, 0, that.game.move_speed, 0, player.character);
                        console.log('Added player ' + session);
                    }
                }
                else {
                    that.game.update_dude(that.game.your_dude, player.position.x, player.position.y, player.movement.dx, player.movement.dy, that.game.your_dude.get_hat_status(), player.character);
                }
            });

            // delete players that left
            $.each(that.game.other_dudes, function(session, player) {
                if(!(session in state.players)) {
                    if( hat_owner == session ) {
                        that.game.hat.set_owner(0);
                    }
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
