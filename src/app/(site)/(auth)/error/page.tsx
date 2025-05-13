"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthCallback":
        return "There was a problem with the authentication process. Please try again.";
      case "OAuthSignin":
        return "There was a problem signing in. Please try again.";
      case "OAuthCreateAccount":
        return "There was a problem creating your account. Please try again.";
      case "EmailCreateAccount":
        return "There was a problem creating your account. Please try again.";
      case "Callback":
        return "There was a problem with the callback. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in with the original provider.";
      case "EmailSignin":
        return "There was a problem signing in with email. Please try again.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-dark-2">
        <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white">
          Authentication Error
        </h1>
        <p className="mb-6 text-gray-6 dark:text-gray-4">
          {getErrorMessage(error)}
        </p>
        <div className="flex justify-center">
          <Link
            href="/signin"
            className="rounded-md bg-primary px-6 py-3 text-white hover:bg-opacity-90"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 