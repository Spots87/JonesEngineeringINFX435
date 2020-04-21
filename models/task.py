from sqlalchemy import Column, String, Integer, Sequence
from base import Base

#Couldn't figure out how to create sequence from here
#manually added through sql developer. Started with 4 since I had 3 entries in the table already
#CREATE sequence task_id_seq
#INCREMENT BY 1
#START WITH 4;
class Task(Base):
    __tablename__ = 'task'
    taskno = Column(Integer, Sequence('task_id_seq'), primary_key=True)
    description = Column(String)

    def __init__(self, description):
        taskno = Sequence('task_id_seq')
        self.taskno = taskno.next_value()
        self.description = description

