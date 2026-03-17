# Ticket Man Web App - Complete Features Overview

## 🎫 System Overview

Ticket Man is a modern, production-ready Queue Ticketing & Service Management Web Application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

**Technology Stack:**
- Frontend: Next.js 14 with App Router
- Language: TypeScript 5
- Styling: Tailwind CSS 3.4
- State: Zustand 4.5
- API: Axios 1.7
- Charts: Recharts 2.12
- Authentication: JWT-based

---

## 👥 User Roles & Access Control

### 1. Admin Role
**Full system control**

Features:
- Create, edit, delete branches
- Create, edit, delete service categories
- Create, edit, delete service counters
- Create, edit, delete users and assign roles
- Access all reports and dashboards
- System-wide statistics

Access: All pages

---

### 2. Supervisor Role
**Monitoring and reporting**

Features:
- View live queue dashboard with real-time updates
- Monitor counter activity and agent status
- View service-wise queue breakdown
- Generate detailed reports with date range filtering
- Export reports to CSV format
- View peak hour analytics
- Track key metrics (wait time, service time, no-shows)

Access:
- `/supervisor` - Live dashboard
- `/reports` - Analytics
- `/counter` - Counter view (if assigned)
- `/reception` - Ticket issuing (if assigned)

---

### 3. Agent Role
**Counter operations**

Features:
- Open/close counter sessions
- Select which service queue to serve
- Call next customer from queue
- Start serving customer
- End service (mark as served)
- Recall customer
- Mark as no-show
- View current queue count
- See ticket details

Access:
- `/counter` - Primary interface

---

### 4. Reception Role
**Ticket issuance**

Features:
- Issue new tickets to customers
- Select branch
- Select service category
- Print tickets (formatted for customers)
- View last issued ticket
- Real-time feedback

Access:
- `/reception` - Ticket issuance

---

## 📱 Pages & Features

### Public Pages (No Login Required)

#### 1. Login Page (`/login`)
```
Features:
✓ Email/password authentication
✓ Error messages
✓ Loading state
✓ Gradient background design
✓ Demo credentials display
✓ Responsive mobile view
```

#### 2. Public Display Screen (`/display/:branchId`)
```
Features:
✓ Real-time updates via Server-Sent Events (SSE)
✓ Large ticket number display (10rem font)
✓ Current ticket information
✓ Recently called tickets sidebar (10 tickets)
✓ Flash animation on new ticket
✓ Service name and counter display
✓ Professional dark theme
✓ Date/time display
✓ Professional messaging
```

---

### Protected Pages (Login Required)

#### 3. Reception - Issue Tickets (`/reception`)
```
Components:
- Branch selector dropdown
- Service category selector (filtered by branch)
- Issue & Print button

Display:
- Last issued ticket preview
- Large ticket number (7rem)
- Service and branch information
- Time of issuance
- Print-optimized styling

Actions:
✓ Issue new ticket
✓ Print ticket
✓ Print again button
✓ Real-time ticket feedback
```

#### 4. Counter Agent View (`/counter`)
```
Session Management:
- Open counter session
- Select counter from dropdown
- Close counter session

Queue Operations:
- Select service queue to serve
- View waiting customer count
- View in-service count
- Call next customer
- Start service
- End service
- Recall customer
- Mark as no-show

Display:
- Large current ticket number (6rem)
- Ticket status (CALLED, IN_SERVICE)
- Service category name
- Queue statistics
- Context-aware action buttons
```

#### 5. Supervisor Dashboard (`/supervisor`)
```
Real-time Features:
✓ Live queue status (auto-refresh 10s)
✓ Service-wise breakdown
✓ Counter activity monitoring
✓ Agent status display

Dashboard Cards:
- Total waiting tickets
- In-service count
- Active counters count

Service Queues:
- Queue count per service
- Serving count
- Currently serving tickets
- Counter assignments

Counter Status:
- Counter name and status
- Active agent name
- Online/offline indicator
- Grid-based layout
```

#### 6. Reports & Analytics (`/reports`)
```
Filtering:
- Branch selector
- Date range picker (from/to)
- Run report button

Summary Statistics:
- Total tickets issued
- Served count
- No-show rate
- Average wait time

Detailed Metrics:
- Service-wise performance
- Total, served, average service time per service
- Peak hours chart (bar chart)

Export:
✓ CSV export button
✓ Filename: report-{from}-{to}.csv

Visualization:
- Bar chart for peak hours
- Color-coded status badges
- Table view for detailed data
```

---

### Admin Pages (Admin Only)

#### 7. Branches Management (`/admin/branches`)
```
Operations:
✓ Create new branch
✓ Edit existing branch
✓ Delete branch
✓ View all branches

Form Fields:
- Branch name (required)
- Branch code (required)
- Address (optional)

Display:
- Table with all branches
- Status indicator (Active/Inactive)
- Edit and delete buttons per row
- Name, code, address columns
```

#### 8. Services Management (`/admin/services`)
```
Operations:
✓ Create new service category
✓ Edit service
✓ Delete service
✓ View all services

Form Fields:
- Branch selector (required)
- Service name (required)
- Service code (required)
- Ticket prefix (A, B, C, etc.)
- Description (optional)

Display:
- Table with all services
- Branch assignment
- Ticket prefix preview (e.g., A001)
- Status indicator
- Edit and delete buttons
```

#### 9. Counters Management (`/admin/counters`)
```
Operations:
✓ Create new counter
✓ View counter status
✓ Delete counter

Form Fields:
- Branch selector (required)
- Counter name (required)
- Counter code (required)

Display:
- Grid-based layout (3 columns on desktop)
- Counter name and code
- Active agent display (if session open)
- Online/offline status indicator
- Delete button
```

#### 10. Users Management (`/admin/users`)
```
Operations:
✓ Create new user
✓ Delete user
✓ Assign role
✓ Assign branch

Form Fields:
- First name (required)
- Last name (required)
- Email (required)
- Password (required)
- Role dropdown (ADMIN, SUPERVISOR, AGENT, RECEPTION)
- Branch selector (optional)

Display:
- Table with all users
- Role badges with color coding
- Branch assignment
- Active/inactive status
- Email display
```

---

## 🔐 Authentication & Security

```
✓ JWT token-based authentication
✓ Automatic token injection in API requests
✓ Token stored in localStorage
✓ Automatic logout on 401 error
✓ Protected routes with auth check
✓ Role-based access control
✓ Logout functionality
```

---

## 🔄 API Integration

### API Clients (`src/lib/api.ts`)

**authApi**
- `login(email, password)` → Returns { token, user }
- `me()` → Returns current user

**branchesApi**
- `getAll()` → Returns all branches
- `getById(id)` → Returns single branch
- `create(data)` → Create branch
- `update(id, data)` → Update branch
- `delete(id)` → Delete branch

**servicesApi**
- `getAll(branchId?)` → Get services
- `create(data)` → Create service
- `update(id, data)` → Update service
- `delete(id)` → Delete service

**countersApi**
- `getAll(branchId?)` → Get counters
- `create(data)` → Create counter
- `update(id, data)` → Update counter
- `delete(id)` → Delete counter
- `openSession(counterId)` → Open session
- `closeSession()` → Close session
- `getActiveSession()` → Get current session

**usersApi**
- `getAll(branchId?)` → Get users
- `create(data)` → Create user
- `update(id, data)` → Update user
- `delete(id)` → Delete user
- `resetPassword(id, password)` → Reset password

**ticketsApi**
- `getAll(params?)` → Get tickets
- `issue(branchId, serviceCategoryId)` → Issue ticket
- `callNext(counterId, serviceCategoryId)` → Call next
- `recall(id)` → Recall ticket
- `startService(id)` → Start serving
- `endService(id)` → End serving
- `noShow(id)` → Mark no-show
- `transfer(id, serviceCategoryId)` → Transfer ticket
- `getQueueSnapshot(branchId)` → Queue status
- `getRecentlyCalled(branchId, limit?)` → Recently called

**reportsApi**
- `getSummary(branchId, from, to)` → Get report data
- `exportCsv(branchId, from, to)` → Download CSV

---

## 🎨 UI Components & Design

### Design System

**Colors:**
- Primary Blue: `#3b82f6` (brand-500)
- Dark Blue: `#1e3a8a` (brand-900)
- Success Green: `#10b981`
- Warning Yellow: `#f59e0b`
- Danger Red: `#ef4444`
- Neutral Gray: `#6b7280`

**Components:**
- Cards with shadows and borders
- Form inputs with focus states
- Status badges and pills
- Tables with hover effects
- Buttons (primary, secondary, danger)
- Modal forms
- Sidebar navigation
- Loading spinners
- Error messages
- Responsive layout

**Responsive:**
- Mobile: 320px+
- Tablet: 768px+ (md)
- Desktop: 1024px+ (lg)

---

## 📊 Real-time Features

### Live Dashboard (`/supervisor`)
```
✓ Auto-refresh every 10 seconds
✓ Real-time queue count updates
✓ Counter activity monitoring
✓ Service-wise metrics
✓ Agent status display
✓ Timestamp of last update
✓ Manual refresh button
```

### Public Display (`/display/:branchId`)
```
✓ Server-Sent Events (SSE) streaming
✓ Real-time ticket number display
✓ Flash animation on new ticket
✓ Recently called ticket updates
✓ Automatic refresh without reload
```

---

## 💾 State Management

### Zustand Store (`src/store/auth.store.ts`)

```typescript
Interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login(email, password): Promise<void>
  logout(): void
  loadUser(): Promise<void>
}
```

Features:
- Persistent user session
- Auto-load user on page load
- Global auth state
- Automatic logout on 401

---

## 🎯 Key Workflows

### Ticket Issuance Workflow
```
Reception opens web app
    ↓
Select branch
    ↓
Select service category
    ↓
Click "Issue & Print Ticket"
    ↓
API creates ticket with auto-generated number
    ↓
Print preview shows
    ↓
Print button → Print dialog
    ↓
Customer receives ticket
```

### Ticket Serving Workflow
```
Agent logs in
    ↓
Opens counter session
    ↓
Selects counter
    ↓
Selects service queue
    ↓
Clicks "Call Next"
    ↓
API returns next waiting ticket
    ↓
Display shows "CALLED" status
    ↓
Agent clicks "Start Service"
    ↓
Display shows "IN_SERVICE"
    ↓
Agent completes service
    ↓
Agent clicks "End Service"
    ↓
Ticket marked "SERVED"
    ↓
Queue updates, next ticket ready
```

---

## 📈 Reporting Features

### Available Reports
1. Daily/Weekly/Monthly reports
2. Service-wise performance
3. Peak hour analysis
4. Agent performance metrics
5. Wait time statistics
6. Service time statistics

### Export Options
- CSV format
- Date range filtering
- Branch filtering
- Timestamped filename

---

## 🔧 Development Features

### Hot Reload
- Automatic reload on file changes
- Fast refresh for React components
- TypeScript compilation on save

### Type Safety
- Full TypeScript coverage
- Type-safe API calls
- Centralized type definitions

### Code Organization
- Modular API clients
- Centralized state management
- Separated concerns (lib, store, types)
- Page-based routing

---

## 📱 Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 14+, Chrome Android

---

## ⚡ Performance Features

- Code splitting per route
- CSS minimization (Tailwind)
- Image optimization ready
- Efficient re-renders
- Request caching via Axios
- Session-based operations

---

## 🚀 Deployment Ready

- TypeScript compilation
- Production build optimization
- Environment variable support
- CORS-enabled API integration
- Error handling and logging
- Responsive design
- Performance optimized

---

## 📚 Documentation

- **README.md** - Setup instructions
- **PROJECT_SUMMARY.md** - Detailed feature docs
- **INSTALLATION_GUIDE.md** - Step-by-step setup
- **FEATURES_OVERVIEW.md** - This file

---

## 🎓 Getting Started

1. **Install**: `npm install`
2. **Configure**: Set `.env.local`
3. **Run**: `npm run dev`
4. **Access**: http://localhost:3001
5. **Login**: Use demo credentials

---

**Version**: 1.0.0
**Last Updated**: February 28, 2026
**Status**: Production Ready
