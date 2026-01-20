"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Resume, JobDescription, ATSScore, MatchAnalysis } from "@/types";
import {
  sampleResume,
  sampleJobDescription,
  calculateATSScore,
  analyzeJobMatch,
} from "@/lib/mockData";
import {
  saveResume,
  getResume,
  saveJobDescription,
  getJobDescription,
} from "@/utils/storageUtils";

interface AppContextType {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  jobDescription: JobDescription | null;
  setJobDescription: (jd: JobDescription) => void;
  atsScore: ATSScore | null;
  matchAnalysis: MatchAnalysis | null;
  refreshScores: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResumeState] = useState<Resume | null>(null);
  const [jobDescription, setJobDescriptionState] =
    useState<JobDescription | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(
    null,
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedResume = getResume();
    const savedJD = getJobDescription();

    if (savedResume) {
      console.log("Loading saved resume from storage");
      setResumeState(savedResume);
    }
    // Don't auto-load sample data - let user upload

    if (savedJD) {
      setJobDescriptionState(savedJD);
    } else {
      setJobDescriptionState(sampleJobDescription);
      saveJobDescription(sampleJobDescription);
    }
  }, []);

  // Recalculate scores when resume or JD changes
  useEffect(() => {
    if (resume) {
      calculateScoresFromAPI(resume, jobDescription?.description);
    }
  }, [resume, jobDescription]);

  // Calculate scores using API
  const calculateScoresFromAPI = async (
    currentResume: Resume,
    jdText?: string,
  ) => {
    try {
      const response = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: currentResume,
          jobDescription: jdText,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAtsScore(result.data.atsScore);
          if (result.data.matchAnalysis) {
            // Convert matchAnalysis to MatchAnalysis type
            const match: MatchAnalysis = {
              matchScore: result.data.matchAnalysis.matchScore,
              matchedSkills: result.data.matchAnalysis.matchedSkills,
              missingSkills: result.data.matchAnalysis.missingSkills,
              matchedRequirements: [],
              missingRequirements: [],
              suggestions: result.data.matchAnalysis.suggestions,
            };
            setMatchAnalysis(match);
          }
        }
      } else {
        // Fallback to mock data
        const score = calculateATSScore(currentResume);
        setAtsScore(score);
      }
    } catch (error) {
      console.error("Error calculating scores:", error);
      // Fallback to mock data
      const score = calculateATSScore(currentResume);
      setAtsScore(score);
    }
  };

  const setResume = (newResume: Resume) => {
    setResumeState(newResume);
    saveResume(newResume);
  };

  const setJobDescription = (newJD: JobDescription) => {
    setJobDescriptionState(newJD);
    saveJobDescription(newJD);
  };

  const refreshScores = () => {
    if (resume) {
      calculateScoresFromAPI(resume, jobDescription?.description);
    }
  };

  return (
    <AppContext.Provider
      value={{
        resume,
        setResume,
        jobDescription,
        setJobDescription,
        atsScore,
        matchAnalysis,
        refreshScores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
