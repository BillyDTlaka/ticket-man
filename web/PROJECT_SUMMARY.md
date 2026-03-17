# Ticket Man Web App - Complete Project Summary

## Project Overview
A modern, full-featured Queue Ticketing & Service Management Web Application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. The app connects to a REST API (running on localhost:4000) to manage queue operations, tickets, and service metrics.

---

## Complete File Structure

```
web/
├── package.json                                (Dependencies & scripts)
├── tsconfig.json                               (TypeScript configuration)
├── next.config.ts                              (Next.js configuration)
├── tailwind.config.ts                          (Tailwind CSS configuration)
├── postcss.config.js                           (PostCSS configuration)
├── .env.local                                  (Environment variables)
├── PROJECT_SUMMARY.md                          (This file)
│
└── src/
    ├── app/
    │   ├── globals.css                         (Global styles & Tailwind directives)
    │   ├── layout.tsx                          (Root layout)
    │   ├── page.tsx                            (Redirects to /login)
    │   │
    │   ├── login/
    │   │   └── page.tsx                        (Login page with auth form)
    │   │
    │   ├── display/
    │   │   └── [branchId]/
    │   │       └── page.tsx                    (Public display screen with SSE)
    │   │
    │   └── (app)/
    │       ├── layout.tsx                      (Protected app layout with sidebar)
    │       │
    │       ├── admin/
    │       │   ├── page.tsx                    (Redirects to /admin/branches)
    │       │   ├── branches/
    │       │   │   └── page.tsx                (Manage branches)
    │       │   ├── services/
    │       │   │   └── page.tsx                (Manage service categories)
    │       │   ├── counters/
    │       │   │   └── page.tsx                (Manage service counters)
    │       │   └── users/
    │       │       └── page.tsx                (Manage users & roles)
    │       │
    │       ├── reception/
    │       │   └── page.tsx                    (Issue new tickets)
    │       │
    │       ├── counter/
    │       │   └── page.tsx                    (Agent counter view - call tickets)
    │       │
    │       ├── supervisor/
    │       │   └── page.tsx                    (Live queue dashboard)
    │       │
    │       └── reports/
    │           └── page.tsx                    (Analytics & reports)
    │
    ├── lib/
    │   ├── api.ts                              (Axios instance with interceptors & API clients)
    │   └── auth.ts                             (Token management utilities)
    │
    ├── store/
    │   └── auth.store.ts                       (Zustand auth store)
    │
    └── types/
        └── index.ts                            (TypeScript type definitions)
```

---

## Core Components & Pages

### 1. Authentication (`login/page.tsx`)
- Email/password login form
- Error handling and loading states
- Demo account credentials display
- Redirects to appropriate dashboard after login

**Features:**
- Client-side form validation
- Error message display
- Loading spinner during submission
- Gradient background with card design

### 2. Protected Layout (`(app)/layout.tsx`)
- Role-based navigation sidebar
- User profile with logout
- Dynamic nav item visibility based on role
- Active route highlighting

**Navigation Items:**
- My Counter (AGENT, SUPERVISOR, ADMIN)
- Issue Ticket (RECEPTION, SUPERVISOR, ADMIN)
- Live Dashboard (SUPERVISOR, ADMIN)
- Reports (SUPERVISOR, ADMIN)
- Branches (ADMIN only)
- Services (ADMIN only)
- Counters (ADMIN only)
- Users (ADMIN only)

### 3. Reception (`reception/page.tsx`)
- Issue new tickets to customers
- Select branch and service category
- Display last issued ticket with large number
- Print ticket functionality
- Real-time queue feedback

**Features:**
- Branch selector dropdown
- Service category selector (filtered by branch)
- Issue & Print button
- Ticket preview with time
- Print-optimized styling

### 4. Counter Agent (`counter/page.tsx`)
- Open/close counter sessions
- Select service queue to serve
- Call next customer from queue
- Manage ticket states (start, serve, no-show)
- Real-time queue count
- Current serving ticket display

**States & Actions:**
- **CALLED**: Start Service, Recall, No-Show
- **IN_SERVICE**: End Service
- Large ticket number display
- Queue waiting count
- Service time tracking

### 5. Supervisor Dashboard (`supervisor/page.tsx`)
- Real-time queue overview
- Service-wise queue breakdown
- Counter activity status
- Active agents display
- Auto-refresh every 10 seconds

**Dashboard Cards:**
- Total waiting tickets
- In-service count
- Active counters
- Service queues with metrics
- Counter availability status

### 6. Reports & Analytics (`reports/page.tsx`)
- Date range filtering
- Service category performance
- Peak hours visualization
- Summary statistics
- CSV export functionality

**Metrics:**
- Total tickets
- Served count
- No-show rate
- Average wait/service time
- Service-wise breakdown
- Peak hours chart (Bar chart via Recharts)

### 7. Admin - Branches (`admin/branches/page.tsx`)
- CRUD operations for branches
- Create new branch
- Edit existing branch
- Delete branch
- List all branches with details
- Status indicator (Active/Inactive)

### 8. Admin - Services (`admin/services/page.tsx`)
- Create/edit service categories
- Set ticket prefix (A, B, C, etc.)
- Assign to branches
- View all services
- Delete services
- Display ticket format preview

### 9. Admin - Counters (`admin/counters/page.tsx`)
- Create new counters
- Assign to branches
- View counter status
- See active agents per counter
- Delete counters
- Grid-based display with live status

### 10. Admin - Users (`admin/users/page.tsx`)
- Create new users
- Assign roles (ADMIN, SUPERVISOR, AGENT, RECEPTION)
- Assign branches
- View all users
- Delete users
- Role color coding
- Status indicators

### 11. Public Display Screen (`display/[branchId]/page.tsx`)
- Real-time ticket display
- Server-Sent Events (SSE) connection
- Large current ticket number (10rem font)
- Recently called tickets sidebar (10 tickets)
- Flash animation when new ticket called
- Professional dark theme
- Shows service name and counter
- Date/time display

---

## Key Features & Functionality

### Authentication & Authorization
- JWT token-based authentication
- Token stored in localStorage
- Automatic token injection in API requests
- 401 error handling (redirects to login)
- Role-based access control
- Protected routes via layout wrapper

### Real-time Features
- SSE (Server-Sent Events) for display screen
- Auto-refresh supervisor dashboard (10s interval)
- Live queue status updates
- Real-time counter activity

### State Management
- Zustand for auth store
- Global user state
- Token management
- Login/logout flows

### API Integration
- Axios instance with interceptors
- Centralized API endpoints
- Error handling with automatic redirects
- Request/response interceptors
- Modular API clients (auth, branches, services, counters, users, tickets, reports)

### UI/UX
- Tailwind CSS for styling
- Responsive design (mobile to desktop)
- Color-coded status indicators
- Loading and error states
- Modal forms for CRUD operations
- Table displays with actions
- Card-based layouts
- Interactive buttons and forms
- Smooth transitions

### Data Visualization
- Recharts bar charts (Peak hours)
- Real-time metrics
- Summary statistics cards
- Queue breakdown visualization

---

## API Clients

### authApi
- `login(email, password)` - User login
- `me()` - Get current authenticated user

### branchesApi
- `getAll()` - Fetch all branches
- `getById(id)` - Get single branch
- `create(data)` - Create new branch
- `update(id, data)` - Update branch
- `delete(id)` - Delete branch

### servicesApi
- `getAll(branchId?)` - Get services (filtered by branch)
- `create(data)` - Create service
- `update(id, data)` - Update service
- `delete(id)` - Delete service

### countersApi
- `getAll(branchId?)` - Get counters
- `create(data)` - Create counter
- `update(id, data)` - Update counter
- `delete(id)` - Delete counter
- `openSession(counterId)` - Open counter session
- `closeSession()` - Close active session
- `getActiveSession()` - Get current session

### usersApi
- `getAll(branchId?)` - Get users
- `create(data)` - Create user
- `update(id, data)` - Update user
- `delete(id)` - Delete user
- `resetPassword(id, password)` - Reset user password

### ticketsApi
- `getAll(params?)` - Get tickets with filters
- `issue(branchId, serviceCategoryId)` - Issue new ticket
- `callNext(counterId, serviceCategoryId)` - Call next ticket
- `recall(id)` - Recall ticket
- `startService(id)` - Start serving
- `endService(id)` - End serving
- `noShow(id)` - Mark as no-show
- `transfer(id, serviceCategoryId)` - Transfer to other service
- `getQueueSnapshot(branchId)` - Get current queue status
- `getRecentlyCalled(branchId, limit?)` - Get recently called tickets

### reportsApi
- `getSummary(branchId, from, to)` - Get report data
- `exportCsv(branchId, from, to)` - Download CSV

---

## Type Definitions

```typescript
type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'RECEPTION'
type TicketStatus = 'CREATED' | 'CALLED' | 'IN_SERVICE' | 'SERVED' | 'NO_SHOW' | 'CANCELLED' | 'TRANSFERRED'

interface Branch { id, name, code, address?, isActive }
interface ServiceCategory { id, branchId, name, code, prefix, description?, isActive }
interface Counter { id, branchId, name, code, isActive, services?, sessions? }
interface User { id, email, firstName, lastName, role, branchId?, branch?, isActive }
interface Ticket { id, ticketNumber, branchId, serviceCategoryId, counterId?, status, issuedAt, ... }
interface AuthUser { id, email, firstName, lastName, role, branch? }
```

---

## Development & Deployment

### Commands
```bash
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm run start    # Start production server
```

### Environment
- `.env.local` contains `NEXT_PUBLIC_API_URL`
- Set to `http://localhost:4000` for local development
- Update for production API URL

### Dependencies
- Next.js 14.2.5
- React 18.3.1
- TypeScript 5
- Tailwind CSS 3.4.6
- Axios 1.7.2
- Zustand 4.5.4
- Recharts 2.12.7
- date-fns 3.6.0
- lucide-react 0.400.0

---

## Design & Styling

### Color Scheme
- **Primary**: Blue (#3b82f6 - brand-500)
- **Dark Blue**: #1e3a8a (brand-900)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Gray (#6b7280)

### Responsive Breakpoints
- Mobile: 320px+
- Tablet: 768px+ (md)
- Desktop: 1024px+ (lg)

### Components
- Cards with subtle shadows and borders
- Forms with focus states
- Badges/pills for status
- Tables with hover effects
- Buttons with hover/disabled states
- Modal overlays for forms
- Sidebar navigation

---

## Security Features

- JWT authentication
- Token stored in localStorage
- Automatic logout on 401
- Role-based access control
- Protected routes
- API request interceptors
- CORS-enabled API integration

---

## Performance Optimizations

- Next.js App Router for faster navigation
- Code splitting per route
- Image optimization (next/image ready)
- CSS-in-JS with Tailwind (minimal CSS)
- Zustand for lightweight state management
- Axios request caching
- Efficient re-renders with React

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

---

## Future Enhancements

- Mobile app version
- Notification system (web push)
- Queue analytics ML predictions
- Multi-language support
- Dark mode toggle
- Advanced filtering & search
- Customer satisfaction ratings
- Performance benchmarking
- System health monitoring
- Audit logging

---

## Getting Started

1. Install dependencies: `npm install`
2. Set environment: Check `.env.local`
3. Start dev server: `npm run dev`
4. Open: `http://localhost:3001`
5. Login with demo credentials

---

## Support & Documentation

- See `/README.md` for full project setup
- API endpoints: http://localhost:4000
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0
