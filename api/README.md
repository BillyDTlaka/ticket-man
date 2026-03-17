# Ticket Man API - Queue Ticketing & Service Management System

A complete production-ready Queue Ticketing & Service Management API built with Fastify, TypeScript, Prisma, and PostgreSQL.

## Features

- Queue ticket management with real-time status tracking
- Multi-branch support with branch-specific operations
- Role-based access control (Admin, Supervisor, Agent, Reception)
- Agent session management with counter assignments
- Service category management with queue prefixes
- Real-time display screens with Server-Sent Events (SSE)
- Comprehensive reporting and analytics
- CSV export capabilities
- Ticket transfer between service queues
- No-show and recall tracking
- Waiting time and service time metrics

## Tech Stack

- **Framework**: Fastify 4.28.1
- **Language**: TypeScript 5.5.3
- **Database**: PostgreSQL with Prisma ORM 5.14.0
- **Authentication**: JWT via @fastify/jwt
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **CORS**: @fastify/cors
- **Dev Tools**: tsx, pino-pretty

## Project Structure

```
api/
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
└── src/
    ├── server.ts          # Server entry point
    ├── app.ts             # Fastify app setup & routes
    ├── config/
    │   └── index.ts       # Configuration management
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   └── seed.ts        # Database seeding script
    ├── shared/
    │   ├── errors.ts      # Custom error classes
    │   ├── plugins/
    │   │   ├── prisma.ts  # Prisma plugin
    │   │   └── websocket.ts
    │   └── middleware/
    │       ├── authenticate.ts  # JWT verification
    │       └── authorize.ts     # Role-based access
    └── modules/
        ├── auth/          # Authentication (login, me)
        ├── branches/      # Branch management
        ├── services/      # Service category management
        ├── counters/      # Counter & agent session management
        ├── users/         # User management
        ├── tickets/       # Ticket lifecycle (issue, call, serve)
        ├── display/       # Display screens & SSE
        └── reports/       # Reports & analytics
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://postgres@localhost:5432/ticket_man_db"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=4000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run production build
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio GUI

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (requires JWT)

### Branches
- `GET /branches` - List all branches
- `GET /branches/:id` - Get branch details
- `POST /branches` - Create branch (admin only)
- `PUT /branches/:id` - Update branch (admin only)
- `DELETE /branches/:id` - Delete branch (admin only)

### Services
- `GET /services` - List services (optional: ?branchId=)
- `POST /services` - Create service (admin only)
- `PUT /services/:id` - Update service (admin only)
- `DELETE /services/:id` - Delete service (admin only)

### Counters
- `GET /counters` - List counters (optional: ?branchId=)
- `POST /counters` - Create counter (admin only)
- `PUT /counters/:id` - Update counter (admin only)
- `DELETE /counters/:id` - Delete counter (admin only)
- `POST /counters/:id/services` - Assign service to counter (admin only)
- `DELETE /counters/:id/services/:serviceId` - Remove service (admin only)
- `POST /counters/session/open` - Open agent session
- `POST /counters/session/close` - Close agent session
- `GET /counters/session/active` - Get active session

### Users
- `GET /users` - List users (admin/supervisor only, optional: ?branchId=)
- `POST /users` - Create user (admin only)
- `PUT /users/:id` - Update user (admin only)
- `POST /users/:id/reset-password` - Reset password (admin only)
- `DELETE /users/:id` - Delete user (admin only)

### Tickets
- `GET /tickets` - List tickets (filters: ?branchId=, ?serviceCategoryId=, ?status=, ?date=)
- `POST /tickets/issue` - Issue new ticket
- `POST /tickets/call-next` - Call next ticket in queue
- `POST /tickets/:id/recall` - Recall ticket
- `POST /tickets/:id/start` - Start serving ticket
- `POST /tickets/:id/end` - End service & mark served
- `POST /tickets/:id/no-show` - Mark as no-show
- `POST /tickets/:id/transfer` - Transfer to different service
- `GET /tickets/queue-snapshot` - Get queue status snapshot
- `GET /tickets/recently-called` - Get recently called tickets

### Display & Reporting
- `GET /display/:branchId` - Get display data for branch
- `GET /display/sse/:branchId` - SSE stream for live updates
- `GET /reports/summary` - Get summary report (?branchId=, ?from=, ?to=)
- `GET /reports/export` - Export CSV report (?branchId=, ?from=, ?to=)

### Health
- `GET /health` - Health check endpoint

## Database Schema Overview

### Models

**Users & Authentication**
- `User` - System users with roles (ADMIN, SUPERVISOR, AGENT, RECEPTION)
- `AgentSession` - Track when agents log into counters

**Organizations**
- `Branch` - Multiple service locations
- `ServiceCategory` - Different service types (Enquiries, Accounts, etc.)
- `Counter` - Physical service counters
- `CounterService` - Maps counters to services

**Ticket Management**
- `Ticket` - Queue ticket lifecycle
- `TicketStatusLog` - Audit trail of status changes

**Display**
- `DisplayScreen` - Configuration for physical displays

## User Roles & Permissions

### ADMIN
- Full system access
- Create/manage branches, users, services, counters
- Create/reset passwords
- View all reports

### SUPERVISOR
- Manage agents and counters at their branch
- View reports
- Monitor queue status

### AGENT
- Open/close counter sessions
- Call next ticket
- Process tickets (start, end, no-show, recall, transfer)

### RECEPTION
- Issue new tickets
- View queue status

## Ticket Status Flow

```
CREATED → CALLED → IN_SERVICE → SERVED
         ↘ NO_SHOW
         ↘ CANCELLED
         ↘ TRANSFERRED
```

- `CREATED` - Ticket issued, waiting in queue
- `CALLED` - Agent called the ticket
- `IN_SERVICE` - Service has started
- `SERVED` - Service completed
- `NO_SHOW` - Customer didn't respond to call
- `CANCELLED` - Customer cancelled
- `TRANSFERRED` - Transferred to different queue

## Example Workflows

### Issue a Ticket

```bash
POST /tickets/issue
{
  "branchId": "branch-id",
  "serviceCategoryId": "service-id"
}
```

### Call Next Ticket

```bash
POST /tickets/call-next
{
  "counterId": "counter-id",
  "serviceCategoryId": "service-id"
}
```

### Complete Service

```bash
POST /tickets/:ticketId/start
POST /tickets/:ticketId/end
```

### Transfer to Different Queue

```bash
POST /tickets/:ticketId/transfer
{
  "serviceCategoryId": "new-service-id"
}
```

## Seed Data

The `npm run db:seed` command creates:

**Branch**
- Head Office (HQ)

**Services**
- Enquiries (ENQ, prefix: A)
- Accounts (ACC, prefix: B)
- Collections (COL, prefix: C)

**Counters**
- Counter 1, 2, 3 (all serve all services)

**Users**
- admin@ticketman.com / Admin@12345 (ADMIN)
- supervisor@ticketman.com / Super@12345 (SUPERVISOR)
- agent1@ticketman.com / Agent@12345 (AGENT)
- reception@ticketman.com / Recep@12345 (RECEPTION)

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

Common error codes:
- `UNAUTHORIZED` - Missing/invalid JWT
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INVALID_CREDENTIALS` - Login failed
- `QUEUE_EMPTY` - No tickets waiting
- `VALIDATION_ERROR` - Invalid request data
- `INTERNAL_SERVER_ERROR` - Server error

## Real-Time Updates (SSE)

Display screens can subscribe to live updates:

```javascript
const eventSource = new EventSource('/display/sse/branch-id');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.type: 'SNAPSHOT', 'TICKET_CALLED', 'TICKET_SERVED'
};
```

## Reports

Get daily statistics:

```bash
GET /reports/summary?branchId=id&from=2026-02-01&to=2026-02-28
```

Returns:
- Total tickets issued
- Tickets served / no-show
- Average wait time (minutes)
- Average service time (minutes)
- Stats by service category
- Peak hours

Export to CSV:

```bash
GET /reports/export?branchId=id&from=2026-02-01&to=2026-02-28
```

## Performance Considerations

- JWT tokens expire based on Fastify JWT configuration (configure in production)
- SSE heartbeat every 30 seconds to keep connections alive
- Ticket numbering uses daily counter (resets daily)
- Service category codes are unique per branch
- Counter codes are unique per branch

## Production Checklist

- Set strong `JWT_SECRET` in `.env`
- Configure `DATABASE_URL` with production database
- Set `NODE_ENV=production`
- Configure appropriate `PORT`
- Set up database backups
- Configure reverse proxy (nginx) for SSL
- Monitor logs with appropriate log levels
- Configure CORS for frontend domain
- Set up monitoring and alerting
- Test disaster recovery procedures

## License

Proprietary - All rights reserved
