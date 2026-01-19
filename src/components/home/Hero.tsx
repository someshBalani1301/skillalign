"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";
import { Button, Badge } from "@/components/ui";

export function Hero() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard/upload");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center animate-fade-in">
        <Badge variant="info" className="mb-4">
          🚀 AI-Powered Resume Optimization
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight text-balance">
          Beat the ATS.
          <br />
          <span className="text-blue-600">Land Your Dream Job.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto text-balance">
          Optimize your resume for Applicant Tracking Systems, match job
          descriptions, and get actionable feedback in seconds.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative">
            <Button
              onClick={handleGetStarted}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl"
            >
              Upload Your Resume
            </Button>
            <Badge variant="success" className="absolute -top-2 -right-2">
              FREE
            </Badge>
          </div>
          <Button
            href="#features"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            See How It Works
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          ✓ Free ATS Score · ✓ No Credit Card · ✓ Unlock Full Analysis from ₹99
        </p>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
