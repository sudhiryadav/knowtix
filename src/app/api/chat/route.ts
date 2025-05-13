import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify the user is sending the message for themselves
    if (session.user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Save the message to the database
    const savedMessage = await prisma.message.create({
      data: {
        content: message,
        userId: userId,
        role: "user",
      },
    });

    // TODO: Add your AI response generation logic here
    // For now, we'll just echo back the message
    const aiResponse = `Echo: ${message}`;

    // Save the AI response
    const savedResponse = await prisma.message.create({
      data: {
        content: aiResponse,
        userId: userId,
        role: "assistant",
      },
    });

    return NextResponse.json({
      message: aiResponse,
      messageId: savedMessage.id,
      responseId: savedResponse.id,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 