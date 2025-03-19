from flask import Flask
from models.model import db
from flask_cors import CORS

app = None

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'jkn8u9enfviuewhhnv8472489bfe49yh43JGe9j93GJR'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.app_context().push()
    CORS(app)
    return app


app = create_app()

with app.app_context():
    # db.drop_all()
    db.create_all()

from controllers.routes import *

if __name__ == '__main__':
    app.run(debug=True)
