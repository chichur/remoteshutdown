import os
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('hello.html')


@app.route('/shutdown')
def shutdown():
    os.system('shutdown /s /t 0')
    return "ok"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
