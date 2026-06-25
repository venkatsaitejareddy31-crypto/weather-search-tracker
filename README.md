# Weather Search History Tracker

A basic MERN stack weather project with a simple weather search UI and a "Recent Cities" sidebar.

## Features

- Search any city and see current weather.
- Save each searched city in the backend.
- Click a recent city to search it again fast.
- Use MongoDB when `MONGODB_URI` is set, with an in-memory fallback for quick local demos.

## Setup

1. Install dependencies from the project root:
   ```bash
   npm install
   ```
2. Add a `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/weather_search_history
   CLIENT_ORIGIN=http://localhost:5173
   ```
3. Start both apps:
   ```bash
   npm run dev
   ```

## API

- `GET /api/history` returns the recent searched cities.
- `GET /api/weather/:city` returns weather data and stores the city in history.

