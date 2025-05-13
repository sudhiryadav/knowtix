import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CustomerData {
  name: string;
  email: string;
  contact: string;
}

interface SubscriptionData {
  planId: string;
  customerId: string;
  totalCount: number;
  notes?: Record<string, any>;
}

export async function createCustomer(data: CustomerData) {
  try {
    const customer = await razorpay.customers.create({
      name: data.name,
      email: data.email,
      contact: data.contact,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Razorpay customer:', error);
    throw error;
  }
}

export async function createSubscription(data: SubscriptionData) {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: data.planId,
      customer_notify: 1,
      total_count: data.totalCount,
      notes: data.notes,
    });
    return subscription;
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

export async function createPlan({
  name,
  amount,
  currency = 'INR',
  interval = 'monthly',
  intervalCount = 1,
}: {
  name: string;
  amount: number;
  currency?: string;
  interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  intervalCount?: number;
}) {
  try {
    const plan = await razorpay.plans.create({
      period: interval,
      interval: intervalCount,
      item: {
        name,
        amount: amount * 100, // Convert to paise
        currency,
      },
    });

    return plan;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
} 