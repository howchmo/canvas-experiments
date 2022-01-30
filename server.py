from flask import Flask
from flask_socketio import SocketIO,send
from engineio.payload import Payload

app = Flask(__name__, static_folder='www', static_url_path='' )
# app.config['SECRET_KEY'] = 'mysecret'
app.debug=True
app.host = '0.0.0.0'

Payload.max_decode_packets = 50
socketIo = SocketIO(app, cors_allowed_origins="*")
@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True, include_self=False)
    return None

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    #socketIo.run(app)


