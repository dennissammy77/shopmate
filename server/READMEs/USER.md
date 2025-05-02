# User Model
The User model represents each individual user of the ShopMate app. Each user belongs to a household, and has customizable preferences for personalized predictions.

## Collection: users
## Schema
```json
{
  "_id": "ObjectId",
  "email": "string",                  // Unique email address
  "passwordHash": "string",           // Hashed password
  "name": "string",                   // Full name of the user
  "householdId": "ObjectId",          // Reference to the household the user belongs to
  "preferences": {
    "prediction_opt_in": "boolean",   // Whether user wants to receive prediction suggestions
    "preferred_brands": ["string"]    // List of preferred product brands
  },
  "createdAt": "Date",                // Timestamp of account creation
  "updatedAt": "Date"                 // Timestamp of last profile update
}
```
## Relationships
`householdId` → References a document in the households collection

## Authentication Notes
Passwords are stored as hashed strings using bcrypt
Authentication is handled via JWT tokens returned after signup or login
Emails must be unique

## Example
```json
{
  "_id": "64fc2cba1f992a4c56e16f45",
  "email": "jane.doe@example.com",
  "passwordHash": "$2b$10$2G...",
  "name": "Jane Doe",
  "householdId": "64fc2cba1f992a4c56e11abc",
  "preferences": {
    "prediction_opt_in": true,
    "preferred_brands": ["Coca-Cola", "Dove"]
  },
  "createdAt": "2025-05-02T08:00:00.000Z",
  "updatedAt": "2025-05-02T08:00:00.000Z"
}
```

## Get Authenticated user
**Endpoint:**  
`GET /api/users/me`  

**Headers:**
`Authorization: Bearer JWT_TOKEN_HERE`
```json
{
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "testuser@example.com",
    "householdId": "HOUSEHOLD_ID",
    "preferences": {
      "prediction_opt_in": true,
      "preferred_brands": ["BrandX"]
    }
  }
}
```
Status Codes:

`200 OK – Returns authenticated user`

`401 Unauthorized – Missing or invalid token`

### Update Authenticated User

**Endpoint:**  
`PATCH /api/users/me`  

**Headers:**
`Authorization: Bearer JWT_TOKEN_HERE`

**Body Parameters:**
```json
{
  "name": "New Name",
  "preferences": {
    "prediction_opt_in": false,
    "preferred_brands": ["BrandA", "BrandB"]
  }
}
```
Success Response:
```json
{
  "user": {
    "id": "USER_ID",
    "name": "New Name",
    "email": "janedoe@example.com",
    "preferences": {
      "prediction_opt_in": false,
      "preferred_brands": ["BrandA", "BrandB"]
    }
  }
}
```
Status Codes:

`200 OK – Update successful`

`401 Unauthorized – No or invalid token`

`500 Server Error – Unexpected issues`