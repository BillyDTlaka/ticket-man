# Ticket Man API - Request Examples

## Authentication

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ticketman.com",
    "password": "Admin@12345"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "admin@ticketman.com",
    "firstName": "System",
    "lastName": "Admin",
    "role": "ADMIN",
    "branch": { ... }
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Branches

### List All Branches
```bash
curl -X GET http://localhost:4000/branches \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Branch Details
```bash
curl -X GET http://localhost:4000/branches/branch-id \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Branch (Admin Only)
```bash
curl -X POST http://localhost:4000/branches \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Branch",
    "code": "DT01",
    "address": "456 Oak Street, Downtown"
  }'
```

### Update Branch (Admin Only)
```bash
curl -X PUT http://localhost:4000/branches/branch-id \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Branch Name",
    "address": "789 Elm Street",
    "isActive": true
  }'
```

### Delete Branch (Admin Only)
```bash
curl -X DELETE http://localhost:4000/branches/branch-id \
  -H "Authorization: Bearer <TOKEN>"
```

## Services

### List Services
```bash
# All services
curl -X GET http://localhost:4000/services \
  -H "Authorization: Bearer <TOKEN>"

# Services for specific branch
curl -X GET "http://localhost:4000/services?branchId=branch-id" \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Service (Admin Only)
```bash
curl -X POST http://localhost:4000/services \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": "branch-id",
    "name": "Premium Services",
    "code": "PREM",
    "prefix": "P",
    "description": "Premium customer services"
  }'
```

### Update Service (Admin Only)
```bash
curl -X PUT http://localhost:4000/services/service-id \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Services",
    "isActive": true
  }'
```

### Delete Service (Admin Only)
```bash
curl -X DELETE http://localhost:4000/services/service-id \
  -H "Authorization: Bearer <TOKEN>"
```

## Counters

### List Counters
```bash
# All counters
curl -X GET http://localhost:4000/counters \
  -H "Authorization: Bearer <TOKEN>"

# Counters for specific branch
curl -X GET "http://localhost:4000/counters?branchId=branch-id" \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Counter (Admin Only)
```bash
curl -X POST http://localhost:4000/counters \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": "branch-id",
    "name": "Counter 4",
    "code": "C4"
  }'
```

### Assign Service to Counter (Admin Only)
```bash
curl -X POST http://localhost:4000/counters/counter-id/services \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceCategoryId": "service-id"
  }'
```

### Remove Service from Counter (Admin Only)
```bash
curl -X DELETE http://localhost:4000/counters/counter-id/services/service-id \
  -H "Authorization: Bearer <TOKEN>"
```

### Open Agent Session
```bash
curl -X POST http://localhost:4000/counters/session/open \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "counterId": "counter-id"
  }'
```

### Close Agent Session
```bash
curl -X POST http://localhost:4000/counters/session/close \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Active Session
```bash
curl -X GET http://localhost:4000/counters/session/active \
  -H "Authorization: Bearer <TOKEN>"
```

## Users

### List Users (Admin/Supervisor Only)
```bash
# All users
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer <TOKEN>"

# Users for specific branch
curl -X GET "http://localhost:4000/users?branchId=branch-id" \
  -H "Authorization: Bearer <TOKEN>"
```

### Create User (Admin Only)
```bash
curl -X POST http://localhost:4000/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newagent@ticketman.com",
    "password": "SecurePass@123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "AGENT",
    "branchId": "branch-id"
  }'
```

### Update User (Admin Only)
```bash
curl -X PUT http://localhost:4000/users/user-id \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "role": "SUPERVISOR",
    "isActive": true
  }'
```

### Reset User Password (Admin Only)
```bash
curl -X POST http://localhost:4000/users/user-id/reset-password \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewPassword@123"
  }'
```

### Delete User (Admin Only)
```bash
curl -X DELETE http://localhost:4000/users/user-id \
  -H "Authorization: Bearer <TOKEN>"
```

## Tickets

### Issue New Ticket
```bash
curl -X POST http://localhost:4000/tickets/issue \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": "branch-id",
    "serviceCategoryId": "service-id"
  }'
```

Response:
```json
{
  "id": "ticket-id",
  "ticketNumber": "A001",
  "branchId": "branch-id",
  "serviceCategoryId": "service-id",
  "status": "CREATED",
  "issuedAt": "2026-02-28T10:30:00Z",
  "serviceCategory": { "name": "Enquiries", "prefix": "A" },
  "branch": { ... }
}
```

### List Tickets
```bash
# All tickets
curl -X GET http://localhost:4000/tickets \
  -H "Authorization: Bearer <TOKEN>"

# With filters
curl -X GET "http://localhost:4000/tickets?branchId=branch-id&status=CREATED&date=2026-02-28" \
  -H "Authorization: Bearer <TOKEN>"
```

### Call Next Ticket
```bash
curl -X POST http://localhost:4000/tickets/call-next \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "counterId": "counter-id",
    "serviceCategoryId": "service-id"
  }'
```

### Recall Ticket
```bash
curl -X POST http://localhost:4000/tickets/ticket-id/recall \
  -H "Authorization: Bearer <TOKEN>"
```

### Start Service
```bash
curl -X POST http://localhost:4000/tickets/ticket-id/start \
  -H "Authorization: Bearer <TOKEN>"
```

### End Service (Mark Served)
```bash
curl -X POST http://localhost:4000/tickets/ticket-id/end \
  -H "Authorization: Bearer <TOKEN>"
```

### Mark No-Show
```bash
curl -X POST http://localhost:4000/tickets/ticket-id/no-show \
  -H "Authorization: Bearer <TOKEN>"
```

### Transfer to Different Service
```bash
curl -X POST http://localhost:4000/tickets/ticket-id/transfer \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceCategoryId": "new-service-id"
  }'
```

### Get Queue Snapshot
```bash
curl -X GET "http://localhost:4000/tickets/queue-snapshot?branchId=branch-id" \
  -H "Authorization: Bearer <TOKEN>"
```

Response:
```json
[
  {
    "service": { "id": "...", "name": "Enquiries", "prefix": "A" },
    "waiting": 5,
    "serving": [
      { "id": "...", "ticketNumber": "A001", "counter": { "name": "Counter 1" } }
    ]
  },
  ...
]
```

### Get Recently Called Tickets
```bash
curl -X GET "http://localhost:4000/tickets/recently-called?branchId=branch-id&limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

## Display Screens

### Get Display Data
```bash
curl -X GET http://localhost:4000/display/branch-id \
  -H "Authorization: Bearer <TOKEN>"
```

Response:
```json
{
  "recentlyCalled": [
    {
      "id": "ticket-id",
      "ticketNumber": "A001",
      "status": "IN_SERVICE",
      "serviceCategory": { "name": "Enquiries" },
      "counter": { "name": "Counter 1" },
      "calledAt": "2026-02-28T10:35:00Z"
    }
  ],
  "snapshot": [ ... ],
  "screen": {
    "id": "screen-id",
    "title": "Head Office Queue",
    "showCalledCount": 8,
    "primaryColor": "#1e40af"
  }
}
```

### Subscribe to Live Updates (Server-Sent Events)
```javascript
const eventSource = new EventSource(`/display/sse/branch-id?token=<TOKEN>`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'SNAPSHOT') {
    // Initial snapshot of recently called tickets
    console.log('Initial tickets:', data.tickets);
  } else if (data.type === 'TICKET_CALLED') {
    // New ticket called
    console.log('Ticket called:', data.ticket);
  } else if (data.type === 'TICKET_SERVED') {
    // Ticket service completed
    console.log('Ticket served:', data.ticket);
  }
};

eventSource.onerror = () => {
  console.error('Connection error');
  eventSource.close();
};
```

## Reports

### Get Summary Report
```bash
curl -X GET "http://localhost:4000/reports/summary?branchId=branch-id&from=2026-02-01&to=2026-02-28" \
  -H "Authorization: Bearer <TOKEN>"
```

Response:
```json
{
  "total": 150,
  "served": 145,
  "noShow": 5,
  "avgWaitMinutes": 8.5,
  "avgServiceMinutes": 12.3,
  "serviceStats": [
    {
      "service": "Enquiries",
      "total": 50,
      "served": 48,
      "avgServiceMinutes": 10.5
    }
  ],
  "peakHours": {
    "9": 12,
    "10": 18,
    "11": 22,
    ...
  }
}
```

### Export CSV Report
```bash
curl -X GET "http://localhost:4000/reports/export?branchId=branch-id&from=2026-02-01&to=2026-02-28" \
  -H "Authorization: Bearer <TOKEN>" \
  -o report.csv
```

## Health Check

### Check API Status
```bash
curl -X GET http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## Common Errors

### Unauthorized (Missing/Invalid Token)
```json
{
  "error": "UNAUTHORIZED",
  "message": "Unauthorized"
}
```

### Forbidden (Insufficient Permissions)
```json
{
  "error": "FORBIDDEN",
  "message": "You do not have permission to perform this action"
}
```

### Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Ticket not found"
}
```

### Validation Error
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "issues": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

### Queue Empty
```json
{
  "error": "QUEUE_EMPTY",
  "message": "No tickets waiting in this queue"
}
```

## Tips for Testing

1. **Get a Token First**: Login and use the token in Authorization header
2. **Use Postman/Insomnia**: Import curl examples into these tools
3. **Check Logs**: Run with `npm run dev` to see server logs
4. **Test with Real IDs**: Replace `branch-id`, `service-id`, etc. with actual IDs
5. **Use Filters**: Test list endpoints with query parameters
