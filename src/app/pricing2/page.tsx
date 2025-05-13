import { prisma } from "@/utils/prismaDB";
import { Check } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSubscription, createCustomer } from "@/utils/razorpay";

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
  if (!session?.user) {
    redirect("/login");
  }

  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });

  async function handleSubscription(planId: string) {
    'use server';
    
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    try {
      // Create or get customer in Razorpay
      const customer = await createCustomer({
        name: session.user.name || "",
        email: session.user.email || "",
        contact: session.user.phone || "",
      });

      // Create subscription
      const subscription = await createSubscription({
        planId,
        customerId: customer.id,
        totalCount: 12, // 12 months subscription
        notes: {
          userId: session.user.id,
        },
      });

      // Save subscription details to database
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          razorpaySubscriptionId: subscription.id,
          razorpayCustomerId: customer.id,
          planId,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_start),
          currentPeriodEnd: new Date(subscription.current_end),
        },
      });

      return { success: true, subscription };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Select the perfect plan to supercharge your query generation experience
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan: SubscriptionPlan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                plan.name === 'Premium' ? 'lg:z-10 lg:rounded-b-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      plan.name === 'Premium' ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <form action={async () => {
                try {
                  const result = await handleSubscription(plan.id);
                  if (result.success) {
                    // Redirect to Razorpay payment page
                    window.location.href = result.subscription.short_url;
                  }
                } catch (error) {
                  console.error("Error:", error);
                }
              }}>
                <button
                  type="submit"
                  className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    plan.name === 'Premium'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:outline-indigo-600'
                  }`}
                >
                  Get started today
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 