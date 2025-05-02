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

### 📤 Request Body
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
