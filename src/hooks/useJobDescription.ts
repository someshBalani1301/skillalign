/**
 * Custom hook for job description operations
 */

import { useApp } from "@/context/AppContext";
import { JobDescription } from "@/types";

export function useJobDescription() {
  const { jobDescription, setJobDescription, matchAnalysis } = useApp();

  const hasJobDescription = Boolean(jobDescription);
  const hasMatchAnalysis = Boolean(matchAnalysis);

  const updateJobDescription = (jd: Partial<JobDescription>) => {
    if (jobDescription) {
      setJobDescription({ ...jobDescription, ...jd });
    } else if (
      jd.id &&
      jd.title &&
      jd.company &&
      jd.description &&
      jd.requirements &&
      jd.preferredSkills
    ) {
      setJobDescription(jd as JobDescription);
    }
  };

  return {
    jobDescription,
    setJobDescription,
    matchAnalysis,
    hasJobDescription,
    hasMatchAnalysis,
    updateJobDescription,
  };
}
