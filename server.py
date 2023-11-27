from flask import Flask, redirect, request, send_file, render_template
import uuid;
import re
import json
import base64
from io import BytesIO
from PIL import Image
import os.path
from datetime import datetime
from tzlocal import get_localzone

app = Flask(__name__, static_folder='www', static_url_path='' )

@app.route("/")
def notes_list_page():
	return render_template("notes.html")

@app.route("/notes")
def notes():
	result = {}
	directory = 'www/notes/'
	files = [os.path.join(directory, file) for file in os.listdir(directory)]
	files.sort(key=os.path.getmtime, reverse=True);
	for filepath in files:
		f = os.path.basename(filepath)
		dt = datetime.fromtimestamp(os.path.getmtime(filepath), get_localzone()).strftime('%Y-%m-%d %H:%M:%S')
		print(f+" "+dt)
		result[dt] = f
	return result

@app.route("/note")
def new_note():
	id = uuid.uuid1()
	print("/note/"+str(id))
	return redirect("/note/"+str(id)+".png")

@app.route("/note/<id>")
def note(id):
	return render_template("note.html", id=id)

@app.route("/retrieve/<id>")
def retrieve(id):
	filepath = "www/notes/"+str(id);
	if os.path.isfile(filepath):
		return send_file(filepath, mimetype='image/png')
	else:
		return "", 404

@app.route("/save/<id>", methods=['POST'])
def save(id):
	print(str(request))
	image_data = re.sub('^data:image/.+;base64,', '', request.form['imageBase64'])
	im = Image.open(BytesIO(base64.b64decode(image_data)))
	im.save("www/notes/"+str(id))
	return json.dumps({'result': 'success'}), 200, {'ContentType': 'application/json'}


# app.config['SECRET_KEY'] = 'mysecret'
app.debug=True
app.host = '0.0.0.0'

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=4444)


