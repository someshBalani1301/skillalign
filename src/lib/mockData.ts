import {
  Resume,
  JobDescription,
  ATSScore,
  MatchAnalysis,
  BulletImprovement,
} from "@/types";

export const sampleResume: Resume = {
  id: "1",
  fileName: "sample-resume.pdf",
  uploadDate: new Date("2026-01-15"),
  rawText: "Sample resume text content...",
  content: {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedIn: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    summary:
      "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.",
    experience: [
      {
        id: "exp1",
        company: "Tech Corp",
        position: "Senior Software Engineer",
        startDate: "2022-01",
        endDate: "Present",
        location: "San Francisco, CA",
        bullets: [
          "Led development of microservices architecture serving 1M+ users",
          "Improved application performance by 40% through code optimization",
          "Mentored team of 5 junior developers",
        ],
      },
      {
        id: "exp2",
        company: "StartupXYZ",
        position: "Software Engineer",
        startDate: "2019-06",
        endDate: "2021-12",
        location: "Remote",
        bullets: [
          "Built RESTful APIs using Node.js and Express",
          "Implemented CI/CD pipelines reducing deployment time by 50%",
          "Collaborated with cross-functional teams",
        ],
      },
    ],
    education: [
      {
        id: "edu1",
        institution: "University of California",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2015-09",
        endDate: "2019-05",
        gpa: "3.8",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Agile",
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional",
    ],
    projects: [
      {
        id: "proj1",
        name: "E-commerce Platform",
        description:
          "Built full-stack e-commerce solution with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "github.com/johndoe/ecommerce",
      },
    ],
  },
};

export const sampleJobDescription: JobDescription = {
  id: "jd1",
  title: "Senior Full Stack Developer",
  company: "Innovative Tech Inc.",
  description:
    "We are seeking an experienced Full Stack Developer to join our growing team...",
  requirements: [
    "5+ years of professional software development experience",
    "Strong proficiency in JavaScript, TypeScript, and React",
    "Experience with Node.js and Express",
    "Knowledge of database systems (SQL and NoSQL)",
    "Experience with cloud platforms (AWS, Azure, or GCP)",
    "Strong understanding of RESTful API design",
    "Experience with version control (Git)",
  ],
  preferredSkills: [
    "Kubernetes and Docker",
    "CI/CD pipelines",
    "GraphQL",
    "Microservices architecture",
    "Test-driven development",
    "Agile methodologies",
  ],
};

export const calculateATSScore = (resume: Resume): ATSScore => {
  // Simple mock calculation based on resume content
  const hasGoodFormat = resume.content.personalInfo.name.length > 0 ? 85 : 60;
  const keywordScore = Math.min(resume.content.skills.length * 5, 90);
  const experienceScore = Math.min(resume.content.experience.length * 30, 90);
  const educationScore = resume.content.education.length > 0 ? 85 : 70;
  const skillsScore = Math.min(resume.content.skills.length * 7, 95);

  const overallScore = Math.round(
    (hasGoodFormat +
      keywordScore +
      experienceScore +
      educationScore +
      skillsScore) /
      5,
  );

  return {
    overallScore,
    breakdown: {
      formatting: hasGoodFormat,
      keywords: keywordScore,
      experience: experienceScore,
      education: educationScore,
      skills: skillsScore,
    },
    recommendations: [
      overallScore < 70
        ? "Add more relevant keywords from job descriptions"
        : "Great keyword usage!",
      resume.content.summary
        ? "Good professional summary"
        : "Consider adding a professional summary",
      resume.content.skills.length < 10
        ? "Add more technical skills"
        : "Excellent skills section",
      resume.content.experience.some((exp) => exp.bullets.length < 3)
        ? "Add more bullet points to experience sections"
        : "Good detail in experience section",
    ],
    missingKeywords: [
      "leadership",
      "stakeholder management",
      "system design",
      "scalability",
    ],
    foundKeywords: resume.content.skills.slice(0, 8),
  };
};

export const analyzeJobMatch = (
  resume: Resume,
  jd: JobDescription,
): MatchAnalysis => {
  const resumeSkills = resume.content.skills.map((s) => s.toLowerCase());
  const allJDSkills = [
    ...jd.requirements.join(" ").toLowerCase().split(" "),
    ...jd.preferredSkills.map((s) => s.toLowerCase()),
  ];

  const matchedSkills = resume.content.skills.filter((skill) =>
    allJDSkills.some(
      (jdSkill) =>
        jdSkill.includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jdSkill),
    ),
  );

  const missingSkills = jd.preferredSkills.filter(
    (skill) =>
      !resumeSkills.some(
        (rs) =>
          rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs),
      ),
  );

  const matchScore = Math.round(
    (matchedSkills.length / (matchedSkills.length + missingSkills.length)) *
      100,
  );

  return {
    matchScore,
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 8),
    matchedRequirements: jd.requirements.slice(0, 5),
    missingRequirements: jd.requirements.slice(5, 7),
    suggestions: [
      `Add ${missingSkills[0] || "relevant"} to your skills section`,
      "Incorporate more keywords from the job description in your experience bullets",
      "Quantify your achievements with specific metrics",
      "Highlight leadership and team collaboration experience",
    ],
  };
};

export const improveBullet = (bullet: string): BulletImprovement => {
  const improvements: { [key: string]: BulletImprovement } = {
    default: {
      original: bullet,
      improved: `Spearheaded ${bullet.toLowerCase()} resulting in 35% efficiency improvement and $200K cost savings`,
      reason: "Added action verb, quantified impact, and business value",
      impact: "high",
    },
  };

  // Simple pattern matching for common improvements
  if (
    bullet.toLowerCase().includes("worked on") ||
    bullet.toLowerCase().includes("responsible for")
  ) {
    return {
      original: bullet,
      improved: bullet.replace(
        /worked on|responsible for/i,
        "Led development of",
      ),
      reason: "Changed weak phrase to strong action verb",
      impact: "high",
    };
  }

  if (!/\d/.test(bullet)) {
    return {
      original: bullet,
      improved: `${bullet.replace(/\.$/, "")} achieving 45% increase in team productivity`,
      reason: "Added quantifiable metric to demonstrate impact",
      impact: "high",
    };
  }

  return improvements.default;
};

export const bulletSuggestions = [
  {
    category: "Action Verbs",
    examples: [
      "Spearheaded",
      "Architected",
      "Orchestrated",
      "Pioneered",
      "Engineered",
      "Optimized",
      "Streamlined",
      "Championed",
    ],
  },
  {
    category: "Quantifiable Metrics",
    examples: [
      "Increased performance by X%",
      "Reduced costs by $X",
      "Served X+ users",
      "Managed team of X",
      "Delivered X projects",
    ],
  },
  {
    category: "Impact Words",
    examples: [
      "resulting in",
      "leading to",
      "achieving",
      "driving",
      "enabling",
      "contributing to",
    ],
  },
];
