# Troubleshooting Guide

Comprehensive guide for diagnosing and resolving common issues in the Top 10 Programming Languages Guide.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Backend Issues](#backend-issues)
3. [Frontend Issues](#frontend-issues)
4. [Database Issues](#database-issues)
5. [Authentication Issues](#authentication-issues)
6. [Performance Issues](#performance-issues)
7. [Deployment Issues](#deployment-issues)
8. [Mobile App Issues](#mobile-app-issues)
9. [Debugging Tools](#debugging-tools)
10. [FAQ](#faq)

---

## Quick Diagnostics

### Health Check Script

Run this script to quickly identify issues:

```bash
#!/bin/bash
# quick-diagnostic.sh

echo "🔍 Running diagnostics..."

# Check backend
echo "1️⃣ Backend API:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3333/api/health

# Check database connection
echo "2️⃣ Database:"
cd backend && npx prisma db execute --stdin <<< "SELECT 1;" && echo "✅ Connected" || echo "❌ Failed"

# Check frontend
echo "3️⃣ Frontend:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/

# Check dependencies
echo "4️⃣ Dependencies:"
cd backend && npm outdated
cd ../frontend && npm outdated

# Check logs
echo "5️⃣ Recent errors:"
cd backend && tail -n 20 logs/error.log 2>/dev/null || echo "No error log found"

echo "✅ Diagnostics complete!"
```

### System Requirements Check

```bash
# Node.js version
node --version  # Should be v18.x or higher

# npm version
npm --version   # Should be 9.x or higher

# PostgreSQL (if local)
psql --version  # Should be 14.x or higher

# Check ports
lsof -i :3000   # Frontend port
lsof -i :3001   # Backend port
lsof -i :5432   # PostgreSQL port
```

---

## Backend Issues

### Issue: Backend Won't Start

**Symptoms:**

```
Error: Cannot find module '@prisma/client'
Error: listen EADDRINUSE: address already in use :::3001
```

**Diagnosis:**

```bash
cd backend

# Check if Prisma client is generated
ls node_modules/.prisma/client

# Check if port is in use
lsof -i :3001

# Check environment variables
cat .env
```

**Solutions:**

1. **Missing Prisma client:**

   ```bash
   npx prisma generate
   npm install
   ```

2. **Port already in use:**

   ```bash
   # Find and kill process
   lsof -ti :3001 | xargs kill -9
   
   # Or use different port
   PORT=3002 npm run dev
   ```

3. **Missing environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with correct values
   ```

### Issue: Database Connection Failed

**Symptoms:**

```
PrismaClientInitializationError: Can't reach database server
Error: P1001: Can't reach database server at `localhost:5432`
```

**Diagnosis:**

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection manually
psql "postgresql://user:password@localhost:5432/dbname"
```

**Solutions:**

1. **PostgreSQL not running:**

   ```bash
   # macOS
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows (via Laragon)
   # Start PostgreSQL from Laragon control panel
   ```

2. **Wrong DATABASE_URL:**

   ```env
   # Correct format:
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   
   # For Railway (production):
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

3. **Database doesn't exist:**

   ```bash
   # Create database
   psql -U postgres
   CREATE DATABASE top_programs_guide;
   
   # Run migrations
   npx prisma migrate deploy
   ```

### Issue: API Returns 500 Internal Server Error

**Symptoms:**

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

**Diagnosis:**

```bash
# Check error logs
tail -f backend/logs/error.log

# Check Sentry (if configured)
# Go to Sentry dashboard → Issues

# Enable debug logging
DEBUG=* npm run dev
```

**Solutions:**

1. **Database query error:**

   ```bash
   # Check database schema
   npx prisma studio
   
   # Verify migrations
   npx prisma migrate status
   
   # Reset database (⚠️ DEVELOPMENT ONLY)
   npx prisma migrate reset
   ```

2. **Middleware error:**

   ```javascript
   // Check middleware order in app.ts
   // Correct order:
   app.use(helmet())
   app.use(cors())
   app.use(express.json())
   app.use(rateLimiter)
   app.use('/api', routes)
   app.use(errorHandler)  // Must be last!
   ```

3. **Unhandled promise rejection:**

   ```javascript
   // Add try-catch in async controllers
   export const getLanguages = async (req, res, next) => {
     try {
       const languages = await prisma.programmingLanguage.findMany()
       res.json({ success: true, data: languages })
     } catch (error) {
       next(error)  // Pass to error handler
     }
   }
   ```

### Issue: Rate Limiting Not Working

**Symptoms:**

- Client can make unlimited requests
- No 429 status codes returned

**Diagnosis:**

```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:3001/api/languages; done

# Check if rate limiter is applied
grep -r "rateLimiter" backend/src/app.ts
```

**Solutions:**

1. **Rate limiter not applied:**

   ```typescript
   // app.ts
   import { apiLimiter, authLimiter, readLimiter } from './middleware/rateLimiter'
   
   app.use('/api/languages', readLimiter)
   app.use('/api/auth', authLimiter)
   app.use('/api', apiLimiter)
   ```

2. **Redis not configured (if using redis-store):**

   ```bash
   # Switch to memory store for development
   # In rateLimiter.ts, use default memory store
   ```

---

## Frontend Issues

### Issue: Frontend Won't Start

**Symptoms:**

```
Error: Cannot find module 'next'
Port 3000 is already in use
```

**Solutions:**

1. **Missing dependencies:**

   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port conflict:**

   ```bash
   # Kill process on port 3000
   lsof -ti :3000 | xargs kill -9
   
   # Or use different port
   PORT=3001 npm run dev
   ```

3. **Next.js cache issues:**

   ```bash
   rm -rf .next
   npm run dev
   ```

### Issue: API Calls Failing from Frontend

**Symptoms:**

```
CORS error: Access to fetch at 'http://localhost:3001/api/languages' 
from origin 'http://localhost:3000' has been blocked
```

**Diagnosis:**

```javascript
// Check browser console (F12)
// Look for CORS or network errors

// Check Network tab → Failed request → Headers
// Look for Access-Control-Allow-Origin header
```

**Solutions:**

1. **CORS not configured:**

   ```typescript
   // backend/src/app.ts
   import cors from 'cors'
   
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
     credentials: true
   }))
   ```

2. **Wrong API URL:**

   ```env
   # frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # Restart frontend after changing env
   ```

3. **Backend not running:**

   ```bash
   cd backend
   npm run dev
   ```

### Issue: Images Not Loading

**Symptoms:**

```
Failed to load resource: net::ERR_FILE_NOT_FOUND
GET http://localhost:3000/logos/python.svg 404
```

**Solutions:**

1. **Images in wrong directory:**

   ```bash
   # Images must be in frontend/public/
   mv frontend/logos frontend/public/logos
   ```

2. **Wrong image path:**

   ```typescript
   // Correct path (without /public prefix)
   <img src="/logos/python.svg" alt="Python" />
   
   // Or use Next.js Image component
   import Image from 'next/image'
   <Image src="/logos/python.svg" alt="Python" width={48} height={48} />
   ```

3. **CORS blocking external images:**

   ```javascript
   // next.config.js
   module.exports = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: '**.example.com',
         },
       ],
     },
   }
   ```

### Issue: Dark Mode Not Working

**Symptoms:**

- Theme toggle button doesn't change theme
- Theme resets on page refresh

**Solutions:**

1. **localStorage not persisting:**

   ```typescript
   // Check if localStorage is accessible
   console.log(localStorage.getItem('theme'))
   
   // Ensure theme is saved on toggle
   const toggleTheme = () => {
     const newTheme = theme === 'dark' ? 'light' : 'dark'
     setTheme(newTheme)
     localStorage.setItem('theme', newTheme)
     document.documentElement.classList.toggle('dark')
   }
   ```

2. **SSR hydration mismatch:**

   ```typescript
   // Use useEffect to set initial theme
   useEffect(() => {
     const savedTheme = localStorage.getItem('theme') || 'light'
     setTheme(savedTheme)
     if (savedTheme === 'dark') {
       document.documentElement.classList.add('dark')
     }
   }, [])
   ```

---

## Database Issues

### Issue: Migrations Failing

**Symptoms:**

```
Error: P3009: migrate found failed migrations
Migration `20251017_add_user_auth` failed
```

**Diagnosis:**

```bash
cd backend

# Check migration status
npx prisma migrate status

# Check database state
npx prisma db execute --stdin <<< "SELECT * FROM _prisma_migrations;"
```

**Solutions:**

1. **Resolve failed migration:**

   ```bash
   # Mark migration as rolled back
   npx prisma migrate resolve --rolled-back 20251017_add_user_auth
   
   # Re-run migration
   npx prisma migrate deploy
   ```

2. **Reset database (⚠️ DEVELOPMENT ONLY):**

   ```bash
   npx prisma migrate reset
   npx prisma db seed
   ```

3. **Manual database fix:**

   ```bash
   # Connect to database
   psql $DATABASE_URL
   
   # Check tables
   \dt
   
   # Fix manually, then mark migration as applied
   npx prisma migrate resolve --applied 20251017_add_user_auth
   ```

### Issue: Slow Database Queries

**Symptoms:**

- API responses taking >1 second
- High database CPU usage

**Diagnosis:**

```bash
# Enable query logging in Prisma
# prisma/client.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

# Check slow queries in PostgreSQL
psql $DATABASE_URL
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

**Solutions:**

1. **Missing indexes:**

   ```prisma
   // schema.prisma
   model ProgrammingLanguage {
     id        String   @id @default(cuid())
     name      String   @unique
     // Add index to frequently queried fields
     popularity Int    @default(0)
     
     @@index([popularity])
     @@index([name])
   }
   ```

   ```bash
   # Generate and apply migration
   npx prisma migrate dev --name add_indexes
   ```

2. **N+1 query problem:**

   ```typescript
   // Bad: N+1 queries
   const users = await prisma.user.findMany()
   for (const user of users) {
     const languages = await prisma.programmingLanguage.findMany({
       where: { userId: user.id }
     })
   }
   
   // Good: Single query with include
   const users = await prisma.user.findMany({
     include: {
       languages: true
     }
   })
   ```

3. **Large result sets:**

   ```typescript
   // Add pagination
   const languages = await prisma.programmingLanguage.findMany({
     skip: (page - 1) * limit,
     take: limit,
   })
   ```

### Issue: Database Connection Pool Exhausted

**Symptoms:**

```
PrismaClientKnownRequestError: P2024
Error: Timed out fetching a new connection from the pool
```

**Solutions:**

1. **Increase connection pool size:**

   ```env
   # .env
   DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"
   ```

2. **Close connections properly:**

   ```typescript
   // Ensure Prisma client is disconnected on shutdown
   process.on('beforeExit', async () => {
     await prisma.$disconnect()
   })
   ```

3. **Reduce query timeout:**

   ```typescript
   const result = await prisma.programmingLanguage.findMany({
     // Add timeout
     timeout: 5000,
   })
   ```

---

## Authentication Issues

### Issue: JWT Token Invalid

**Symptoms:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**Diagnosis:**

```bash
# Check JWT secret is set
echo $JWT_SECRET

# Decode JWT token (use jwt.io)
# Check expiration, signature, payload
```

**Solutions:**

1. **Token expired:**

   ```typescript
   // Client should refresh token
   const response = await fetch('/api/auth/refresh', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ refreshToken })
   })
   ```

2. **Wrong JWT secret:**

   ```env
   # Ensure JWT_SECRET matches between dev and prod
   # Generate new secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Token not included in request:**

   ```typescript
   // Correct authorization header
   const response = await fetch('/api/languages', {
     headers: {
       'Authorization': `Bearer ${accessToken}`
     }
   })
   ```

### Issue: Login Always Returns 401

**Symptoms:**

- Correct credentials return "Invalid credentials"
- bcrypt comparison failing

**Diagnosis:**

```bash
# Check user exists in database
npx prisma studio
# Look for user in User table

# Test password hashing
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('password123', 10))"
```

**Solutions:**

1. **Password not hashed in database:**

   ```typescript
   // Ensure password is hashed on registration
   import bcrypt from 'bcrypt'
   
   const hashedPassword = await bcrypt.hash(password, 10)
   await prisma.user.create({
     data: {
       email,
       password: hashedPassword  // Not plain text!
     }
   })
   ```

2. **bcrypt rounds mismatch:**

   ```typescript
   // Use consistent salt rounds (10 is standard)
   const hashedPassword = await bcrypt.hash(password, 10)
   const isValid = await bcrypt.compare(password, user.password)
   ```

---

## Performance Issues

### Issue: Slow API Response Times

**Symptoms:**

- API calls taking >1 second
- High server CPU/memory usage

**Diagnosis:**

```bash
# Measure API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/languages

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_total:  %{time_total}\n

# Check server resources
top  # CPU/memory usage
```

**Solutions:**

1. **Add database indexes** (see Database Issues)

2. **Enable response compression:**

   ```typescript
   // app.ts
   import compression from 'compression'
   app.use(compression())
   ```

3. **Add caching:**

   ```typescript
   // Cache API responses
   import NodeCache from 'node-cache'
   const cache = new NodeCache({ stdTTL: 300 })  // 5 minutes
   
   export const getLanguages = async (req, res) => {
     const cacheKey = 'languages_all'
     const cached = cache.get(cacheKey)
     if (cached) {
       return res.json(cached)
     }
     
     const languages = await prisma.programmingLanguage.findMany()
     cache.set(cacheKey, languages)
     res.json({ success: true, data: languages })
   }
   ```

4. **Optimize database queries:**

   ```typescript
   // Select only needed fields
   const languages = await prisma.programmingLanguage.findMany({
     select: {
       id: true,
       name: true,
       description: true,
       // Don't select large fields if not needed
     }
   })
   ```

### Issue: Frontend Loads Slowly

**Symptoms:**

- Lighthouse score <90
- Large bundle size
- Slow Time to Interactive (TTI)

**Diagnosis:**

```bash
# Check bundle size
cd frontend
npm run build
# Look at .next/static bundle sizes

# Run Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

**Solutions:**

1. **Optimize images:**

   ```typescript
   // Use Next.js Image component
   import Image from 'next/image'
   
   <Image
     src="/logos/python.svg"
     alt="Python"
     width={48}
     height={48}
     loading="lazy"  // Lazy load
   />
   ```

2. **Code splitting:**

   ```typescript
   // Dynamic imports
   import dynamic from 'next/dynamic'
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
     ssr: false  // Client-side only
   })
   ```

3. **Reduce bundle size:**

   ```bash
   # Analyze bundle
   npm run build -- --analyze
   
   # Remove unused dependencies
   npm uninstall unused-package
   
   # Use tree shaking
   # Import only what you need
   import { Button } from '@/components/ui/button'  // Good
   import * as UI from '@/components/ui'            // Bad
   ```

---

## Deployment Issues

### Issue: Vercel Build Failing

**Symptoms:**

```
Error: Command "npm run build" exited with 1
Type error: Cannot find module 'next'
```

**Solutions:**

1. **Check build logs:**
   - Go to Vercel dashboard → Deployments → Failed build
   - Read error message carefully

2. **Missing environment variables:**

   ```bash
   # Add in Vercel dashboard → Settings → Environment Variables
   NEXT_PUBLIC_API_URL=https://api.yoursite.com
   ```

3. **TypeScript errors:**

   ```bash
   # Fix locally first
   cd frontend
   npm run build
   # Fix all TypeScript errors before deploying
   ```

4. **Out of memory:**

   ```json
   // package.json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }
   ```

### Issue: Railway Deployment Failing

**Symptoms:**

```
Error: Build failed
Error: Unable to find image 'railway/nixpacks:latest' locally
```

**Solutions:**

1. **Check Railway logs:**

   ```bash
   railway logs --service backend
   ```

2. **Database connection issue:**

   ```env
   # Ensure DATABASE_URL is set correctly
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

3. **Build command incorrect:**

   ```json
   // railway.json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm install && npm run build"
     }
   }
   ```

4. **Start command incorrect:**

   ```json
   {
     "deploy": {
       "startCommand": "npm start"
     }
   }
   ```

---

## Mobile App Issues

### Issue: Android Build Failing

**Symptoms:**

```
Execution failed for task ':androidApp:compileReleaseKotlin'
AAPT: error: resource drawable/logo not found
```

**Solutions:**

1. **Missing resources:**

   ```bash
   # Ensure all drawables are in correct directory
   ls androidApp/src/main/res/drawable/
   ```

2. **Gradle sync issues:**

   ```bash
   cd mobile-app
   ./gradlew clean
   ./gradlew build
   ```

3. **Kotlin version mismatch:**

   ```kotlin
   // build.gradle.kts (project level)
   plugins {
     kotlin("multiplatform") version "1.9.20"
   }
   ```

### Issue: iOS Build Failing

**Symptoms:**

```
error: Signing for "iosApp" requires a development team
error: Unable to resolve build file: XCBCore.BuildFile
```

**Solutions:**

1. **Code signing:**
   - Open Xcode → Signing & Capabilities
   - Select Team
   - Enable "Automatically manage signing"

2. **Clean build:**

   ```bash
   cd mobile-app/iosApp
   rm -rf build/
   xcodebuild clean
   ```

3. **Cocoapods issues:**

   ```bash
   cd iosApp
   pod deintegrate
   pod install
   ```

---

## Debugging Tools

### Backend Debugging

**Winston Logs:**

```bash
# View all logs
tail -f backend/logs/combined.log

# View errors only
tail -f backend/logs/error.log

# Search logs
grep "ERROR" backend/logs/combined.log
```

**Sentry:**

```bash
# View errors in Sentry dashboard
# https://sentry.io/organizations/your-org/issues/

# Filter by:
# - Environment (dev/production)
# - Time period
# - Error type
```

**Prisma Studio:**

```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
# View and edit database records visually
```

### Frontend Debugging

**React DevTools:**

- Install browser extension
- Inspect component tree
- View props and state

**Network Tab:**

- Open DevTools (F12) → Network
- Filter by XHR/Fetch
- Check request/response headers and body

**Console Logging:**

```typescript
// Add debug logging
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Response:', response)

// Use debugger
debugger;  // Pauses execution
```

### Database Debugging

**Query Logging:**

```typescript
// prisma/client.ts
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

**PostgreSQL Logs:**

```bash
# Find PostgreSQL log file
psql -U postgres -c "SHOW log_directory;"
psql -U postgres -c "SHOW log_filename;"

# View logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## FAQ

### Q: How do I reset the database?

**A:** ⚠️ **DEVELOPMENT ONLY** - This deletes all data!

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Q: How do I add a new API endpoint?

**A:**

```typescript
// 1. Create controller (backend/src/controllers/myController.ts)
export const myHandler = async (req, res) => {
  res.json({ success: true, data: 'Hello' })
}

// 2. Create route (backend/src/routes/myRoutes.ts)
import { Router } from 'express'
import { myHandler } from '../controllers/myController'

const router = Router()
router.get('/', myHandler)
export default router

// 3. Mount route (backend/src/app.ts)
import myRoutes from './routes/myRoutes'
app.use('/api/my-endpoint', myRoutes)
```

### Q: How do I update dependencies safely?

**A:**

```bash
# Check for outdated packages
npm outdated

# Update non-breaking changes
npm update

# Update major versions (review breaking changes first!)
npm install package@latest

# Test thoroughly after updates
npm test
npm run build
```

### Q: How do I enable HTTPS locally?

**A:**

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update app.ts
import https from 'https'
import fs from 'fs'

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

https.createServer(options, app).listen(3001)
```

### Q: How do I debug "Module not found" errors?

**A:**

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check import paths (TypeScript)
# Use absolute imports with @ alias
import { Button } from '@/components/ui/button'  # ✅ Good
import { Button } from '../../../components/ui/button'  # ❌ Bad

# Restart TypeScript server (VS Code)
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Q: How do I test rate limiting locally?

**A:**

```bash
# Send multiple requests quickly
for i in {1..15}; do 
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/languages
done

# Expected output:
# 200 (1-10 times)
# 429 (11-15 times - rate limited)
```

### Q: How do I backup production database?

**A:**

```bash
# Railway
railway run pg_dump $DATABASE_URL > backup.sql

# Restore
railway run psql $DATABASE_URL < backup.sql
```

### Q: What to do when "Address already in use"?

**A:**

```bash
# Find process using port 3000/3001
lsof -i :3000

# Kill process
kill -9 <PID>

# Or kill all node processes
pkill -9 node
```

---

**Need More Help?**

- Check [GitHub Issues](https://github.com/yourrepo/issues)
- Review [API Documentation](./api-specification.yaml)
- Consult [Architecture Guide](./ARCHITECTURE.md)
- Read [Deployment Guide](./DEPLOYMENT.md)

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
