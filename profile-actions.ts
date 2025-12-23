'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { StudentProfileFormData } from '@/types/profile-types';

/**
 * Save or update student profile
 */
export async function saveStudentProfile(
  userId: string,
  data: StudentProfileFormData
) {
  try {
    // Check if profile already exists
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { subjects: true },
    });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.studentProfile.update({
        where: { userId },
        data: {
          // A. Demographics & Residency
          studentName: data.studentName,
          currentGrade: data.currentGrade,
          targetEntryYear: data.targetEntryYear,
          citizenshipPrimary: data.citizenshipPrimary,
          citizenshipSecondary: data.citizenshipSecondary,
          countryResidence: data.countryResidence,
          
          // B. Financial Reality Check
          annualBudgetRange: data.annualBudgetRange,
          needBasedAid: data.needBasedAid,
          usApplicantStatus: data.usApplicantStatus,
          
          // C. Educational System Context
          primaryCurriculum: data.primaryCurriculum,
          curriculumOther: data.curriculumOther,
          
          // E. Standardized Testing
          ieltsScore: data.ieltsScore,
          toeflScore: data.toeflScore,
          duolingoScore: data.duolingoScore,
          nativeEnglish: data.nativeEnglish,
          satTotal: data.satTotal,
          satMath: data.satMath,
          satReadingWriting: data.satReadingWriting,
          actComposite: data.actComposite,
          ucatBmatScore: data.ucatBmatScore,
          testPlanDate: data.testPlanDate,
          testOptional: data.testOptional,
          
          // F. Learning & Disciplinary Context
          learningSupport: data.learningSupport,
          learningSupportDetails: data.learningSupportDetails,
          disciplinaryRecord: data.disciplinaryRecord,
          
          // G. Student Aspirations
          careerInterest1: data.careerInterest1,
          careerInterest2: data.careerInterest2,
          careerInterest3: data.careerInterest3,
          destinationCountry1: data.destinationCountry1,
          destinationUniversities1: data.destinationUniversities1,
          destinationCountry2: data.destinationCountry2,
          destinationUniversities2: data.destinationUniversities2,
          destinationCountry3: data.destinationCountry3,
          destinationUniversities3: data.destinationUniversities3,
          
          completed: true,
        },
      });

      // Delete existing subjects and create new ones
      await prisma.studentSubject.deleteMany({
        where: { profileId: existingProfile.id },
      });

      if (data.subjects && data.subjects.length > 0) {
        await prisma.studentSubject.createMany({
          data: data.subjects.map((subject, index) => ({
            profileId: existingProfile.id,
            subjectCategory: subject.subjectCategory,
            courseName: subject.courseName,
            difficultyLevel: subject.difficultyLevel,
            latestGrade: subject.latestGrade,
            interestLevel: subject.interestLevel,
            displayOrder: index,
          })),
        });
      }

      revalidatePath('/profile');
      revalidatePath('/dashboard');

      return {
        success: true,
        profileId: updatedProfile.id,
        message: 'Profile updated successfully!',
      };
    } else {
      // Create new profile
      const newProfile = await prisma.studentProfile.create({
        data: {
          userId,
          // A. Demographics & Residency
          studentName: data.studentName,
          currentGrade: data.currentGrade,
          targetEntryYear: data.targetEntryYear,
          citizenshipPrimary: data.citizenshipPrimary,
          citizenshipSecondary: data.citizenshipSecondary,
          countryResidence: data.countryResidence,
          
          // B. Financial Reality Check
          annualBudgetRange: data.annualBudgetRange,
          needBasedAid: data.needBasedAid,
          usApplicantStatus: data.usApplicantStatus,
          
          // C. Educational System Context
          primaryCurriculum: data.primaryCurriculum,
          curriculumOther: data.curriculumOther,
          
          // E. Standardized Testing
          ieltsScore: data.ieltsScore,
          toeflScore: data.toeflScore,
          duolingoScore: data.duolingoScore,
          nativeEnglish: data.nativeEnglish,
          satTotal: data.satTotal,
          satMath: data.satMath,
          satReadingWriting: data.satReadingWriting,
          actComposite: data.actComposite,
          ucatBmatScore: data.ucatBmatScore,
          testPlanDate: data.testPlanDate,
          testOptional: data.testOptional,
          
          // F. Learning & Disciplinary Context
          learningSupport: data.learningSupport,
          learningSupportDetails: data.learningSupportDetails,
          disciplinaryRecord: data.disciplinaryRecord,
          
          // G. Student Aspirations
          careerInterest1: data.careerInterest1,
          careerInterest2: data.careerInterest2,
          careerInterest3: data.careerInterest3,
          destinationCountry1: data.destinationCountry1,
          destinationUniversities1: data.destinationUniversities1,
          destinationCountry2: data.destinationCountry2,
          destinationUniversities2: data.destinationUniversities2,
          destinationCountry3: data.destinationCountry3,
          destinationUniversities3: data.destinationUniversities3,
          
          completed: true,
        },
      });

      // Create subjects
      if (data.subjects && data.subjects.length > 0) {
        await prisma.studentSubject.createMany({
          data: data.subjects.map((subject, index) => ({
            profileId: newProfile.id,
            subjectCategory: subject.subjectCategory,
            courseName: subject.courseName,
            difficultyLevel: subject.difficultyLevel,
            latestGrade: subject.latestGrade,
            interestLevel: subject.interestLevel,
            displayOrder: index,
          })),
        });
      }

      revalidatePath('/profile');
      revalidatePath('/dashboard');

      return {
        success: true,
        profileId: newProfile.id,
        message: 'Profile created successfully!',
      };
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    return {
      success: false,
      message: 'Failed to save profile. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get student profile by user ID
 */
export async function getStudentProfile(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjects: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!profile) {
      return {
        success: false,
        message: 'Profile not found',
      };
    }

    return {
      success: true,
      profile,
    };
  } catch (error) {
    console.error('Error getting profile:', error);
    return {
      success: false,
      message: 'Failed to retrieve profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if user has completed Section 0
 */
export async function checkProfileCompleted(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { completed: true },
    });

    return {
      completed: profile?.completed || false,
    };
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return {
      completed: false,
    };
  }
}

/**
 * Delete student profile
 */
export async function deleteStudentProfile(userId: string) {
  try {
    await prisma.studentProfile.delete({
      where: { userId },
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Profile deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return {
      success: false,
      message: 'Failed to delete profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
