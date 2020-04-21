from flask import Flask, render_template, request, flash, redirect, url_for
from sqlalchemy import Column, String, Integer, Sequence, Date
from wtforms import Form, TextField, validators, StringField, SubmitField, IntegerField
import time
import flask_sqlalchemy
import flask_restless
import flask_bootstrap
import datetime
import requests

app = Flask(__name__)

flask_bootstrap.Bootstrap(app)

app.config.from_pyfile('config.py')

db = flask_sqlalchemy.SQLAlchemy(app)

manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

class SurveyRequestForm(Form):
    development = TextField("Development Name: ", validators=[validators.required()])
    client      = TextField("Client Name: ", validators=[validators.required()])
    location    = TextField("Location Name: ", validators=[validators.required()])
    sRange      = TextField("Range: ", validators=[validators.required(), validators.length(min=2, max=2, message="Min and max length 2")])
    section     = IntegerField("Section: ", validators=[validators.required(message="Must be integer value"), validators.number_range(min=1, max=100000, message="Must be integer between 1 and 100000")])
    township    = TextField("Township: ", validators=[validators.required()])
    requestedBy = TextField("Requested By: ", validators=[validators.required()])

def _getDate():
    return datetime.datetime.now()

#fields need to be all lowercase and same name as db
class SurveyRequest(db.Model):
    __tablename__ = 'surveyrequest'
    jobno = db.Column(Integer, Sequence('job_id_seq'), primary_key=True)
    development = db.Column(String)
    client = db.Column(String)
    contractdate = db.Column(Date, default=_getDate)
    location = db.Column(String)
    range = db.Column(String)
    section = db.Column(Integer)
    township = db.Column(String)
    daterequested = db.Column(Date, default=_getDate)
    requestedby = db.Column(String)
    completiondate = db.Column(Date, nullable=True)
    istwosetsdrawings = db.Column(String, nullable=True)
    restakecount = db.Column(Integer)



class Task(db.Model):
    __tablename__ = 'task'
    taskno = db.Column(Integer, Sequence('task_id_seq'), primary_key=True)
    description = db.Column(String)


@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/requestsurvey', methods=['GET', 'POST'])
def requestSurvey():
    form = SurveyRequestForm(request.form)

    if request.method == 'POST':

        if form.validate():

            data = {'development': request.form['development'],
                    'client': request.form['client'],
                    'location': request.form['location'],
                    'range': request.form['sRange'],
                    'section': request.form['section'],
                    'township': request.form['township'],
                    'requestedby': request.form['requestedBy']
            }
            response = requests.post('http://localhost:5000/api/surveyrequest', json=data)
            if response.status_code == requests.codes.created:
                flash('Request Created. Redirecting....')
                time.sleep(3)

                return redirect(url_for('home'))
    return render_template('requestSurvey.html', form=form)



manager.create_api(SurveyRequest, methods=['GET', 'POST', 'PATCH', 'DELETE'])
manager.create_api(Task, methods=['GET', 'POST', 'PATCH', 'DELETE'])
