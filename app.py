from flask import Flask, render_template
import flask_sqlalchemy
import flask_restless
import flask_bootstrap
from sqlalchemy import Column, String, Integer, Sequence

app = Flask(__name__)

flask_bootstrap.Bootstrap(app)

app.config.from_pyfile('config.py')

db = flask_sqlalchemy.SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'task'
    taskno = db.Column(Integer, Sequence('task_id_seq'), primary_key=True)
    description = db.Column(String)

manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(Task, methods=['GET', 'POST', 'PATCH', 'DELETE'])

@app.route('/')
def home():
    return render_template('index.html')

