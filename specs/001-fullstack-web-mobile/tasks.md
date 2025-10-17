# Tasks: Full Stack Web and Mobile Application

**Input**: Design documents from `/specs/001-fullstack-web-mobile/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not requested in the feature specification, so excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Mobile**: `mobile-app/shared/src/`, `mobile-app/androidApp/src/`, `mobile-app/iosApp/`
- **PHP**: `php-web/public/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per plan.md
- [x] T002 Create frontend directory structure per plan.md
- [x] T003 Create mobile-app directory structure per plan.md
- [x] T004 Create php-web directory structure per plan.md
- [x] T005 [P] Initialize backend Node.js project with package.json in backend/
- [x] T006 [P] ✅ Initialize frontend Next.js project with package.json in frontend/ (Next.js 15.5.5, React 19.2.0 already configured)
- [x] T007 [P] ✅ Initialize mobile KMM project with build.gradle.kts in mobile-app/ (Kotlin Multiplatform structure exists with shared/androidApp/iosApp)
- [x] T008 [P] ✅ Initialize PHP project with composer.json in php-web/ (Structure and composer.json already exist)
- [x] T009 [P] Configure TypeScript strict mode in backend/tsconfig.json
- [x] T010 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [x] T011 [P] Install backend dependencies (Express, Prisma, Zod) in backend/package.json
- [x] T012 [P] ✅ Install frontend dependencies (React, Next.js, Tailwind, Shadcn) in frontend/package.json (React 19.2.0, Next.js 15.5.5, Tailwind CSS 4.1.14, all Shadcn/UI Radix components installed)
- [x] T013 [P] ✅ Configure Tailwind CSS v4 in frontend/tailwind.config.ts (134 lines with dark mode, custom colors, animations, plugins)
- [x] T014 [P] ✅ Configure Shadcn/UI components in frontend/components.json (New York style, RSC false, TypeScript, cssVariables, lucide icons)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T015 ✅ Setup PostgreSQL database and connection configuration (Database "top10languages" created at localhost:5432, connection string configured in .env, Prisma datasource connected successfully)
- [x] T016 Create Prisma schema with ProgrammingLanguage entity in backend/prisma/schema.prisma
- [x] T017 [P] Create User entity in backend/prisma/schema.prisma
- [x] T018 [P] Create CareerPath entity in backend/prisma/schema.prisma
- [x] T019 [P] Create ComparisonData entity in backend/prisma/schema.prisma
- [x] T020 Generate Prisma client and types in backend/src/prisma/client.ts
- [x] T021 Create base Express app structure in backend/src/app.ts
- [x] T022 [P] Implement error handling middleware in backend/src/middleware/errorHandler.ts
- [x] T023 [P] Implement validation middleware with Zod in backend/src/middleware/validation.ts
- [x] T024 [P] Setup API routing structure in backend/src/routes/languages.ts
- [x] T025 Create base controller structure in backend/src/controllers/languageController.ts
- [x] T026 Configure environment variables and .env template in backend/.env.example
- [x] T027 ✅ Run initial database migration in backend/prisma/migrations/ (Migration 20251017044007_add_user_auth_fields applied, database schema up to date, 4 models introspected: ProgrammingLanguage, User, CareerPath, ComparisonData)
- [x] T028 Create seed data for 10 programming languages in backend/prisma/seed.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅ PHASE 2 COMPLETE (100%)

---

## Phase 3: User Story 1 - Access Responsive Website (Priority: P1) 🎯 MVP

**Goal**: Deliver a responsive web interface that displays programming language information across devices

**Independent Test**: Access website on desktop/mobile, navigate language pages, verify content display and responsiveness without mobile apps or advanced features

### Implementation for User Story 1

- [x] T029 [US1] Implement GET /api/languages endpoint in backend/src/controllers/languageController.ts
- [x] T030 [US1] Implement GET /api/languages/{id} endpoint in backend/src/controllers/languageController.ts
- [x] T031 [US1] Create LanguageCard component in frontend/components/LanguageCard.tsx
- [x] T032 [US1] Create Header component in frontend/components/Header.tsx
- [x] T033 [US1] Create Footer component in frontend/components/Footer.tsx
- [x] T034 [US1] Implement home page layout in frontend/app/page.tsx
- [x] T035 [US1] Implement language detail page in frontend/app/languages/[id]/page.tsx
- [x] T036 [US1] Create API client utilities in frontend/lib/api.ts
- [x] T037 [US1] Add responsive styling with Tailwind CSS in frontend/app/globals.css
- [x] T038 [US1] Configure Next.js App Router navigation in frontend/app/layout.tsx
- [x] T039 [US1] Add loading states and error handling in frontend components
- [x] T040 [US1] Implement basic SEO meta tags in frontend/app/layout.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Use Mobile Applications (Priority: P2)

**Goal**: Provide native mobile applications for Android and iOS with programming language information

**Independent Test**: Install and launch mobile apps, browse languages, view details, verify native performance without web features

### Implementation for User Story 2

- [x] T041 [US2] Create shared KMM data models in mobile-app/shared/src/commonMain/kotlin/models/Language.kt
- [x] T042 [US2] Create shared API client in mobile-app/shared/src/commonMain/kotlin/api/LanguageApi.kt
- [x] T043 [US2] Create shared repository layer in mobile-app/shared/src/commonMain/kotlin/repository/LanguageRepository.kt
- [x] T044 [US2] Implement Android language list screen in mobile-app/androidApp/src/main/java/com/topprogramsguide/android/ui/screens/LanguageListScreen.kt
- [x] T045 [US2] Implement Android language detail screen in mobile-app/androidApp/src/main/java/com/topprogramsguide/android/ui/screens/LanguageDetailScreen.kt
- [x] T046 [US2] Configure Android app navigation in mobile-app/androidApp/src/main/java/com/topprogramsguide/android/MainActivity.kt
- [x] T047 [US2] Implement iOS language list screen in mobile-app/iosApp/iosApp/Views/LanguageListView.swift
- [x] T048 [US2] Implement iOS language detail screen in mobile-app/iosApp/iosApp/Views/LanguageDetailView.swift
- [x] T049 [US2] Configure iOS app navigation in mobile-app/iosApp/iosApp/TopProgramsGuideApp.swift
- [x] T050 [US2] Add offline data caching in mobile-app/shared/src/commonMain/kotlin/repository/LanguageRepository.kt
- [ ] T051 [US2] Implement platform-specific UI optimizations for Android and iOS

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Deploy and Maintain System (Priority: P3)

**Goal**: Enable deployment and maintenance of the full-stack system using specified tools

**Independent Test**: Deploy components to staging, verify all parts work together, monitor performance metrics

### Implementation for User Story 3

- [x] T052 [US3] ✅ Implement admin authentication middleware in backend/src/middleware/auth.ts (JWT token generation/verification, bcrypt password hashing, authenticate/authenticateAdmin middleware, 165 lines)
- [x] T053 [US3] ✅ Implement POST /api/languages admin endpoint in backend/src/controllers/languageController.ts (Already existed from Phase 2, now protected with authenticateAdmin, logs admin CREATE actions)
- [x] T054 [US3] ✅ Implement PUT /api/languages/{id} admin endpoint in backend/src/controllers/languageController.ts (Already existed from Phase 2, now protected with authenticateAdmin, logs admin UPDATE actions)
- [x] T055 [US3] ✅ Implement DELETE /api/languages/{id} admin endpoint in backend/src/controllers/languageController.ts (Already existed from Phase 2, now protected with authenticateAdmin, logs admin DELETE actions)
- [x] T056 [US3] ✅ Add JWT authentication for admin endpoints - Created backend/src/controllers/authController.ts (320 lines) with login, refresh, registerAdmin, getCurrentUser endpoints; backend/src/routes/auth.ts (35 lines); updated Prisma User model with password, name, role fields; migration 20251017044007_add_user_auth_fields applied successfully
- [x] T057 [US3] ✅ Create PHP landing page in php-web/public/index.php (320 lines with full SEO optimization)
- [x] T058 [US3] ✅ Add SEO optimization to PHP landing page - Implemented OpenGraph tags, Twitter Cards, Schema.org structured data (WebSite + ItemList), meta tags, responsive design, .htaccess with security headers/compression/caching, robots.txt, sitemap.xml, assets/README.md guide
- [x] T059 [US3] ✅ Configure Vercel deployment for frontend - Created frontend/vercel.json (60 lines) with security headers, API proxy, redirects, environment variables; frontend/DEPLOYMENT.md (280 lines) comprehensive guide; frontend/.env.production.example (25 lines)
- [x] T060 [US3] ✅ Configure Railway deployment for backend - Created backend/Dockerfile (45 lines multi-stage build), backend/railway.json (15 lines), backend/.dockerignore (40 lines), backend/DEPLOYMENT.md (380 lines), backend/.env.production.example (50 lines), backend/.gitignore (40 lines)
- [x] T061 [US3] ✅ Add environment configuration for production deployments - Environment templates created for backend and frontend with all necessary variables (JWT, database, CORS, monitoring, analytics, feature flags, etc.); PRODUCTION-CHECKLIST.md (400+ lines) with 180+ verification items covering pre-deployment, deployment, monitoring, testing, documentation
- [x] T062 [US3] ✅ Implement comprehensive monitoring and logging - Winston logger (backend/src/utils/logger.ts, 90 lines) with console/file transports, colored output, log levels; Sentry error tracking (backend/src/utils/sentry.ts, 140 lines) with filtering and breadcrumbs; Request/performance/security logging middleware (backend/src/middleware/logging.ts, 170 lines); Security logging integrated into auth and language controllers; Graceful shutdown and process error handlers in app.ts

**Checkpoint**: All user stories should now be independently functional ✅ PHASE 5 COMPLETE (100%)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T063 [P] ✅ Add comprehensive error handling across all components (Backend: rateLimiter.ts, security.ts, enhanced errorHandler.ts; Frontend: ErrorBoundary.tsx, enhanced error.tsx, error.ts utilities, integrated into layout.tsx and api.ts with retry logic)
- [x] T064 [P] ✅ Implement accessibility improvements (WCAG 2.1 AA) in frontend components (SkipToContent.tsx, accessibility.ts utilities, semantic HTML with role attributes, ARIA labels in Header/Footer/LanguageCard, keyboard navigation with focus-visible styles, screen reader support with formatForScreenReader, reduced motion & high contrast mode support in globals.css)
- [x] T065 [P] ✅ Add performance optimizations (Lighthouse >90) in frontend/next.config.js (Image optimization: AVIF/WebP, device sizes; Bundle optimization: code splitting, vendor/common chunks; Caching headers: 31536000s for static assets, no-store for API; Web-vitals monitoring: CLS/INP/FCP/LCP/TTFB; Performance utilities in performance.ts: measurePerformance, lazyLoadImage, preloadCriticalResources, deferNonCriticalScripts)
- [x] T066 [P] ✅ Implement security hardening (CORS, rate limiting) in backend/src/middleware/ (Rate limiting: 4 strategies (apiLimiter, authLimiter, adminLimiter, readLimiter); Input sanitization: express-mongo-sanitize, hpp; Security headers: helmet, custom headers; Pattern detection: SQL injection, XSS; Request size limits; Integrated into app.ts)
- [x] T067 [P] ✅ Add comprehensive logging and monitoring across backend (Winston logger with console/file transports, Sentry error tracking with Express integration, request/performance/error logging middleware in logging.ts, security logging for auth/admin actions in authController.ts & languageController.ts; Already complete from Phase 5 - reviewed and validated)
- [x] T068 [P] ✅ Create documentation updates in README.md and docs/ (Comprehensive README.md created: architecture diagram, tech stack details, prerequisites, quick start guide, project structure, environment variables reference, development workflows, API documentation with all endpoints, rate limits, security features, deployment guides for Vercel/Railway/Mobile, contributing guidelines; 600+ lines)
- [ ] T069 [P] Run quickstart.md validation and update as needed
- [ ] T070 [P] Final cross-platform testing and integration validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all foundational models together:
Task: "Create User entity in backend/prisma/schema.prisma"
Task: "Create CareerPath entity in backend/prisma/schema.prisma"
Task: "Create ComparisonData entity in backend/prisma/schema.prisma"

# Launch all frontend components together:
Task: "Create LanguageCard component in frontend/components/LanguageCard.tsx"
Task: "Create Header component in frontend/components/Header.tsx"
Task: "Create Footer component in frontend/components/Footer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
