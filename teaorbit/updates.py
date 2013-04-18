from tornado import web, ioloop
from sockjs.tornado import SockJSRouter, SockJSConnection
from teaorbit.game import GameState, Player
import simplejson as json

class Connection(SockJSConnection):
    participants = set()
    game_state = GameState()

    def on_open(self, info):
        sessid = self.session.session_id
        # Send that someone joined
        self.broadcast_text("{id} joined.".format(id=sessid))

        self.send_obj('session', {'session_id': sessid})

        # Add client to the clients list
        self.participants.add(self)
        self.game_state.add_player(sessid)

        self.debug()
        periodic = ioloop.PeriodicCallback(self.broadcast_state, 1000)
        periodic.start()

    def on_message(self, text):
        message = json.loads(text)
        if message['action'] == 'move':
            x = message['body']['x']
            y = message['body']['y']
            self.game_state.players[message['body']['session_id']].position.update(x, y)

    def on_close(self):
        sessid = self.session.session_id
        # Remove client from the clients list and broadcast leave message
        self.game_state.remove_player(sessid)
        self.participants.remove(self)
        self.broadcast_text("{id} left.".format(id=sessid))
        self.debug()

    def debug(self):
        print self.game_state.__dict__

    def send_obj(self, action, object):
        self.send(json.dumps({'action': action, 'body': object}))

    def broadcast_text(self, text):
        json_message = json.dumps({'action': 'log', 'body': {'message': text}})
        self.broadcast(self.participants, json_message)

    def broadcast_state(self):
        self.send_obj('state', self.game_state.dictify())
