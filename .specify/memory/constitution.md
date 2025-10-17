<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- List of modified principles: All principles added (new constitution)
- Added sections: Technology Stack & Configuration, Development Workflow & Quality Gates
- Removed sections: None
- Templates requiring updates: ⚠ pending - plan-template.md, spec-template.md, tasks-template.md, command files
- Follow-up TODOs: None
-->
# Top 10 Programming Languages Guide Constitution

## Core Principles

### I. Type Safety and Code Quality

Full TypeScript strict mode compliance across all components; Type-safe database operations with Prisma; Comprehensive input validation using Zod schemas; Zero-tolerance for any type errors or unsafe operations.

### II. Performance and Scalability

All web pages must achieve Google Lighthouse performance score >90; Stateless API design for horizontal scaling; Optimized database queries and caching; Container-ready deployment for easy scaling.

### III. Security and Reliability

Input validation and SQL injection prevention via Prisma; CORS configuration and rate limiting; JWT authentication for admin endpoints; Comprehensive error handling and logging.

### IV. Accessibility and User Experience

WCAG 2.1 Level AA compliance across all interfaces; Mobile-first responsive design from 320px to 4K screens; Modern, intuitive UI using Shadcn/UI components; Fast loading and smooth interactions.

### V. RESTful API Standards

Consistent RESTful API design patterns; Proper HTTP status codes and response formats; Comprehensive endpoint documentation; Backward-compatible API evolution.

### VI. Modern Technology Stack

Next.js 15.5.2 with App Router for optimal performance; React 19.2 for modern UI development; Shadcn/ui with Tailwind CSS v4.1.14 for utility-first styling; PostgreSQL with Prisma ORM for type-safe data operations.

### VII. Cross-Platform Compatibility

Shared business logic via Kotlin Multiplatform Mobile; Consistent user experience across web, Android, and iOS platforms; Platform-specific optimizations while maintaining core functionality.

## Technology Stack & Configuration

Technology stack requirements include Node.js 18+, TypeScript strict mode, Express.js, Prisma ORM, PostgreSQL, Next.js 15.5.2, React 19.2, Tailwind CSS v4.1.14, Shadcn/UI, PHP 8.4.5, Kotlin Multiplatform Mobile, Android SDK, and Xcode for iOS. All frontend clients (Web, Mobile, PHP) communicate with the central Backend API Server via RESTful API endpoints.All components must use the specified versions for compatibility and security.

## Development Workflow & Quality Gates

Code review requirements mandate TypeScript strict compliance and performance benchmarks. Testing gates require unit tests for controllers (90%+ coverage), integration tests for API endpoints, and validation schema tests (100% coverage). Deployment approval requires successful builds, passing tests, and Lighthouse scores >90.

## Governance

Constitution supersedes all other practices; Amendments require documentation, team approval, and migration plan. Versioning follows semantic versioning: MAJOR for breaking changes, MINOR for new features, PATCH for fixes. All PRs/reviews must verify compliance with principles; Complexity must be justified against YAGNI principles.

**Version**: 1.0.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
