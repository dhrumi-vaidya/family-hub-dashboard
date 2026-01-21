# KutumbOS - Project Overview

## High-Level Architecture

KutumbOS is a production-grade family management system built with React 18 + TypeScript. It follows a modular, context-driven architecture designed for scalability and maintainability.

### Technology Stack
- **Frontend**: React 18.3, TypeScript, Vite
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **State Management**: Context API (AuthContext, AppContext, ThemeContext)
- **Routing**: React Router v6 with protected routes
- **Data Fetching**: TanStack React Query (configured, ready for API integration)
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast system
- **Charts**: Recharts for data visualization

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   REST APIs     │    │   Database      │
│                 │    │                 │    │                 │
│ • Context API   │◄──►│ • JWT Auth      │◄──►│ • Family Data   │
│ • Protected     │    │ • Role-based    │    │ • User Roles    │
│   Routes        │    │   Endpoints     │    │ • Permissions   │
│ • Role-based UI │    │ • Stateless     │    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Concepts

### Families
- **Multi-family Support**: Users can belong to multiple families
- **Data Isolation**: Each family's data is completely isolated
- **Member Limit**: Maximum ~20 members per family
- **Family Selection**: UI for switching between families (if user belongs to multiple)

### User Roles (Per Family)

#### Family Admin
- **Full Control**: Complete access to family data and settings
- **Permissions**: Create, read, update, delete all family data
- **Responsibilities**: 
  - Manage family members and their permissions
  - Set budgets and spending limits
  - Assign and track responsibilities/tasks
  - Upload and manage health records
  - Configure emergency access settings

#### Family Member
- **Limited Access**: Permission-based access to family data
- **Permissions**: Primarily read access with selective write permissions
- **Capabilities**:
  - View family expenses (within permitted scope)
  - Add personal expenses
  - Confirm assigned responsibilities
  - View health records (own and permitted family members)
  - Receive notifications

#### Global Role: System Admin
- **Platform Management**: Manages system-level operations
- **Scope**: Not involved in family data directly
- **Responsibilities**: System maintenance, user support, platform analytics

## Modules Explanation

### 1. Dashboard Module
**Purpose**: Central overview of family and personal data

**Admin Dashboard**:
- Family overview with expense summaries
- Health record alerts
- Pending responsibilities
- Member activity overview
- Budget utilization charts
- Quick action buttons

**Member Dashboard**:
- Personal task list
- Recent health records
- Expense summary (read-only)
- Notifications feed
- Simplified interface for accessibility

### 2. Expense Module
**Purpose**: Family and personal expense tracking with budgeting

**Features**:
- **Dual View**: Family vs Personal expense tracking
- **Monthly Budgets**: Set and track spending limits
- **Categories**: Food, Travel, Medical, Utilities, Other
- **Insights**: Spending analysis and trend identification
- **Permissions**: 
  - Admin: View all expenses, set budgets, manage categories
  - Member: View permitted expenses, add personal expenses

**Data Flow**:
```
Add Expense → Categorize → Budget Check → Update Totals → Generate Insights
```

### 3. Health Records Module
**Purpose**: Centralized medical document management

**Record Types**:
- **Uploaded Records**: Images/PDFs (immutable once uploaded)
- **Manual Records**: Text entries (editable)

**Features**:
- **Document Upload**: Secure file storage with thumbnails
- **Emergency Access**: Time and IP-restricted access
- **Audit Trail**: Complete access logging
- **Member Filtering**: View records by family member
- **Type Classification**: Prescription, Report, Bill

**Security Model**:
- All access is logged for audit purposes
- Emergency access requires special authentication
- Records are immutable once uploaded to prevent tampering

### 4. Responsibility/Task Module
**Purpose**: Family task assignment and completion tracking

**Task Lifecycle**:
```
Create → Assign → Due Date → Reminder → Complete/Escalate → Audit
```

**Features**:
- **Assignment**: Admin assigns tasks to specific members
- **Recurrence**: Daily, Weekly, Monthly, One-time
- **Status Tracking**: Pending, Overdue, Escalated, Confirmed
- **Escalation**: Auto-escalate overdue tasks to other members
- **Completion**: Members confirm task completion

**Permissions**:
- **Admin**: Create, assign, modify, delete tasks
- **Member**: View assigned tasks, confirm completion

### 5. Notifications Module
**Purpose**: Multi-channel notification system

**Channels**:
- **In-app**: Real-time notifications within the application
- **WhatsApp**: Critical notifications only (configurable)
- **Email**: Digest and important alerts

**Notification Types**:
- Task assignments and reminders
- Budget alerts and spending notifications
- Health record uploads
- Emergency access alerts
- System announcements

## Roles & Permissions Model

### Permission Structure
Permissions are **feature-based**, not just role-based:

```typescript
interface Permissions {
  expenses: {
    read: 'all' | 'own' | 'none';
    write: 'all' | 'own' | 'none';
    budget: boolean;
  };
  health: {
    read: string[]; // member IDs
    upload: boolean;
    emergency: boolean;
  };
  responsibilities: {
    create: boolean;
    assign: boolean;
    confirm: boolean;
  };
  members: {
    invite: boolean;
    remove: boolean;
    permissions: boolean;
  };
}
```

### Enforcement Levels
1. **UI Level**: Components conditionally render based on permissions
2. **API Level**: Backend validates permissions for all operations
3. **Data Level**: Database constraints ensure data integrity

### Key Permission Rules
- **Hide, Don't Disable**: Admin-only features are hidden from members, not disabled
- **Granular Control**: Permissions can be set per feature, not just per role
- **Audit Everything**: All permission-based actions are logged

## Data Flow Summary

### Authentication Flow
```
Login → Validate Credentials → Select Family → Select UI Mode → Dashboard
```

### Data Operations Flow
```
User Action → Permission Check → API Call → Database Update → UI Update → Audit Log
```

### State Management Flow
```
Context Providers → Page Components → Child Components → Local State → API Integration
```

## UI Mode System

### Simple Mode (Elder-Friendly)
- **Target**: Less tech-savvy users, elderly family members
- **Features**:
  - Larger text and buttons
  - Guided step-by-step forms
  - More confirmations and explanations
  - Onboarding tour
  - Always-expanded sidebar
  - Helpful hints throughout

### Fast Mode (Power Users)
- **Target**: Tech-savvy users who want efficiency
- **Features**:
  - Compact, dense UI
  - Quick inline forms
  - Fewer confirmations
  - Collapsible sidebar
  - Minimal explanatory text
  - Keyboard shortcuts

## Assumptions & Constraints

### Technical Assumptions
- **Stateless Backend**: REST APIs with JWT authentication
- **Modern Browsers**: ES2020+ support required
- **Mobile-First**: Responsive design for all screen sizes
- **Internet Connectivity**: Online-first application (offline support future enhancement)

### Business Constraints
- **Family Size**: Maximum 20 members per family
- **Data Retention**: Health records are immutable once uploaded
- **Emergency Access**: Time-limited, IP-restricted, fully audited
- **Notification Limits**: WhatsApp notifications only for critical events

### Performance Targets
- **API Response Time**: ~200ms p95
- **Page Load Time**: <2 seconds on 3G
- **Bundle Size**: <500KB gzipped
- **Accessibility**: WCAG 2.1 AA compliance

### Security Requirements
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control at API level
- **Data Privacy**: Family data isolation enforced at database level
- **Audit Trail**: All sensitive operations logged with user, timestamp, IP
- **Emergency Access**: Special authentication flow with enhanced logging

## Current Implementation Status

### ✅ Completed Features
- Authentication system with role-based access
- Multi-family support with family selection
- Simple/Fast mode switching
- Dashboard with overview cards and charts
- Expense tracking with budget management
- Health records management (UI complete)
- Responsibility assignment and tracking
- Member management (admin-only)
- Settings and preferences
- Onboarding tour and contextual hints
- Theme switching (light/dark mode)
- Responsive design for all screen sizes
- Error handling and loading states
- Toast notification system

### 🚧 In Progress
- API integration layer (TanStack Query configured)
- Real-time notifications
- File upload for health records

### ❌ Pending Implementation
- Backend API development
- Database schema and migrations
- Audit logs page and functionality
- Emergency access workflow
- Email/SMS notification delivery
- Advanced search and filtering
- Data export and reporting
- User profile management
- Password reset functionality
- Two-factor authentication

## Development Guidelines

### Code Quality Standards
- **TypeScript**: Full type coverage, no `any` types
- **Component Structure**: Single responsibility, clear naming
- **Error Handling**: Graceful degradation with user-friendly messages
- **Performance**: Lazy loading, code splitting, optimized re-renders
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Architecture Principles
- **Modularity**: Components should be reusable and composable
- **Separation of Concerns**: Clear boundaries between UI, state, and business logic
- **Scalability**: Code should handle growth in users and features
- **Maintainability**: Clear documentation, consistent patterns
- **Testability**: Components should be easily unit and integration tested

This document serves as the single source of truth for KutumbOS architecture and implementation decisions.