from flask import Flask
import flask_sqlalchemy
import flask_restless
from sqlalchemy import Column, String, Integer, Sequence

app = Flask(__name__)

app.config.from_pyfile('config.py')

db = flask_sqlalchemy.SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'task'
    taskno = db.Column(Integer, Sequence('task_id_seq'), primary_key=True)
    description = db.Column(String)

manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(Task, methods=['GET', 'POST', 'PATCH', 'DELETE'])

