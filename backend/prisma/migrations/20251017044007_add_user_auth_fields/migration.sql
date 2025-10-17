-- CreateTable
CREATE TABLE "programming_languages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "useCases" JSONB NOT NULL,
    "advantages" JSONB NOT NULL,
    "salaryRange" JSONB NOT NULL,
    "popularityIndex" SMALLINT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programming_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "interactionHistory" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_paths" (
    "id" SERIAL NOT NULL,
    "languageId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "salaryRange" JSONB NOT NULL,
    "experienceRequired" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_data" (
    "id" SERIAL NOT NULL,
    "language1Id" INTEGER NOT NULL,
    "language2Id" INTEGER NOT NULL,
    "metric" VARCHAR(50) NOT NULL,
    "value1" DOUBLE PRECISION NOT NULL,
    "value2" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparison_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programming_languages_name_key" ON "programming_languages"("name");

-- CreateIndex
CREATE INDEX "programming_languages_popularityIndex_idx" ON "programming_languages"("popularityIndex");

-- CreateIndex
CREATE INDEX "programming_languages_releaseYear_idx" ON "programming_languages"("releaseYear");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "career_paths_languageId_idx" ON "career_paths"("languageId");

-- CreateIndex
CREATE INDEX "career_paths_title_idx" ON "career_paths"("title");

-- CreateIndex
CREATE INDEX "comparison_data_language1Id_language2Id_idx" ON "comparison_data"("language1Id", "language2Id");

-- CreateIndex
CREATE INDEX "comparison_data_metric_idx" ON "comparison_data"("metric");

-- AddForeignKey
ALTER TABLE "career_paths" ADD CONSTRAINT "career_paths_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "programming_languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_data" ADD CONSTRAINT "comparison_data_language1Id_fkey" FOREIGN KEY ("language1Id") REFERENCES "programming_languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_data" ADD CONSTRAINT "comparison_data_language2Id_fkey" FOREIGN KEY ("language2Id") REFERENCES "programming_languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
