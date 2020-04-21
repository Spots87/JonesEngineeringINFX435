from base import Session
from models.task import Task, TaskEncoder

session = Session()

class TaskQuery():

    def get_all():
        return [TaskEncoder().encode(task) for task in session.query(Task).all()]

