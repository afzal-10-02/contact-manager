from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50))
    email = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(30), nullable=False, unique=True)
