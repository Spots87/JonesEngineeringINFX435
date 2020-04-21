from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import cx_Oracle

user = 'system'
password = 'oracle'
tnsname = 'orcl'
host = '0.0.0.0'
port = 1521

engine = create_engine(f'oracle+cx_oracle://{user}:{password}@{tnsname}')
Session = sessionmaker(bind=engine)

Base = declarative_base()
