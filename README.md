# ShopClone 🛒

A full-stack Amazon-style e-commerce platform built as a learning project — React frontend, Spring Boot backend, MongoDB Atlas database.

## Features

- **Authentication** — JWT-based register/login, role-based access (user/admin), BCrypt password hashing
- **Product catalog** — Browse, search (matches name and description), filter by category, paginated listings
- **Product details** — Full product view with pricing, discounts, stock status
- **Admin product management** — Create, update, and soft-delete products (admin-only API endpoints)

## Tech Stack

**Frontend**
- React (via Vite)
- React Router for navigation
- Axios for API calls
- Context API for auth state

**Backend**
- Spring Boot 3 (Java 17)
- Spring Security + JWT (jjwt 0.12.x)
- Spring Data MongoDB
- MongoDB Atlas (cloud-hosted)
- Maven

## Project Structure

```
Amazon_clone/
├── backend/                 # Spring Boot API
│   └── src/main/java/com/shopclone/backend/
│       ├── config/          # Security configuration
│       ├── controller/      # REST endpoints
│       ├── dto/              # Request/response objects
│       ├── exception/       # Global error handling
│       ├── model/             # MongoDB documents
│       ├── repository/      # Data access layer
│       ├── security/          # JWT filter & utilities
│       └── service/           # Business logic
└── frontend/                # React (Vite) app
    └── src/
        ├── api/                # Axios instance & API functions
        ├── components/      # Reusable UI components
        ├── context/          # Auth context/state
        ├── pages/             # Page-level components
        └── routes/            # Route protection
```

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven
- A MongoDB Atlas account (free tier works fine) — [create one here](https://www.mongodb.com/cloud/atlas/register)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the example properties file and fill in your own values:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
3. Edit `application.properties` and set:
   - `spring.data.mongodb.uri` — your MongoDB Atlas connection string
   - `jwt.secret` — any long random string (used to sign JWTs)
4. Run the backend:
   ```bash
   mvn spring-boot:run
   ```
   The API will start on `http://localhost:8080`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

### Running Both Together

Backend and frontend run as two separate processes — start each in its own terminal, and leave both running while you use the app.

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Log in, receive a JWT |
| GET | `/api/products` | Public | List/search/filter products (paginated) |
| GET | `/api/products/{id}` | Public | Get a single product |
| POST | `/api/products/admin` | Admin only | Create a product |
| PUT | `/api/products/admin/{id}` | Admin only | Update a product |
| DELETE | `/api/products/admin/{id}` | Admin only | Soft-delete a product |

### Becoming an admin

There's no public signup path to admin (intentionally). To test admin endpoints locally:
1. Register a normal account
2. In MongoDB Atlas, open the `users` collection and add `"ROLE_ADMIN"` to that user's `roles` array
3. Log in again to get a fresh JWT that includes the new role

## Roadmap

- [x] Project setup
- [x] Authentication (JWT, role-based access)
- [x] Product catalog (CRUD, search, filter, pagination)
- [ ] Cart & Wishlist
- [ ] Checkout & Orders
- [ ] Payments (Stripe)
- [ ] Admin panel (UI)
- [ ] Reviews & ratings

## License

This is a personal learning project, built step by step while learning full-stack development. Not intended for production use.