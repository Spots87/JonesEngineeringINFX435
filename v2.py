from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Sequence

app = Flask(__name__)

user = 'system'
password = 'oracle'
tnsname = 'orcl'
host = '0.0.0.0'
port = 1521

app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+cx_oracle://{user}:{password}@{tnsname}'
db = SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'task'
    taskno = db.Column(Integer, Sequence('task_id_seq'), primary_key=True)
    description = db.Column(String)

    def __repr__(self):
        return f'{self.description}'

    def serialize(self):
        return{
            'taskno': self.taskno,
            'description': self.description
        }

@app.route('/tasks')
def get_all_tasks():
    tasks= [task.serialize() for task in Task.query.all()]
    return jsonify(tasks)
