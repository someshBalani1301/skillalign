/**
 * Payment Initiation API
 * Creates a Razorpay order
 */

import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance, PLANS, PlanId } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userEmail, userName } = body;

    // Validate plan
    if (!planId || !(planId in PLANS)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    // Validate user data
    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: "User information required" },
        { status: 400 },
      );
    }

    const plan = PLANS[planId as PlanId];
    const razorpay = getRazorpayInstance();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planId: plan.id,
        userEmail,
        userName,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: plan.id,
      planName: plan.name,
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate payment",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
