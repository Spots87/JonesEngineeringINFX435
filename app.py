from flask import Flask, render_template, request, flash, redirect, url_for
from sqlalchemy import Column, String, Integer, Sequence, Date, ForeignKey
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

dateRegex = "^(([0-9])|([0-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{2}$"

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

class FieldBook(db.Model):
    __tablename__ = 'fieldbook'
    fieldbookno = db.Column(Integer, Sequence('fieldbook_id_seq'), primary_key=True)
    bookpath = db.Column(String)

class Crew(db.Model):
    __tablename__ = 'crew'
    crewno = db.Column(Integer, Sequence('crew_id_seq'), primary_key=True)

class Employee(db.Model):
    __tablename__ = 'employee'
    employeeno = db.Column(Integer, Sequence('employee_id_seq'), primary_key=True)
    firstname = db.Column(String)
    lastname = db.Column(String)
    crewno = db.Column(Integer, ForeignKey('crew.crewno'))

class Assigned(db.Model):
    __tablename__ = 'assigned'
    assignno = db.Column(Integer, Sequence('assigned_id_seq'), primary_key=True)
    crewno = db.Column(Integer, ForeignKey('crew.crewno'))
    workdate = db.Column(Date)
    notes = db.Column(String)

class SurveyPlan(db.Model):
    __tablename__ = 'surveyplan'
    planno = db.Column(Integer, Sequence('plan_id_seq'), primary_key=True)
    jobno = db.Column(Integer, ForeignKey('surveyrequest.jobno'))
    taskno = db.Column(Integer, ForeignKey('task.taskno'))
    notes = db.Column(String)

class Schedule(db.Model):
    __tablename__ = 'schedule'
    scheduleno = db.Column(Integer, Sequence('schedule_id_seq'), primary_key=True)
    planno = db.Column(Integer, ForeignKey('surveyplan.planno'))
    jobno = db.Column(Integer, ForeignKey('surveyrequest.jobno'))
    assignno = db.Column(Integer, ForeignKey('assigned.assignno'))
    employeeno = db.Column(Integer, ForeignKey('employee.employeeno'))
    scheduleDate = db.Column(Date)

class SurveyReport(db.Model):
    __tablename__ = 'surveyreport'
    reportno = db.Column(Integer, Sequence('report_id_seq'), primary_key=True)
    jobno = db.Column(Integer, ForeignKey('surveyrequest.jobno'))
    scheduleno = db.Column(Integer, ForeignKey('schedule.scheduleno'))
    iscomplete = db.Column(String)
    fieldbookno = db.Column(Integer, ForeignKey('fieldbook.fieldbookno'))
    beginningpageno = db.Column(Integer)
    employeeno = db.Column(Integer, ForeignKey('employee.employeeno'))

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
                    'requestedby': request.form['requestedBy'],
                    'restakecount': 0
            }
            response = requests.post('http://localhost:5000/api/surveyrequest', json=data)
            if response.status_code == requests.codes.created:
                time.sleep(3)

                return redirect(url_for('home'))
    return render_template('requestSurvey.html', form=form)


@app.route('/plansurvey', methods=['GET', 'POST'])
def planSurvey():
    jobs = SurveyRequest.query.filter_by(completiondate=None)
    tasks = Task.query.all()
    if request.method == 'POST':
        plan = SurveyPlan(jobno=request.form['surveyrequest'], taskno=request.form['task'], notes=request.form['notes'])
        db.session.add(plan)
        db.session.commit()



    return render_template('planSurvey.html', jobs=jobs, tasks=tasks)
manager.create_api(SurveyRequest, methods=['GET', 'POST', 'PATCH', 'DELETE'])
manager.create_api(Task, methods=['GET', 'POST', 'PATCH', 'DELETE'])
