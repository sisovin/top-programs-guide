# Production Deployment Checklist

## Pre-Deployment

### Code Quality

- [ ] All TypeScript compilation errors resolved
- [ ] ESLint warnings addressed
- [ ] Unit tests passing (backend: `npm test`, frontend: `npm test`)
- [ ] Integration tests passing
- [ ] No console.log statements in production code
- [ ] Code reviewed and approved

### Security

- [ ] All environment variables using secure secrets
- [ ] JWT_SECRET is at least 64 characters
- [ ] ADMIN_REGISTRATION_SECRET is strong and unique
- [ ] No secrets committed to git (check .env files)
- [ ] CORS origins configured for production domains
- [ ] HTTPS enforced on all endpoints
- [ ] Security headers configured (helmet.js)
- [ ] Rate limiting implemented
- [ ] SQL injection protection verified (Prisma)
- [ ] XSS protection enabled

### Database

- [ ] Production database created and accessible
- [ ] Database migrations reviewed
- [ ] Migration tested on staging environment
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] Database credentials secured
- [ ] Seed data prepared (if needed)

### Environment Configuration

- [ ] .env.production.example updated with all variables
- [ ] Backend environment variables set in Railway
- [ ] Frontend environment variables set in Vercel
- [ ] API URLs pointing to production (no localhost)
- [ ] NODE_ENV set to "production"
- [ ] Logging level appropriate for production

### Dependencies

- [ ] All npm packages up to date
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Unused dependencies removed
- [ ] Package-lock.json committed
- [ ] Production dependencies separated from dev dependencies

## Backend Deployment (Railway)

### Railway Setup

- [ ] Railway account created
- [ ] Project created in Railway
- [ ] GitHub repository connected
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured
- [ ] Custom domain added (api.top-programs-guide.com)
- [ ] DNS CNAME record configured
- [ ] SSL certificate provisioned

### Deployment

- [ ] Dockerfile tested locally
- [ ] Docker build succeeds
- [ ] railway.json configured correctly
- [ ] .dockerignore configured
- [ ] Automatic deployments enabled
- [ ] Initial deployment successful
- [ ] Database migrations run (`prisma migrate deploy`)
- [ ] Seed data loaded (if applicable)
- [ ] Health check endpoint responding (/health)

### Verification

- [ ] API accessible via production URL
- [ ] CORS working with frontend domain
- [ ] Authentication endpoints working
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/refresh
  - [ ] POST /api/auth/register-admin
  - [ ] GET /api/auth/me
- [ ] Language endpoints working
  - [ ] GET /api/languages
  - [ ] GET /api/languages/:id
  - [ ] POST /api/languages (admin only)
  - [ ] PUT /api/languages/:id (admin only)
  - [ ] DELETE /api/languages/:id (admin only)
- [ ] Rate limiting functional
- [ ] Error responses appropriate (no stack traces)
- [ ] Logs accessible in Railway Dashboard

## Frontend Deployment (Vercel)

### Vercel Setup

- [ ] Vercel account created
- [ ] Project created in Vercel
- [ ] GitHub repository connected
- [ ] Build command configured: `npm run build`
- [ ] Output directory set: `.next`
- [ ] Node.js version specified: 18
- [ ] Environment variables configured
- [ ] Custom domain added (<www.top-programs-guide.com>)
- [ ] DNS records configured
- [ ] SSL certificate provisioned

### Deployment

- [ ] vercel.json configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] No build warnings (critical ones)
- [ ] Production deployment successful
- [ ] Automatic deployments enabled
- [ ] Preview deployments working for PRs

### Verification

- [ ] Site accessible via production URL
- [ ] All pages loading correctly
  - [ ] Home page (/)
  - [ ] Language list (/app or /)
  - [ ] Language detail (/language/[id])
  - [ ] Compare page (/compare)
  - [ ] Career paths (/career-paths)
  - [ ] Error pages (404, 500)
- [ ] API calls working (check browser console)
- [ ] Images loading correctly
- [ ] Responsive design working (mobile, tablet, desktop)
- [ ] Dark mode toggle functional (if enabled)
- [ ] Search functionality working
- [ ] Navigation working
- [ ] SEO meta tags present (view source)
- [ ] OpenGraph tags present
- [ ] Twitter Card tags present
- [ ] Structured data (Schema.org) present
- [ ] Favicon displaying
- [ ] Performance acceptable (Lighthouse score)

## PHP Landing Page

### Server Setup

- [ ] PHP 8+ installed
- [ ] Apache/Nginx configured
- [ ] .htaccess working (if Apache)
- [ ] mod_rewrite enabled
- [ ] SSL certificate installed

### Deployment

- [ ] index.php uploaded to server
- [ ] .htaccess configured
- [ ] robots.txt uploaded
- [ ] sitemap.xml uploaded
- [ ] Assets uploaded (images, favicon)
- [ ] Rewrite rules working (/app redirects)

### Verification

- [ ] Landing page accessible
- [ ] /app redirect working
- [ ] SEO meta tags present
- [ ] OpenGraph images loading
- [ ] Responsive design working
- [ ] Links functional
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible

## DNS & Domain Configuration

### DNS Records

- [ ] Root domain (@) pointing to landing page
- [ ] www subdomain pointing to Vercel
- [ ] api subdomain pointing to Railway
- [ ] DNS propagation complete (check dnschecker.org)
- [ ] TTL values appropriate

### SSL/TLS

- [ ] SSL certificates issued for all domains
- [ ] HTTPS redirect configured
- [ ] Mixed content issues resolved
- [ ] Certificate auto-renewal enabled

## Monitoring & Analytics

### Error Tracking

- [ ] Sentry configured (if using)
- [ ] Error notifications set up
- [ ] Source maps uploaded (frontend)
- [ ] Test error tracking works

### Analytics

- [ ] Google Analytics configured (if using)
- [ ] Vercel Analytics enabled
- [ ] Conversion tracking set up
- [ ] Privacy policy updated (if collecting data)

### Logging

- [ ] Backend logs accessible (Railway)
- [ ] Frontend logs accessible (Vercel)
- [ ] Log level appropriate (info/warn/error)
- [ ] Log retention configured

### Health Monitoring

- [ ] Uptime monitoring configured
- [ ] Health check endpoints monitored
- [ ] Alert notifications set up
- [ ] Status page created (optional)

## Performance

### Frontend

- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] Lighthouse Best Practices score > 90
- [ ] Lighthouse SEO score > 90
- [ ] Core Web Vitals passing
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Static assets cached

### Backend

- [ ] Response times < 500ms
- [ ] Database queries optimized
- [ ] Connection pooling configured
- [ ] Compression enabled
- [ ] Caching strategy implemented (if applicable)

## Testing

### Functional Testing

- [ ] All user flows tested end-to-end
- [ ] Authentication flows working
- [ ] CRUD operations working (admin)
- [ ] Search functionality working
- [ ] Filtering working
- [ ] Comparison feature working
- [ ] Error handling working

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing

- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] Small mobile (iPhone SE)

### Load Testing

- [ ] API can handle expected load
- [ ] Database performance acceptable
- [ ] No memory leaks
- [ ] Concurrent user testing (if applicable)

## Documentation

### User-Facing

- [ ] README.md updated
- [ ] API documentation available
- [ ] User guide created (if needed)
- [ ] FAQ created (if needed)

### Developer-Facing

- [ ] DEPLOYMENT.md complete
- [ ] Environment variables documented
- [ ] Architecture documented
- [ ] API endpoints documented
- [ ] Database schema documented

### Legal

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie policy published (if using cookies)
- [ ] GDPR compliance (if applicable)

## Post-Deployment

### Verification (24 hours after)

- [ ] No critical errors in logs
- [ ] Performance metrics acceptable
- [ ] User reports reviewed
- [ ] Analytics data flowing

### Maintenance

- [ ] Backup schedule confirmed
- [ ] Monitoring alerts tested
- [ ] Incident response plan in place
- [ ] Rollback procedure documented
- [ ] Update schedule established

### Marketing

- [ ] Social media announcement
- [ ] Product Hunt submission (optional)
- [ ] Blog post published (optional)
- [ ] Email announcement (if applicable)

## Rollback Plan

### If Deployment Fails

- [ ] Rollback procedure documented
- [ ] Previous deployment can be restored
- [ ] Database rollback plan in place
- [ ] Stakeholders notified

### Emergency Contacts

- [ ] On-call engineer identified
- [ ] Contact information documented
- [ ] Escalation path defined

## Sign-off

- [ ] Product Owner approval
- [ ] Technical Lead approval
- [ ] Security review complete
- [ ] Performance review complete
- [ ] Final go/no-go decision

---

**Deployment Date:** ______________

**Deployed By:** ______________

**Verified By:** ______________

**Notes:**
