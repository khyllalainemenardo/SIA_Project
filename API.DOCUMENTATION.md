# API Data Contract Documentation

## 1. User Registration

### Endpoint

POST /api/register

### Full URL

http://localhost:8080/api/register

### Purpose

Registers a new user in the system.

### HTTP Headers

Content-Type: application/json

### Request Body

| Field | Data Type | Required |
|---|---|---|
| username | String | Yes |
| email | String | Yes |
| password | String | Yes |

### Sample Request

{
"username": "testuser",
"email": "test@example.com",
"password": "Password123"
}

### Successful Response

Status Code: 201 Created

{
"message": "Registration successful"
}

### Error Responses

400 Bad Request

{
"message": "Registration failed"
}

---

## 2. User Login

### Endpoint

POST /api/login

### Full URL

http://localhost:8080/api/login

### Purpose

Authenticates a registered user.

### HTTP Headers

Content-Type: application/json

### Request Body

| Field | Data Type | Required |
|---|---|---|
| username | String | Yes |
| password | String | Yes |

### Sample Request

{
"username": "testuser",
"password": "Password123"
}

### Successful Response

Status Code: 200 OK

{
"message": "Login successful"
}

### Error Response

401 Unauthorized

{
"message": "Invalid username or password"
}