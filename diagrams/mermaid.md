```mermaid
erDiagram
    MOVIES {
        int id PK
        string title
        string original_title
        string overview
        float budget
        float revenue
        string release_date
        int runtime
        string status
        string tagline
        float popularity
        float vote_average
        int vote_count
        string original_language
        string homepage
    }

    GENRES {
        int genre_id PK
        string genre_name
    }

    MOVIE_GENRE {
        int movie_id FK
        int genre_id FK
    }

    PRODUCTION_COUNTRIES {
        int country_id PK
        string country_name
        string iso_code
    }

    MOVIE_PRODUCTION_COUNTRY {
        int movie_id FK
        int country_id FK
    }

    SPOKEN_LANGUAGES {
        int language_id PK
        string name
        string iso_code
    }

    MOVIE_SPOKEN_LANGUAGES {
        int movie_id FK
        int language_id FK
    }

    KEYWORDS {
        int keyword_id PK
        string keyword_name
    }

    MOVIE_KEYWORDS {
        int movie_id FK
        int keyword_id FK
    }

    MOVIES ||--o{ MOVIE_GENRE : has
    GENRES ||--o{ MOVIE_GENRE : contains

    MOVIES ||--o{ MOVIE_PRODUCTION_COUNTRY : has
    PRODUCTION_COUNTRIES ||--o{ MOVIE_PRODUCTION_COUNTRY : contains

    MOVIES ||--o{ MOVIE_SPOKEN_LANGUAGES : has
    SPOKEN_LANGUAGES ||--o{ MOVIE_SPOKEN_LANGUAGES : contains

    MOVIES ||--o{ MOVIE_KEYWORDS : has
    KEYWORDS ||--o{ MOVIE_KEYWORDS : contains
```

### Movies Table

| Field                 | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| **id** (Primary Key)  | A unique identifier for the movie.                                 |
| **title**             | The title of the movie.                                            |
| **original_title**    | The original title of the movie.                                   |
| **overview**          | A brief summary of the movie plot.                                 |
| **budget**            | The budget of the movie.                                           |
| **revenue**           | The total revenue the movie earned.                                |
| **release_date**      | The official release date of the movie.                            |
| **runtime**           | The duration of the movie in minutes.                              |
| **status**            | The current status of the movie (e.g., Released, Post-Production). |
| **tagline**           | A short phrase or slogan associated with the movie.                |
| **popularity**        | A measure of how popular the movie is.                             |
| **vote_average**      | The average rating given to the movie.                             |
| **vote_count**        | The total number of votes the movie received.                      |
| **original_language** | The original language of the movie.                                |
| **homepage**          | The official homepage URL of the movie.                            |

---

### Genres Table

| Field                      | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| **genre_id** (Primary Key) | Unique identifier for each genre.                          |
| **genre_name**             | The name of the genre (e.g., Action, Drama, Comedy, etc.). |

---

### Movie_Genre Table (Join Table for Many-to-Many Relationship between Movies and Genres)

| Field                      | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| **movie_id** (Foreign Key) | References the `id` in the Movies table.                                 |
| **genre_id** (Foreign Key) | References the `genre_id` in the Genres table.                           |
| **PRIMARY KEY**            | Composite primary key of `movie_id` and `genre_id` to ensure uniqueness. |

---

### Production_Countries Table

| Field                        | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| **country_id** (Primary Key) | Unique identifier for each country.                               |
| **country_name**             | The name of the country                                           |
| **iso_code**                 | The ISO 3166-1 alpha-2 country code (e.g. "US" for United States) |

---

### Movie_Production_Countries Table

| Field                        | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| **movie_id** (Foreign Key)   | References the `id` in the Movies table.                                  |
| **country_id** (Foreign Key) | References the `country_id` in the Production_Countries table             |
| **PRIMARY KEY**              | Composite primary key of `movie_id` and `country_id` to ensure uniqueness |

---

### Spoken_Languages Table

| Field                         | Description                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| **language_id** (Primary Key) | Unique identifier for each language.                           |
| **name**                      | The name of the language (e.g. "English", "Spanish").          |
| **iso_code**                  | The ISO 639-1 alpha-2 code for the language ("en" for English) |

---

### Movie_Spoken_Languages Table

| Field                         | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| **movie_id** (Foreign Key)    | References the `id` in the Movies table                                    |
| **language_id** (Foreign Key) | References the `language_id` in the Spoken_Languages table.                |
| **PRIMARY KEY**               | Composite primary key of `movie_id` and `language_id` to ensure uniqueness |

---

### Keywords Table

| Field                        | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| **keyword_id** (Primary Key) | Unique Identifier for each keyword.             |
| **keyword_name**             | The name of the keyword (e.g., "elf", "knight") |

---

### Movie_Keywords Table

| Field                        | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| **movie_id** (Foreign Key)   | References the `id` in the Movies Table                                   |
| **keyword_id** (Foreign Key) | References the `keyword_id` in the Keywords table                         |
| **PRIMARY KEY**              | Composite primary key of `movie_id` and `keyword_id` to ensure uniqueness |

---

### Cast Table

| Field                      | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **actor_id** (Primary Key) | Unique identifier for each actor                        |
| **name**                   | Name of the actor                                       |
| **gender**                 | Gender of the actor (1 = Female, 2 = Male, 0 = Unknown) |

---

### Movies_Cast Table

| Field                      | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| **movie_id** (Foreign Key) | References the `id` from the Movies table                               |
| **actor_id** (Foreign Key) | References the `actor_id` from the Cast table                           |
| **character**              | The character played by the actor                                       |
| **PRIMARY KEY**            | Composite primary key of `movie_id` and `actor_id` to ensure uniqueness |

---
