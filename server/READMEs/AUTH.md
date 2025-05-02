# Authentication API
This module handles user authentication for the ShopMate app, including registration, login, and accessing authenticated user information.

## Base URL
```bash
/api/auth
```

## Sign Up
Endpoint:
`POST /signup`
Creates a new user account.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```
Success Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

Status Codes:
`201 Created – Successfully registered`

`400 Bad Request – Missing fields or user already exists`

## Login
Endpoint:
`POST /login`
Authenticates a user and returns a JWT.
Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```
Success Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```
Status Codes:
`200 OK – Successful login`
`400 Bad Request – Invalid credentials`

## Get Authenticated User
Endpoint:
`GET /api/protected/me`
Returns user details for the currently authenticated user. 

Headers:
makefile
`Authorization: Bearer JWT_TOKEN_HERE`
Success Response:
```json
{
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```
Status Codes:
`200 OK – Returns authenticated user`
`401 Unauthorized – Token missing or invalid`

## Security Notes
- Passwords are hashed using bcrypt.
- Authentication is handled using JWT (JSON Web Tokens).
- Tokens should be stored securely on the client (e.g., AsyncStorage or SecureStore in React Native).
- All requests must be sent over HTTPS in production.