# Ticket Man - Queue Ticketing & Service Management System

Complete queue management system with separate API (Node.js/Express) and Web (Next.js 14) applications.

## Project Structure

```
ticket-man/
├── api/                    # NestJS API server (port 4000)
├── web/                    # Next.js 14 Web App (port 3001)
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

---

## API Setup

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Environment Configuration
```bash
cp api/.env.example api/.env
```

Edit `api/.env` and set:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ticket_man_db
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=4000
```

### 3. Create Database
```bash
psql -U postgres -d postgres -c "CREATE DATABASE ticket_man_db;"
```

### 4. Run Migrations
```bash
cd api
npm run db:migrate
```

### 5. Seed Demo Data
```bash
cd api
npm run db:seed
```

This creates demo accounts:
- **Admin**: admin@ticketman.com / Admin@12345
- **Agent**: agent1@ticketman.com / Agent@12345
- **Reception**: reception@ticketman.com / Recep@12345

### 6. Start API Server
```bash
cd api
npm run dev
```

API will be available at: **http://localhost:4000**

---

## Web App Setup

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Web app will be available at: **http://localhost:3001**

---

## Usage

### Access the Application
1. Open **http://localhost:3001** in your browser
2. Login with one of the demo accounts
3. Navigate based on your role

### User Roles

#### Admin
- Manage branches
- Manage service categories
- Manage counters
- Manage users
- View all reports

#### Supervisor
- View live queue dashboard
- Monitor counter activity
- Generate reports
- View detailed analytics

#### Agent
- Open counter sessions
- Call tickets from queue
- Mark tickets as served/no-show
- Transfer tickets to other services

#### Reception
- Issue new tickets
- Select branch and service
- Print tickets

### Public Display Screen

Display the queue on a public screen:
```
http://localhost:3001/display/{branchId}
```

Replace `{branchId}` with an actual branch ID. The display screen:
- Shows currently serving ticket (large)
- Shows recently called tickets (side panel)
- Updates in real-time via Server-Sent Events (SSE)
- Shows all information for waiting customers

---

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Branches
- `GET /branches` - List all branches
- `POST /branches` - Create branch
- `PUT /branches/:id` - Update branch
- `DELETE /branches/:id` - Delete branch

### Services
- `GET /services` - List services
- `POST /services` - Create service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Counters
- `GET /counters` - List counters
- `POST /counters` - Create counter
- `POST /counters/session/open` - Open counter session
- `POST /counters/session/close` - Close counter session
- `GET /counters/session/active` - Get active session

### Tickets
- `POST /tickets/issue` - Issue new ticket
- `POST /tickets/call-next` - Call next ticket
- `POST /tickets/:id/start` - Start serving ticket
- `POST /tickets/:id/end` - End serving ticket
- `POST /tickets/:id/no-show` - Mark as no-show
- `GET /tickets/queue-snapshot` - Get queue status
- `GET /tickets/recently-called` - Get recently called tickets

### Reports
- `GET /reports/summary` - Get summary report
- `GET /reports/export` - Export to CSV

### Display
- `GET /display/:branchId` - Get display data
- `GET /display/sse/:branchId` - Server-Sent Events stream

---

## Key Features

### Ticket Management
- Automatic ticket number generation with service-specific prefixes
- Real-time queue status
- Ticket lifecycle tracking (created, called, in service, served)
- No-show tracking
- Ticket transfers between services

### Counter Management
- Session-based counter operation
- Multi-service support per counter
- Real-time agent status

### Live Dashboard
- Real-time queue visualization
- Counter activity monitoring
- Service-wise queue breakdown
- Peak hours analytics

### Reports
- Daily/weekly/monthly analytics
- Service-wise performance metrics
- Average service/wait times
- No-show rates
- CSV export capability

### Public Display
- Real-time ticket updates via SSE
- Large, clear ticket number display
- Service name and counter information
- Professional appearance

---

## Development

### Project Tech Stack

#### API
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Class Validator
- Swagger Documentation

#### Web
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)
- Recharts (Data Visualization)

### Environment Variables

#### API (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ticket_man_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://localhost:3001
```

#### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Troubleshooting

### API won't start
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run migrations: `npm run db:migrate`

### Web app can't connect to API
- Check NEXT_PUBLIC_API_URL in web/.env.local
- Ensure API is running on correct port
- Check browser console for CORS errors

### Database errors
- Drop and recreate: `psql -U postgres -d postgres -c "DROP DATABASE ticket_man_db; CREATE DATABASE ticket_man_db;"`
- Re-run migrations: `npm run db:migrate`
- Re-seed data: `npm run db:seed`

---

## License

MIT

---

## Support

For issues and questions, please refer to the API and Web documentation files.
