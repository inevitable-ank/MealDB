# TheMealDB Explorer

A full-stack project that explores TheMealDB with a clean, production-style architecture: a Spring Boot API that proxies and caches TheMealDB, and a React + Vite frontend that delivers a modern UI.

## Why This Architecture

- **Backend proxy** keeps API key usage server-side and normalizes TheMealDB responses.
- **Caching** (Caffeine) reduces latency and external API calls.
- **Frontend** stays focused on UI and UX, calling stable, simplified endpoints.

## Tech Stack

**Backend**
- Java 17, Spring Boot
- REST API, validation, cache abstraction
- Caffeine (in-memory cache)

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS

## Project Structure

```
Assignment1/
  backend/MealDb/          # Spring Boot API
  frontend/               # React UI
```

## Backend Setup (Spring Boot)

### 1) Install and run

From the repo root:

```bash
cd backend\MealDb
.\mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 2) Configuration

`application.properties` contains:

- TheMealDB base URL and API key
- Caffeine cache settings (TTL + max size)

Key settings:

```
themealdb.base-url=https://www.themealdb.com/api/json/v1
themealdb.api-key=1
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

### 3) API Endpoints

Base URL: `http://localhost:8080/api`

- `GET /search?name=chicken` — search meals by name
- `GET /categories` — list categories
- `GET /category/{name}` — meals in a category
- `GET /meal/{id}` — meal details
- `GET /random` — random meal
- `GET /stats?query=chicken` — stats for UI

### 4) Caching Behavior

Cached endpoints:
- search, categories, meals by category, meal details, stats

Not cached:
- random meal (must return a new recipe each time)

## Frontend Setup (React)

### 1) Install and run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 2) Environment

The frontend calls the backend via:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

If you need a custom URL, create `.env` in `frontend/` with the value above.

### 3) Features

- **Search**: Query TheMealDB by name
- **Categories**: Browse meals by category
- **Random Meal**: Surprise recipe
- **Details**: Ingredients, instructions, YouTube embed
- **Responsive UI**: Works on mobile and desktop

## How the App Works

1. Frontend calls the backend (`/api/...`).
2. Backend calls TheMealDB and returns simplified DTOs.
3. Cache reduces repeated calls.
4. Frontend renders results and handles interactions.

## Commands Summary

```bash
# Backend
cd backend\MealDb
.\mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

## Notes

- This project uses TheMealDB test key `1`.
- All endpoints are local; no external secrets required.

## Submission

- Push repository to GitHub
- Share the repo link in your submission email
