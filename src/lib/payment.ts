/**
 * Payment Service - Frontend integration with Razorpay
 */

import { PlanId } from "@/lib/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  planId: PlanId;
  userEmail: string;
  userName: string;
  onSuccess: (subscriptionData: any) => void;
  onFailure: (error: string) => void;
}

/**
 * Load Razorpay script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiate payment process
 */
export async function initiatePayment(options: PaymentOptions) {
  const { planId, userEmail, userName, onSuccess, onFailure } = options;

  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Create order on backend
    const orderResponse = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, userEmail, userName }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      throw new Error(error.error || "Failed to create order");
    }

    const orderData = await orderResponse.json();

    // Configure Razorpay options
    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "SkillAlign",
      description: `${orderData.planName} - Resume ATS Analysis`,
      order_id: orderData.orderId,
      prefill: {
        email: userEmail,
        name: userName,
      },
      theme: {
        color: "#2563eb",
      },
      handler: async function (response: any) {
        // Payment successful, verify on backend
        try {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              userEmail,
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error("Payment verification failed");
          }

          const verifyData = await verifyResponse.json();
          onSuccess(verifyData.subscription);
        } catch (error: any) {
          onFailure(error.message || "Payment verification failed");
        }
      },
      modal: {
        ondismiss: function () {
          onFailure("Payment cancelled by user");
        },
      },
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error: any) {
    onFailure(error.message || "Payment initiation failed");
  }
}

/**
 * Increment JD analysis count
 */
export async function incrementJDAnalysisCount(userEmail: string) {
  try {
    const response = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        action: "increment_jd_count",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update usage count");
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing JD count:", error);
    throw error;
  }
}
