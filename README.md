# FitBook

A Telegram Mini App for discovering personal trainers and booking training sessions.

## Preview

### Home

![FitBook Home](screenshots/home.png)

### Trainers

![Trainers](screenshots/trainers.png)

### Booking

![Booking](screenshots/booking.png)

### My Bookings

![My Bookings](screenshots/bookings.png)

## Features

* Browse and search personal trainers
* Filter trainers by specialization
* View trainer profiles
* Choose available date and time
* Book training sessions
* View and cancel bookings
* Telegram user authentication
* Responsive mobile-first interface

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Alembic

### Development

* Docker
* Docker Compose
* ngrok

## How It Works

The application allows users to discover personal trainers, view their profiles, check available training slots, and book a session directly inside Telegram.

Users can also view their existing bookings and cancel them when needed.

## Telegram Authentication

FitBook uses Telegram Mini App `initData` to authenticate users.

The backend validates the Telegram data and verifies its signature and `auth_date` before processing authenticated requests.

## Booking Flow

```text
Home
  ↓
Trainers
  ↓
Search / Filter
  ↓
Trainer Profile
  ↓
Select Date
  ↓
Select Time
  ↓
Confirm Booking
  ↓
My Bookings
  ↓
Cancel Booking
```

## API

Main API endpoints:

```text
GET    /trainers
GET    /trainers/{trainer_id}/availability

POST   /bookings
GET    /bookings
DELETE /bookings/{booking_id}

POST   /auth/telegram
```

Development endpoints are also available through Swagger for managing trainer and availability data.

## Database

The application uses PostgreSQL for storing trainers, availability slots, and bookings.

Main entities:

```text
Trainer
   │
   ├── Availability
   │
   └── Booking
```

Alembic is used for database migrations.

## Project Structure

```text
FitBook/
│
├── backend/
│   ├── app/
│   │   ├── db/
│   │   ├── models/
│   │   ├── main.py
│   │   └── telegram_auth.py
│   │
│   ├── alembic/
│   ├── alembic.ini
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

## Running Locally

### Backend

From the `backend` directory:

```bash
docker compose up
```

Run database migrations:

```bash
python -m alembic upgrade head
```

The API will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

### Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Environment Variables

Create the required environment variables for the backend.

Example:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
DATABASE_URL=your_database_url
```

Do not commit `.env` files, bot tokens, passwords, or other secrets to the repository.

## Project Goals

This project was built to practice and demonstrate:

* Full-stack web development
* React and TypeScript
* REST API development with FastAPI
* PostgreSQL database integration
* SQLAlchemy ORM
* Database migrations with Alembic
* Telegram Mini Apps
* Telegram authentication
* Docker-based development
* Booking and availability logic
* Responsive UI development

## Status

FitBook is a portfolio project focused on demonstrating a complete booking workflow inside a Telegram Mini App.
