from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

# Join tables
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
    name = db.Column(db.String(255), nullable=False)

class MovieCast(db.Model):
    __tablename__ = 'movies_cast'
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('cast.actor_id'), primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.character_id'), primary_key=True)