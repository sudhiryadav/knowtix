import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    console.log("Webhook received:", {
      signature,
      body: JSON.parse(body),
    });

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case "subscription.activated":
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      case "subscription.charged":
        await handleSubscriptionCharged(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(subscription: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: subscription.id,
    },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_start),
      currentPeriodEnd: new Date(subscription.current_end),
    },
  });
}

async function handleSubscriptionCancelled(subscription: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: subscription.id,
    },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
    },
  });
}

async function handleSubscriptionCharged(payment: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: payment.subscription_id,
    },
    data: {
      lastPaymentId: payment.id,
      lastPaymentAmount: payment.amount / 100, // Convert from paise to rupees
      lastPaymentDate: new Date(payment.created_at),
    },
  });
}

async function handlePaymentFailed(payment: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: payment.subscription_id,
    },
    data: {
      status: "failed",
      lastPaymentError: payment.error_description,
    },
  });
} 