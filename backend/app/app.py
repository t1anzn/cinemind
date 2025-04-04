from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Path to your existing cinemind.db database
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(os.path.dirname(basedir), 'models', 'cinemind.db')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database connection
db = SQLAlchemy(app)

# Defining Models
class Cast(db.Model):
    __tablename__ = 'cast'
    actor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(50))

class Genres(db.Model):
    __tablename__ = 'genres'
    genre_id = db.Column(db.Integer, primary_key=True)
    genre_name = db.Column(db.String(255), nullable=False)

class Keywords(db.Model):
    __tablename__ = 'keywords'
    keyword_id = db.Column(db.Integer, primary_key=True)
    keyword_name = db.Column(db.String(255), nullable=False)

class Movie(db.Model):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    original_title = db.Column(db.String(255))
    overview = db.Column(db.Text)
    budget = db.Column(db.BigInteger)
    revenue = db.Column(db.BigInteger)
    release_date = db.Column(db.String(255))
    runtime = db.Column(db.Integer)
    status = db.Column(db.String(50))
    tagline = db.Column(db.String(255))
    popularity = db.Column(db.Float)
    vote_average = db.Column(db.Float)
    vote_count = db.Column(db.Integer)
    original_language = db.Column(db.String(50))
    homepage = db.Column(db.String(255))
    poster_url = db.Column(db.String(255))
    backdrop_url = db.Column(db.String(255))
    video_url = db.Column(db.String(255))

class MovieGenre(db.Model):
    __tablename__ = 'movie_genre'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.genre_id'), primary_key=True)

class MovieKeywords(db.Model):
    __tablename__ = 'movie_keywords'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    keyword_id = db.Column(db.Integer, db.ForeignKey('keywords.keyword_id'), primary_key=True)

class ProductionCountries(db.Model):
    __tablename__ = 'production_countries'
    country_id = db.Column(db.Integer, primary_key=True)
    country_name = db.Column(db.String(255), nullable=False)
    iso_code = db.Column(db.String(10))

class MovieProductionCountries(db.Model):
    __tablename__ = 'movie_production_countries'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('production_countries.country_id'), primary_key=True)

class SpokenLanguages(db.Model):
    __tablename__ = 'spoken_languages'
    language_id = db.Column(db.Integer, primary_key=True)
    language_name = db.Column(db.String(255), nullable=False)
    iso_code = db.Column(db.String(10))

class MovieSpokenLanguages(db.Model):
    __tablename__ = 'movie_spoken_languages'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    language_id = db.Column(db.Integer, db.ForeignKey('spoken_languages.language_id'), primary_key=True)

class MovieCast(db.Model):
    __tablename__ = 'movies_cast'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('cast.actor_id'), primary_key=True)

# Endpoints
@app.route('/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    return jsonify([
        {
            'id': movie.id,
            'title': movie.title,
            'vote_average': movie.vote_average,
            'release_date': movie.release_date,
            'original_language': movie.original_language,
            'runtime': movie.runtime,
            'popularity': movie.popularity,
            'homepage': movie.homepage,
            'poster_url': movie.poster_url,
            'backdrop_url': movie.backdrop_url,
            'video_url': movie.video_url,
        } 
        for movie in movies
    ])


@app.route('/genres', methods=['GET'])
def get_genres():
    genres = Genres.query.all()
    return jsonify([{'id': genre.genre_id, 'name': genre.genre_name} for genre in genres])

@app.route('/cast', methods=['GET'])
def get_cast():
    cast_list = Cast.query.all()
    return jsonify([{'id': cast.actor_id, 'name': cast.name, 'gender': cast.gender} for cast in cast_list])

@app.route('/keywords', methods=['GET'])
def get_keywords():
    keywords = Keywords.query.all()
    return jsonify([{'id': keyword.keyword_id, 'name': keyword.keyword_name} for keyword in keywords])

@app.route('/production_countries', methods=['GET'])
def get_production_countries():
    countries = ProductionCountries.query.all()
    return jsonify([{'id': country.country_id, 'name': country.country_name, 'iso_code': country.iso_code} for country in countries])

@app.route('/spoken_languages', methods=['GET'])
def get_spoken_languages():
    languages = SpokenLanguages.query.all()
    return jsonify([{'id': language.language_id, 'name': language.language_name, 'iso_code': language.iso_code} for language in languages])


# Enhanced Endpoints: makes use of the Relationship tables to link table information
@app.route('/featured', methods=['GET'])
def get_featured():

    # Get the top 3 movies based on popularity
    movies = Movie.query.order_by(Movie.popularity.desc()).limit(3).all()

    featured_movies = []

    # Loop through the movies
    for movie in movies:

        genres = Genres.query.join(MovieGenre).filter(MovieGenre.movie_id == movie.id).all()
        genre_names = [genre.genre_name for genre in genres]

        featured_movies.append({
            'id': movie.id,
            'title': movie.title,
            'vote_average': movie.vote_average,
            'release_date': movie.release_date,
            'overview' : movie.overview,
            'original_language': movie.original_language,
            'runtime': movie.runtime,
            'popularity': movie.popularity,
            'homepage': movie.homepage,
            'video_url': movie.video_url,
            'genres': genre_names  # Include genre names in the response
        })

    return jsonify(featured_movies)

# Get the top 10 movies based on vote average   
@app.route('/popular', methods=['GET'])
def get_popular():
    movies= Movie.query.order_by(Movie.popularity.desc()).offset(3).limit(10).all()
    popular_movies = []
    for movie in movies:
        popular_movies.append({
            'id': movie.id,
            'title': movie.title,
            'release_date': movie.release_date,
            'vote_average': movie.vote_average,
            'poster_url': movie.poster_url,
        })
    return jsonify(popular_movies)

@app.route('/movies/genre/<int:genre_id>', methods=['GET'])
def get_movies_by_genre(genre_id):
    genre = Genres.query.get(genre_id)
    movies = Movie.query.join(MovieGenre).filter(MovieGenre.genre_id == genre_id).all()
    return jsonify({'genre': genre.genre_name, 'movies': [{'id': movie.id, 'title': movie.title} for movie in movies]})

@app.route('/movies/keyword/<int:keyword_id>', methods=['GET'])
def get_movies_by_keyword(keyword_id):
    keyword = Keywords.query.get(keyword_id)
    movies = Movie.query.join(MovieKeywords).filter(MovieKeywords.keyword_id == keyword_id).all()
    return jsonify({'keyword': keyword.keyword_name, 'movies': [{'id': movie.id, 'title': movie.title} for movie in movies]})

@app.route('/movies/actor/<int:actor_id>', methods=['GET'])
def get_movies_by_actor(actor_id):
    actor = Cast.query.get(actor_id)
    movies = Movie.query.join(MovieCast).filter(MovieCast.actor_id == actor_id).all()
    return jsonify({'actor': actor.name, 'movies': [{'id': movie.id, 'title': movie.title} for movie in movies]})

@app.route('/movies/country/<int:country_id>', methods=['GET'])
def get_movies_by_country(country_id):
    country = ProductionCountries.query.get(country_id)
    movies = Movie.query.join(MovieProductionCountries).filter(MovieProductionCountries.country_id == country_id).all()
    return jsonify({'country': country.country_name, 'movies': [{'id': movie.id, 'title': movie.title} for movie in movies]})

@app.route('/movies/language/<int:language_id>', methods=['GET'])
def get_movies_by_language(language_id):
    language = SpokenLanguages.query.get(language_id)
    movies = Movie.query.join(MovieSpokenLanguages).filter(MovieSpokenLanguages.language_id == language_id).all()
    return jsonify({'language': language.language_name, 'movies': [{'id': movie.id, 'title': movie.title} for movie in movies]})


# default message to test API is connected
@app.route('/')
def index():
    return jsonify({'message': 'Connected to Flask API'})

if __name__ == '__main__':
    app.run(debug=True)
