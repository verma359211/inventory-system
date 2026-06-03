# Inventory & Order Management System

Production-ready full-stack Inventory & Order Management System built with FastAPI, React, PostgreSQL, Docker, and Docker Compose.

---

## Live Demo

### Frontend

Add your Vercel URL here

```text
https://inventory-system-gamma-lac.vercel.app
```

### Backend API

Add your Railway URL here

```text
https://inventory-system-production-88d4.up.railway.app
```

### API Documentation

```text
https://inventory-system-production-88d4.up.railway.app/docs
```

### Docker Hub Image

```text
https://hub.docker.com/r/verma17/inventory-backend
```

---

## Assessment Compliance

✅ Product Management

✅ Customer Management

✅ Order Management

✅ Inventory Tracking

✅ Dashboard Analytics

✅ React Frontend

✅ FastAPI Backend

✅ PostgreSQL Database

✅ Docker Containerization

✅ Docker Compose Orchestration

✅ Docker Hub Image

✅ Railway Deployment

✅ Vercel Deployment

✅ Environment Variables

✅ Alembic Database Migrations

✅ Responsive UI

---

## Architecture

```mermaid
flowchart TB

    User[Browser]

    subgraph Frontend
        FE[React + Vite]
    end

    subgraph Backend
        BE[FastAPI]
    end

    subgraph Database
        DB[(PostgreSQL)]
    end

    User --> FE
    FE -->|REST API| BE
    BE --> DB
```

### Production Architecture

```text
Vercel (Frontend)
        ↓
Railway (FastAPI Backend)
        ↓
Neon PostgreSQL
```

---

## Technology Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Frontend         | React 19, TypeScript, Vite |
| State Management | TanStack React Query       |
| Routing          | React Router               |
| Backend          | FastAPI                    |
| ORM              | SQLAlchemy 2.x             |
| Validation       | Pydantic                   |
| Database         | PostgreSQL                 |
| Migrations       | Alembic                    |
| Containerization | Docker                     |
| Orchestration    | Docker Compose             |
| Frontend Server  | Nginx                      |
| Deployment       | Railway, Vercel            |
| Image Registry   | Docker Hub                 |

---

## Features

### Product Management

* Create Product
* View Products
* Update Product
* Delete Product
* Unique SKU Validation
* Inventory Tracking
* Price Management

### Customer Management

* Create Customer
* View Customers
* Delete Customer
* Unique Email Validation

### Order Management

* Create Orders
* View Orders
* View Order Details
* Delete Orders
* Automatic Total Calculation
* Automatic Stock Reduction
* Inventory Validation

### Dashboard

* Total Products
* Total Customers
* Total Orders
* Low Stock Products

---

## Project Structure

```text
inventory-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   │
│   ├── alembic/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   └── types/
│   │
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API Endpoints

### Products

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /products      |
| GET    | /products/{id} |
| POST   | /products      |
| PUT    | /products/{id} |
| DELETE | /products/{id} |

### Customers

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /customers      |
| GET    | /customers/{id} |
| POST   | /customers      |
| DELETE | /customers/{id} |

### Orders

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /orders      |
| GET    | /orders/{id} |
| POST   | /orders      |
| DELETE | /orders/{id} |

### Dashboard

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /dashboard/summary |

---

## Business Rules

### Products

* SKU must be unique
* Quantity cannot be negative
* Price must be positive

### Customers

* Email must be unique

### Orders

* Customer must exist
* Product must exist
* Quantity must be positive
* Stock must be sufficient
* Total amount calculated by backend
* Stock automatically reduced after order creation

---

## Environment Variables

### Root `.env`

Used by Docker Compose.

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
POSTGRES_PORT=5432

BACKEND_PORT=8000
FRONTEND_PORT=5173

APP_NAME=Inventory API
DEBUG=false

CORS_ORIGINS=http://localhost:5173

VITE_API_BASE_URL=http://localhost:8000
```

---

### Backend `.env`

Used only when running FastAPI locally without Docker.

```env
APP_NAME=Inventory System API
DEBUG=true

DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/inventory_db

CORS_ORIGINS=http://localhost:5173
```

---

### Frontend `.env`

Used only during local React development.

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Local Development

### Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Docker

### Services

| Service    | Port |
| ---------- | ---- |
| Frontend   | 5173 |
| Backend    | 8000 |
| PostgreSQL | 5432 |

### Run Entire Stack

```bash
docker compose up --build
```

### Apply Database Migrations

```bash
docker compose exec backend alembic upgrade head
```

### Stop Containers

```bash
docker compose down
```

### Remove Containers and Volume

```bash
docker compose down -v
```

---

## Docker Files

### Backend

* Production-ready Dockerfile
* Python 3.12 Slim
* FastAPI + Uvicorn

### Frontend

* Multi-stage Docker Build
* Node 22 Alpine Builder
* Nginx Alpine Runtime

### PostgreSQL

* Official PostgreSQL Alpine Image
* Named Persistent Volume

### Docker Compose

Runs:

* Frontend Container
* Backend Container
* PostgreSQL Container

with networking and volume persistence configured automatically.

---

## Docker Hub

Backend image available at:

```text
https://hub.docker.com/r/verma17/inventory-backend
```

Pull image:

```bash
docker pull verma17/inventory-backend:latest
```

---

## Deployment

### Backend (Railway)

Environment Variables:

```env
APP_NAME=Inventory API
DEBUG=false

DATABASE_URL=<railway-or-neon-connection-string>

CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Start Command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Migration Command:

```bash
alembic upgrade head
```

---

### Frontend (Vercel)

Environment Variable:

```env
VITE_API_BASE_URL=https://inventory-system-production-88d4.up.railway.app
```

Build Command:

```bash
npm run build
```

Output Directory:

```text
dist
```

---

## QA Checklist

### Products

* Create Product
* Edit Product
* Delete Product
* Duplicate SKU Validation

### Customers

* Create Customer
* Delete Customer
* Duplicate Email Validation

### Orders

* Create Order
* View Orders
* View Order Details
* Delete Order
* Inventory Validation

### Dashboard

* Product Count
* Customer Count
* Order Count
* Low Stock Products

### Docker

* docker compose up --build succeeds
* migrations apply successfully
* frontend communicates with backend
* database persistence works

---

## Submission Deliverables

### GitHub Repository

https://github.com/verma359211/inventory-system

### Docker Hub Image

https://hub.docker.com/r/verma17/inventory-backend

### Live Frontend

Add your Vercel URL

### Live Backend

Add your Railway URL

---

## Notes

* Alembic is used for database schema migrations.
* PostgreSQL data is persisted using Docker named volumes.
* Frontend uses React Query for caching and state synchronization.
* Backend follows REST API design principles with proper HTTP status codes and validation.
* Environment variables are used for all configuration; no secrets are hardcoded.

---

## License

Created as part of a Software Engineer Technical Assessment.
