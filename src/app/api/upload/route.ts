import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/auth';
import { prisma } from '@/utils/prismaDB';

export async function POST(request: NextRequest) {
  // 1. Check authentication
  const session = await getServerSession(authOptions);
  // Try to get user id from session.user.id or session.user.sub (for JWT strategy)
  const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Check subscription status
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  if (!subscription || subscription.status !== 'active') {
    return NextResponse.json({ error: 'Subscription required' }, { status: 402 });
  }

  // 3. Forward the request to FastAPI backend
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Prepare the request to FastAPI
  const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000/upload';
  const fetchRes = await fetch(fastApiUrl, {
    method: 'POST',
    body: formData,
  });
  const result = await fetchRes.json();
  return NextResponse.json(result, { status: fetchRes.status });
} 