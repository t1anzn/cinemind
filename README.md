# CineMind 🎬

CineMind is a comprehensive movie exploration and data platform that helps users discover and explore films through rich data from The Movie Database (TMDB) API and intelligent insights. Built as a full-stack application with a custom Flask API backend, it provides detailed movie information, analytics, and features an AI-powered smart review section that uses Google's Gemini API to summarize reviews and provide intelligent commentary.

## 🎥 Demo

https://github.com/user-attachments/assets/bc0ec213-9ea9-4cb0-8a8f-0c47bb2dc4a8

_Watch CineMind in action - showcasing movie search, AI-powered reviews, and data visualizations._

## ✨ Features

- Movie search and discovery with trailers, posters, and backdrops
- Comprehensive movie metadata including cast, crew, and financial performance
- User reviews integration
- AI-powered review summaries (via Gemini API)
- Interactive analytical charts and database visualizations
- Custom Flask API for data management and processing
- Movie analytics and insights
- Responsive web interface built with Astro
- Accessibility features including dyslexia-friendly fonts, font size slider, high contrast mode, reduced motion options, and keyboard navigation

## 🛠️ Tech Stack

### Frontend

- **Astro** - Modern web framework for content-focused websites
- **React** - Interactive UI components
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Python Flask** - Lightweight web framework
- **SQLite** - Local database for movie data storage
- **Google Gemini API** - AI-powered review summarization

### Data & Analytics

- **Pandas** - Data manipulation and analysis
- **Chart.js** - Interactive data visualizations
- **TMDB API** - Movie metadata and information

## 📁 Project Directories

### Frontend (`/frontend`)

- **`src/pages/`** - Astro page components and routing
- **`src/components/`** - Reusable React components
- **`src/layouts/`** - Page layout templates
- **`src/styles/`** - CSS and styling files
- **`src/utils/`** - Utility functions and helpers
- **`src/hooks/`** - Custom React hooks
- **`src/assets/`** - SVG logos and graphics used in the about section
- **`public/`** - Static assets (images, icons, etc.)

### Backend (`/backend`)

- **`app/`** - Main Flask application code and development notebooks
  - **`app.py`** - Main Flask application entry point
  - **`api_and_db_testing.ipynb`** - Initial API testing and database implementation work from the start of the project
  - **`cinemind_toolkit.ipynb`** - Well-formatted utilities and commands for regular database operations and API management
  - **`cinemind_ai.ipynb`** - Testing and experimentation with the Gemini AI API for review analysis
- **`data/`** - CSV datasets and raw data files
  - **`tmdb_5000_movies.csv`** - Core movie dataset with metadata, budget, revenue, and ratings
  - **`tmdb_5000_credits.csv`** - Cast and crew information for movies
- **`models/`** - Original SQLite database files (now legacy - replaced by migration system)
- **`tests/`** - Unit testing files and test notebooks
  - **`test_database.ipynb`** - Comprehensive unit tests for database functionality and data integrity
- **`requirements.txt`** - Python dependencies

### Other

- **`diagrams/`** - Project documentation and diagrams, mainly showing the backend database structure with Mermaid diagrams
- **`migration_project/`** - **Current active database** - SQLAlchemy-based implementation with Alembic migrations (more powerful than the original cinemind.db)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Python 3.8 or higher
- Flask

### Frontend Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/t1anzn/cinemind
   cd cinemind/frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start development server**
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:4321`

### Backend Setup

1. **[Optional] Create a virtual environment (from project root)**

   ```sh
   # From the cinemind root directory
   python -m venv venv

   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate

   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Navigate to backend directory**

   ```sh
   cd backend
   ```

3. **Install Python dependencies**

   ```sh
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   ```sh
   # Create a .env file in the backend/app directory
   # Add your API keys as shown in the Environment Variables section below
   ```

5. **Start Flask server**
   ```sh
   cd app
   flask run
   ```

### Full-Stack Development

1. **Start both frontend and backend**

   ```sh
   # Terminal 1 - Backend
   cd backend/app && flask run

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 🌐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
TMdb_api_key=your_tmdb_bearer_token_here
GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:5000
```

**Getting API Keys:**

- **TMDB API**: Get your bearer token from [TMDB API Settings](https://www.themoviedb.org/settings/api)
- **Gemini API**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎨 Design & Planning

- [Miro Board - Project Planning & Wireframes](https://miro.com/welcomeonboard/MWNqbGFuSnR2eGFpWmZvOHpZa0dnWXNNZ3BXOGZNNjErOGw3L0pZOWpqSy8zSEF0cmNjSEFTeFllNXhvMEpHay95ZWZFcDREMjBacUoweTArSUF4VHFTRzlyVU9LNnJNdzdvR3FJeVpKelkrK1pId2U0M1VNNFRYM3YyUWtHY1BQdGo1ZEV3bUdPQWRZUHQzSGl6V2NBPT0hdjE=?share_link_id=349313849409)
- [Figma - UI/UX Design System](https://www.figma.com/design/PGvnXwsl5oZu1HCtS92Qo9/Movie-Database-Wireframe?node-id=0-1&t=r7HSsxrDrFJ8ZyHN-1)

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Movie Database API Documentation](https://developers.themoviedb.org/3)

## 👥 Credits

This project was developed by:

**Timothy Chen** - Lead Full-Stack Developer & AI Engineer

- BSc Computer Science Student at University of the Arts London (UAL)
- Full-stack development with frontend leadership, backend architecture, AI integration with Gemini API, and system design
- [GitHub](https://github.com/t1anzn) | [LinkedIn](https://www.linkedin.com/in/timothy-chen-0a2900286/)

**Balmee Hunumunt** - Backend Lead Developer

- BSc Computer Science Student at University of the Arts London (UAL)
- Backend development, API architecture, database design, and TMDB API data processing
- [GitHub](https://github.com/Balmee) | [LinkedIn](https://www.linkedin.com/in/balmee-hunumunt-87080429a/)

## 📄 License

This project is part of the UAL Data-Driven Full Stack course.
