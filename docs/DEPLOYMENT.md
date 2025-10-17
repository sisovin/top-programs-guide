# Deployment Runbooks

Comprehensive step-by-step guides for deploying all components of the Top 10 Programming Languages Guide.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Database Setup (PostgreSQL)](#database-setup-postgresql)
5. [Mobile App Deployment](#mobile-app-deployment)
6. [PHP Landing Page Deployment](#php-landing-page-deployment)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)
9. [Environment Configuration](#environment-configuration)

---

## Prerequisites

### Required Accounts

- [ ] GitHub account (for repository)
- [ ] Vercel account (frontend hosting)
- [ ] Railway account (backend + database)
- [ ] Google Play Console (Android)
- [ ] Apple Developer Program (iOS)
- [ ] Domain registrar (optional custom domain)

### Required Tools

```bash
# Check installed versions
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
git --version
docker --version  # Optional, for local testing
```

### Environment Variables Setup

Prepare the following secrets before deployment:

**Backend (.env)**

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-key-minimum-32-characters"
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.vercel.app"
PORT="3001"
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL="https://your-backend-domain.railway.app"
NEXT_PUBLIC_SENTRY_DSN="https://your-frontend-sentry-dsn@sentry.io/project-id"
```

---

## Frontend Deployment (Vercel)

### Initial Setup

#### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Choose **frontend** directory as root

#### Step 2: Configure Build Settings

```yaml
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x
```

#### Step 3: Set Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app` | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...` | Production |

#### Step 4: Deploy

```bash
# Option A: Automatic deployment (Git push)
git add .
git commit -m "Deploy frontend to production"
git push origin main

# Option B: Manual deployment via Vercel CLI
cd frontend
npm install -g vercel
vercel --prod
```

### Custom Domain Setup

#### Step 1: Add Domain in Vercel

1. Project Settings → Domains
2. Add your domain: `www.yoursite.com`
3. Copy DNS records provided by Vercel

#### Step 2: Configure DNS

At your domain registrar (Namecheap, GoDaddy, etc.):

```dns
Type    Name    Value                           TTL
A       @       76.76.21.21                     3600
CNAME   www     cname.vercel-dns.com            3600
```

#### Step 3: Verify SSL

- SSL certificate is automatically provisioned
- Wait 5-10 minutes for DNS propagation
- Check HTTPS: `https://www.yoursite.com`

### Deployment Verification

```bash
# Check deployment status
curl -I https://your-site.vercel.app

# Expected response:
# HTTP/2 200
# content-type: text/html
# x-vercel-id: ...

# Test API connectivity
curl https://your-site.vercel.app/api/health
```

### Vercel Configuration Files

**vercel.json** (already in `frontend/`):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Backend Deployment (Railway)

### Initial Setup

#### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize GitHub access
5. Select your repository

#### Step 2: Configure Service

```yaml
Service Name: top-programs-guide-backend
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Port: 3001
```

#### Step 3: Set Environment Variables

In Railway dashboard → Variables tab:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-characters
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=3001
```

**Important**: Use Railway's built-in `${{Postgres.DATABASE_URL}}` variable reference.

#### Step 4: Deploy

```bash
# Automatic deployment
git push origin main

# Railway will automatically:
# 1. Detect changes in backend/
# 2. Build Docker container
# 3. Run npm install
# 4. Execute npm start
# 5. Expose service on Railway domain
```

### Database Migration

#### Step 1: Run Migrations via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd backend
railway link

# Run migrations
railway run npx prisma migrate deploy
```

#### Step 2: Seed Database (First Time Only)

```bash
railway run npx prisma db seed
```

### Custom Domain Setup

#### Step 1: Add Domain in Railway

1. Service Settings → Domains
2. Click **"Custom Domain"**
3. Enter: `api.yoursite.com`

#### Step 2: Configure DNS

Add CNAME record at your DNS provider:

```dns
Type    Name    Value                           TTL
CNAME   api     your-service.railway.app        3600
```

#### Step 3: Verify SSL

- Railway automatically provisions SSL via Let's Encrypt
- Wait 5-10 minutes for DNS propagation
- Test: `https://api.yoursite.com/api/health`

### railway.json Configuration

**backend/railway.json** (already created):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Monitoring & Logs

```bash
# View live logs
railway logs

# View specific service logs
railway logs --service backend

# Stream logs in real-time
railway logs --follow
```

---

## Database Setup (PostgreSQL)

### Railway PostgreSQL

#### Step 1: Add PostgreSQL Service

1. Railway Project → **"New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway provisions database automatically

#### Step 2: Connect to Backend

Railway automatically creates `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://user:pass@host:5432/railway
```

Reference it in backend service:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

#### Step 3: Initialize Database

```bash
# Connect via Railway CLI
railway connect Postgres

# Or use Prisma Studio
railway run npx prisma studio
```

### Database Migrations

#### Development → Production Migration Path

**Step 1: Generate Migration (Local)**

```bash
cd backend
npm run db:migrate -- --name add_new_feature
```

**Step 2: Commit Migration Files**

```bash
git add prisma/migrations/
git commit -m "Add database migration: add_new_feature"
git push origin main
```

**Step 3: Deploy Migration (Railway)**

```bash
railway run npx prisma migrate deploy
```

**Step 4: Verify Migration**

```bash
railway run npx prisma migrate status
```

### Backup Strategy

#### Automated Backups (Railway)

- Railway automatically backs up PostgreSQL daily
- Retention: 7 days on free tier, 30 days on paid plans

#### Manual Backup

```bash
# Export database
railway run pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Import database (if needed)
railway run psql $DATABASE_URL < backup-20251017.sql
```

---

## Mobile App Deployment

### Android Deployment (Google Play Store)

#### Prerequisites

- [ ] Google Play Console account ($25 one-time fee)
- [ ] Keystore file for signing APK/AAB
- [ ] Privacy policy URL
- [ ] App icons (512x512, 1024x500)
- [ ] Screenshots (phone, tablet)

#### Step 1: Build Release APK

```bash
cd mobile-app

# Generate signing key (first time only)
keytool -genkey -v -keystore release-key.jks \
  -alias top-programs-guide \
  -keyalg RSA -keysize 2048 -validity 10000

# Build release
./gradlew :androidApp:assembleRelease

# Output: androidApp/build/outputs/apk/release/androidApp-release.apk
```

#### Step 2: Create App Bundle (AAB)

```bash
# Recommended format for Play Store
./gradlew :androidApp:bundleRelease

# Output: androidApp/build/outputs/bundle/release/androidApp-release.aab
```

#### Step 3: Upload to Google Play Console

1. Go to [Play Console](https://play.google.com/console)
2. Create new app:
   - **App name**: Top 10 Programming Languages
   - **Default language**: English (US)
   - **App type**: App
   - **Category**: Education / Reference
   - **Free/Paid**: Free
3. Complete store listing:
   - **Short description**: Compare top programming languages with salary data, use cases, and career paths
   - **Full description**: (Use README.md description)
   - **App icon**: Upload 512x512 PNG
   - **Feature graphic**: Upload 1024x500 PNG
   - **Screenshots**: Upload at least 2 phone screenshots
4. Content rating questionnaire:
   - Select "Education / Reference"
   - Answer questions truthfully
5. Upload AAB:
   - Production → Create new release
   - Upload `androidApp-release.aab`
   - Add release notes
6. Review and rollout

#### Step 4: Phased Rollout (Recommended)

```
Day 1: 10% of users
Day 3: 25% of users
Day 5: 50% of users
Day 7: 100% of users
```

### iOS Deployment (Apple App Store)

#### Prerequisites

- [ ] Apple Developer Program membership ($99/year)
- [ ] Xcode 15+ on macOS
- [ ] App Store Connect account
- [ ] App icons (1024x1024)
- [ ] Screenshots (various iOS device sizes)

#### Step 1: Configure App in Xcode

```bash
cd mobile-app/iosApp
open iosApp.xcodeproj
```

In Xcode:

1. Select project → General
2. **Bundle Identifier**: `com.yourcompany.topprogramsguide`
3. **Version**: `1.0.0`
4. **Build**: `1`
5. **Deployment Target**: iOS 15.0+

#### Step 2: Configure Signing & Capabilities

1. Signing & Capabilities tab
2. Check **"Automatically manage signing"**
3. Select your **Team**
4. Xcode generates provisioning profile

#### Step 3: Build Archive

```bash
# In Xcode:
# 1. Select "Any iOS Device (arm64)" as destination
# 2. Product → Archive
# 3. Wait for build to complete (~5-10 minutes)
```

#### Step 4: Upload to App Store Connect

1. After archive completes, **Organizer** window opens
2. Select your archive
3. Click **"Distribute App"**
4. Select **"App Store Connect"**
5. Click **"Upload"**
6. Xcode validates and uploads (~10 minutes)

#### Step 5: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → **"+"** → New App
3. Fill details:
   - **Name**: Top 10 Programming Languages
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select from dropdown
   - **SKU**: unique identifier (e.g., TPG-001)
4. App Information:
   - **Category**: Education / Reference
   - **Privacy Policy URL**: <https://yoursite.com/privacy>
5. Pricing and Availability:
   - **Price**: Free
   - **Availability**: All countries
6. App Store screenshots (upload for each size):
   - iPhone 6.7" (required)
   - iPhone 6.5" (required)
   - iPad Pro 12.9" (recommended)
7. App Review Information:
   - Contact email
   - Phone number
   - Demo account (if applicable)
8. Version Information:
   - Upload uploaded build from Step 4
   - Add release notes
9. Submit for Review

#### Step 6: Wait for Review

- Typical review time: 24-48 hours
- Check email for status updates
- Respond promptly to rejection feedback

### Kotlin Multiplatform Build Commands

```bash
# Build both platforms
./gradlew build

# Android only
./gradlew :androidApp:assembleRelease

# iOS only (macOS only)
./gradlew :iosApp:build

# Run tests
./gradlew :shared:test

# Check for updates
./gradlew dependencyUpdates
```

---

## PHP Landing Page Deployment

### Apache/Nginx Setup

#### Option A: Shared Hosting (cPanel)

1. Upload `php-web/` contents via FTP/SFTP
2. Place files in `public_html/`
3. Ensure `.htaccess` is present (for Apache)
4. Verify PHP version (8.4+ required)

#### Option B: VPS (Ubuntu + Nginx)

**Step 1: Install Dependencies**

```bash
sudo apt update
sudo apt install nginx php8.4-fpm php8.4-cli composer -y
```

**Step 2: Configure Nginx**

```nginx
# /etc/nginx/sites-available/top-programs-guide
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;
    root /var/www/top-programs-guide/php-web/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

**Step 3: Enable Site**

```bash
sudo ln -s /etc/nginx/sites-available/top-programs-guide \
            /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Step 4: Deploy Files**

```bash
cd /var/www
sudo git clone https://github.com/youruser/top-programs-guide.git
cd top-programs-guide/php-web
composer install --no-dev
sudo chown -R www-data:www-data /var/www/top-programs-guide
```

**Step 5: Setup SSL (Let's Encrypt)**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yoursite.com -d www.yoursite.com
```

### Verify PHP Deployment

```bash
# Check PHP version
php -v

# Test PHP configuration
php -i | grep php.ini

# Verify web server
curl -I http://yoursite.com

# Expected:
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=UTF-8
```

---

## Post-Deployment Verification

### Automated Health Checks

Create a script to verify all services:

```bash
#!/bin/bash
# deploy-verify.sh

echo "🔍 Verifying deployment..."

# Frontend
echo "✅ Frontend (Vercel):"
curl -f https://your-frontend.vercel.app/ || echo "❌ Frontend DOWN"

# Backend API
echo "✅ Backend API (Railway):"
curl -f https://api.yoursite.com/api/health || echo "❌ Backend DOWN"

# Database
echo "✅ Database:"
curl -f https://api.yoursite.com/api/languages?limit=1 || echo "❌ Database DOWN"

# PHP Landing
echo "✅ PHP Landing:"
curl -f https://yoursite.com/ || echo "❌ PHP DOWN"

echo "✅ Deployment verification complete!"
```

### Manual Testing Checklist

- [ ] **Frontend loads without errors**
  - [ ] Homepage displays language cards
  - [ ] Navigation works
  - [ ] Dark/light theme toggle works
  - [ ] No console errors
  
- [ ] **API endpoints respond correctly**
  - [ ] `GET /api/languages` returns 200
  - [ ] `POST /api/auth/login` accepts credentials
  - [ ] Rate limiting works (test with burst requests)
  - [ ] Error responses are formatted correctly
  
- [ ] **Database is accessible**
  - [ ] Prisma Studio connects (if exposed)
  - [ ] Seed data is present (10 languages)
  - [ ] Queries return expected results
  
- [ ] **Mobile apps work (if deployed)**
  - [ ] Android app installs and launches
  - [ ] iOS app installs and launches
  - [ ] API connectivity from mobile
  
- [ ] **Security checks**
  - [ ] HTTPS enabled on all domains
  - [ ] Security headers present (helmet)
  - [ ] CORS configured correctly
  - [ ] Rate limiting active
  
- [ ] **Performance checks**
  - [ ] Lighthouse score >90
  - [ ] API response time <500ms
  - [ ] Images optimized (WebP/AVIF)
  - [ ] Code splitting works

### Monitoring Setup

```bash
# Setup Sentry alerts
# 1. Go to Sentry dashboard
# 2. Project → Alerts
# 3. Create alert: "Error rate > 5% for 5 minutes"
# 4. Add notification: Email + Slack

# Setup Vercel analytics
# Already enabled by default

# Setup Railway metrics
# Railway → Project → Metrics
# Monitor CPU, memory, request rate
```

---

## Rollback Procedures

### Frontend Rollback (Vercel)

#### Instant Rollback

```bash
# Option A: Vercel Dashboard
# 1. Go to Deployments tab
# 2. Find previous working deployment
# 3. Click "..." → Promote to Production

# Option B: Vercel CLI
vercel rollback
```

#### Git Revert

```bash
cd frontend
git log --oneline  # Find commit to revert to
git revert <commit-hash>
git push origin main
# Vercel auto-deploys reverted version
```

### Backend Rollback (Railway)

#### Instant Rollback

```bash
# Railway Dashboard
# 1. Service → Deployments
# 2. Find previous deployment
# 3. Click "Redeploy"
```

#### Git Revert

```bash
cd backend
git revert <commit-hash>
git push origin main
```

#### Database Rollback

```bash
# ⚠️ DANGEROUS - Only if migration failed

# Restore from backup
railway run psql $DATABASE_URL < backup-20251017.sql

# Or revert migration
cd backend
railway run npx prisma migrate resolve --rolled-back <migration-name>
```

### Emergency Procedures

#### Complete System Down

```bash
# 1. Check status pages
# - Vercel: https://vercel-status.com
# - Railway: https://railway.app/status

# 2. Roll back all services to last known good state

# 3. Notify users via:
# - Status page
# - Social media
# - Email (if applicable)

# 4. Investigate logs
railway logs --service backend --since 1h
vercel logs

# 5. Fix issue and redeploy
```

---

## Environment Configuration

### Environment Variables Matrix

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/dev` | Railway injected | PostgreSQL connection |
| `JWT_SECRET` | `dev-secret-key` | Strong 32+ char secret | JWT signing key |
| `JWT_REFRESH_SECRET` | `dev-refresh-key` | Strong 32+ char secret | Refresh token key |
| `SENTRY_DSN` | Empty (optional) | `https://...@sentry.io/...` | Error tracking |
| `NODE_ENV` | `development` | `production` | Environment flag |
| `CORS_ORIGIN` | `http://localhost:3000` | `https://yoursite.com` | Allowed origins |
| `PORT` | `3001` | `3001` | Backend port |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | `https://api.yoursite.com` | Backend URL |

### Security Best Practices

1. **Never commit secrets to Git**

   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   *.jks
   *.p12
   ```

2. **Use strong secrets**

   ```bash
   # Generate strong JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Rotate secrets regularly**
   - JWT secrets: Every 3-6 months
   - Database passwords: Every 6-12 months
   - API keys: When compromised

4. **Use environment-specific configs**
   - Development: Local database, verbose logging
   - Staging: Staging database, moderate logging
   - Production: Production database, error-only logging

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common deployment issues and solutions.

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
