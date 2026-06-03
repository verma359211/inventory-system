# Inventory & Order Management System

Production-ready full-stack Inventory & Order Management System built with FastAPI, React, PostgreSQL, Docker, and Docker Compose.

---

# Live Demo

### Frontend

https://inventory-system-gamma-lac.vercel.app

### Backend API

https://inventory-system-production-b35e.up.railway.app

### API Documentation

https://inventory-system-production-b35e.up.railway.app/docs

### Docker Hub Image

https://hub.docker.com/r/verma17/inventory-backend

### GitHub Repository

https://github.com/verma359211/inventory-system

---

# Assessment Requirements Covered

✅ Product Management

✅ Customer Management

✅ Order Management

✅ Inventory Tracking

✅ Dashboard Analytics

✅ React Frontend

✅ FastAPI Backend

✅ PostgreSQL Database

✅ Docker Containerization

✅ Docker Compose

✅ Docker Hub Image

✅ Railway Deployment

✅ Vercel Deployment

✅ Environment Variables

✅ Responsive UI

---

# Technology Stack

| Layer | Technology |
|---------|---------|
| Frontend | React, TypeScript, Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Migrations | Alembic |
| State Management | React Query |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Deployment | Railway, Vercel |

---

# Features

## Products

- Create Product
- View Products
- Update Product
- Delete Product
- SKU Validation
- Inventory Tracking

## Customers

- Create Customer
- View Customers
- Delete Customer
- Unique Email Validation

## Orders

- Create Orders
- View Orders
- Order Details
- Delete Orders
- Automatic Stock Reduction
- Automatic Total Calculation

## Dashboard

- Total Products
- Total Customers
- Total Orders
- Low Stock Products

---

# Project Structure

```text
inventory-system
│
├── backend
├── frontend
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# Quick Start (Recommended)

## Run Entire Application Using Docker Compose

Clone repository:

```bash
git clone https://github.com/verma359211/inventory-system.git
cd inventory-system
```

Create environment file:

```bash
cp .env.example .env
```

Start application:

```bash
docker compose up --build
```

Application URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
Docs:     http://localhost:8000/docs
```

Stop:

```bash
docker compose down
```

---

# Docker Compose Services

The compose setup runs:

| Service | Purpose |
|----------|----------|
| frontend | React application |
| backend | FastAPI API |
| postgres | PostgreSQL database |

PostgreSQL data is stored using a named Docker volume.

---

# Running Backend Docker Image Only

Pull image:

```bash
docker pull verma17/inventory-backend:latest
```

Run image:

```bash
docker run -p 8000:8000 \
-e DATABASE_URL="YOUR_DATABASE_URL" \
-e CORS_ORIGINS="http://localhost:5173" \
verma17/inventory-backend:latest
```

Required:

- PostgreSQL database
- DATABASE_URL environment variable

The container automatically runs Alembic migrations during startup.

---

# Environment Variables

## Docker Compose (.env)

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db

BACKEND_PORT=8000
FRONTEND_PORT=5173

APP_NAME=Inventory API
DEBUG=false

CORS_ORIGINS=http://localhost:5173

VITE_API_BASE_URL=http://localhost:8000
```

## Backend Local Development

```env
APP_NAME=Inventory System API
DEBUG=true

DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/inventory_db

CORS_ORIGINS=http://localhost:5173
```

## Frontend Local Development

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

# Local Development

## Backend

```bash
cd backend

python -m venv .venv

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# API Endpoints

## Products

```text
GET    /products
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
```

## Customers

```text
GET    /customers
GET    /customers/{id}
POST   /customers
DELETE /customers/{id}
```

## Orders

```text
GET    /orders
GET    /orders/{id}
POST   /orders
DELETE /orders/{id}
```

## Dashboard

```text
GET /dashboard/summary
```

---

# Business Rules

- SKU must be unique
- Customer email must be unique
- Product quantity cannot be negative
- Orders cannot exceed available stock
- Creating orders automatically reduces stock
- Total amount is calculated by the backend
- Request validation enforced using Pydantic

---

# Submission Deliverables

### GitHub

https://github.com/verma359211/inventory-system

### Docker Hub

https://hub.docker.com/r/verma17/inventory-backend

### Live Frontend

https://inventory-system-gamma-lac.vercel.app

### Live Backend

https://inventory-system-production-b35e.up.railway.app

---

# Notes

- Docker Compose runs the complete stack.
- Backend Docker image automatically applies Alembic migrations on startup.
- PostgreSQL data persists using Docker volumes.
- No credentials are hardcoded.
- Environment variables are used for all configuration.

---

Created as part of a Software Engineer Technical Assessment.