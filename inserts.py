from sqlalchemy import Sequence
from base import Session, engine, Base
from models.task import Task

Base.metadata.create_all(engine)

session = Session()

test_task = Task('made with ORM')

session.add(test_task)

session.commit()
session.close()
