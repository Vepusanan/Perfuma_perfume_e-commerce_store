# Perfuma - Perfume E-commerce Platform

Perfuma is a full-stack perfume e-commerce platform with customer shopping features and admin operations for catalog and order management.

## Platform Scope

### Business goal

Perfuma is designed to support a small to medium online perfume store with:
- Product discovery and filtering
- Customer authentication and shopping cart
- Inventory-aware order placement
- Manual operations support for admin (catalog + order monitoring)

### User roles

- **Customer (`CUS`)**
  - Browse products
  - Search and filter
  - Add/remove/update cart items
  - Checkout using Cash on Delivery (COD)
- **Admin (`ADMIN`)**
  - Add, edit, and delete products
  - Upload product images from local files
  - Monitor all orders
  - Update order status manually

### Current boundaries

- No external payment gateway yet (COD only)
- No shipment integration yet
- No advanced auth/JWT yet
- No automated test suite yet

## Architecture Overview

- `perfuma-frontend`: static HTML/CSS/JavaScript app
- `perfuma-backend`: Spring Boot REST API with layered architecture
- `MySQL`: persistent data storage

Data flow:
1. Frontend calls backend REST APIs
2. Backend executes business logic in services
3. Repositories persist entities in MySQL
4. Backend also serves static image assets under `/images/**`

## Project Structure

```text
Perfuma_perfume_e-commerce_store/
├── perfuma-backend/
│   ├── src/main/java/com/perfuma/backend/
│   │   ├── config/          # Seed data and web/static config
│   │   ├── controllers/     # API controllers
│   │   ├── dto/             # Request payload objects
│   │   ├── models/          # JPA entities
│   │   ├── repositories/    # Data access interfaces
│   │   └── services/        # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/images/
│   ├── docker-compose.yml   # MySQL container config
│   └── pom.xml
├── perfuma-frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

## Technology Stack

- Java 17
- Spring Boot 3
- Spring Data JPA
- MySQL 8
- Maven
- HTML/CSS/JavaScript (Vanilla)

## Core Features

### Catalog and product management

- Product listing with images, stock, and price
- Product search by name/brand
- Category filtering
- Admin CRUD for products
- Admin image upload (saved as Base64 data URL in DB)

### Cart and stock handling

- Customer cart operations are backed by server APIs
- Stock synchronization rules:
  - Add/increase cart quantity -> stock decreases
  - Decrease/remove cart quantity -> stock increases

### Checkout and order operations

- Checkout with `CASH_ON_DELIVERY`
- Order creation from cart
- Order states: `PLACED`, `PROCESSING`, `DISPATCHED`, `DELIVERED`, `CANCELLED`
- Admin can view all orders and manually update status

## Prerequisites

- JDK 17+
- Maven 3.9+
- MySQL running on port `3307` (local install or Docker)
- Browser (Chrome/Edge/Firefox)

## Database Configuration

Configure `perfuma-backend/src/main/resources/application.properties`:

- URL: `jdbc:mysql://localhost:3307/perfuma_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true`
- Username: `root`
- Password: `yourpassword` (replace with your local password)

## Docker / OrbStack (MySQL)

If you are on macOS, OrbStack is the easiest way to run MySQL for this project.

1. Install and open [OrbStack](https://orbstack.dev/).
2. Start MySQL from backend folder:
   ```bash
   cd perfuma-backend
   docker compose up -d mysql
   ```
3. Verify:
   ```bash
   docker ps
   ```
   Expected container: `perfuma_mysql` with `3307->3306`.
4. Stop:
   ```bash
   docker compose down
   ```

## Run the Application

### 1) Start backend

```bash
cd perfuma-backend
mvn spring-boot:run
```

Backend URL:
- `http://localhost:8080`

### 2) Start frontend

Use one option:

- **Live Server**: open `perfuma-frontend/index.html` with VS Code Live Server
- **Python server**:
  ```bash
  cd perfuma-frontend
  python3 -m http.server 5500
  ```
  If `5500` is occupied:
  ```bash
  python3 -m http.server 8081
  ```

Frontend URL:
- `http://127.0.0.1:5500` or `http://127.0.0.1:8081`

## Seeded Accounts for Testing

On first run (empty DB), seed data creates:

- **Admin**
  - Email: `admin@perfuma.com`
  - Password: `admin123`
  - Role: `ADMIN`
- **Customer**
  - Email: `customer@perfuma.com`
  - Password: `customer123`
  - Role: `CUS`

## Signup Policy

- Signup is **customer-only**.
- Admin account creation is not available through public signup.
- Signup UI does not expose any Admin role option.
- Password strength rules for signup:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

## API Summary

Base URL: `http://localhost:8080`

### Auth
- `POST /users/login`
- `POST /users/addUser`

### Products
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Cart
- `POST /cart/addToCart`
- `GET /cart/user/{userId}`
- `PUT /cart/updateCart/{cartId}`
- `DELETE /cart/delete/{cartId}`
- `DELETE /cart/clear/{userId}`

### Orders
- `POST /orders/checkout/{userId}?paymentMethod=CASH_ON_DELIVERY`
- `GET /orders/user/{userId}`
- `GET /orders/all`
- `PUT /orders/{orderId}/status?status=PROCESSING`

## UI Asset Notes

- Product and hero assets are served via backend static route:
  - `http://localhost:8080/images/...`
- Home page currently references:
  - Hero: `http://localhost:8080/images/hero.jpeg`
  - Inspiration: `http://localhost:8080/images/hero2.jpeg`

## Manual Validation Checklist

- Login as customer and admin
- Verify product search and category filtering
- Add/increase/decrease/remove cart items and confirm stock updates
- Checkout with COD and verify order creation
- Login as admin and update order statuses
- Add/edit/delete a product and upload a product image

## Known Gaps / Future Improvements

- Add JWT-based authentication and route protection
- Add payment gateway integration
- Add automated tests (unit + integration + e2e)
- Improve role-based authorization in backend endpoints
- Add order history UI enhancements and analytics dashboard
