# Backend Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account (https://railway.app)
- Railway CLI installed (optional): `npm i -g @railway/cli`
- PostgreSQL database on Railway or external provider
- GitHub repository (for automatic deployments)

### Deployment Steps

#### 1. Create Railway Project

**Via Railway Dashboard:**
1. Go to https://railway.app/new
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the repository: `top-programs-guide`
6. Select root directory: `/backend`

**Via Railway CLI:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link to project
railway link
```

#### 2. Add PostgreSQL Database

1. In Railway Dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway automatically provisions a PostgreSQL instance
3. Note the connection details (or use Railway's DATABASE_URL)

#### 3. Configure Environment Variables

In Railway Dashboard → Variables, add:

```env
# Database (Railway auto-generates DATABASE_URL)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Admin Registration
ADMIN_REGISTRATION_SECRET=your-admin-secret-key

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://www.top-programs-guide.com,https://top-programs-guide.com

# Environment
NODE_ENV=production
PORT=3001
```

**Generate secure secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ADMIN_REGISTRATION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. Deploy

**Automatic Deployment (GitHub):**
- Railway automatically deploys on push to `main` branch
- Monitor build logs in Railway Dashboard

**Manual Deployment (CLI):**
```bash
railway up
```

#### 5. Run Database Migrations

**Via Railway CLI:**
```bash
# Connect to Railway environment
railway run npx prisma migrate deploy

# Or open shell
railway shell
npx prisma migrate deploy
```

**Via Dockerfile:**
- Migrations run automatically on container startup (see CMD in Dockerfile)

#### 6. Verify Deployment

Test the health endpoint:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-17T12:00:00.000Z"
}
```

### Configuration Files

#### Dockerfile
Multi-stage build:
- **Builder stage**: Installs dependencies, generates Prisma Client, builds TypeScript
- **Production stage**: Minimal image with only production dependencies
- **Health check**: Monitors application health every 30s
- **Auto-migration**: Runs `prisma migrate deploy` on startup

#### railway.json
- Build configuration: Uses Dockerfile
- Deploy settings: Single replica, auto-restart on failure
- Health check: Monitors `/health` endpoint

#### .dockerignore
Excludes unnecessary files from Docker build (node_modules, tests, etc.)

### Database Management

#### View Database
```bash
# Open Prisma Studio
railway run npx prisma studio
```

#### Run Migrations
```bash
# Deploy pending migrations
railway run npx prisma migrate deploy

# Create new migration (development only)
railway run npx prisma migrate dev --name migration-name
```

#### Seed Database
```bash
# Run seed script
railway run npx prisma db seed
```

#### Backup Database
```bash
# Dump database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore from backup
railway run psql $DATABASE_URL < backup.sql
```

### Monitoring & Logs

#### View Logs
**Railway Dashboard:**
- Go to project → Deployments → Select deployment → Logs

**Railway CLI:**
```bash
railway logs
```

#### Metrics
Railway provides:
- CPU usage
- Memory usage
- Network I/O
- Deployment history
- Build times

### Custom Domain Setup

#### 1. Add Domain in Railway
1. Go to project Settings → Domains
2. Click "Add Domain"
3. Enter: `api.top-programs-guide.com`

#### 2. Configure DNS
Add CNAME record to your DNS provider:

```
Type: CNAME
Name: api
Value: [your-railway-domain].railway.app
TTL: 3600
```

#### 3. SSL Certificate
- Railway automatically provisions SSL
- Certificate auto-renews

### Environment-Specific Deployments

#### Staging Environment
1. Create separate Railway project: "top-programs-guide-backend-staging"
2. Use separate database
3. Set `NODE_ENV=staging`
4. Deploy from `develop` branch

#### Production Environment
- Deploy from `main` branch
- Use production database
- Set `NODE_ENV=production`
- Enable all security features

### Security Best Practices

#### Environment Variables
- Never commit `.env` files
- Use Railway's encrypted variable storage
- Rotate secrets regularly
- Use different secrets for staging/production

#### CORS Configuration
```typescript
// backend/src/app.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

#### Rate Limiting
Consider adding rate limiting middleware:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Database Scaling

#### Connection Pooling
Prisma manages connection pooling automatically. Configure if needed:

```env
DATABASE_URL="postgresql://user:password@host:port/db?connection_limit=10&pool_timeout=20"
```

#### Read Replicas
For high traffic, consider PostgreSQL read replicas:
1. Set up replica in Railway
2. Configure Prisma with read/write URLs

### Performance Optimization

#### Enable Compression
```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

#### Caching
Implement Redis caching for frequently accessed data:

```bash
# Add Redis database in Railway
railway add redis
```

### Troubleshooting

#### Build Fails
- Check build logs in Railway Dashboard
- Verify Dockerfile syntax
- Ensure all dependencies in package.json
- Test Docker build locally: `docker build -t backend .`

#### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check database is running
- Ensure Prisma schema matches database
- Run: `railway run npx prisma db push`

#### Migration Fails
- Check migration files for errors
- Verify database schema state
- Reset database (staging only): `railway run npx prisma migrate reset`

#### Application Crashes
- Check logs: `railway logs`
- Verify environment variables
- Check memory limits (Railway defaults to 512MB)
- Increase memory if needed in Railway settings

#### CORS Errors
- Verify ALLOWED_ORIGINS includes frontend URL
- Check protocol (http vs https)
- Ensure credentials: true if using cookies

### Rollback

#### Redeploy Previous Version
1. Go to Railway Dashboard → Deployments
2. Select stable deployment
3. Click "Redeploy"

#### Via CLI
```bash
# View deployments
railway status

# Rollback (not directly supported, redeploy from git commit)
git revert HEAD
git push origin main
```

### CI/CD Integration

Railway automatically deploys on:
- Push to main branch (production)
- Pull requests (preview deployments)

#### GitHub Actions (Optional)
Add tests before deployment:

```yaml
# .github/workflows/backend-deploy.yml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: echo "Railway auto-deploys on push"
```

### Cost Optimization

#### Hobby Plan
- Free tier: 500 hours/month
- Suitable for small apps
- Automatic sleep after inactivity

#### Pro Plan ($5/month)
- Unlimited hours
- Better performance
- No sleep mode
- Priority support

### Monitoring Integration

#### Sentry Error Tracking
```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

#### Health Checks
Railway monitors `/health` endpoint (configured in railway.json)

### Support Resources

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Prisma Docs: https://www.prisma.io/docs
- Railway Status: https://status.railway.app
