
class GameState(object):

    def __init__(self):
        self.players = {}
        self.hat = Hat()
        print "Blank game initiated"

    def add_player(self, session_id):
        player = Player(session_id)
        self.players[session_id] = player
        return player

    def remove_player(self, session_id):
        if self.hat.owner == session_id:
            self.hat.owner = None
            self.hat.position = players[session_id].position
        del self.players[session_id]

    def assign_hat(self, session_id):
        if self.hat.owner is not None:
            raise Exception('Hat is already being worn')
        else:
            self.hat.owner = session_id

    def dictify(self):
        return {'test': 'hello'}

class Player(object):
    def __init__(self, session_id):
        self.id = session_id
        self.position = Position(0, 0)

    def move(self, x, y):
        self.position.update(x, y)

class Hat(object):
    def __init__(self):
        self.position = Position(0, 0)
        self.owner = None

class Position(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def update(self, x, y):
        self.x = x
        self.y = y
