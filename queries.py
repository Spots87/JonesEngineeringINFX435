from base import Session
from models.task import Task

session = Session()

tasks = session.query(Task).all()

for task in tasks:
   print(task.description)

