/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "currentGrade" TEXT NOT NULL,
    "targetEntryYear" TEXT NOT NULL,
    "citizenshipPrimary" TEXT NOT NULL,
    "citizenshipSecondary" TEXT,
    "countryResidence" TEXT NOT NULL,
    "annualBudgetRange" TEXT NOT NULL,
    "needBasedAid" TEXT NOT NULL,
    "usApplicantStatus" TEXT NOT NULL,
    "primaryCurriculum" TEXT NOT NULL,
    "curriculumOther" TEXT,
    "ieltsScore" DOUBLE PRECISION,
    "toeflScore" INTEGER,
    "duolingoScore" INTEGER,
    "nativeEnglish" BOOLEAN NOT NULL DEFAULT false,
    "satTotal" INTEGER,
    "satMath" INTEGER,
    "satReadingWriting" INTEGER,
    "actComposite" INTEGER,
    "ucatBmatScore" TEXT,
    "testPlanDate" TEXT,
    "testOptional" BOOLEAN NOT NULL DEFAULT false,
    "learningSupport" BOOLEAN NOT NULL DEFAULT false,
    "learningSupportDetails" TEXT,
    "disciplinaryRecord" TEXT NOT NULL,
    "careerInterest1" TEXT NOT NULL,
    "careerInterest2" TEXT,
    "careerInterest3" TEXT,
    "destinationCountry1" TEXT NOT NULL,
    "destinationUniversities1" TEXT,
    "destinationCountry2" TEXT,
    "destinationUniversities2" TEXT,
    "destinationCountry3" TEXT,
    "destinationUniversities3" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_subjects" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "subjectCategory" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "difficultyLevel" TEXT NOT NULL,
    "latestGrade" TEXT NOT NULL,
    "interestLevel" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "scores" JSONB NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_subjects" ADD CONSTRAINT "student_subjects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
