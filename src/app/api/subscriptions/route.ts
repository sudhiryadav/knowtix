import { NextResponse } from "next/server";
import { createSubscription, createPlan, createCustomer } from "@/utils/razorpay";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId } = body;

    if (!userId || !planId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create or get customer in Razorpay
    const customer = await createCustomer({
      name: user.name || "",
      email: user.email,
      contact: user.phone || "",
    });

    // Create subscription
    const subscription = await createSubscription({
      planId,
      customerId: customer.id,
      totalCount: 12, // 12 months subscription
      notes: {
        userId: user.id,
      },
    });

    // Save subscription details to database
    await prisma.subscription.create({
      data: {
        userId: user.id,
        razorpaySubscriptionId: subscription.id,
        razorpayCustomerId: customer.id,
        planId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_start),
        currentPeriodEnd: new Date(subscription.current_end),
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Error in subscription API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 