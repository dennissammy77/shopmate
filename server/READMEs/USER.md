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