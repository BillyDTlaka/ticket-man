# Ticket Man API - Setup & Installation Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git (optional)

## Installation Steps

### 1. Install Node Dependencies

```bash
cd /sessions/friendly-quirky-ritchie/mnt/ticket-man/api
npm install
```

This installs all required packages from `package.json`:
- Fastify and plugins
- Prisma ORM
- TypeScript
- Dependencies for authentication, validation, etc.

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres@localhost:5432/ticket_man_db"

# JWT Secret for authentication (use a strong random string in production)
JWT_SECRET="your-super-secret-key-at-least-32-chars-long"

# Server Configuration
PORT=4000
NODE_ENV=development
```

**Important**: 
- For production, use a strong random JWT_SECRET (minimum 32 characters)
- PostgreSQL must be running and accessible
- Database specified in DATABASE_URL must exist

### 3. Create PostgreSQL Database

If using PostgreSQL locally:

```bash
# Using psql
createdb ticket_man_db

# Or connect to PostgreSQL and run:
# CREATE DATABASE ticket_man_db;
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma client based on your schema.

### 5. Run Database Migrations

```bash
npm run db:migrate
```

This creates all tables in the database according to `src/prisma/schema.prisma`.

You'll be prompted to create a migration name. For first setup, you can use "init":

```
Enter a name for the new migration: init
```

### 6. Seed Initial Data (Optional but Recommended)

```bash
npm run db:seed
```

This creates:
- Head Office branch
- 3 service categories (Enquiries, Accounts, Collections)
- 3 service counters
- 1 display screen
- 4 test users with different roles

**Test Credentials**:
```
Admin:       admin@ticketman.com / Admin@12345
Supervisor:  supervisor@ticketman.com / Super@12345
Agent:       agent1@ticketman.com / Agent@12345
Reception:   reception@ticketman.com / Recep@12345
```

### 7. Start Development Server

```bash
npm run dev
```

You should see:
```
🎫 Ticket Man API running on port 4000
```

### 8. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## Database Management

### Prisma Studio (Visual Database Browser)

```bash
npm run db:studio
```

Opens a web UI at `http://localhost:5555` to view and edit database records.

### View Database Schema

```bash
# Check current schema
cat src/prisma/schema.prisma

# See database structure
npm run db:studio
```

### Reset Database (Development Only)

```bash
# ⚠️ WARNING: This deletes all data!
npm run db:migrate reset
```

Then run seed again:

```bash
npm run db:seed
```

## TypeScript Build & Production

### Build TypeScript to JavaScript

```bash
npm run build
```

Creates compiled JavaScript in the `dist/` folder.

### Run Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### "Cannot find module '@prisma/client'"

Solution:
```bash
npm run db:generate
npm install
```

### "Connection refused" or "ECONNREFUSED"

PostgreSQL is not running or DATABASE_URL is wrong.

Check:
```bash
# Verify PostgreSQL is running
psql -U postgres -d postgres -c "SELECT 1"

# Verify database exists
psql -U postgres -l | grep ticket_man

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

### "Database does not exist"

Create the database:
```bash
createdb ticket_man_db
```

Then run:
```bash
npm run db:migrate
```

### "Error: P1000 Authentication failed"

Check DATABASE_URL credentials:
```bash
# Test connection manually
psql postgresql://user:password@localhost:5432/ticket_man_db
```

### Port 4000 Already in Use

Change the PORT in `.env`:
```env
PORT=4001
```

Or kill the process using port 4000:
```bash
# macOS/Linux
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### "Unexpected token" or TypeScript errors

Ensure TypeScript and tsx are installed:
```bash
npm install --save-dev typescript tsx
```

## Development Workflow

### 1. Start with Code Changes

Edit files in `src/` directory.

### 2. Database Schema Changes

Edit `src/prisma/schema.prisma`, then:

```bash
npm run db:migrate
```

Name the migration descriptively (e.g., "add_user_phone").

### 3. Automatic Hot Reload

With `npm run dev`, the server automatically restarts on file changes.

### 4. Test Your Changes

- Use `curl`, Postman, or Insomnia
- Check logs in the terminal
- Test in Prisma Studio: `npm run db:studio`

## Project Structure Quick Reference

```
/sessions/friendly-quirky-ritchie/mnt/ticket-man/api/
├── .env                    # Environment variables (not in git)
├── .env.example            # Template for .env
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
│
├── src/
│   ├── server.ts           # Entry point
│   ├── app.ts              # Fastify app setup
│   ├── config/             # Configuration
│   ├── prisma/             # Database schema & seed
│   ├── shared/             # Shared code (errors, middleware, plugins)
│   └── modules/            # Feature modules (auth, tickets, etc)
│
├── dist/                   # Compiled JS (generated by build)
├── node_modules/           # Installed packages
│
├── README.md               # Main documentation
├── API_EXAMPLES.md         # API request examples
└── SETUP.md                # This file
```

## Next Steps

1. **Explore the API**: Use `API_EXAMPLES.md` to test endpoints
2. **Read the README**: Understand features and architecture
3. **Start Development**: Modify code, run migrations, test changes
4. **Integrate Frontend**: Connect a web/mobile UI to the API
5. **Deploy**: Follow production setup in README

## Getting Help

- Check `README.md` for feature overview
- See `API_EXAMPLES.md` for endpoint examples
- Review Prisma docs: https://www.prisma.io/docs/
- Check Fastify docs: https://www.fastify.io/

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm start                # Run production build

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed with test data
npm run db:studio        # Open Prisma Studio GUI
npm run db:migrate reset # Reset database (dev only)

# Utilities
npm install              # Install dependencies
npm list                 # Show installed packages
npm outdated             # Check for updates
```
