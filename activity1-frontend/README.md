# Authenticated Service Request Module — ReactJS + Spring Boot

A full-stack service request management system with JWT authentication. Users can register, log in, and create, view, update, and delete their own service requests. Spring Security protects all request endpoints, and ownership is enforced on the backend — a user can never view, modify, or delete another user's request.

**Student:** Khylla Laine Menardo · **Section:** G01 · **Course:** IT342 – Systems Integration and Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | ReactJS (Vite) |
| Backend | Spring Boot 4.1, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.13) sent via `Authorization: Bearer <token>` header |
| Database | MySQL / MariaDB |
| Build tools | Maven (backend), npm (frontend) |

## Project Structure

```
SIA_Project-main/
├── pom.xml                  # Maven config (note: source dirs point at activity1-backend)
├── activity1-backend/       # Spring Boot source (main/java, main/resources)
│   └── main/resources/application.properties
└── activity1-frontend/      # React + Vite app
    └── src/ (pages, components, services/api.js, ServiceRequests.jsx)
```

## Prerequisites

- **JDK 17 or 21** (must match `<java.version>` in `pom.xml` — edit that property if your installed JDK differs)
- **Node.js 18+** and npm
- **MySQL 8.x** or **MariaDB** (XAMPP works) running on port **3306**
- IntelliJ IDEA (recommended) or Maven CLI

## 1. Database Setup

1. Start MySQL/MariaDB (e.g., start MySQL in the XAMPP control panel, or the MySQL80 Windows service).
2. Create the database (MySQL Workbench, phpMyAdmin, or CLI):

   ```sql
   CREATE DATABASE activity1db;
   ```

3. Tables (`users`, service requests) are created automatically by Hibernate on first backend startup (`spring.jpa.hibernate.ddl-auto=update`). No SQL scripts needed.

## 2. Backend Configuration

Edit `activity1-backend/main/resources/application.properties` to match your machine:

```properties
spring.application.name=activity1

spring.datasource.url=jdbc:mysql://localhost:3306/activity1db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD   # leave empty for default XAMPP root

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Adjust the port in the URL if your MySQL runs on a non-default port, and the database name if you created it under a different name.

## 3. Run the Backend

**IntelliJ:** open the project folder, let Maven finish importing, then run `Activity1Application.java` (green arrow next to `main()`).

**CLI alternative:**

```bash
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

Wait for `Started Activity1Application` in the console. The API is now at **http://localhost:8080**.

> If compilation fails with a JVM target error, your JDK version doesn't match `<java.version>` in `pom.xml` — install the matching JDK or change the property to your installed version (17 or 21 both work).

## 4. Run the Frontend

```bash
cd activity1-frontend
npm install        # first time only
npm run dev
```

Open the printed URL — **http://localhost:5173**.

> CORS is configured for port 5173 (and 5174). If Vite starts on a different port because 5173 is busy, close the other Vite instance or add the new port to `corsConfigurationSource()` in `SecurityConfig.java`.

## 5. Using the App

1. **Register** two accounts at `/register` (e.g., User A and User B).
2. **Log in** — the backend returns a JWT which the frontend stores in localStorage. If you are not redirected automatically, navigate to `/requests`.
3. On **My Service Requests** you can create, edit, and delete your own requests. All API calls send the JWT in the `Authorization: Bearer <token>` header.

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register (password stored BCrypt-hashed) |
| POST | `/api/auth/login` | Public | Login → returns `{ token, username, email }` |
| POST | `/api/requests` | JWT | Create request (linked to authenticated user) |
| GET | `/api/requests` | JWT | List **own** requests only |
| GET | `/api/requests/{id}` | JWT | View one — `403` if not the owner |
| PUT | `/api/requests/{id}` | JWT | Update own — `403` if not the owner |
| DELETE | `/api/requests/{id}` | JWT | Delete own — `403` if not the owner |

Requests without a valid JWT receive **401 Unauthorized**. Ownership is verified server-side in the controller by comparing the authenticated user (from the JWT) to the request's owner — a request from User B against User A's record returns **403 Forbidden** regardless of what the client sends.

## Verifying Security (Postman)

1. Log in as User A, copy the token, create a request, note its `id`.
2. `GET /api/requests` with **no** token → `401 Unauthorized`.
3. Log in as User B, use B's token on `GET /api/requests/{A's id}` → `403 Forbidden`, "You cannot access this request."

## Troubleshooting

- **`Failed to fetch` / `ERR_CONNECTION_REFUSED` in the browser** — the backend isn't running; start it and wait for `Started Activity1Application`.
- **CORS error in the browser console** — frontend is on an unexpected port; see the note in step 4.
- **`Communications link failure` on backend startup** — MySQL isn't running or the port/credentials in `application.properties` are wrong.
- **`Unknown database`** — the database name in `spring.datasource.url` doesn't exist; create it (step 1).
- **Login fails for an account that used to work** — accounts created before password hashing was added can't authenticate; delete the row and re-register.
