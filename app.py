from flask import Flask, jsonify, request
from  queries import TaskQuery

app = Flask(__name__)

@app.route('/tasks')
def get_all_tasks():
    return jsonify(TaskQuery.get_all())


