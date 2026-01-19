/**
 * Razorpay Configuration and Utilities
 */

import Razorpay from "razorpay";

// Initialize Razorpay instance (server-side only)
export function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Plan configurations
export const PLANS = {
  single: {
    id: "single",
    name: "Single JD",
    amount: 9900, // Amount in paise (₹99)
    currency: "INR",
    description: "One-time Job Description Analysis",
    features: ["1 JD Analysis", "Full Report", "7 days validity"],
    maxAnalysis: 1,
  },
  weekly: {
    id: "weekly",
    name: "Weekly Pro",
    amount: 29900, // Amount in paise (₹299)
    currency: "INR",
    description: "Unlimited for 7 days",
    features: ["Unlimited JD Analysis", "Priority Support", "7 days validity"],
    validityDays: 7,
  },
  monthly: {
    id: "monthly",
    name: "Monthly Pro",
    amount: 99900, // Amount in paise (₹999)
    currency: "INR",
    description: "Unlimited for 30 days",
    features: [
      "Unlimited JD Analysis",
      "Priority Support",
      "Advanced Analytics",
      "30 days validity",
    ],
    validityDays: 30,
  },
} as const;

export type PlanId = keyof typeof PLANS;

// Razorpay options for frontend
export function getRazorpayOptions(
  orderId: string,
  amount: number,
  userEmail: string,
  userName: string,
) {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount,
    currency: "INR",
    name: "SkillAlign",
    description: "Resume ATS Analysis",
    order_id: orderId,
    prefill: {
      email: userEmail,
      name: userName,
    },
    theme: {
      color: "#2563eb",
    },
  };
}
