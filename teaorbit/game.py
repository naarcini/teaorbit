
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
        players = {}
        for key, val in self.players.items():
            players[key] = val.dictify()
        return {'players': players}

class Player(object):
    def __init__(self, session_id):
        self.id = session_id
        self.position = Position(0, 0)
        self.movement = Movement(0, 0)

    def move(self, x, y, dx, dy):
        self.position.update(x, y)
        self.Movement.update(dx, dy)

    def dictify(self):
        return {'id': self.id, 'position': {'x': self.position.x, 'y': self.position.y}, 'movement': {'dx': self.movement.dx, 'dy': self.movement.dy}}

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

class Movement(object):
    def __init__(self, dx, dy):
        self.dx = dx
        self.dy = dy

    def update(self, dx, dy):
        self.dx = dx
        self.dy = dy
