/**
 * Utility functions for localStorage operations
 */

import { STORAGE_KEYS } from "@/lib/constants";
import { Resume, JobDescription } from "@/types";

/**
 * Save resume to localStorage
 */
export function saveResume(resume: Resume): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
  } catch (error) {
    console.error("Error saving resume to localStorage:", error);
  }
}

/**
 * Get resume from localStorage
 */
export function getResume(): Resume | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESUME);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting resume from localStorage:", error);
    return null;
  }
}

/**
 * Save job description to localStorage
 */
export function saveJobDescription(jd: JobDescription): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, JSON.stringify(jd));
  } catch (error) {
    console.error("Error saving job description to localStorage:", error);
  }
}

/**
 * Get job description from localStorage
 */
export function getJobDescription(): JobDescription | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting job description from localStorage:", error);
    return null;
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
