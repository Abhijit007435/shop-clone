# ShopClone 🛒

A full-stack Amazon-inspired e-commerce application built with **React**, **Spring Boot**, and **MongoDB Atlas**. This project was developed to learn full-stack application development, REST APIs, JWT authentication, and modern frontend-backend integration.

---

# Features

## Authentication & Authorization

* JWT-based authentication
* User registration and login
* BCrypt password hashing
* Persistent login using local storage
* Role-based authorization (User / Admin)
* Protected frontend routes
* Protected backend APIs with Spring Security

---

## Product Management

### User Features

* Browse all products
* Product details page
* Search by product name and description
* Category filtering
* Pagination
* Stock availability display
* Discount pricing

### Admin Features

* Create products
* Update products
* Soft delete products
* Protected admin endpoints

---

## Shopping Cart

* Add products to cart
* Update quantity
* Remove individual items
* Clear entire cart
* Live cart total calculation
* Stock validation before checkout

---

## Address Management

* Add multiple delivery addresses
* View saved addresses
* Delete addresses
* Select shipping address during checkout

---

## Order Management

### User

* Place orders
* View order history
* View complete order details
* Cancel pending orders
* Automatic stock restoration on cancellation

### Admin

* View all customer orders
* Update order status

  * PENDING
  * CONFIRMED
  * SHIPPED
  * DELIVERED
  * CANCELLED

---

# Tech Stack

## Frontend

* React (Vite)
* React Router DOM
* Axios
* Context API
* CSS

## Backend

* Spring Boot 3
* Spring Security
* JWT (jjwt)
* Spring Data MongoDB
* MongoDB Atlas
* Maven
* Lombok

---

# Project Structure

```
shop-clone
│
├── backend
│   ├── controller
│   ├── dto
│   ├── model
│   ├── repository
│   ├── security
│   ├── service
│   └── config
│
├── frontend
│   ├── api
│   ├── components
│   ├── context
│   ├── pages
│   ├── routes
│   └── styles
│
└── README.md
```

---

# Running the Project

## Backend

```bash
cd backend

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Environment Variables

## Backend (`application.properties`)

```properties
spring.data.mongodb.uri=<YOUR_MONGODB_URI>

jwt.secret=<YOUR_SECRET_KEY>
```

## Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# API Overview

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |

---

## Products

| Method | Endpoint                   | Access |
| ------ | -------------------------- | ------ |
| GET    | `/api/products`            | Public |
| GET    | `/api/products/{id}`       | Public |
| POST   | `/api/products/admin`      | Admin  |
| PUT    | `/api/products/admin/{id}` | Admin  |
| DELETE | `/api/products/admin/{id}` | Admin  |

---

## Cart

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/api/cart`             |
| POST   | `/api/cart/add`         |
| PUT    | `/api/cart/{productId}` |
| DELETE | `/api/cart/{productId}` |
| DELETE | `/api/cart/clear`       |

---

## Addresses

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | `/api/addresses`      |
| POST   | `/api/addresses`      |
| DELETE | `/api/addresses/{id}` |

---

## Orders

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/orders/place`       |
| GET    | `/api/orders`             |
| GET    | `/api/orders/{id}`        |
| PUT    | `/api/orders/{id}/cancel` |

---

## Admin Orders

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | `/api/orders/admin`      |
| PUT    | `/api/orders/admin/{id}` |

---

# Becoming an Admin

1. Register a user account.
2. Open MongoDB Atlas.
3. Navigate to the `users` collection.
4. Add `"ROLE_ADMIN"` to the user's `roles` array.
5. Log in again to receive a new JWT containing the admin role.

---

# Current Project Status

* ✅ JWT Authentication
* ✅ Role-based Authorization
* ✅ Product Catalog
* ✅ Search & Filtering
* ✅ Pagination
* ✅ Shopping Cart
* ✅ Address Management
* ✅ Checkout Flow
* ✅ Order Management
* ✅ Admin Order Management
* ✅ Product CRUD


---

# Future Improvements

* Product Reviews & Ratings
* Wishlist
* Stripe Payment Integration
* Order Tracking Timeline
* Admin Dashboard Analytics
* Email Notifications
* Image Upload (Cloudinary/AWS S3)

---

# License

This project was built as a learning project to practice full-stack development using React, Spring Boot, Spring Security, JWT, and MongoDB.

It is intended for educational purposes and is not production-ready.
