/**
 * Constants for the SkillAlign application
 */

// Application Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: {
    UPLOAD: "/dashboard/upload",
    SCORE: "/dashboard/score",
    JD_MATCH: "/dashboard/jd-match",
    BULLET_IMPROVER: "/dashboard/bullet-improver",
    EXPORT: "/dashboard/export",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  RESUME: "skillalign_resume",
  JOB_DESCRIPTION: "skillalign_jd",
} as const;

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  NEEDS_IMPROVEMENT: 0,
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  ACCEPTED_TYPES: [".pdf", ".docx", ".txt"],
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
} as const;

// UI Messages
export const MESSAGES = {
  NO_RESUME: "No resume uploaded yet. Please upload your resume first.",
  UPLOAD_SUCCESS: "Resume uploaded successfully!",
  UPLOAD_ERROR: "Error uploading resume. Please try again.",
  INVALID_FILE_TYPE: "Please upload a PDF, DOCX, or TXT file",
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
  PASTE_JD: "Please paste a job description first",
  PROCESSING: "Processing your resume...",
  ANALYZING: "Analyzing...",
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  PDF: "pdf",
  DOCX: "docx",
  TXT: "txt",
} as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    name: "Upload",
    href: ROUTES.DASHBOARD.UPLOAD,
    description: "Upload your resume",
  },
  {
    name: "ATS Score",
    href: ROUTES.DASHBOARD.SCORE,
    description: "Check ATS compatibility",
  },
  {
    name: "JD Match",
    href: ROUTES.DASHBOARD.JD_MATCH,
    description: "Match with job descriptions",
  },
  {
    name: "Bullet Improver",
    href: ROUTES.DASHBOARD.BULLET_IMPROVER,
    description: "Improve resume bullets",
  },
  {
    name: "Export",
    href: ROUTES.DASHBOARD.EXPORT,
    description: "Download your resume",
  },
] as const;

// Impact Levels
export const IMPACT_LEVELS = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  FILE_UPLOAD_DELAY: 2000,
  JD_ANALYSIS_DELAY: 1500,
} as const;

// Color Schemes
export const COLORS = {
  SCORE: {
    EXCELLENT: "text-green-600",
    GOOD: "text-yellow-600",
    NEEDS_IMPROVEMENT: "text-red-600",
  },
  BG: {
    EXCELLENT: "bg-green-100",
    GOOD: "bg-yellow-100",
    NEEDS_IMPROVEMENT: "bg-red-100",
  },
  BADGE: {
    SUCCESS: "bg-green-100 text-green-800",
    WARNING: "bg-yellow-100 text-yellow-800",
    DANGER: "bg-red-100 text-red-800",
    INFO: "bg-blue-100 text-blue-800",
    NEUTRAL: "bg-gray-100 text-gray-800",
  },
} as const;
