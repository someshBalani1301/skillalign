/**
 * ATS Scoring Logic - Calculate resume ATS compatibility score
 */

import { Resume, ATSScore } from "@/types";

// Module-level constants to avoid recreating on every function call
const STOP_WORDS = new Set([
  "we",
  "are",
  "is",
  "am",
  "was",
  "were",
  "been",
  "be",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "this",
  "that",
  "these",
  "those",
  "who",
  "which",
  "what",
  "our",
  "your",
  "their",
  "seeking",
  "looking",
  "join",
  "team",
  "company",
  "role",
  "position",
  "opportunity",
  "candidate",
  "ideal",
  "perfect",
  "great",
  "good",
  "excellent",
  "strong",
  "solid",
  "proven",
  "work",
  "working",
  "able",
  "using",
  "use",
  "used",
  "growing",
  "dynamic",
  "fast",
  "paced",
  "innovative",
  "exciting",
]);

const KNOWN_TECH = new Set([
  "react",
  "angular",
  "vue",
  "svelte",
  "next",
  "nuxt",
  "node",
  "express",
  "django",
  "flask",
  "spring",
  "laravel",
  "typescript",
  "javascript",
  "python",
  "java",
  "ruby",
  "php",
  "go",
  "rust",
  "swift",
  "kotlin",
  "html",
  "css",
  "sass",
  "scss",
  "tailwind",
  "bootstrap",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "elasticsearch",
  "docker",
  "kubernetes",
  "jenkins",
  "gitlab",
  "github",
  "git",
  "aws",
  "azure",
  "gcp",
  "cloud",
  "api",
  "rest",
  "graphql",
  "grpc",
  "agile",
  "scrum",
  "kanban",
  "devops",
  "testing",
  "jest",
  "cypress",
  "selenium",
  "mocha",
  "webpack",
  "babel",
  "vite",
  "rollup",
  "redux",
  "mobx",
  "zustand",
  "recoil",
  "microservices",
  "serverless",
  "lambda",
  "linux",
  "unix",
  "bash",
  "shell",
  "ci",
  "cd",
  "pipeline",
  "deployment",
  "frontend",
  "backend",
  "fullstack",
  "design",
  "architecture",
  "patterns",
  "performance",
  "optimization",
  "scalability",
  "security",
  "authentication",
  "authorization",
  "developer",
  "engineer",
  "programmer",
  "architect",
  "lead",
  "senior",
]);

const MULTI_WORD_PATTERNS = [
  /\b(react\.?js|angular\.?js|vue\.?js|next\.?js|node\.?js|express\.?js)\b/gi,
  /\b(full[- ]stack|front[- ]end|back[- ]end|micro[- ]frontend)\b/gi,
  /\b(machine learning|artificial intelligence|data science|cloud computing)\b/gi,
  /\b(ci\/cd|rest api|graphql|nosql|postgresql|mongodb)\b/gi,
  /\b(aws|azure|gcp|google cloud|cloud platform)\b/gi,
  /\b(type[- ]?script|java[- ]?script|c\+\+|c#)\b/gi,
];

// Helper function to check keyword variations (used by multiple functions)
function keywordExistsInText(keyword: string, text: string): boolean {
  const normalized = keyword.toLowerCase();
  if (text.includes(normalized)) return true;
  if (text.includes(normalized.replace(/\s+/g, ""))) return true;
  if (text.includes(normalized.replace(/\s+/g, "-"))) return true;
  return false;
}

/**
 * Calculate overall ATS score for a resume
 */
export function calculateATSScore(
  resume: Resume,
  jobDescription?: string,
): ATSScore {
  const breakdown = {
    formatting: calculateFormattingScore(resume),
    keywords: calculateKeywordScore(resume, jobDescription),
    experience: calculateExperienceScore(resume),
    education: calculateEducationScore(resume),
    skills: calculateSkillsScore(resume),
  };

  // Calculate weighted overall score
  const overallScore = Math.round(
    breakdown.formatting * 0.2 +
      breakdown.keywords * 0.3 +
      breakdown.experience * 0.25 +
      breakdown.education * 0.1 +
      breakdown.skills * 0.15,
  );

  const { recommendations, missingKeywords, foundKeywords } =
    generateRecommendations(resume, breakdown, jobDescription);

  return {
    overallScore,
    breakdown,
    recommendations,
    missingKeywords,
    foundKeywords,
  };
}

/**
 * Calculate formatting score (0-100)
 */
function calculateFormattingScore(resume: Resume): number {
  let score = 0;
  const issues = [];

  // Check for standard sections (20 points)
  if (resume.content.experience.length > 0) score += 7;
  if (resume.content.education.length > 0) score += 7;
  if (resume.content.skills.length > 0) score += 6;

  // Check personal info completeness (20 points)
  const info = resume.content.personalInfo;
  if (info.name) score += 5;
  if (info.email) score += 5;
  if (info.phone) score += 5;
  if (info.location) score += 5;

  // Check for summary/objective (15 points)
  if (resume.content.summary && resume.content.summary.length > 50) {
    score += 15;
  }

  // Text quality indicators (20 points)
  const text = resume.rawText;

  // No special characters that break parsing
  if (!/[★☆♦◆●○]/.test(text)) score += 7;

  // Proper bullet points
  if (/[•\-\*]/.test(text)) score += 7;

  // Not too short or too long
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 1000) score += 6;

  // Check for contact info (15 points)
  if (/@/.test(text)) score += 8; // Has email
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 7; // Has phone

  // Bonus: LinkedIn/GitHub (10 points)
  if (info.linkedIn) score += 5;
  if (info.github) score += 5;

  return Math.min(100, score);
}

/**
 * Calculate keyword match score (0-100)
 */
function calculateKeywordScore(
  resume: Resume,
  jobDescription?: string,
): number {
  if (!jobDescription || jobDescription.trim().length < 50) {
    // Base score without meaningful JD comparison
    // Score based on resume quality indicators
    const hasGoodSkills = resume.content.skills.length >= 10;
    const hasExperience = resume.content.experience.length > 0;
    const hasEducation = resume.content.education.length > 0;

    let baseScore = 60;
    if (hasGoodSkills) baseScore += 15;
    if (hasExperience) baseScore += 15;
    if (hasEducation) baseScore += 10;

    return Math.min(100, baseScore);
  }

  const resumeText = resume.rawText.toLowerCase();
  const jdKeywords = extractImportantKeywords(jobDescription);

  if (jdKeywords.length === 0) return 75;

  // Count matches using helper function
  const matchedKeywords = jdKeywords.filter((kw) =>
    keywordExistsInText(kw, resumeText),
  );

  // Calculate match percentage with better weighting
  const matchPercentage = matchedKeywords.length / jdKeywords.length;

  // Apply scoring curve:
  // 0-30% match = 0-40 score
  // 30-60% match = 40-70 score
  // 60-100% match = 70-100 score
  let score = 0;
  if (matchPercentage <= 0.3) {
    score = (matchPercentage / 0.3) * 40;
  } else if (matchPercentage <= 0.6) {
    score = 40 + ((matchPercentage - 0.3) / 0.3) * 30;
  } else {
    score = 70 + ((matchPercentage - 0.6) / 0.4) * 30;
  }

  return Math.round(score);
}

/**
 * Calculate experience score (0-100)
 */
function calculateExperienceScore(resume: Resume): number {
  let score = 0;
  const experiences = resume.content.experience;

  if (experiences.length === 0) return 20; // Some base score

  // Number of experiences (30 points)
  score += Math.min(30, experiences.length * 10);

  // Quality of bullet points (40 points)
  let totalBullets = 0;
  let strongBullets = 0;

  experiences.forEach((exp) => {
    totalBullets += exp.bullets.length;
    exp.bullets.forEach((bullet) => {
      if (isStrongBullet(bullet)) strongBullets++;
    });
  });

  if (totalBullets > 0) {
    score += Math.round((strongBullets / totalBullets) * 40);
  }

  // Date completeness (15 points)
  const datesComplete = experiences.filter(
    (exp) => exp.startDate && exp.endDate,
  ).length;
  score += Math.round((datesComplete / experiences.length) * 15);

  // Has company and position (15 points)
  const detailsComplete = experiences.filter(
    (exp) => exp.company && exp.position,
  ).length;
  score += Math.round((detailsComplete / experiences.length) * 15);

  return Math.min(100, score);
}

/**
 * Calculate education score (0-100)
 */
function calculateEducationScore(resume: Resume): number {
  let score = 0;
  const education = resume.content.education;

  if (education.length === 0) return 30; // Base score

  // Has education entries (40 points)
  score += Math.min(40, education.length * 20);

  // Completeness of education info (60 points)
  education.forEach((edu) => {
    if (edu.institution) score += 15;
    if (edu.degree) score += 15;
    if (edu.field) score += 15;
    if (edu.startDate && edu.endDate) score += 15;
  });

  return Math.min(100, score);
}

/**
 * Calculate skills score (0-100)
 */
function calculateSkillsScore(resume: Resume): number {
  const skills = resume.content.skills;

  if (skills.length === 0) return 20;

  // More skills = higher score (up to 80)
  const baseScore = Math.min(80, skills.length * 5);

  // Bonus for having variety of skills (20)
  const hasVariety = skills.length >= 5 ? 20 : skills.length * 4;

  return Math.min(100, baseScore + hasVariety);
}

/**
 * Check if a bullet point is strong (has action verbs, metrics, etc.)
 */
function isStrongBullet(bullet: string): boolean {
  // Action verbs
  const actionVerbs = [
    "achieved",
    "improved",
    "increased",
    "decreased",
    "developed",
    "created",
    "built",
    "designed",
    "implemented",
    "led",
    "managed",
    "coordinated",
    "optimized",
    "streamlined",
    "established",
    "launched",
    "delivered",
    "reduced",
    "enhanced",
    "transformed",
    "generated",
    "accelerated",
  ];

  const hasActionVerb = actionVerbs.some((verb) =>
    new RegExp(`\\b${verb}`, "i").test(bullet),
  );

  // Has numbers/metrics
  const hasMetrics =
    /\d+%|\d+\+|\$\d+|(\d+,\d+)|\d+ (hours|days|weeks|months|users|customers|clients)/.test(
      bullet,
    );

  // Reasonable length
  const wordCount = bullet.split(/\s+/).length;
  const goodLength = wordCount >= 8 && wordCount <= 30;

  return (hasActionVerb && hasMetrics) || (hasActionVerb && goodLength);
}

/**
 * Generate recommendations based on score breakdown
 */
function generateRecommendations(
  resume: Resume,
  breakdown: ATSScore["breakdown"],
  jobDescription?: string,
): {
  recommendations: string[];
  missingKeywords: string[];
  foundKeywords: string[];
} {
  const recommendations: string[] = [];
  let missingKeywords: string[] = [];
  let foundKeywords: string[] = [];

  // Formatting recommendations
  if (breakdown.formatting < 70) {
    if (!resume.content.personalInfo.phone) {
      recommendations.push("Add your phone number to improve ATS parsing");
    }
    if (!resume.content.summary) {
      recommendations.push(
        "Add a professional summary at the top of your resume",
      );
    }
    if (resume.content.experience.length === 0) {
      recommendations.push(
        "Add work experience section with detailed bullet points",
      );
    }
  }

  // Experience recommendations
  if (breakdown.experience < 70) {
    recommendations.push(
      "Use strong action verbs at the start of each bullet point",
    );
    recommendations.push(
      "Quantify your achievements with numbers, percentages, or metrics",
    );
    recommendations.push(
      "Ensure each experience has 3-5 detailed bullet points",
    );
  }

  // Skills recommendations
  if (breakdown.skills < 60) {
    recommendations.push("Add more relevant technical and professional skills");
    recommendations.push(
      "Include tools, technologies, and methodologies you know",
    );
  }

  // Education recommendations
  if (breakdown.education < 60) {
    recommendations.push(
      "Complete your education details with degree, field, and dates",
    );
  }

  // Keyword analysis if JD provided
  if (jobDescription && jobDescription.trim().length >= 50) {
    const resumeText = resume.rawText.toLowerCase();
    const jdKeywords = extractImportantKeywords(jobDescription);

    if (jdKeywords.length > 0) {
      foundKeywords = jdKeywords.filter((kw) =>
        keywordExistsInText(kw, resumeText),
      );
      missingKeywords = jdKeywords
        .filter((kw) => !keywordExistsInText(kw, resumeText))
        .filter((kw) => kw.length > 2);

      // Keyword-specific recommendations
      if (breakdown.keywords < 60) {
        if (missingKeywords.length > 0) {
          recommendations.push(
            `Add key skills from job description: ${missingKeywords.slice(0, 5).join(", ")}`,
          );
        }
        recommendations.push(
          "Incorporate job description keywords naturally throughout your resume",
        );
      } else if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
        recommendations.push(`Consider adding: ${missingKeywords.join(", ")}`);
      }

      // Provide positive feedback for matches
      if (foundKeywords.length > 0 && breakdown.keywords >= 70) {
        recommendations.push(
          `Great! Your resume matches ${foundKeywords.length} key requirements`,
        );
      }
    }
  } else if (jobDescription && jobDescription.trim().length < 50) {
    // JD is too short/generic
    recommendations.push(
      "Tip: Provide a detailed job description for better keyword analysis",
    );
  }

  // General best practices
  if (recommendations.length === 0) {
    recommendations.push("Great job! Your resume is ATS-friendly");
    recommendations.push("Consider tailoring it for specific job descriptions");
  }

  return { recommendations, missingKeywords, foundKeywords };
}

/**
 * Extract important keywords from job description
 * Extracts actual technical requirements, skills, and tools mentioned in the JD
 */
function extractImportantKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const keywords = new Set<string>();

  // Extract multi-word technical terms using module-level patterns
  MULTI_WORD_PATTERNS.forEach((pattern) => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      matches.forEach((match) => keywords.add(match.toLowerCase().trim()));
    }
  });

  // Extract individual technical words
  const words = text
    .replace(/[,;\/\(\)\[\]]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= 3 && !STOP_WORDS.has(word) && !/^\d+$/.test(word),
    );

  // Add known technical terms found in the JD
  words.forEach((word) => {
    if (KNOWN_TECH.has(word)) keywords.add(word);
  });

  // Extract years of experience requirement
  const yearsMatch = text.match(
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/i,
  );
  if (yearsMatch) keywords.add(`${yearsMatch[1]}+ years experience`);

  // Extract degree requirements
  if (/bachelor'?s?\b|b\.?s\.?|b\.?a\.?|undergraduate/i.test(text)) {
    keywords.add("bachelor's degree");
  }
  if (/master'?s?\b|m\.?s\.?|m\.?a\.?|graduate degree/i.test(text)) {
    keywords.add("master's degree");
  }

  // Filter and return
  return Array.from(keywords).filter(
    (kw) => kw.length > 2 && !STOP_WORDS.has(kw) && !/^[\d\s]+$/.test(kw),
  );
}

/**
 * Compare resume against job description
 */
export function compareWithJobDescription(
  resume: Resume,
  jobDescription: string,
): {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
} {
  const jdKeywords = extractImportantKeywords(jobDescription);
  const resumeText = resume.rawText.toLowerCase();
  const resumeSkills = resume.content.skills.map((s) => s.toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Enhanced keyword checker that also checks extracted skills
  const keywordExists = (keyword: string): boolean => {
    if (keywordExistsInText(keyword, resumeText)) return true;
    const normalized = keyword.toLowerCase();
    return resumeSkills.some(
      (skill) =>
        skill.includes(normalized) ||
        skill === normalized.replace(/\s+/g, "") ||
        skill === normalized.replace(/\s+/g, "-"),
    );
  };

  jdKeywords.forEach((keyword) => {
    if (keywordExists(keyword)) {
      matchedSkills.push(keyword);
    } else {
      missingSkills.push(keyword);
    }
  });

  const matchScore =
    jdKeywords.length > 0
      ? Math.round((matchedSkills.length / jdKeywords.length) * 100)
      : 0;

  const suggestions: string[] = [];

  if (missingSkills.length > 0) {
    suggestions.push(
      `Add these key skills: ${missingSkills.slice(0, 3).join(", ")}`,
    );
  }

  if (matchScore < 60) {
    suggestions.push(
      "Tailor your experience bullets to match job requirements",
    );
    suggestions.push(
      "Use keywords from the job description naturally in your resume",
    );
  }

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    suggestions,
  };
}
