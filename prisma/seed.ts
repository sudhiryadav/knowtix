import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create subscription plans
  const plans = [
    {
      name: 'Free',
      description: 'Basic features for individual users',
      price: 0,
      currency: 'USD',
      features: [
        'Basic query generation',
        'Limited query history',
        'Community support',
        'Standard response time'
      ],
    },
    {
      name: 'Premium',
      description: 'Advanced features for power users',
      price: 100,
      currency: 'USD',
      features: [
        'Advanced query generation',
        'Unlimited query history',
        'Priority support',
        'Faster response time',
        'Custom query templates',
        'API access'
      ],
    },
    {
      name: 'Business',
      description: 'Enterprise features for teams',
      price: 5,
      currency: 'USD',
      features: [
        'All Premium features',
        'Team collaboration',
        'User management',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantees'
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('Subscription plans seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 