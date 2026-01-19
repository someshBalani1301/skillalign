export interface Resume {
  id: string;
  fileName: string;
  uploadDate: Date;
  content: ResumeContent;
  rawText: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  projects?: Project[];
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location?: string;
  bullets: string[];
  isImproved?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
}

export interface ATSScore {
  overallScore: number;
  breakdown: {
    formatting: number;
    keywords: number;
    experience: number;
    education: number;
    skills: number;
  };
  recommendations: string[];
  missingKeywords: string[];
  foundKeywords: string[];
}

export interface MatchAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedRequirements: string[];
  missingRequirements: string[];
  suggestions: string[];
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
  impact: "low" | "medium" | "high";
}
