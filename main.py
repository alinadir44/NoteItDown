from email.policy import strict
from http.client import OK
import string
#from types import NoneType
from flask import Flask,render_template,request,session,redirect,abort
import json
from flask_mysqldb import MySQL,MySQLdb

NoneType= type(None)

app=Flask(__name__)

with open("config.json","r") as c:
    params=json.load(c)["params"]

local_server=True

app.config['MYSQL_HOST']=params['MYSQL_HOST']
app.config['MYSQL_USER']= params['MYSQL_USER']
app.config['MYSQL_PASS']=params['MYSQL_PASS']
app.config['MYSQL_DB']=params['MYSQL_DB']
app.config['MYSQL_CURSORCLASS']=params['MYSQL_CURSORCLASS']

app.secret_key="some-key"

mysql=MySQL(app)

def updateNote(id, body):
    cur=mysql.connection.cursor()
    cur.execute("update notes set note_body=%s where note_id=%s",([body],[id],))
    mysql.connection.commit()
    cur.close()

@app.route('/',methods=['GET','POST'])
def home():
    cur=mysql.connection.cursor()
    if request.method=='GET':
        cur.execute("CREATE TABLE IF NOT EXISTS USERS (user_id INTEGER PRIMARY KEY AUTO_INCREMENT,userFullName varchar(50) NOT NULL,user_email varchar(30) NOT NULL,user_pass varchar(30) NOT NULL)")
        cur.execute("CREATE TABLE IF NOT EXISTS NOTES (note_id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER, note_title varchar(20) NOT NULL,note_body varchar(3000) NOT NULL)")
        cur.close()
        return render_template("index.html")
    else:
        email=request.form.get("email")
        password=request.form.get("pass")
        cur.execute("SELECT * from USERS where user_email=%s",([email],))
        rec=cur.fetchone()
        if(type(rec)!=NoneType):
            if password==rec["user_pass"]:
                session["current_user"]=rec
                cur.execute("SELECT * FROM notes WHERE user_id=%s",([rec["user_id"]],))
                notes=cur.fetchall()
                session["userNotes"]=notes
                cur.close()
                return redirect("notes",code=303)
            else:
                cur.close()
                return render_template("index.html",wrongPass=True)
        else:
            session["userEmail"]=email
            return redirect("signup",code=303)

@app.route('/signup',methods=['GET','POST'])
def signup():
    if request.method=='POST':
        fullName=request.form.get("fullName")
        email=request.form.get("email")
        password=request.form.get("pass")
        cur=mysql.connection.cursor()
        cur.execute("SELECT user_email from users where user_email=%s",([email],))
        rec=cur.fetchone()
        if(type(rec)!=NoneType):
            return render_template("signup.html",alreadyExists=True)
        else:        
            cur.execute("INSERT INTO USERS (userFullName,user_email,user_pass) VALUES(%s,%s,%s)",([fullName],[email],[password],))
            mysql.connection.commit()
            cur.close()
            return redirect("/",code=303)
    else:
        return render_template("signup.html")

@app.route('/notes')
def notes():
    session['loggedin']=True
    return render_template("testcopy.html")

@app.route('/addNote', methods=['GET','POST','PUT'])
def addNote():
    if request.method=='POST':
        title=request.form.get("title")
        body=request.form.get("body")
        user_id=session["current_user"]["user_id"]
        print(title,body,user_id)
        cur=mysql.connection.cursor()
        cur.execute("INSERT INTO NOTES (USER_ID,NOTE_TITLE,NOTE_BODY) VALUES (%s,%s,%s)",([user_id],[title],[body],))
        mysql.connection.commit()
        cur.close()
        updateNoteList()
        return {
            "user_id":user_id,
            "note_body":body,
            "note_title":title
        }
    elif request.method=='PUT':
        noteID=request.form.get("noteID")
        newBody=request.form.get("body")
        print(f"NoteID: {noteID}, newBody: {newBody}")
        updateNote(noteID,newBody)
        updateNoteList()
        return {
            "status":"success",
            "noteBody":newBody,
        }
    else:
        abort(404)

@app.route('/deleteNote', methods=['GET','DELETE'])
def deleteNote():
    if request.method=='DELETE':
        noteID=request.form.get("noteID")
        print(f"Deleting note with ID: {noteID}\n\n")
        cur=mysql.connection.cursor()
        cur.execute("delete from notes where note_id=%s",([noteID],))
        mysql.connection.commit()
        cur.close()
        updateNoteList()
        return {
            "status":"success"
        }
    else:
        abort(404)

def updateNoteList():
    cur=mysql.connection.cursor()
    cur.execute("select * from notes where user_id=%s",([session["current_user"]["user_id"]],))
    session["userNotes"]=cur.fetchall()
    cur.close()

@app.route('/logout')
def logout():
    session.pop('loggedin')
    session.pop('current_user')
    #session.pop('userEmail')
    return redirect('/',code=303)

app.run(debug=True)