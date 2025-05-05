# Shopping List Model
This model will allow users to belong to shared shopping groups to create, list and manage shopping lists

## Feature Scope: Shopping Lists
Each household can have multiple shopping lists. Each shopping list contains:

- A name (e.g. “Weekly Groceries”)

- An optional description

- An array of items (will be handled separately later)

- A createdBy user reference

- A reference to the householdId it belongs to

- Timestamps
- 
`models/shoppingList.model.js`
```json
    {
        "name": {
            "type": "String",
            "required": "true",
        },
        "description": "String",
        "householdId": {
            "type": "mongoose.Schema.Types.ObjectId",
            "ref": "Household",
            "required": true,
        },
        "createdBy": {
            "type": "mongoose.Schema.Types.ObjectId",
            "ref": "User",
            "required": true,
        },
    },
    { "timestamps": true }
```

## Relationships
`Household` → References a document in the household collection
`User` → References a document in the user collection

## Create Shopping list

**Endpoint:** `POST /api/shopping-lists`  
**Auth Required:** Yes (Bearer Token)  

### Headers
`Authorization: Bearer JWT_TOKEN_HERE`
`Content-Type: application/json`

### Request Body
```json
    {
      "name": "Weekly Groceries",
      "description": "Our usual weekly items",
      "householdId": "HOUSEHOLD_OBJECT_ID"
    }
```
Success Response
`Status: 201 Created`
```json
    {
        "name": "Weekly List",
        "description": "Groceries for the week",
        "householdId": "68154187a401c2c191a554a9",
        "createdBy": "68153ae0192a166548dd4039",
        "_id": "6815b3c89a3fbe2eafa6cca8",
        "createdAt": "2025-05-03T06:12:24.529Z",
        "updatedAt": "2025-05-03T06:12:24.529Z",
        "__v": 0
    }
```
Error Responses
`400 Bad Request`: Household name is missing

`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error

## Get All Shopping Lists for a Household
Endpoint:
`GET /api/shopping-lists/:householdId`
Auth required: Yes (Bearer Token)

Description:
Returns all shopping lists that belong to the specified household.
Request Headers:
`Authorization: Bearer <your_token>`
URL Params:
| Param         | Type     | Required | Description             |
| ------------- | -------- | -------- | ----------------------- |
| `householdId` | ObjectId | Yes      | The ID of the household |
Success Response
`Status: 200 Created`
```json
    [
      {
        "_id": "66400456d8a31c001e3a4f2a",
        "name": "Weekly Groceries",
        "description": "Basic weekly shopping",
        "householdId": "664001f92d8d50a1e25bcb3c",
        "createdBy": "663ff20e1a3b54001ee2e938",
        "createdAt": "2025-05-02T20:40:00.000Z",
        "__v": 0
      }
    ]
```
Error Responses
`401 Unauthorized`: Missing or invalid token

`500 Server Error`: Internal error

## Get a Specific Shopping List
Endpoint:
`GET /api/shopping-lists/list/:id`
Returns one shopping list by its ID.
Headers:
`Authorization: Bearer <your_token>`
| Param | Type     | Required | Description      |
| ----- | -------- | -------- | ---------------- |
| id    | ObjectId | Yes      | Shopping List ID |
Sample Response:
```json
    {
      "_id": "66400456d8a31c001e3a4f2a",
      "name": "Target List",
      "description": "Shopping at Target",
      "householdId": "664001f92d8d50a1e25bcb3c",
      "createdAt": "2025-05-02T21:10:00.000Z"
    }
```
Errors:
`404 - Not found`

`500 - Server error`

## Delete a Shopping List
Endpoint:
`DELETE /api/shopping-lists/item/:id`
Returns one shopping list by its ID.
Headers:
`Authorization: Bearer <your_token>`
| Param | Type     | Required | Description      |
| ----- | -------- | -------- | ---------------- |
| id    | ObjectId | Yes      | Shopping List ID |
Sample Response:
```json
    {
      "message": "Shopping list deleted successfully"
    }
```
Errors:
`404 - Shopping list not found`

`500 - Server error`

## Add Item to Shopping List
Endpoint:
`POST /api/shopping-lists/list/:id/item/add`
Returns shopping list by its ID.
Headers:
`Authorization: Bearer <your_token>`
| Param | Type     | Required | Description      |
| ----- | -------- | -------- | ---------------- |
| id    | ObjectId | Yes      | Shopping List ID |
### Request Body
```json
    {
      "name": "Milk",
      "quantity": "2",
    }
```
Sample Response:
```json
    {
      "_id": "list_id",
      "items": [
        {
          "name": "Milk",
          "quantity": 2,
          ...
        }
      ]
    }
```
Errors:
`404 - Shopping list not found`

`500 - Server error`