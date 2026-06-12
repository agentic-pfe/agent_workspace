# JWT Authentication API

This is a FastAPI application with JWT authentication setup using OAuth2PasswordBearer. It includes user registration and login endpoints.

## Features

- User registration with password hashing
- JWT token generation and validation
- Protected routes that require authentication
- SQLite database for user storage

## Setup

1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   uvicorn main:app --reload
   ```

## API Endpoints

### Register a new user
- **POST** `/register`
- Request Body:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "full_name": "string"
  }
  ```
- Response:
  ```json
  {
    "username": "string",
    "email": "string",
    "full_name": "string"
  }
  ```

### Login to get access token
- **POST** `/token`
- Request Body (form-data):
  - username: `string`
  - password: `string`
- Response:
  ```json
  {
    "access_token": "string",
    "token_type": "bearer"
  }
  ```

### Get current user info (protected route)
- **GET** `/users/me`
- Headers:
  - Authorization: `Bearer <access_token>`
- Response:
  ```json
  {
    "username": "string",
    "email": "string",
    "full_name": "string",
    "disabled": null
  }
  ```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are signed with HS256 algorithm
- Access tokens expire after 30 minutes