# Inventory System

Full-stack inventory application with a FastAPI backend and React frontend.

## Docker (backend + PostgreSQL)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` if you want different credentials or CORS origins.

3. Start services:

   ```bash
   docker compose up --build
   ```

4. Apply database migrations (first run and after model changes):

   ```bash
   docker compose exec backend alembic upgrade head
   ```

5. Stop services:

   ```bash
   docker compose down
   ```

### API

- Health: http://localhost:8000/health
- DB health: http://localhost:8000/health/db
- Products: http://localhost:8000/products
- OpenAPI docs: http://localhost:8000/docs

## Local backend development

See `backend/.env.example` for environment variables when running outside Docker.

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
