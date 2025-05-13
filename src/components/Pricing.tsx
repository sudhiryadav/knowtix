'use client';

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
};

type PricingProps = {
  plans: SubscriptionPlan[];
  handleSubscription: (planId: string) => Promise<{ success: boolean; subscription?: any; error?: string }>;
  isAuthenticated: boolean;
};

export default function Pricing({ plans, handleSubscription, isAuthenticated }: PricingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    setError(null);
    
    try {
      if (!isAuthenticated) {
        router.push(`/login?callbackUrl=/pricing`);
        return;
      }

      const result = await handleSubscription(planId);
      
      if (result.success && result.subscription) {
        window.location.href = result.subscription.short_url;
      } else {
        setError(result.error || "Failed to create subscription");
      }
    } catch (error) {
      setError("An error occurred while processing your request");
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

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
        {error && (
          <div className="mx-auto mt-4 max-w-2xl text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans?.map((plan: SubscriptionPlan) => (
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
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.name === 'Premium'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:outline-indigo-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  "Processing..."
                ) : isAuthenticated ? (
                  "Get started today"
                ) : (
                  "Sign in to subscribe"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 