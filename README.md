# Perfuma - Perfume E-commerce Store

Perfuma is a full-stack perfume store application with:
- `perfuma-backend`: Spring Boot REST API + MySQL
- `perfuma-frontend`: static HTML/CSS/JavaScript web app

## Project Structure

```text
Perfuma_perfume_e-commerce_store/
├── perfuma-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/perfuma/backend/
│   │   │   │   ├── config/          # Seed data and resource config
│   │   │   │   ├── controllers/     # REST controllers
│   │   │   │   ├── dto/             # Request DTOs
│   │   │   │   ├── models/          # JPA entities
│   │   │   │   ├── repositories/    # Spring Data repositories
│   │   │   │   └── services/        # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/images/   # Product/hero images
│   │   └── test/                    # (no tests added yet)
│   └── pom.xml
├── perfuma-frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Data JPA
- MySQL
- Plain HTML/CSS/JavaScript frontend

## Prerequisites

- JDK 17+
- Maven 3.9+
- MySQL running on port `3307`
- A browser (Chrome/Edge/Firefox)

## Docker / OrbStack Setup (MySQL)

If you use [OrbStack](https://orbstack.dev/) on macOS, you can run MySQL using Docker instead of installing MySQL locally.

1. Install and open OrbStack.
2. From the backend folder, start MySQL:
   ```bash
   cd perfuma-backend
   docker compose up -d mysql
   ```
3. Confirm container is running:
   ```bash
   docker ps
   ```
   You should see container `perfuma_mysql` with port mapping `3307->3306`.
4. Keep `application.properties` aligned with compose values:
   - URL: `jdbc:mysql://localhost:3307/perfuma_db?...`
   - Username: `root`
   - Password: `yourpassword`
5. Then run backend and frontend normally.

To stop MySQL container:
```bash
cd perfuma-backend
docker compose down
```

## Backend Setup and Run

1. Go to backend folder:
   ```bash
   cd perfuma-backend
   ```
2. Configure database in `src/main/resources/application.properties`:
   - URL: `jdbc:mysql://localhost:3307/perfuma_db?...`
   - Username: `root`
   - Password: replace `yourpassword` with your local MySQL password
3. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or if Maven wrapper is not available:
   ```bash
   mvn spring-boot:run
   ```
4. Backend will start on:
   - `http://localhost:8080`

## Frontend Setup and Run

Open `perfuma-frontend/index.html` using a local server (recommended).

### Option 1: VS Code Live Server
- Right-click `index.html` -> **Open with Live Server**
- Default URL is usually `http://127.0.0.1:5500`

### Option 2: Python local server
```bash
cd perfuma-frontend
python3 -m http.server 5500
```
Then open:
- `http://127.0.0.1:5500`

If port `5500` is already in use:
```bash
python3 -m http.server 8081
```
Then open:
- `http://127.0.0.1:8081`

> The frontend is already configured to call backend APIs at `http://localhost:8080`.

## Seeded Test Users (Login Credentials)

When database is empty, startup seeds two users:

- **Admin**
  - Email: `admin@perfuma.com`
  - Password: `admin123`
  - Role: `ADMIN`
- **Customer**
  - Email: `customer@perfuma.com`
  - Password: `customer123`
  - Role: `CUS`

## Main API Endpoints

- Products:
  - `GET /api/products`
  - `GET /api/products/{id}`
  - `POST /api/products`
  - `PUT /api/products/{id}`
  - `DELETE /api/products/{id}`
- User auth:
  - `POST /users/login`
  - `POST /users/addUser`
- Cart:
  - `POST /cart/addToCart`
  - `GET /cart/user/{userId}`
  - `PUT /cart/updateCart/{cartId}`
  - `DELETE /cart/delete/{cartId}`
  - `DELETE /cart/clear/{userId}`
- Orders:
  - `POST /orders/checkout/{userId}?paymentMethod=CASH_ON_DELIVERY`
  - `GET /orders/user/{userId}`
  - `GET /orders/all` (admin monitoring)
  - `PUT /orders/{orderId}/status?status=PROCESSING` (manual admin update)

Base URL:
- `http://localhost:8080`

## Notes

- Product and user seed data are added automatically at first startup.
- Product images are served from backend static resources at:
  - `http://localhost:8080/images/...`
- Homepage images currently used by the frontend:
  - Hero section: `http://localhost:8080/images/hero.webp`
  - Inspiration section: `http://localhost:8080/images/baccarat-rouge.jpg`
- If frontend cannot load products, verify backend is running and accessible on port `8080`.

## Recent Platform Updates

- Admin form/input text visibility improved for easier editing.
- Admin product image now supports **file upload** (stored in DB as Base64 data URL).
- Stock is now synced with cart actions:
  - Add/increase cart quantity -> stock decreases
  - Decrease/remove cart quantity -> stock is restored
- Customer checkout now supports **Cash on Delivery**.
- Admin can monitor all orders and manually update status (`PLACED`, `PROCESSING`, `DISPATCHED`, `DELIVERED`, `CANCELLED`).

## Current Testing Status

- Automated tests are not added yet in this repository.
- You can validate manually with:
  - Login (admin/customer)
  - Product listing/search/filter
  - Cart actions (customer)
  - Admin product add/edit/delete
  - Cash on Delivery checkout
  - Admin order monitoring and status updates
