import requests
import sqlite3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_API_URL = "https://api.themoviedb.org/3/"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"  # High-quality images

# Connect to SQLite database
db_path = "../models/cinemind.db"  # Update with your database path
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def fetch_movie_details(movie_id):
    """Fetch movie details from TMDB API."""
    url = f"{BASE_API_URL}movie/{movie_id}?language=en-US"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching movie {movie_id}: {response.status_code}")
        return None

def fetch_movie_videos(movie_id):
    """Fetch videos for a given TMDB movie ID."""
    url = f"{BASE_API_URL}movie/{movie_id}/videos?language=en-US"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        videos = response.json().get("results", [])
        for video in videos:
            if video["site"].lower() == "youtube" and video["type"].lower() == "trailer":
                return f"https://www.youtube.com/watch?v={video['key']}"
    else:
        print(f"Error fetching videos for movie {movie_id}: {response.status_code}")
    return None

def fetch_movie_credits(movie_id):
    """Fetch credits (cast and crew) for a given TMDb movie ID."""
    url = f"{BASE_API_URL}movie/{movie_id}/credits?language=en-US"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("cast", [])
    else:
        print(f"Error fetching credits for movie {movie_id}: {response.status_code}")
        return []

def fetch_movie_keywords(movie_id):
    """Fetch keywords for a given TMDb movie ID."""
    url = f"{BASE_API_URL}movie/{movie_id}/keywords"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("keywords", [])
    else:
        print(f"Error fetching keywords for movie {movie_id}: {response.status_code}")
        return []

def insert_actors_and_cast(movie_id, cast):
    """Insert actors and their roles into the database."""
    for actor in cast[:10]:  # Limit to the first 10 cast members
        actor_name = actor.get("name")
        gender = actor.get("gender", 0)  # Default to 0 if gender is missing
        character = actor.get("character", "Unknown")

        # Check if the actor already exists
        cursor.execute("SELECT actor_id FROM Cast WHERE name = ?", (actor_name,))
        actor_id = cursor.fetchone()
        if not actor_id:
            # Insert the actor if they don't exist
            cursor.execute("INSERT INTO Cast (name, gender) VALUES (?, ?)", (actor_name, gender))
            actor_id = cursor.lastrowid
        else:
            actor_id = actor_id[0]

        # Link the actor with the movie
        cursor.execute("INSERT OR IGNORE INTO Movies_Cast (movie_id, actor_id, character) VALUES (?, ?, ?)", (movie_id, actor_id, character))

def insert_keywords(movie_id, keywords):
    """Insert keywords and link them to the movie."""
    for keyword in keywords:
        keyword_name = keyword.get("name")

        # Check if the keyword already exists
        cursor.execute("SELECT keyword_id FROM Keywords WHERE keyword_name = ?", (keyword_name,))
        keyword_id = cursor.fetchone()
        if not keyword_id:
            # Insert the keyword if it doesn't exist
            cursor.execute("INSERT INTO Keywords (keyword_name) VALUES (?)", (keyword_name,))
            keyword_id = cursor.lastrowid
        else:
            keyword_id = keyword_id[0]

        # Link the keyword with the movie
        cursor.execute("INSERT OR IGNORE INTO Movie_Keywords (movie_id, keyword_id) VALUES (?, ?)", (movie_id, keyword_id))

def insert_movie_into_db(movie_data):
    """Insert a new movie and its related data into the database."""
    poster_url = f"{IMAGE_BASE_URL}{movie_data.get('poster_path')}" if movie_data.get('poster_path') else None
    backdrop_url = f"{IMAGE_BASE_URL}{movie_data.get('backdrop_path')}" if movie_data.get('backdrop_path') else None
    video_url = fetch_movie_videos(movie_data['id'])
    vote_average = round(movie_data.get('vote_average', 0), 1)  # Format to 1 decimal place

    # Insert movie details
    cursor.execute("""
        INSERT OR IGNORE INTO Movies (id, title, overview, release_date, budget, revenue, runtime, popularity, original_language, original_title, homepage, status, tagline, vote_average, vote_count, poster_url, backdrop_url, video_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        movie_data['id'], movie_data['title'], movie_data['overview'], movie_data['release_date'],
        movie_data['budget'], movie_data['revenue'], movie_data['runtime'], movie_data['popularity'],
        movie_data['original_language'], movie_data['original_title'], movie_data['homepage'],
        movie_data['status'], movie_data['tagline'], vote_average, movie_data['vote_count'],
        poster_url, backdrop_url, video_url
    ))

    # Insert genres
    for genre in movie_data.get('genres', []):
        cursor.execute("SELECT genre_id FROM Genres WHERE genre_name = ?", (genre['name'],))
        genre_id = cursor.fetchone()
        if not genre_id:
            cursor.execute("INSERT INTO Genres (genre_name) VALUES (?)", (genre['name'],))
            genre_id = cursor.lastrowid
        else:
            genre_id = genre_id[0]
        cursor.execute("INSERT OR IGNORE INTO Movie_Genre (movie_id, genre_id) VALUES (?, ?)", (movie_data['id'], genre_id))

    # Insert production countries
    for country in movie_data.get('production_countries', []):
        cursor.execute("SELECT country_id FROM Production_Countries WHERE country_name = ? AND iso_code = ?", (country['name'], country['iso_3166_1']))
        country_id = cursor.fetchone()
        if not country_id:
            cursor.execute("INSERT INTO Production_Countries (country_name, iso_code) VALUES (?, ?)", (country['name'], country['iso_3166_1']))
            country_id = cursor.lastrowid
        else:
            country_id = country_id[0]
        cursor.execute("INSERT OR IGNORE INTO Movie_Production_Countries (movie_id, country_id) VALUES (?, ?)", (movie_data['id'], country_id))

    # Insert spoken languages
    for language in movie_data.get('spoken_languages', []):
        cursor.execute("SELECT language_id FROM Spoken_Languages WHERE language_name = ? AND iso_code = ?", (language['name'], language['iso_639_1']))
        language_id = cursor.fetchone()
        if not language_id:
            cursor.execute("INSERT INTO Spoken_Languages (language_name, iso_code) VALUES (?, ?)", (language['name'], language['iso_639_1']))
            language_id = cursor.lastrowid
        else:
            language_id = language_id[0]
        cursor.execute("INSERT OR IGNORE INTO Movie_Spoken_Languages (movie_id, language_id) VALUES (?, ?)", (movie_data['id'], language_id))

    # Fetch and insert actors
    cast = fetch_movie_credits(movie_data['id'])
    insert_actors_and_cast(movie_data['id'], cast)

    # Fetch and insert keywords
    keywords = fetch_movie_keywords(movie_data['id'])
    insert_keywords(movie_data['id'], keywords)

    conn.commit()
    print(f"Inserted movie: {movie_data['title']} (ID: {movie_data['id']})")

def fetch_and_insert_new_movies():
    """Fetch popular movies from TMDB API and insert new ones into the database."""
    url = f"{BASE_API_URL}movie/popular?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        popular_movies = response.json().get('results', [])
        existing_movie_ids = [row[0] for row in cursor.execute("SELECT id FROM Movies").fetchall()]

        for movie in popular_movies:
            if movie['id'] not in existing_movie_ids:
                movie_details = fetch_movie_details(movie['id'])
                if movie_details:
                    insert_movie_into_db(movie_details)
    else:
        print(f"Error fetching popular movies: {response.status_code}")

def test_insert_specific_movie(movie_id):
    """Test inserting a specific movie by its TMDB ID."""
    print(f"Testing insertion for movie ID: {movie_id}")
    existing_movie_ids = [row[0] for row in cursor.execute("SELECT id FROM Movies").fetchall()]

    if movie_id in existing_movie_ids:
        print(f"Movie ID {movie_id} already exists in the database.")
    else:
        movie_details = fetch_movie_details(movie_id)
        if movie_details:
            insert_movie_into_db(movie_details)
            print(f"Movie ID {movie_id} successfully added to the database.")
        else:
            print(f"Failed to fetch details for movie ID {movie_id}.")

def find_and_insert_first_new_movie():
    """Find the first movie not in the database, insert it, and print its ID."""
    url = f"{BASE_API_URL}movie/popular?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        popular_movies = response.json().get('results', [])
        existing_movie_ids = [row[0] for row in cursor.execute("SELECT id FROM Movies").fetchall()]

        for movie in popular_movies:
            if movie['id'] not in existing_movie_ids:
                movie_details = fetch_movie_details(movie['id'])
                if movie_details:
                    insert_movie_into_db(movie_details)
                    print(f"Inserted new movie with ID: {movie['id']}")
                    return
    else:
        print(f"Error fetching popular movies: {response.status_code}")

# Test with a specific movie ID (ensure it's not already in the database)
# test_movie_id = 550  # Example: "Fight Club" (replace with a valid TMDB ID not in your database)
#test_insert_specific_movie(test_movie_id)

# Run the script to fetch and insert new movies
#fetch_and_insert_new_movies()

# Find and insert the first new movie
find_and_insert_first_new_movie()

# Close the database connection
conn.close()
