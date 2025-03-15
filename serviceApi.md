# Service API Documentation

## Base URL
```
http://yourdomain.com/api/services
```

## Authentication
Most endpoints require authentication. Use a valid token in the `Authorization` header:
```json
Authorization: Bearer <your_token>
```

---

## 1. Create a Service
**Endpoint:**
```
POST /api/services
```

**Description:**  
Creates a new service.

**Request Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Home Cleaning",
  "description": "Professional home cleaning services",
  "imageUrl": "https://example.com/image.jpg",
  "category": "Cleaning",
  "price": 50,
  "location": "Nairobi",
  "provider": "605c72ef2f1b2c0015b5bdf6",
  "status": "available"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": { "_id": "60f7c90b8b1d2a001c9c25e5" }
}
```

---

## 2. Get All Services
**Endpoint:**
```
GET /api/services/all
```

**Description:**  
Fetches all available services.

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "_id": "60f7c90b8b1d2a001c9c25e5",
      "title": "Home Cleaning",
      "category": "Cleaning",
      "price": 50,
      "location": "Nairobi",
      "status": "available"
    }
  ]
}
```

---

## 3. Get Service by ID
**Endpoint:**
```
GET /api/services/id?id=<service_id>
```

**Description:**  
Fetches a single service by its ID.

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "60f7c90b8b1d2a001c9c25e5",
    "title": "Home Cleaning",
    "description": "Professional home cleaning services",
    "category": "Cleaning",
    "price": 50,
    "location": "Nairobi",
    "status": "available"
  }
}
```

---

## 4. Get Services by Provider
**Endpoint:**
```
GET /api/services/provider/:id
```

**Description:**  
Fetches services offered by a specific provider.

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "_id": "60f7c90b8b1d2a001c9c25e5",
      "title": "Home Cleaning",
      "category": "Cleaning",
      "price": 50
    }
  ]
}
```

---

## 5. Update a Service
**Endpoint:**
```
PUT /api/services/id?id=<service_id>
```

**Request Body:**
```json
{
  "title": "Office Cleaning",
  "price": 60
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully"
}
```

---

## 6. Delete a Service
**Endpoint:**
```
DELETE /api/services/id?id=<service_id>
```

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## 7. Get Service Count
**Endpoint:**
```
GET /api/services/count
```

**Response:**
```json
{
  "success": true,
  "count": 120
}
```

---

## 8. Get Service Statistics
**Endpoint:**
```
GET /api/services/stats
```

**Response:**
```json
{
  "success": true,
  "totalServices": 500,
  "availableServices": 450,
  "unavailableServices": 50
}
```

---

## 9. Get Top Services
**Endpoint:**
```
GET /api/services/top
```

**Response:**
```json
{
  "success": true,
  "topServices": [
    { "title": "Plumbing", "requests": 300 },
    { "title": "Electrical Repairs", "requests": 250 }
  ]
}
