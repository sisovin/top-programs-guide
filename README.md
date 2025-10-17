# Top 10 Programming Languages Guide

> A full-stack web and mobile application showcasing the top 10 programming languages with detailed information, career paths, salary data, and comparison tools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Features

- ✅ **Responsive Web Application** - Built with Next.js 15.5 and React 19
- ✅ **Native Mobile Apps** - Android (Jetpack Compose) and iOS (SwiftUI) via Kotlin Multiplatform Mobile
- ✅ **RESTful API** - Express.js backend with PostgreSQL and Prisma ORM
- ✅ **Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Admin Dashboard** - Protected routes for content management
- ✅ **Career Path Guide** - Explore programming language career opportunities
- ✅ **Language Comparison** - Side-by-side comparison of multiple languages
- ✅ **PHP Landing Page** - SEO-optimized entry point
- ✅ **WCAG 2.1 AA Accessible** - Full accessibility compliance
- ✅ **Performance Optimized** - Lighthouse score >90
- ✅ **Security Hardened** - OWASP Top 10 compliance

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Next.js    │   Android    │     iOS      │   PHP Landing  │
│   Frontend   │     App      │     App      │      Page      │
│  (React 19)  │   (Compose)  │  (SwiftUI)   │   (SEO/OG)    │
└──────────────┴──────────────┴──────────────┴────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Gateway                            │
│                    (Express.js + Auth)                       │
│              Rate Limiting │ Security │ Logging              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic                          │
│              Controllers │ Services │ Middleware             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│              PostgreSQL + Prisma ORM                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│              Sentry (Errors) │ Analytics │ CDN               │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.5 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4.1.14
- **Components**: Shadcn/UI (Radix UI)
- **State Management**: React Hooks
- **HTTP Client**: Fetch API with retry logic
- **Type Safety**: TypeScript 5.3 (strict mode)

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Error Tracking**: Sentry
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization

### Mobile

- **Platform**: Kotlin Multiplatform Mobile (KMM)
- **Android UI**: Jetpack Compose
- **iOS UI**: SwiftUI
- **Shared Logic**: Kotlin (network, business logic)

### PHP Landing

- **Version**: PHP 8.4.5
- **Features**: SEO optimization, OpenGraph, Twitter Cards, Schema.org

### DevOps

- **Deployment**: Vercel (Frontend), Railway (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Winston logs
- **Testing**: Jest (optional, not in spec)

## 📦 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- PHP 8.4+ (for landing page)
- Android Studio (for Android app)
- Xcode (for iOS app, macOS only)
- Git

## 🚀 Quick Start

See [quickstart.md](./specs/001-fullstack-web-mobile/quickstart.md) for detailed setup instructions.

### 1. Clone the Repository

```bash
git clone https://github.com/sisovin/top-programs-guide.git
cd top-programs-guide
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL connection string
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Backend runs on <http://localhost:3333>

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

Frontend runs on <http://localhost:3000>

### 4. Setup PHP Landing Page

```bash
cd php-web
composer install
# Configure web server to point to public/
```

### 5. Setup Mobile Apps (Optional)

#### Android

```bash
cd mobile-app
./gradlew :androidApp:assembleDebug
# Or open in Android Studio
```

#### iOS (macOS only)

```bash
cd mobile-app/iosApp
open iosApp.xcodeproj
# Build and run in Xcode
```

## 📁 Project Structure

```
top-programs-guide/
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth, validation, logging, security
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Logger, Sentry
│   │   ├── prisma/           # Prisma client
│   │   └── app.ts            # Express app
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Seed data
│   │   └── migrations/       # Database migrations
│   ├── tests/                # API tests (optional)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── railway.json          # Railway deployment config
│
├── frontend/                 # Next.js web app
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components + Shadcn/UI
│   │   ├── lib/              # Utilities (API, accessibility, performance)
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json
│   ├── next.config.js        # Next.js config (performance optimization)
│   ├── tailwind.config.ts    # Tailwind config
│   ├── tsconfig.json
│   └── vercel.json           # Vercel deployment config
│
├── mobile-app/               # Kotlin Multiplatform Mobile
│   ├── androidApp/           # Android-specific code (Jetpack Compose)
│   ├── iosApp/               # iOS-specific code (SwiftUI)
│   └── shared/               # Shared business logic (Kotlin)
│
├── php-web/                  # PHP landing page
│   ├── public/
│   │   ├── index.php         # Main landing page
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── assets/               # Images, CSS
│   └── composer.json
│
└── specs/                    # Project documentation
    └── 001-fullstack-web-mobile/
        ├── plan.md           # Project plan
        ├── spec.md           # Feature specification
        ├── tasks.md          # Task breakdown
        ├── quickstart.md     # Setup guide
        └── README.md         # This file
```

## 🔐 Environment Variables

### Backend (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/top10languages?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Sentry (Error Tracking)
SENTRY_DSN=your-sentry-dsn

# Rate Limiting (optional, defaults applied)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (`.env.local`)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your-frontend-sentry-dsn
```

## 💻 Development

### Backend

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm run lint         # Lint code
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev --name migration_name  # Create new migration
```

### Frontend

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build production bundle
npm start            # Start production server
npm run lint         # Lint code
npm run lint:fix     # Auto-fix linting issues
```

### Database

```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with initial data
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## 🧪 Testing

Tests are optional and not included in the feature specification.

```bash
# Backend tests (if implemented)
cd backend
npm test
npm run test:coverage

# Frontend tests (if implemented)
cd frontend
npm test
npm run test:e2e
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to `main`

Or use Vercel CLI:

```bash
cd frontend
npm install -g vercel
vercel
```

### Backend (Railway)

1. Create new project on Railway
2. Connect GitHub repository
3. Configure environment variables
4. Add PostgreSQL database service
5. Deploy

Or use Railway CLI:

```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### Mobile Apps

#### Android (Google Play)

1. Build release APK/AAB: `./gradlew :androidApp:bundleRelease`
2. Sign with keystore
3. Upload to Google Play Console

#### iOS (App Store)

1. Archive in Xcode: Product → Archive
2. Upload to App Store Connect
3. Submit for review

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3001/api
Production: https://your-api-domain.com/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Languages

```http
GET    /api/languages          # List all languages (public)
GET    /api/languages/:id      # Get language by ID (public)
POST   /api/languages          # Create language (admin only)
PUT    /api/languages/:id      # Update language (admin only)
DELETE /api/languages/:id      # Delete language (admin only)
```

Query parameters for `GET /api/languages`:

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search query
- `sort` (string): Sort field (e.g., 'name', 'popularityIndex')
- `order` ('asc' | 'desc'): Sort order (default: 'desc')

#### Authentication

```http
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login and get JWT token
POST   /api/auth/refresh       # Refresh access token
POST   /api/auth/logout        # Logout (invalidate token)
GET    /api/auth/me            # Get current user info (authenticated)
```

#### Career Paths

```http
GET    /api/career-paths       # List career paths
GET    /api/career-paths/:id   # Get career path details
```

#### Comparison

```http
GET    /api/compare?ids=1,2,3  # Compare multiple languages
```

### Response Format

Success:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error:

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": [ ... ]
}
```

### Rate Limiting

- General API: 100 requests / 15 minutes
- Authentication: 5 requests / 15 minutes
- Admin operations: 30 requests / 15 minutes
- Read operations: 200 requests / 15 minutes

Rate limit headers:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1634567890
```

### Security

- **Authentication**: JWT tokens (24h expiry, 7d refresh)
- **Password Hashing**: bcrypt (10 rounds)
- **Input Validation**: Zod schemas
- **SQL Injection Prevention**: Prisma ORM + sanitization
- **XSS Prevention**: Input sanitization + CSP headers
- **CSRF Protection**: SameSite cookies
- **Rate Limiting**: Per-IP and per-user limits
- **HTTPS**: Required in production
- **CORS**: Restricted to allowed origins

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Specification](docs/api-specification.yaml)** - OpenAPI 3.0.3 specification for all API endpoints
  - Use with Swagger UI at `/api-docs`
  - Import into Postman for API testing
  - Generate API clients for multiple languages
  
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System architecture and design decisions
  - High-level architecture diagram
  - Component breakdown
  - Data flow diagrams
  - Technology decisions
  - Security architecture
  - Scalability considerations
  
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment runbooks
  - Frontend deployment (Vercel)
  - Backend deployment (Railway)
  - Database setup (PostgreSQL)
  - Mobile app deployment (Android & iOS)
  - Custom domain configuration
  - Environment variables setup
  - Rollback procedures
  
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues and solutions
  - Quick diagnostics
  - Backend issues
  - Frontend issues
  - Database issues
  - Authentication issues
  - Performance issues
  - Debugging tools
  - FAQ

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow Airbnb TypeScript style guide
- **Frontend**: Follow Airbnb React/JSX style guide
- **Commits**: Use conventional commits (feat, fix, docs, style, refactor, test, chore)
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html) - Cross-platform development

## 📞 Support

For support, email <support@example.com> or open an issue on GitHub.

---

**Built with ❤️ for developers by developers**
