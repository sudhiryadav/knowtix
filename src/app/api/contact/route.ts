import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendContactEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, message } = body;

    if (!fullName || !email || !phone || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Save the contact message to the database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone,
        message,
      },
    });

    // Send email notification
    const emailSent = await sendContactEmail({
      fullName,
      email,
      phone,
      message,
    });

    if (!emailSent) {
      console.error("Failed to send email notification");
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Error in contact API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 