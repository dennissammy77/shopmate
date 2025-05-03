# Household Model
This model will allow users to belong to shared shopping groups and later power collaborative shopping lists and predictions.

`models/Household.js`
```json
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        members: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            },
        ],
    },
    {
    timestamps: true, // adds createdAt and updatedAt
    }
```
## Relationships
`User` → References a document in the user collection
## Notes:
- name: The household name (e.g., "Smith Family" or "Apartment 5B").
- members: An array of User ObjectIds.
- timestamps: Tracks creation and last update times for auditing.
- 

## Create Household

**Endpoint:** `POST /api/households`  
**Auth Required:** Yes (Bearer Token)  

### Headers
`Authorization: Bearer JWT_TOKEN_HERE`
`Content-Type: application/json`

### Request Body
```json
    {
      "name": "My Household Name"
    }
```
Success Response
`Status: 201 Created`
```json
    {
      "_id": "household_id",
      "name": "My Household Name",
      "members": ["user_id"],
      "createdAt": "...",
      "updatedAt": "..."
    }
```
Error Responses
`400 Bad Request`: Household name is missing

`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error

## Get Current User's Household

**Endpoint:** `GET /api/households/me`  
`Authorization: Bearer JWT_TOKEN_HERE`
### 📥 Request Body
None

### ✅ Success Response
**Status:** `200 OK`
```json
{
  "_id": "household_id",
  "name": "Fetch Household",
  "members": [
    {
      "_id": "user_id",
      "name": "Fetch User",
      "email": "fetch@example.com"
    }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```
Error Responses
`404 Not Found`: Household not assigned or doesn't exist

`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error

## Update Current User's Household

**Endpoint:** `PUT /api/households/me`  
**Auth Required:** Yes (Bearer Token)

### 🔐 Headers
Authorization: Bearer JWT_TOKEN_HERE
```json
{
  "name": "Updated Household Name"
}
```
Success Response
Status: `200 OK`
```json
    {
      "message": "Household updated",
      "household": {
        "_id": "household_id",
        "name": "Updated Household Name",
        "members": ["user_id1"],
        "createdAt": "...",
        "__v": 0
      }
    }
```
Error Responses
`404 Not Found`: Household not found

`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error
## Delete Current User's Household

**Endpoint:** `DELETE /api/households/me`  
**Auth Required:** Yes (Bearer Token)

### Headers
Authorization: Bearer JWT_TOKEN_HERE

### 📥 Request Body
None

### ✅ Success Response
**Status:** `200 OK`
```json
    {
      "message": "Household deleted successfully"
    }
```
Error Responses
`404 Not Found`: Household not assigned or already deleted

`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error

## Update Household Members

**Endpoint:** `PATCH /api/households/members`  
**Auth Required:** Yes (Bearer Token)

### 🔐 Headers
`Authorization: Bearer JWT_TOKEN_HERE`
### Request Body
```json
{
  "add": ["userId1", "userId2"],
  "remove": ["userId3"]
}
```
`add`: array of user IDs to add to household.

`remove`: array of user IDs to remove from household.
Success Response
Status: `200 OK`

```json
    {
      "message": "Household members updated",
      "household": {
        "_id": "householdId",
        "name": "Household Name",
        "members": ["userId1", "userId2"],
        ...
      }
    }
```
Error Responses
`404 Not Found`: Household not found

`500 Server Error`: Unexpected issue