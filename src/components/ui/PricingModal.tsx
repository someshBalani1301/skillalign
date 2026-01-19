"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { initiatePayment } from "@/lib/payment";
import { PlanId } from "@/lib/razorpay";
import Card from "./Card";
import Button from "./Button";
import Alert from "./Alert";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  requireAuth?: boolean;
}

const PLANS = [
  {
    id: "single",
    name: "Single JD Analysis",
    price: "₹99",
    period: "one-time",
    features: [
      "Full JD Match Analysis",
      "Missing Keywords Report",
      "Skill Gap Analysis",
      "Bullet Point Improvements",
      "ATS-Safe Export",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    id: "weekly",
    name: "7-Day Unlimited",
    price: "₹299",
    period: "7 days",
    features: [
      "Unlimited JD Analyses",
      "Unlimited Bullet Improvements",
      "Priority Support",
      "Advanced Analytics",
      "Export All Formats",
    ],
    popular: true,
    cta: "Most Popular",
  },
  {
    id: "monthly",
    name: "Monthly Pro",
    price: "₹999",
    period: "month",
    features: [
      "Everything in Weekly",
      "AI-Powered Suggestions",
      "Resume Templates",
      "Cover Letter Generator",
      "Interview Prep Tips",
    ],
    popular: false,
    cta: "Go Pro",
  },
];

export function PricingModal({
  isOpen,
  onClose,
  requireAuth = true,
}: PricingModalProps) {
  const { isAuthenticated, user, updateSubscriptionFromPayment } = useAuth();
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePlanSelect = async (planId: string) => {
    if (requireAuth && !isAuthenticated) {
      setShowAuthRequired(true);
      return;
    }

    if (!user) return;

    setError("");
    setSuccess("");
    setIsProcessing(true);

    try {
      await initiatePayment({
        planId: planId as PlanId,
        userEmail: user.email,
        userName: user.name,
        onSuccess: (subscriptionData) => {
          // Update user subscription
          updateSubscriptionFromPayment(subscriptionData);
          setSuccess("Payment successful! Your subscription is now active.");
          setTimeout(() => {
            onClose();
          }, 2000);
        },
        onFailure: (errorMessage) => {
          setError(errorMessage);
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center pt-12 pb-8 px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Unlock Full Analysis
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your job search
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 px-6 pb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              variant={plan.popular ? "elevated" : "bordered"}
              padding="lg"
              className={`relative ${plan.popular ? "border-2 border-blue-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    🔥 Best Value
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePlanSelect(plan.id)}
                variant={plan.popular ? "primary" : "outline"}
                className="w-full mt-8"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 px-6 py-8 border-t border-gray-200">
          {showAuthRequired && (
            <Alert variant="warning" className="mb-6">
              <p className="font-medium">
                ⚠️ Please sign in to purchase a plan
              </p>
              <p className="text-sm mt-1">
                Create a free account to unlock premium features
              </p>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mb-6">
              <p className="font-medium">Payment Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              <p className="font-medium">{success}</p>
            </Alert>
          )}

          {isProcessing && (
            <Alert variant="info" className="mb-6">
              <p className="font-medium">Processing payment...</p>
              <p className="text-sm mt-1">
                Please complete the payment in the Razorpay window
              </p>
            </Alert>
          )}

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💯</span>
              <span>Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
