from flask import Flask
from models import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        # This would create all tables directly, but we'll use migrations instead
        # db.create_all()
        print("App initialized. Use Alembic for migrations.")