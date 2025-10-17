# Quick Start Guide: Full Stack Web and Mobile Application

**Feature**: 001-fullstack-web-mobile
**Date**: October 17, 2025
**Target**: Developers setting up the development environment

## Prerequisites

### System Requirements

- **OS**: Windows 11, macOS 12+, or Linux
- **Node.js**: v18.0.0 or later
- **npm/pnpm**: Latest stable version
- **PostgreSQL**: v14.0 or later
- **PHP**: 8.4.5 CLI
- **Java JDK**: 11 or 17
- **Android Studio**: Latest stable with Android SDK
- **Xcode**: 14+ (macOS only, for iOS development)
- **VS Code**: With recommended extensions

### Environment Setup

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Install PostgreSQL from [postgresql.org](https://postgresql.org)
3. Install PHP 8.4.5 from [php.net](https://php.net)
4. Install Java JDK from [adoptium.net](https://adoptium.net)
5. Install Android Studio from [developer.android.com](https://developer.android.com)
6. Install Xcode from Mac App Store (macOS only)

## Project Structure

```
top-programs-guide/
├── backend/                    # Node.js + Express API
│   ├── prisma/
│   ├── src/
│   └── package.json
├── frontend/                   # Next.js web application
│   ├── app/
│   ├── components/
│   └── package.json
├── php-web/                    # PHP landing page
│   ├── index.php
│   └── composer.json
├── mobile-app/                 # KMM mobile applications
│   ├── shared/
│   ├── androidApp/
│   └── iosApp/
└── README.md
```

## Backend Setup (Node.js + Express)

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb top10languages

# Or using psql
psql -U postgres -c "CREATE DATABASE top10languages;"
```

### 2. Backend Installation

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create `.env` file in `backend/` directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/top10languages"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_EXPIRES_IN="7d"
ADMIN_REGISTRATION_SECRET="your-admin-secret-change-this-in-production"
PORT=3001
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8080"

# Optional: Monitoring & Logging
SENTRY_DSN=""
LOG_LEVEL="info"
LOG_FORMAT="simple"
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate
# Or use npm script
npm run prisma:generate

# Run migrations
npx prisma migrate deploy
# Or use npm script
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

### 5. Start Backend Server

```bash
npm run dev
```

Server will start at `http://localhost:3001`

## Frontend Setup (Next.js)

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## PHP Landing Page Setup

### 1. Installation

```bash
cd php-web
# If using Composer for dependencies
composer install
```

### 2. Start PHP Server

```bash
# From php-web directory
php -S localhost:8000 -t public
```

Landing page will be available at `http://localhost:8000`

## Mobile App Setup (KMM)

### Prerequisites

- Android Studio with Kotlin plugin
- Xcode (macOS only)

### 1. Android App

```bash
cd mobile-app
# Open androidApp in Android Studio
# Build and run on device/emulator
```

### 2. iOS App (macOS only)

```bash
cd mobile-app
# Open iosApp.xcodeproj in Xcode
# Build and run on simulator/device
```

## Testing Setup

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### End-to-End Tests

```bash
cd frontend
npm run test:e2e
```

## Development Workflow

### 1. Start All Services

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: PHP Landing (optional)
cd php-web && php -S localhost:8000
```

### 2. Database Changes

```bash
cd backend
npx prisma studio  # Open Prisma Studio at http://localhost:5555
```

### 3. API Documentation

- OpenAPI spec: `specs/001-fullstack-web-mobile/contracts/languages-api.yaml`
- View with Swagger UI or similar tool

## Common Issues

### Database Connection

- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check user permissions

### Port Conflicts

- Backend: 3001
- Frontend: 3000
- PHP: 8000
- Prisma Studio: 5555

### Mobile Development

- Ensure Android SDK is properly configured
- For iOS: Xcode command line tools installed
- KMM requires Kotlin 1.9.0+

## Next Steps

1. **Explore the API**: Visit `http://localhost:3001/api/languages`
2. **View the Web App**: Open `http://localhost:3000`
3. **Check the Landing Page**: Visit `http://localhost:8000`
4. **Run Tests**: Execute test suites in each component
5. **Start Development**: Follow the implementation plan in `plan.md`

## Deployment

For production deployment:

- Backend: Railway, Render, or AWS App Runner
- Frontend: Vercel
- Database: Managed PostgreSQL (Neon, Supabase)
- PHP Landing: Traditional hosting or Heroku

See `specs/001-fullstack-web-mobile/plan.md` for detailed deployment instructions.
