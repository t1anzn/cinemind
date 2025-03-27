from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Path to your existing cinemind.db database
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(os.path.dirname(basedir), 'models', 'cinemind.db')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database connection
db = SQLAlchemy(app)

# Define the Movie model
class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title
        }

# Movie endpoint to return list of movies with id and title
@app.route('/movies', methods=['GET'])
def get_movies():
    # Query the Movie table
    movies = Movie.query.all()

    # Return the list of movies as JSON, showing only id and title
    return jsonify([movie.to_dict() for movie in movies])

# Simple test route to verify the application is running
@app.route('/')
def index():
    return jsonify({'message': 'Connected to Flask API'})

# Run the application
if __name__ == '__main__':
    app.run(debug=True)