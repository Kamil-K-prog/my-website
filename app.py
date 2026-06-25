from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', active='home')

@app.route('/resume')
def resume():
    return render_template('resume.html', active='resume')