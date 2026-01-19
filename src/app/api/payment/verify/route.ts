/**
 * Payment Verification API
 * Verifies Razorpay payment signature and updates subscription
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PLANS, PlanId } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      userEmail,
    } = body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !planId ||
      !userEmail
    ) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400 },
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Payment verified successfully
    const plan = PLANS[planId as PlanId];
    const now = new Date();
    let expiresAt: Date | undefined;

    // Calculate expiry based on plan
    if (plan.id === "weekly") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (plan.id === "monthly") {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    // Return subscription data
    const subscriptionData = {
      plan: plan.id,
      status: "active" as const,
      expiresAt: expiresAt?.toISOString(),
      jdAnalysisCount: 0,
      maxJdAnalysis: plan.id === "single" ? 1 : undefined,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      purchasedAt: now.toISOString(),
    };

    // In production, you would:
    // 1. Store this in a database
    // 2. Send confirmation email
    // 3. Update user record

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      subscription: subscriptionData,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
