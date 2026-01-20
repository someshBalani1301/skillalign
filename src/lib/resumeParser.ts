/**
 * Resume Parser - Extracts structured data from PDF/DOCX files
 */

import { ResumeContent, PersonalInfo, Experience, Education } from "@/types";

/**
 * Extract personal information from resume text
 */
export function extractPersonalInfo(text: string): PersonalInfo {
  const info: PersonalInfo = {
    name: "",
    email: "",
  };

  // Extract email
  const emailMatch = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  );
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Extract phone (various formats)
  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  );
  if (phoneMatch) {
    info.phone = phoneMatch[0];
  }

  // Extract name (assume first line or first meaningful text before email)
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length > 0) {
    // Get first non-empty line as name
    info.name = lines[0].trim();
  }

  // Extract LinkedIn
  const linkedInMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedInMatch) {
    info.linkedIn = linkedInMatch[0].startsWith("http")
      ? linkedInMatch[0]
      : `https://www.${linkedInMatch[0]}`;
  }

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) {
    info.github = githubMatch[0].startsWith("http")
      ? githubMatch[0]
      : `https://www.${githubMatch[0]}`;
  }

  // Extract location (common patterns)
  const locationMatch = text.match(
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
  );
  if (locationMatch) {
    info.location = locationMatch[0];
  }

  return info;
}

/**
 * Extract experience section from resume text
 */
export function extractExperience(text: string): Experience[] {
  const experiences: Experience[] = [];

  // Find experience section - more keywords
  const expSectionMatch = text.match(
    /(?:WORK EXPERIENCE|EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|WORK HISTORY)([\s\S]*?)(?=EDUCATION|PROJECTS|CERTIFICATIONS|AWARDS|$)/i,
  );

  if (!expSectionMatch) return experiences;

  const expText = expSectionMatch[1];

  // Parse line by line to find jobs
  const lines = expText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  let jobIndex = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line contains a date range (indicates job title/header)
    const hasDate =
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{4}\s*[-–—]|Present|Current/i.test(
        line,
      );

    if (hasDate) {
      // This line has dates - it's likely the position line
      // Company should be the previous line
      const company = i > 0 ? lines[i - 1] : "Company";
      const position = line;
      const dates = parseDateRange(line);

      // Collect bullets until next company/date line
      const bullets: string[] = [];
      i++;

      while (i < lines.length) {
        const nextLine = lines[i];
        // Stop if we hit another date line (new job)
        if (
          /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|\d{4}\s*[-–—]/i.test(
            nextLine,
          )
        ) {
          i--; // Back up one so outer loop processes it
          break;
        }
        // Stop if we hit another section
        if (/^(PROJECTS|EDUCATION|AWARDS|CERTIFICATIONS)/i.test(nextLine)) {
          break;
        }
        // Add bullet if it starts with bullet point or has content
        if (nextLine.match(/^[•●◆■▪▸►∙⦿⦾\-\*]/) || nextLine.length > 10) {
          bullets.push(nextLine.replace(/^[•●◆■▪▸►∙⦿⦾\-\*]\s*/, ""));
        }
        i++;
      }

      if (bullets.length > 0 || position.length > 5) {
        experiences.push({
          id: `exp${++jobIndex}`,
          company: company.replace(/^[•●◆■▪▸►∙⦿⦾\-\*]\s*/, ""),
          position:
            position
              .replace(
                /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*$/i,
                "",
              )
              .trim() || position,
          startDate: dates.start,
          endDate: dates.end,
          bullets,
        });
      }
    }
    i++;
  }

  return experiences;
}

/**
 * Extract education section from resume text
 */
export function extractEducation(text: string): Education[] {
  const education: Education[] = [];

  // Find education section - more keywords
  const eduSectionMatch = text.match(
    /(?:EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS|EDUCATIONAL BACKGROUND)([\s\S]*?)(?=EXPERIENCE|WORK|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|$)/i,
  );

  if (!eduSectionMatch) return education;

  const eduText = eduSectionMatch[1];

  // Pattern for education entries
  const eduPattern =
    /((?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate)[^\n]+)\n?([^\n]+)?\n?((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})[^\n]+)?/gi;
  let match;
  let eduIndex = 0;

  while ((match = eduPattern.exec(eduText)) !== null) {
    const [, degreeLine, institutionLine, dateRange] = match;

    const dates = dateRange
      ? parseDateRange(dateRange)
      : { start: "", end: "" };

    education.push({
      id: `edu${++eduIndex}`,
      institution: institutionLine?.trim() || "University",
      degree: degreeLine.trim(),
      field: "Field of Study",
      startDate: dates.start,
      endDate: dates.end,
    });
  }

  // If no education found, try simpler pattern
  if (education.length === 0 && eduText.trim()) {
    const lines = eduText.split("\n").filter((l) => l.trim());
    if (lines.length > 0) {
      education.push({
        id: "edu1",
        institution: lines[0]?.trim() || "University",
        degree: lines[1]?.trim() || "Degree",
        field: "Field of Study",
        startDate: "2015-09",
        endDate: "2019-05",
      });
    }
  }

  return education;
}

/**
 * Extract skills from resume text
 */
export function extractSkills(text: string): string[] {
  let skills: string[] = [];

  // Find skills section
  const skillsSectionMatch = text.match(
    /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)([\s\S]*?)(?=WORK|EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|AWARDS|$)/i,
  );

  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];

    // Split by common delimiters and clean up
    const skillList = skillsText
      .split(/[,;•\-\n:]/)
      .map((s) => s.trim())
      // Remove category labels
      .map((s) =>
        s.replace(
          /^(Frontend|Backend|Build|DevOps|Testing|Performance|System|Others?):\s*/i,
          "",
        ),
      )
      .map((s) => s.replace(/\([^)]+\)/g, "").trim()) // Remove text in parentheses
      .filter((s) => s && s.length > 1 && s.length < 40)
      .filter((s) => !/^(and|or|the|with|in|of|for)$/i.test(s))
      .filter(
        (s) =>
          !/^(Optimization|Design|Knowledge|Quality|Basic|Practices)$/i.test(s),
      );

    skills.push(...skillList);
  }

  // Also extract common tech skills from entire text
  const commonSkills = extractCommonSkills(text);
  skills.push(...commonSkills);

  // Remove duplicates and return
  return [...new Set(skills)].filter((s) => s.length > 1);
}

/**
 * Extract common tech skills from text
 */
function extractCommonSkills(text: string): string[] {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C\\+\\+",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "Laravel",
    "HTML",
    "CSS",
    "Sass",
    "Tailwind",
    "Bootstrap",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "DynamoDB",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "GitHub",
    "GitLab",
    "Jira",
    "Agile",
    "Scrum",
    "REST",
    "GraphQL",
    "API",
    "Microservices",
    "Machine Learning",
    "AI",
    "Data Analysis",
    "TensorFlow",
    "PyTorch",
  ];

  const foundSkills: string[] = [];

  commonSkills.forEach((skill) => {
    // Case-insensitive match with already escaped special characters
    const regex = new RegExp(`\\b${skill}\\b`, "i");
    if (regex.test(text)) {
      // Store the display name (without escaping)
      const displayName = skill.replace(/\\\+/g, "+");
      foundSkills.push(displayName);
    }
  });

  return foundSkills;
}

/**
 * Parse date range (e.g., "Jan 2020 - Present", "2020-2023")
 */
function parseDateRange(dateStr: string): { start: string; end: string } {
  const result = { start: "", end: "" };

  if (!dateStr) return result;

  // Check for "Present" or "Current"
  if (/present|current/i.test(dateStr)) {
    result.end = "Present";
  }

  // Extract year patterns
  const years = dateStr.match(/\d{4}/g);
  if (years && years.length >= 1) {
    result.start = `${years[0]}-01`;
    result.end = years.length >= 2 ? `${years[1]}-12` : result.end || "Present";
  }

  // Extract month-year patterns
  const monthYearMatch = dateStr.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/gi,
  );
  if (monthYearMatch && monthYearMatch.length >= 1) {
    result.start = convertMonthYearToISO(monthYearMatch[0]);
    if (monthYearMatch.length >= 2 && !result.end) {
      result.end = convertMonthYearToISO(monthYearMatch[1]);
    }
  }

  return result;
}

/**
 * Convert "Jan 2020" to "2020-01"
 */
function convertMonthYearToISO(monthYear: string): string {
  const months: { [key: string]: string } = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const match = monthYear.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
  );
  if (match) {
    const month = months[match[1].toLowerCase().substring(0, 3)];
    const year = match[2];
    return `${year}-${month}`;
  }

  return monthYear;
}

/**
 * Extract summary/objective from resume text
 */
export function extractSummary(text: string): string {
  // Look for summary section
  const summaryMatch = text.match(
    /(?:SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|PROFILE|ABOUT)([\s\S]*?)(?=EXPERIENCE|EDUCATION|SKILLS|$)/i,
  );

  if (summaryMatch) {
    const summary = summaryMatch[1].trim();
    // Return first 500 characters
    return summary.length > 500 ? summary.substring(0, 500) + "..." : summary;
  }

  // If no summary section, extract first paragraph after personal info
  const lines = text.split("\n").filter((l) => l.trim());
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Skip if it looks like a header or contact info
    if (line.length > 50 && !/@/.test(line) && !/^[A-Z\s]+$/.test(line)) {
      return line;
    }
  }

  return "";
}

/**
 * Normalize text by removing excessive spaces from PDF extraction
 */
function normalizeText(text: string): string {
  // This PDF has spaces between EVERY character: "S O M E S H" -> "SOMESH"

  let normalized = text;

  // Strategy: Aggressively remove all single spaces between individual characters
  // Keep only double spaces (line separators) and spaces between complete words

  // Step 1: Replace any sequence of "letter space letter" repeatedly
  // Do this many times to catch all patterns
  for (let i = 0; i < 20; i++) {
    // Match: single letter/digit, single space, single letter/digit
    normalized = normalized.replace(
      /([A-Za-z0-9])\s([A-Za-z0-9](?=\s|$|\.|,|;|:|\(|\)|&|-))/g,
      "$1$2",
    );
  }

  // Step 2: Clean up any remaining double spaces to single
  normalized = normalized.replace(/\s{2,}/g, " ");

  // Step 3: Fix common issues
  normalized = normalized.replace(/\s+([.,;:)])/g, "$1"); // Remove space before punctuation
  normalized = normalized.replace(/([(\[])\s+/g, "$1"); // Remove space after opening brackets

  return normalized.trim();
}

/**
 * Parse resume text into structured content
 */
export function parseResumeText(text: string): ResumeContent {
  // Normalize the text first
  const normalizedText = normalizeText(text);

  return {
    personalInfo: extractPersonalInfo(normalizedText),
    summary: extractSummary(normalizedText),
    experience: extractExperience(normalizedText),
    education: extractEducation(normalizedText),
    skills: extractSkills(normalizedText),
  };
}

/**
 * Detect if text has ATS-friendly formatting issues
 */
export function detectFormattingIssues(text: string): string[] {
  const issues: string[] = [];

  // Check for tables (often problematic)
  if (/\|.*\|/.test(text)) {
    issues.push("Contains tables which may not be ATS-friendly");
  }

  // Check for special characters
  if (/[★☆♦◆●○]/.test(text)) {
    issues.push("Contains special symbols that may not parse correctly");
  }

  // Check for two-column layout indicators
  if (/\t{2,}/.test(text)) {
    issues.push("May have multi-column layout which can confuse ATS");
  }

  // Check if sections are present
  const hasSections = /EXPERIENCE|EDUCATION|SKILLS/i.test(text);
  if (!hasSections) {
    issues.push("Missing standard sections (Experience, Education, Skills)");
  }

  return issues;
}
