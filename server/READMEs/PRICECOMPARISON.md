## Compare Item Prices

**Endpoint:** `GET /api/price/compare?itemName=`  
**Auth Required:** Yes (Bearer Token)

### 🔐 Headers
`Authorization: Bearer JWT_TOKEN_HERE`
### Request query
| Param    | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| itemName | String | Yes      | Name of the product |


Success Response
Status: `200 OK`

```json
    {
      "itemName": "milk",
      "prices": [
        {
          "storeName": "Walmart",
          "price": 4.87,
          "currency": "USD",
          "lastChecked": "2025-05-02T19:11:53.342Z"
        },
        ...
      ]
    }
```
Error Responses
`400 Not Found`: Missing itemName in query

`500 Server Error`: Unexpected issue