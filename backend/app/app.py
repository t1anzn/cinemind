# ============================== #
# CineMind Flask API             #
# Backend server for movie data #
# ============================== #

# === Imports === #
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import func
from sqlalchemy import func
from flask_cors import CORS
import os
from google import genai  # Import the Gemini AI library
from dotenv import load_dotenv
from pathlib import Path

# === App Setup === #
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# === Database Config === #
basedir = os.path.abspath(os.path.dirname(__file__)) # Path to existing cinemind.db database
#db_path = os.path.join(os.path.dirname(basedir), 'models', 'cinemind.db')
db_path = os.path.join(os.path.dirname(basedir), '..', 'migration_project', 'cinema_migrations.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database connection
db = SQLAlchemy(app)

# === Environment Variable Loader === #
def load_environment():
    """Load environment variables from multiple possible locations"""
    possible_paths = [
        Path('.env'),  # Current directory
        Path('../.env'),  # One level up
        Path('../../frontend/.env'),  # Frontend directory
        Path('../../../.env'),  # Project root
        Path('../../.env'),  # Project root alternative
    ]

    for path in possible_paths:
        if path.exists():
            print(f"Loading .env from: {path.absolute()}")
            load_dotenv(path)
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                print("✓ API key loaded successfully")
                return True

    print("⚠ No valid .env file found with API key!")
    print("\nTry creating .env file in one of these locations:")
    for path in possible_paths:
        print(f"- {path.absolute()}")
    return False

# Ensure environment variables are loaded
if not load_environment():
    raise EnvironmentError("Failed to load GEMINI_API_KEY from .env file")

# Now use the API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# === Models === #
# Each model maps to a table in the SQLite database
class Cast(db.Model):
    __tablename__ = 'cast'
    actor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(50))
    popularity = db.Column(db.Float)
    profile_path = db.Column(db.Text)
    biography = db.Column(db.Text)

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
    poster_url = db.Column(db.Text)
    backdrop_url = db.Column(db.Text)
    video_url = db.Column(db.Text)
    reviews = db.Column(db.Text)
    keyposter_url = db.Column(db.Text)
    keyvideo_url = db.Column(db.Text)

# === Join Tables === #
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

class Characters(db.Model):
    __tablename__ = 'characters'
    character_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # Changed from character_name to name

class MovieCast(db.Model):
    __tablename__ = 'movies_cast'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('cast.actor_id'), primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.character_id'), primary_key=True)

# === Endpoints === #
@app.route('/movies', methods=['GET'])
def get_movies():
    # Pagination parameters from query string, with default values
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    # Paginate the query
    pagination = Movie.query.order_by(Movie.popularity.desc()).paginate(page=page, per_page=per_page, error_out=False)
    movies = pagination.items

    movie_data = []
    
    for movie in movies:
        # Query the production countries
        countries = ProductionCountries.query.join(MovieProductionCountries).filter(MovieProductionCountries.movie_id == movie.id).all()
        country_names = [country.country_name for country in countries]

        # Query the spoken languages
        languages = SpokenLanguages.query.join(MovieSpokenLanguages).filter(MovieSpokenLanguages.movie_id == movie.id).all()
        language_names = [language.language_name for language in languages]


        movie_data.append({
            'id': movie.id,
            'title': movie.title,
            'vote_average': movie.vote_average,
            'release_date': movie.release_date,
            'original_language': movie.original_language,
            'runtime': movie.runtime,
            'popularity': movie.popularity,
            'homepage': movie.homepage,
            'status': movie.status,
            'poster_url': movie.poster_url,
            'backdrop_url': movie.backdrop_url,
            'video_url': movie.video_url,
            'production_countries': country_names,  
            'spoken_languages': language_names,
            'reviews': movie.reviews,
            'keyposter_url': movie.keyposter_url,  
            'keyvideo_url': movie.keyvideo_url, 
        })

    return jsonify({
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
        'movies': movie_data
    })



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

# === Enhanced Endpoints: makes use of the Relationship tables to link table information ===#
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
            'keyvideo_url': movie.keyvideo_url,
            'genres': genre_names
        })

    return jsonify(featured_movies)

# Get the top 10 movies based on vote average   
@app.route('/popular', methods=['GET'])
def get_popular():
    movies = Movie.query.order_by(Movie.popularity.desc()).offset(3).limit(10).all()
    popular_movies = []
    for movie in movies:
        popular_movies.append({
            'id': movie.id,
            'title': movie.title,
            'release_date': movie.release_date,
            'vote_average': movie.vote_average,
            'poster_url': movie.poster_url,
            'keyposter_url': movie.keyposter_url,
        })
    return jsonify(popular_movies)

@app.route('/explore', methods=['GET'])
def get_explore():
    movies = Movie.query.order_by(func.random()).limit(10).all()
    explore_movies = []
    for movie in movies:
        explore_movies.append({
            'id': movie.id,
            'title': movie.title,
            'release_date': movie.release_date,
            'vote_average': movie.vote_average,
            'poster_url': movie.poster_url,
            'keyposter_url': movie.keyposter_url,
        })
    return jsonify(explore_movies)

    
@app.route('/movies/<int:id>', methods=['GET'])
def get_movie_by_id(id):
    print(f"Received request for movie with ID {id}")  # Debugging statement
    movie = Movie.query.get(id)

    if not movie:
        return jsonify({'error': f'Movie with ID {id} not found'}), 404
    
    # Query the genres of the movie
    genres = Genres.query.join(MovieGenre).filter(MovieGenre.movie_id == movie.id).all()
    genre_names = [genre.genre_name for genre in genres]

    # Query the keywords of the movie
    keywords = Keywords.query.join(MovieKeywords).filter(MovieKeywords.movie_id == movie.id).all()
    keyword_names = [keyword.keyword_name for keyword in keywords]

    # Query enhanced cast details with profile images and more information
    cast_members = Cast.query.join(MovieCast).filter(MovieCast.movie_id == movie.id).order_by(Cast.popularity.desc().nullslast()).all()

    # Create detailed cast information incl. profile images and character names
    cast_details = []
    for cast in cast_members:
        # Get the character name from MovieCast and Characters tables
        movie_cast = MovieCast.query.filter_by(movie_id=movie.id, actor_id=cast.actor_id).first()
        character_name = None
        if movie_cast and movie_cast.character_id:
            character = Characters.query.get(movie_cast.character_id)
            if character:
                character_name = character.name  # Changed from character.character_name to character.name
    
        cast_details.append({
            'id': cast.actor_id,
            'name': cast.name,
            'character': character_name,
            'gender': cast.gender, 
            'popularity': cast.popularity,
            'profile_path': cast.profile_path if hasattr(cast, 'profile_path') else None,
            'biography': (cast.biography[:150] + '...') if hasattr(cast, 'biography') and cast.biography else None
        })

    # Simple cast names list (for backward compatibility)
    cast_names = [cast.name for cast in cast_members]

    # Query the production countries of the movie
    countries = ProductionCountries.query.join(MovieProductionCountries).filter(MovieProductionCountries.movie_id == movie.id).all()
    country_names = [country.country_name for country in countries]

    # Query the spoken languages using MovieSpokenLanguages association with `join`
    languages = SpokenLanguages.query.join(MovieSpokenLanguages).filter(MovieSpokenLanguages.movie_id == movie.id).all()
    language_names = [language.language_name for language in languages]

    movie_data = {
        'id': movie.id,
        'title': movie.title,
        'overview': movie.overview,
        'release_date': movie.release_date,
        'original_title': movie.original_title,
        'genres': genre_names,
        'keywords': keyword_names,
        'cast': cast_names,
        'cast_details': cast_details,
        'budget': movie.budget,
        'revenue': movie.revenue,
        'runtime': movie.runtime,
        'status': movie.status,
        'tagline': movie.tagline,
        'popularity': movie.popularity,
        'vote_average': movie.vote_average,
        'vote_count': movie.vote_count,
        'original_language': movie.original_language,
        'homepage': movie.homepage,
        'production_countries': country_names,
        'spoken_languages': language_names,
        'poster_url': movie.poster_url,
        'backdrop_url': movie.backdrop_url,
        'video_url': movie.video_url,
        'reviews': movie.reviews,
        'keyposter_url': movie.keyposter_url,
        'keyvideo_url': movie.keyvideo_url,
    }

    return jsonify(movie_data)

@app.route('/movies/ids', methods=['GET'])
def get_movie_ids():
    movie_ids = Movie.query.with_entities(Movie.id).all()
    return jsonify([{'id': m.id} for m in movie_ids])


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

# Search Bar Endpoints:
@app.route('/movies/search', methods=['GET'])
def search_movies():
    query = Movie.query

    title = request.args.get('title')
    genre_id = request.args.get('genre_id')
    language_id = request.args.get('language_id')

    if title:
        query = query.filter(Movie.title.ilike(f"%{title}%"))
    if genre_id:
        query = query.join(MovieGenre).filter(MovieGenre.genre_id == genre_id)
    if language_id:
        query = query.join(MovieSpokenLanguages).filter(MovieSpokenLanguages.language_id == language_id)

    movies = query.all()
    return jsonify([{
        "id": movie.id, "title": movie.title,
        "vote_average": movie.vote_average, "release_date": movie.release_date
    } for movie in movies])

# Endpoint made to create suggestions as user types in searchbar
@app.route('/movies/suggest', methods=['GET'])
def suggest_movies():
    query = request.args.get('query', '')
    movies = Movie.query.filter(Movie.title.ilike(f"%{query}%")).limit(5).all()
    return jsonify([{"id": movie.id, "title": movie.title} for movie in movies])

# Endpoint made to create results when user searches for movies to display on the movie grid
@app.route('/results', methods=['GET'])
def results_movies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    query = request.args.get('query', '')
    genre_ids = request.args.getlist('genre')
    language = request.args.get('language', '')
    sort_by = request.args.get('sort_by', 'popularity')
    order = request.args.get('order', 'desc')

    base_query = Movie.query

    # Filter by title
    if query:
        base_query = base_query.filter(Movie.title.ilike(f"%{query}%"))

    # Filter by original language
    if language:
        base_query = base_query.filter(Movie.original_language == language)

    # AND-filter by genres (must match all)
    if genre_ids:
        genre_ids = list(map(int, genre_ids))
        base_query = base_query.join(MovieGenre).filter(MovieGenre.genre_id.in_(genre_ids))
        base_query = base_query.group_by(Movie.id).having(func.count(MovieGenre.genre_id) == len(genre_ids))

    # Sorting
    sortable_columns = {
        "popularity": Movie.popularity,
        "vote_count": Movie.vote_count,
        "vote_average": Movie.vote_average,
        "runtime": Movie.runtime,
        "release_date": Movie.release_date,
        "title": Movie.title,
    }
    sort_column = sortable_columns.get(sort_by, Movie.popularity)
    if order == "asc":
        base_query = base_query.order_by(sort_column.asc())
    else:
        base_query = base_query.order_by(sort_column.desc())

    # === Pagination === #
    pagination = base_query.paginate(page=page, per_page=per_page, error_out=False)
    movies = pagination.items

    movie_data = []
    for movie in movies:
        # Get genres for this movie
        genres = Genres.query.join(MovieGenre).filter(MovieGenre.movie_id == movie.id).all()
        genre_names = [genre.genre_name for genre in genres]
        
        movie_data.append({
            'id': movie.id,
            'title': movie.title,
            'vote_average': movie.vote_average,
            'release_date': movie.release_date,
            'original_language': movie.original_language,
            'runtime': movie.runtime,
            'popularity': movie.popularity,
            'homepage': movie.homepage,
            'status': movie.status,
            'poster_url': movie.poster_url,
            'backdrop_url': movie.backdrop_url,
            'video_url': movie.video_url,
            'reviews': movie.reviews,
            'keyposter_url': movie.keyposter_url,
            'keyvideo_url': movie.keyvideo_url,
            'genres': genre_names,  
            'budget': movie.budget, 
            'revenue': movie.revenue  
        })

    return jsonify({
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
        'movies': movie_data
    })

# Endpoint to analyze movie sentiment using Gemini AI
@app.route('/movies/<int:id>/sentiment', methods=['GET'])
def analyze_movie_sentiment(id):
    movie = Movie.query.get(id)

    if not movie:
        return jsonify({'error': f'Movie with ID {id} not found'}), 404

    if not movie.reviews:
        return jsonify({'error': 'No reviews available for this movie'}), 400

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",  # Replace with the specific model name
            contents=(
                "Analyze the sentiment of the following movie reviews and provide a single plain-text summary of the overall sentiment. "
                "Do not include any titles, headings, author names, or individual review analysis. Focus only on the overall sentiment "
                "and key points expressed collectively in the reviews:\n\n"
                f"{movie.reviews}"
            )
        )
        sentiment_analysis = response.text.strip()
        return jsonify({
            'movie_id': movie.id,
            'title': movie.title,
            'sentiment_analysis': sentiment_analysis
        })
    except Exception as e:
        return jsonify({'error': f'Failed to analyze sentiment: {str(e)}'}), 500
    


# default message to test API is connected
@app.route('/')
def index():
    return jsonify({'message': 'Connected to CineMind Flask API'})

if __name__ == '__main__':
    app.run(debug=True)
