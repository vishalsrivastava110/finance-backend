# finance-backend

## Setup Instructions
1. Install Node.js
2. Open Command Prompt in project folder
3. Run: npm install express
4. Run: node index.js

Server runs on:
http://localhost:3000

---

## Storage Approach
This application uses in-memory storage (JavaScript array) to store financial records.

- No database is used
- Data is stored temporarily in server memory
- Data will be lost when the server restarts

This approach is used to keep the implementation simple and focus on backend logic.

---

## Authentication
All APIs require header:

Authorization: role:password

Examples:
- admin:admin123
- user:user123

---

## API Endpoints

### Create Record
POST /records

Body:
{
  "name": "salary",
  "amount": 5000,
  "category": "job",
  "type": "income"
}

---

### Get All Records (with pagination & filter)
GET /records?page=1&type=income&category=job

---

### Get Single Record
GET /records/:id

---

### Update Record (Admin only)
PUT /records/:id

---

### Delete Record (Admin only - soft delete)
DELETE /records/:id

---

### Dashboard Summary
GET /dashboard

Returns:
- totalIncome
- totalExpense
- balance

---

## Features Implemented

- CRUD operations for financial records
- Role-based access control (Admin/User)
- Token-based authentication
- Record filtering (type, category)
- Pagination
- Soft delete functionality
- Dashboard summary (income, expense, balance)
- Input validation and error handling
- In-memory data storage

---

## Error Handling

- 400 → Bad request (missing fields)
- 401 → Unauthorized (no token)
- 403 → Forbidden (invalid role)
- 404 → Record not found
