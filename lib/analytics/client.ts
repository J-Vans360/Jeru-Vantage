'use client';

import { v4 as uuidv4 } from 'uuid';

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('jv_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('jv_session_id', sessionId);
  }
  return sessionId;
}

// Get screen size
function getScreenSize(): string {
  if (typeof window === 'undefined') return '';
  return `${window.screen.width}x${window.screen.height}`;
}

// Track page view
export async function trackPageView(pagePath: string, pageTitle?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'page_view',
        eventCategory: 'navigation',
        sessionId: getSessionId(),
        pagePath,
        pageTitle: pageTitle || document.title,
        referrer: document.referrer,
        screenSize: getScreenSize(),
      }),
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// Track custom event
export async function trackClientEvent(
  eventName: string,
  eventCategory: string,
  properties?: Record<string, unknown>
) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventCategory,
        sessionId: getSessionId(),
        properties,
        pagePath: window.location.pathname,
        screenSize: getScreenSize(),
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Update heartbeat (for active session tracking)
export async function sendHeartbeat(currentActivity?: string) {
  try {
    await fetch('/api/analytics/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        currentPage: window.location.pathname,
        currentActivity,
      }),
    });
  } catch {
    // Silent fail for heartbeat
  }
}

// Predefined event helpers
export const Analytics = {
  // Registration funnel
  registrationStarted: () => trackClientEvent('registration_started', 'conversion'),
  registrationCompleted: () => trackClientEvent('registration_completed', 'conversion'),
  profileCompleted: () => trackClientEvent('profile_completed', 'conversion'),

  // Assessment funnel
  assessmentStarted: () => trackClientEvent('assessment_started', 'assessment'),
  assessmentSectionCompleted: (section: string, timeSpent: number) =>
    trackClientEvent('assessment_section_completed', 'assessment', { section, timeSpent }),
  assessmentCompleted: (totalTime: number) =>
    trackClientEvent('assessment_completed', 'conversion', { totalTime }),

  // Results
  resultsViewed: () => trackClientEvent('results_viewed', 'engagement'),
  resultsSectionExpanded: (section: string) =>
    trackClientEvent('results_section_expanded', 'engagement', { section }),

  // University matching
  universityMatchClicked: (universityId: string, matchScore: number) =>
    trackClientEvent('university_match_clicked', 'conversion', { universityId, matchScore }),
  universityConnected: (universityId: string) =>
    trackClientEvent('university_connected', 'conversion', { universityId }),

  // Engagement
  feedbackModalOpened: () => trackClientEvent('feedback_modal_opened', 'engagement'),
  feedbackSubmitted: (rating: number, nps: number) =>
    trackClientEvent('feedback_submitted', 'engagement', { rating, nps }),

  // Report
  reportViewed: () => trackClientEvent('report_viewed', 'engagement'),
  reportDownloaded: () => trackClientEvent('report_downloaded', 'engagement'),
  reportShared: () => trackClientEvent('report_shared', 'engagement'),
};
