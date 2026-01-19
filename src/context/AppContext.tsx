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
      setResumeState(savedResume);
    } else {
      // Use sample data if nothing saved
      setResumeState(sampleResume);
      saveResume(sampleResume);
    }

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
      const score = calculateATSScore(resume);
      setAtsScore(score);
    }
  }, [resume]);

  useEffect(() => {
    if (resume && jobDescription) {
      const analysis = analyzeJobMatch(resume, jobDescription);
      setMatchAnalysis(analysis);
    }
  }, [resume, jobDescription]);

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
      const score = calculateATSScore(resume);
      setAtsScore(score);
    }
    if (resume && jobDescription) {
      const analysis = analyzeJobMatch(resume, jobDescription);
      setMatchAnalysis(analysis);
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
