import Breadcrumb from "@/components/Common/Breadcrumb";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSubscription, createCustomer } from "@/utils/razorpay";

export const metadata: Metadata = {
  title: "Pricing | Knowtix - AI-Powered Document Conversations",
  description: "Choose the perfect Knowtix plan for your organization's document conversation needs.",
};

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true, price: { gt: 0 } },
    orderBy: { id: 'asc' },
  });

  async function handleSubscription(planId: string) {
    'use server';
    
    const currentSession = await getServerSession(authOptions);
    if (!currentSession?.user) {
      return { success: false, error: "Please login to subscribe" };
    }

    try {
      // Create or get customer in Razorpay
      const customer = await createCustomer({
        name: currentSession.user.name || "",
        email: currentSession.user.email || "",
        contact: "", // Remove phone since it's not in the session type
      });

      // Create subscription
      const subscription = await createSubscription({
        planId,
        customerId: customer.id,
        totalCount: 12, // 12 months subscription
        notes: {
          userId: currentSession.user.id,
        },
      });

      // Save subscription details to database
      await prisma.subscription.create({
        data: {
          userId: currentSession.user.id,
          razorpaySubscriptionId: subscription.id,
          razorpayCustomerId: customer.id,
          planId,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_start || Date.now()),
          currentPeriodEnd: new Date(subscription.current_end || Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days if not provided
        },
      });

      return { success: true, subscription };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  return (
    <>
      <Breadcrumb
        pageName="Pricing"
        pageDescription="Choose the perfect plan for your needs"
      />
      <Pricing 
        plans={plans as SubscriptionPlan[]} 
        handleSubscription={handleSubscription} 
        isAuthenticated={!!session?.user}
      />
      <Faq />
    </>
  );
}