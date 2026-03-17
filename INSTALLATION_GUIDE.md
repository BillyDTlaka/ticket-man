# Ticket Man - Installation & Quick Start Guide

## Prerequisites

- **Node.js**: v18+ (Download from https://nodejs.org)
- **PostgreSQL**: v13+ (Download from https://www.postgresql.org/download)
- **Git**: (Optional, for version control)

## Project Directory

All files are located at: `/sessions/friendly-quirky-ritchie/mnt/ticket-man/`

```
ticket-man/
├── web/                    # Next.js 14 Frontend (THIS PROJECT)
├── api/                    # NestJS Backend (should be created separately)
├── README.md              # Main setup guide
└── INSTALLATION_GUIDE.md  # This file
```

---

## Web Application Setup (Next.js 14)

### Step 1: Navigate to Web Directory
```bash
cd /sessions/friendly-quirky-ritchie/mnt/ticket-man/web
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14.2.5
- React 18.3.1
- TypeScript 5
- Tailwind CSS
- Axios for API calls
- Zustand for state management
- Recharts for charts
- And other utilities

**Installation time**: ~2-3 minutes

### Step 3: Verify Environment Configuration
Check `.env.local` file exists with:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

If missing, create it:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
```

### Step 4: Start Development Server
```bash
npm run dev
```

Output should show:
```
> ticket-man-web@1.0.0 dev
> next dev -p 3001

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3001
  - Environments: .env.local

✓ Ready in 2.3s
```

### Step 5: Access the Application
Open your browser and navigate to:
```
http://localhost:3001
```

You should see the **Ticket Man** login page.

---

## Login & First Steps

### Demo Credentials

Use any of these accounts to test:

1. **Admin Account** (Full access)
   - Email: `admin@ticketman.com`
   - Password: `Admin@12345`
   - Access: All admin features + dashboards

2. **Supervisor Account** (Monitoring)
   - Email: `supervisor@ticketman.com`
   - Password: `Super@12345`
   - Access: Dashboard, Reports, Counter monitoring

3. **Agent Account** (Counter operations)
   - Email: `agent1@ticketman.com`
   - Password: `Agent@12345`
   - Access: Counter view, ticket management

4. **Reception Account** (Ticket issuing)
   - Email: `reception@ticketman.com`
   - Password: `Recep@12345`
   - Access: Ticket issuance only

### First Login Steps
1. Visit http://localhost:3001
2. Enter email and password from above
3. Click "Sign In"
4. You'll be redirected to your role's default page

---

## Available URLs

Once the app is running:

### Main Pages
- **Login**: http://localhost:3001/login
- **Counter (Agent)**: http://localhost:3001/counter
- **Reception**: http://localhost:3001/reception
- **Dashboard (Supervisor)**: http://localhost:3001/supervisor
- **Reports**: http://localhost:3001/reports

### Admin Pages (Admin only)
- **Branches**: http://localhost:3001/admin/branches
- **Services**: http://localhost:3001/admin/services
- **Counters**: http://localhost:3001/admin/counters
- **Users**: http://localhost:3001/admin/users

### Public Display Screen
- **Display**: http://localhost:3001/display/{branchId}
  - Replace `{branchId}` with actual branch ID from database

---

## Project Structure

### Root Configuration Files
```
web/
├── package.json           # Dependencies & npm scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS theme
├── postcss.config.js      # PostCSS for CSS processing
└── .env.local             # Environment variables
```

### Source Code (`src/`)
```
src/
├── app/                   # Next.js 14 App Router
│   ├── (app)/            # Protected routes (with sidebar)
│   ├── login/            # Public login page
│   ├── display/          # Public display screens
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Redirect to login
│   └── globals.css       # Global styles
│
├── lib/                  # Utilities
│   ├── api.ts           # API client with Axios
│   └── auth.ts          # Authentication helpers
│
├── store/               # State management
│   └── auth.store.ts    # Zustand auth store
│
└── types/               # TypeScript definitions
    └── index.ts         # All type definitions
```

---

## Development Workflow

### Making Changes
1. Edit files in `src/` directory
2. Next.js will hot-reload automatically
3. Check browser for changes
4. Check terminal for TypeScript errors

### Example: Adding a New Page
```typescript
// src/app/(app)/mypage/page.tsx
'use client'
import { useAuthStore } from '@/store/auth.store'

export default function MyPage() {
  const { user } = useAuthStore()
  return <div>Hello, {user?.firstName}!</div>
}
```

Access at: http://localhost:3001/mypage

---

## Building for Production

### Create Production Build
```bash
npm run build
```

Output:
```
Compiled successfully

Creating optimized production build...
Analyzing bundles...
Route (App Router)    ...
Page                  ...

Creating an optimized production build took 45.2s
```

### Start Production Server
```bash
npm run start
```

The app will run on the same port (3001) in production mode.

---

## Troubleshooting

### Issue: "Cannot find module '@/types'"
**Solution**: Check tsconfig.json paths configuration. Should have:
```json
"paths": { "@/*": ["./src/*"] }
```

### Issue: API endpoints return 401
**Ensure**:
- API server is running on http://localhost:4000
- `.env.local` has correct `NEXT_PUBLIC_API_URL`
- You're logged in with valid credentials

### Issue: Port 3001 already in use
**Solution**: Kill the process or use different port:
```bash
npm run dev -- -p 3002
```

### Issue: "NEXT_PUBLIC_API_URL is not defined"
**Solution**: Create/update `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
```

### Issue: TypeScript errors in editor
**Solution**: Restart TypeScript server in your editor or run:
```bash
npm run build
```

---

## Key Features by Role

### Admin
- Create/edit/delete branches
- Create/edit/delete service categories
- Create/edit/delete counters
- Create/edit/delete users
- View all reports
- Manage entire system

### Supervisor
- View live queue dashboard
- Monitor counter activity
- Generate detailed reports
- Export data to CSV
- View peak hour analytics

### Agent
- Open/close counter sessions
- Select service queue
- Call next customer
- Start/end service
- Mark no-shows
- See queue status

### Reception
- Issue new tickets
- Select branch and service
- Print tickets
- See issued ticket preview

---

## API Connection

The app communicates with API running on:
- **Base URL**: http://localhost:4000
- **Port**: 4000
- **Protocol**: HTTP (REST)

### Auto-retry & Error Handling
- Automatic login redirect on 401 errors
- Token included in all requests
- Error messages displayed to user
- Network error handling

---

## Performance Tips

### Development
- Hot reload enabled by default
- Fast refresh for React components
- TypeScript compilation on save

### Production
- Minified bundle
- CSS optimization
- Image optimization
- Code splitting per route

---

## Next Steps

1. **Setup API Server**
   - Create/setup the API at `/sessions/friendly-quirky-ritchie/mnt/ticket-man/api`
   - Ensure it runs on port 4000

2. **Database Setup**
   - Create PostgreSQL database
   - Run migrations
   - Seed demo data

3. **Test Features**
   - Login with different roles
   - Issue tickets from reception
   - Call tickets from counter
   - View dashboard on supervisor

4. **Customize**
   - Change colors in `tailwind.config.ts`
   - Add your company logo
   - Modify themes
   - Add additional features

---

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | All API endpoints defined here |
| `src/store/auth.store.ts` | Global auth state |
| `src/types/index.ts` | All TypeScript types |
| `tailwind.config.ts` | Colors & theme |
| `.env.local` | Environment variables |

---

## Useful npm Commands

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm install       # Install dependencies
npm list          # List all dependencies
npm update        # Update all packages
```

---

## Getting Help

### Check Logs
- **Terminal**: Watch for errors in development terminal
- **Browser Console**: Open DevTools (F12) → Console tab
- **Network**: DevTools → Network tab to see API calls

### Read Documentation
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Axios: https://axios-http.com

---

## System Requirements Check

```bash
# Check Node.js version
node --version      # Should be v18+

# Check npm version
npm --version       # Should be v9+

# Check if PostgreSQL is running (if applicable)
psql --version      # Should be v13+
```

---

## Quick Reference

### URLs
- **App**: http://localhost:3001
- **API**: http://localhost:4000
- **Docs**: This file (INSTALLATION_GUIDE.md)

### Default Credentials
- **Admin**: admin@ticketman.com / Admin@12345
- **Agent**: agent1@ticketman.com / Agent@12345

### Key Directories
- **Source Code**: `src/`
- **Pages**: `src/app/`
- **API Clients**: `src/lib/api.ts`
- **State**: `src/store/`
- **Types**: `src/types/`

---

## Success Indicators

You've successfully installed the app when:
1. ✓ `npm install` completes without errors
2. ✓ `npm run dev` starts the server
3. ✓ Browser shows login page at http://localhost:3001
4. ✓ Can login with demo credentials
5. ✓ Dashboard loads without errors

---

**Installation Complete!** You're ready to use Ticket Man.

Last Updated: February 28, 2026
Version: 1.0.0
