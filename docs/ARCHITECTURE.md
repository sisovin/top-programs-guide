# Architecture Documentation

## System Overview

The Top 10 Programming Languages Guide is a full-stack application following a modern microservices-inspired architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                       │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│              │              │              │                    │
│   Next.js    │   Android    │     iOS      │   PHP Landing     │
│   Web App    │     App      │     App      │      Page         │
│  (Port 3000) │  (Native)    │  (Native)    │  (Apache/Nginx)   │
│              │              │              │                    │
│   React 19   │   Jetpack    │   SwiftUI    │    PHP 8.4       │
│  Tailwind v4 │   Compose    │              │   SEO/OpenGraph   │
│  Shadcn/UI   │              │              │                    │
└──────────────┴──────────────┴──────────────┴────────────────────┘
                              │
                         HTTP/HTTPS
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                      (Port 3001)                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Security Middleware                                      │  │
│  │  • Helmet Headers                                         │  │
│  │  • CORS Configuration                                     │  │
│  │  • Rate Limiting (4 strategies)                           │  │
│  │  • Input Sanitization (SQL, XSS, NoSQL)                   │  │
│  │  • JWT Authentication                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Logging & Monitoring                                     │  │
│  │  • Winston Logger (console + file)                        │  │
│  │  • Sentry Error Tracking                                  │  │
│  │  • Request/Performance Logging                            │  │
│  │  • Security Event Logging                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│                   (Express.js Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  Controllers   │  │  Middleware    │  │  Routes          │ │
│  │                │  │                │  │                  │ │
│  │  • Language    │  │  • Auth        │  │  • /api/langs    │ │
│  │  • Auth        │  │  • Validation  │  │  • /api/auth     │ │
│  │  • CareerPath  │  │  • Error       │  │  • /api/career   │ │
│  │                │  │  • Logging     │  │  • /api/compare  │ │
│  └────────────────┘  └────────────────┘  └──────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Business Logic                                           │  │
│  │  • Input Validation (Zod)                                 │  │
│  │  • Business Rules                                         │  │
│  │  • Data Transformation                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
│                      (Prisma ORM)                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Prisma Client                                            │  │
│  │  • Type-safe queries                                      │  │
│  │  • Migrations                                             │  │
│  │  • Connection pooling                                     │  │
│  │  • Query optimization                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer                              │
│                   PostgreSQL 14+ (Port 5432)                     │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                         │
│  • ProgrammingLanguage                                           │
│  • User                                                          │
│  • CareerPath                                                    │
│  • ComparisonData                                                │
│                                                                  │
│  Features:                                                       │
│  • ACID Transactions                                             │
│  • Indexes on frequently queried columns                         │
│  • Foreign key constraints                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Sentry     │  Analytics   │   CDN        │   Email Service  │
│  (Errors)    │  (Metrics)   │  (Assets)    │   (Optional)     │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

## Component Architecture

### Frontend (Next.js)

```
frontend/
├── App Router (Next.js 15.5)
│   ├── Page Components (page.tsx)
│   ├── Layout Components (layout.tsx)
│   ├── Loading States (loading.tsx)
│   └── Error Boundaries (error.tsx)
│
├── Component Layer
│   ├── UI Components (Shadcn/UI)
│   │   ├── Button, Card, Badge
│   │   ├── Form elements
│   │   └── Layout components
│   │
│   ├── Feature Components
│   │   ├── LanguageCard
│   │   ├── Header, Footer
│   │   └── Comparison tools
│   │
│   └── Error Handling
│       ├── ErrorBoundary
│       └── ErrorFallback
│
├── Business Logic Layer
│   ├── API Client (lib/api.ts)
│   │   ├── Request handling
│   │   ├── Error handling
│   │   ├── Retry logic
│   │   └── Type-safe responses
│   │
│   ├── Utilities
│   │   ├── Accessibility (lib/accessibility.ts)
│   │   ├── Performance (lib/performance.ts)
│   │   ├── Error handling (lib/error.ts)
│   │   └── Metadata (lib/metadata.ts)
│   │
│   └── State Management
│       └── React Hooks
│
└── Styling Layer
    ├── Tailwind CSS v4
    ├── CSS Modules (globals.css)
    └── Theme System (dark/light)
```

### Backend (Express.js)

```
backend/
├── Entry Point (app.ts)
│   ├── Express setup
│   ├── Middleware registration
│   ├── Route mounting
│   └── Error handling
│
├── Routing Layer (routes/)
│   ├── languages.ts → /api/languages
│   ├── auth.ts → /api/auth
│   └── Route-specific middleware
│
├── Controller Layer (controllers/)
│   ├── languageController.ts
│   │   ├── GET /languages (list)
│   │   ├── GET /languages/:id (detail)
│   │   ├── POST /languages (create - admin)
│   │   ├── PUT /languages/:id (update - admin)
│   │   └── DELETE /languages/:id (delete - admin)
│   │
│   └── authController.ts
│       ├── POST /register
│       ├── POST /login
│       ├── POST /refresh
│       └── GET /me
│
├── Middleware Layer (middleware/)
│   ├── auth.ts (JWT authentication)
│   ├── validation.ts (Zod schemas)
│   ├── errorHandler.ts (centralized errors)
│   ├── logging.ts (request/performance)
│   ├── rateLimiter.ts (4 strategies)
│   └── security.ts (sanitization)
│
├── Data Layer (prisma/)
│   ├── client.ts (Prisma client)
│   ├── schema.prisma (database schema)
│   ├── seed.ts (initial data)
│   └── migrations/ (version control)
│
└── Utilities (utils/)
    ├── logger.ts (Winston)
    └── sentry.ts (error tracking)
```

### Mobile (Kotlin Multiplatform)

```
mobile-app/
├── shared/ (Kotlin - Shared Logic)
│   ├── Network Layer
│   │   ├── API client
│   │   ├── Data models
│   │   └── Repository pattern
│   │
│   ├── Business Logic
│   │   ├── Use cases
│   │   ├── Data transformation
│   │   └── Validation
│   │
│   └── Common Utilities
│       ├── Date formatting
│       ├── String utilities
│       └── Constants
│
├── androidApp/ (Android - UI)
│   ├── Jetpack Compose UI
│   ├── Navigation
│   ├── ViewModels
│   └── Android-specific code
│
└── iosApp/ (iOS - UI)
    ├── SwiftUI Views
    ├── Navigation
    ├── ViewModels
    └── iOS-specific code
```

## Data Flow

### Read Operation (GET /api/languages)

```
1. Client Request
   ├── Browser/App → HTTP GET /api/languages?page=1&limit=10
   │
2. API Gateway
   ├── Rate Limiter → Check request limit (200 req/15min for reads)
   ├── CORS → Validate origin
   ├── Request Logger → Log incoming request
   │
3. Application Layer
   ├── Route Handler → /api/languages router
   ├── Controller → languageController.getLanguages()
   ├── Validation → Validate query parameters (Zod)
   │
4. Data Layer
   ├── Prisma Client → prisma.programmingLanguage.findMany()
   ├── Database → Execute SQL query with pagination
   │
5. Response
   ├── Transform Data → Format response
   ├── Performance Logger → Log query time
   ├── Return JSON → { success: true, data: [...], pagination: {...} }
   │
6. Client Receives
   └── Update UI → Display languages
```

### Write Operation (POST /api/languages - Admin)

```
1. Client Request
   ├── Admin App → HTTP POST /api/languages
   ├── Headers → Authorization: Bearer <jwt-token>
   ├── Body → { name: "Rust", description: "...", ... }
   │
2. API Gateway
   ├── Rate Limiter → Check admin limit (30 req/15min)
   ├── Auth Middleware → Verify JWT token
   ├── Role Check → Ensure user.role === 'admin'
   ├── Input Sanitization → Remove malicious input
   │
3. Application Layer
   ├── Route Handler → POST /languages
   ├── Controller → languageController.createLanguage()
   ├── Validation → Validate body (Zod schema)
   │   ├── Required fields present
   │   ├── Data types correct
   │   └── Business rules satisfied
   │
4. Data Layer
   ├── Prisma Client → prisma.programmingLanguage.create()
   ├── Database → INSERT INTO programming_language
   ├── Transaction → COMMIT if successful
   │
5. Logging & Monitoring
   ├── Security Logger → Log admin action
   ├── Sentry → Track successful creation
   │
6. Response
   ├── Return 201 → { success: true, data: { id: 11, ... } }
   │
7. Client Receives
   └── Update UI → Show success message
```

### Authentication Flow

```
1. Login Request
   ├── POST /api/auth/login
   ├── Body → { email, password }
   │
2. Authentication
   ├── Rate Limiter → Strict limit (5 req/15min)
   ├── Find User → prisma.user.findUnique({ email })
   ├── Verify Password → bcrypt.compare(password, user.password)
   │
3. Token Generation (if valid)
   ├── Access Token → JWT (24h expiry)
   │   ├── Payload: { userId, email, role }
   │   ├── Secret: JWT_SECRET
   │   └── Algorithm: HS256
   │
   ├── Refresh Token → JWT (7d expiry)
   │   ├── Payload: { userId }
   │   └── Store in database (optional)
   │
4. Security Logging
   ├── Success → Log successful authentication
   ├── Failure → Log failed attempt (rate limit trigger)
   │
5. Response
   └── Return → { accessToken, refreshToken, user: {...} }
```

## Security Architecture

### Defense in Depth

```
Layer 1: Network Security
├── HTTPS only in production
├── Firewall rules
└── DDoS protection (Cloudflare/Railway)

Layer 2: API Gateway Security
├── Rate Limiting (per-IP, per-user)
├── CORS restrictions
├── Helmet security headers
└── Request size limits (10MB)

Layer 3: Authentication & Authorization
├── JWT tokens (signed, expiring)
├── bcrypt password hashing (10 rounds)
├── Role-based access control (user/admin)
└── Token refresh mechanism

Layer 4: Input Validation
├── Zod schema validation
├── SQL injection prevention (Prisma)
├── NoSQL injection prevention (mongo-sanitize)
├── XSS prevention (input sanitization)
├── HPP prevention (hpp middleware)
└── Pattern detection (SQL/XSS regex)

Layer 5: Application Security
├── Error handling (no sensitive data leak)
├── Secure session management
├── CSRF protection (SameSite cookies)
└── Security event logging

Layer 6: Data Security
├── Database access control
├── Encrypted connections (SSL/TLS)
├── Backup and recovery
└── Data retention policies
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├──► Backend Instance 1 ─┐
    ├──► Backend Instance 2 ─┼─► PostgreSQL Primary
    ├──► Backend Instance 3 ─┤   (with read replicas)
    └──► Backend Instance N ─┘

Stateless Design:
• JWT tokens (no server-side sessions)
• Database-backed sessions (if needed)
• Shared Redis cache (future enhancement)
```

### Vertical Scaling

```
• Increase server resources (CPU, RAM)
• Database optimization (indexes, query tuning)
• Connection pooling (Prisma)
• Caching layer (Redis - future)
```

### Performance Optimizations

```
Frontend:
├── Code splitting (Next.js automatic)
├── Image optimization (AVIF/WebP)
├── Static generation (ISR)
├── CDN for assets
└── Service Worker (future PWA)

Backend:
├── Database indexing
├── Query optimization
├── Response compression (gzip)
├── Caching headers
└── API response pagination

Database:
├── Indexes on foreign keys
├── Composite indexes for common queries
├── Query planning and analysis
└── Connection pooling
```

## Monitoring & Observability

### Logging Strategy

```
Winston Logger:
├── Console transport (development)
├── File transport (production)
│   ├── combined.log (all logs)
│   └── error.log (errors only)
└── Log levels: error, warn, info, http, debug

Log Structure:
{
  timestamp: "2025-10-17T10:30:00Z",
  level: "info",
  message: "Request completed",
  context: {
    method: "GET",
    url: "/api/languages",
    statusCode: 200,
    duration: 45,
    userId: "user-123"
  }
}
```

### Error Tracking

```
Sentry Integration:
├── Backend: @sentry/node
├── Frontend: @sentry/nextjs (future)
├── Error context capture
├── Performance monitoring
└── Release tracking
```

### Metrics to Track

```
Application Metrics:
├── Request rate (req/sec)
├── Response time (p50, p95, p99)
├── Error rate (%)
├── Database query time
└── Active connections

Business Metrics:
├── User registrations
├── Language views
├── Career path queries
└── Comparison tool usage

Infrastructure Metrics:
├── CPU usage
├── Memory usage
├── Disk I/O
└── Network throughput
```

## Deployment Architecture

### Development Environment

```
localhost:
├── Frontend: http://localhost:3000
├── Backend: http://localhost:3001
├── Database: localhost:5432
└── PHP: http://localhost (Laragon/XAMPP)
```

### Production Environment

```
Vercel (Frontend):
├── Global CDN
├── Automatic HTTPS
├── Preview deployments
└── Edge functions

Railway (Backend):
├── Docker containers
├── Managed PostgreSQL
├── Automatic deployments
├── Environment variables
└── Monitoring dashboard

Mobile:
├── Google Play Store (Android)
└── Apple App Store (iOS)
```

## Technology Decisions

### Why Next.js?

- Server-side rendering (SEO)
- Automatic code splitting
- Built-in routing
- React 19 support
- Vercel deployment

### Why Prisma?

- Type-safe queries
- Automatic migrations
- Great developer experience
- PostgreSQL optimization
- Schema versioning

### Why PostgreSQL?

- ACID compliance
- Excellent performance
- JSON support (flexible data)
- Strong ecosystem
- Railway/Vercel compatibility

### Why Kotlin Multiplatform?

- Share business logic
- Native UI performance
- Single codebase for Android/iOS
- Type safety
- Modern language features

### Why Express.js?

- Lightweight and fast
- Large ecosystem
- Middleware support
- Well-documented
- Industry standard

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
