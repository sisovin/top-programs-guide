# Data Model: Full Stack Web and Mobile Application

**Feature**: 001-fullstack-web-mobile
**Date**: October 17, 2025
**Based on**: spec.md requirements and project document

## Overview

The data model supports a programming language guide platform with web and mobile interfaces. All entities use PostgreSQL with Prisma ORM for type-safe operations.

## Core Entities

### Programming Language

**Purpose**: Represents individual programming languages with comprehensive information for user education and comparison.

**Fields**:

- `id`: Int (Primary Key, Auto-increment)
- `name`: String (Required, 1-100 chars, Unique)
- `description`: String (Required, Detailed description)
- `useCases`: String[] (JSON array of use cases)
- `advantages`: String[] (JSON array of advantages)
- `salaryRange`: Json (Object with min/max/currency/experience levels)
- `popularityIndex`: Int (1-100 scale)
- `releaseYear`: Int (Year language was released)
- `logoUrl`: String (URL to logo image)
- `createdAt`: DateTime (Auto-generated)
- `updatedAt`: DateTime (Auto-updated)

**Validation Rules**:

- Name: Required, unique, 1-100 characters
- Description: Required, minimum 10 characters
- SalaryRange: Must include min/max numbers, optional experience levels
- PopularityIndex: 1-100 range
- ReleaseYear: Valid year (1950-current)
- LogoUrl: Valid URL format

**Relationships**:

- None (standalone entity)

**Indexes**:

- Unique on `name`
- Index on `popularityIndex` for sorting
- Index on `releaseYear` for filtering

### User

**Purpose**: Represents platform users for personalization and analytics.

**Fields**:

- `id`: Int (Primary Key, Auto-increment)
- `email`: String (Optional, for future auth)
- `preferences`: Json (User settings and favorites)
- `interactionHistory`: Json (Array of viewed languages and timestamps)
- `createdAt`: DateTime (Auto-generated)
- `updatedAt`: DateTime (Auto-updated)

**Validation Rules**:

- Email: Valid email format if provided
- Preferences: JSON object with language preferences
- InteractionHistory: Array of objects with languageId and timestamp

**Relationships**:

- None (future expansion possible)

**Indexes**:

- Index on `email` (future auth)

### Career Path

**Purpose**: Represents career progression information related to programming languages.

**Fields**:

- `id`: Int (Primary Key, Auto-increment)
- `languageId`: Int (Foreign Key to ProgrammingLanguage)
- `title`: String (Career role title)
- `description`: String (Role description)
- `salaryRange`: Json (Similar to Language salaryRange)
- `experienceRequired`: String (Years/minimum experience)
- `createdAt`: DateTime (Auto-generated)

**Validation Rules**:

- Title: Required, 1-100 characters
- Description: Required, minimum 20 characters
- ExperienceRequired: Valid format (e.g., "2-5 years")

**Relationships**:

- Belongs to ProgrammingLanguage (many-to-one)

**Indexes**:

- Index on `languageId`
- Index on `title`

### Comparison Data

**Purpose**: Stores comparative metrics between programming languages for analysis.

**Fields**:

- `id`: Int (Primary Key, Auto-increment)
- `language1Id`: Int (Foreign Key to ProgrammingLanguage)
- `language2Id`: Int (Foreign Key to ProgrammingLanguage)
- `metric`: String (Comparison type: performance, ease_of_use, etc.)
- `value1`: Float (Value for language1)
- `value2`: Float (Value for language2)
- `description`: String (Explanation of comparison)
- `createdAt`: DateTime (Auto-generated)

**Validation Rules**:

- Metric: Enum values (performance, community, learning_curve, etc.)
- Values: Non-negative numbers
- Description: Optional explanation

**Relationships**:

- Belongs to ProgrammingLanguage (two foreign keys)

**Indexes**:

- Composite index on `language1Id`, `language2Id`
- Index on `metric`

## Database Schema (Prisma)

```prisma
model ProgrammingLanguage {
  id              Int      @id @default(autoincrement())
  name            String   @unique @db.VarChar(100)
  description     String
  useCases        Json     // String array
  advantages      Json     // String array
  salaryRange     Json
  popularityIndex Int      @db.SmallInt
  releaseYear     Int
  logoUrl         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  careerPaths     CareerPath[]
  comparisons1    ComparisonData[] @relation("Language1Comparisons")
  comparisons2    ComparisonData[] @relation("Language2Comparisons")

  @@index([popularityIndex])
  @@index([releaseYear])
  @@map("programming_languages")
}

model User {
  id                Int      @id @default(autoincrement())
  email             String?  @unique @db.VarChar(255)
  preferences       Json
  interactionHistory Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([email])
  @@map("users")
}

model CareerPath {
  id                 Int      @id @default(autoincrement())
  languageId         Int
  title              String   @db.VarChar(100)
  description        String
  salaryRange        Json
  experienceRequired String   @db.VarChar(50)
  createdAt          DateTime @default(now())

  language           ProgrammingLanguage @relation(fields: [languageId], references: [id], onDelete: Cascade)

  @@index([languageId])
  @@index([title])
  @@map("career_paths")
}

model ComparisonData {
  id          Int     @id @default(autoincrement())
  language1Id Int
  language2Id Int
  metric      String  @db.VarChar(50)
  value1      Float
  value2      Float
  description String?
  createdAt   DateTime @default(now())

  language1   ProgrammingLanguage @relation("Language1Comparisons", fields: [language1Id], references: [id])
  language2   ProgrammingLanguage @relation("Language2Comparisons", fields: [language2Id], references: [id])

  @@index([language1Id, language2Id])
  @@index([metric])
  @@map("comparison_data")
}
```

## Data Seeding Strategy

- **Programming Languages**: Seed with 10 initial languages from project requirements
- **Career Paths**: Include 2-3 paths per language
- **Comparison Data**: Generate comparative metrics between popular language pairs
- **Users**: Start empty, populate through user interactions

## Migration Strategy

- Initial migration creates all tables with constraints
- Future migrations follow Prisma's migration system
- Backward compatibility maintained for API consumers
