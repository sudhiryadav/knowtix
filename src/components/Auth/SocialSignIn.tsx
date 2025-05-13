import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SocialSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      router.push("/auth/error?error=OAuthSignin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-4 p-3.5 text-dark duration-200 ease-in hover:border-gray-5 hover:bg-gray dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
        ) : (
          <svg
            width="23"
            height="22"
            viewBox="0 0 23 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_709_8846)">
              <path
                d="M22.5001 11.2438C22.5134 10.4876 22.4338 9.73256 22.2629 8.995H11.7246V13.0771H17.9105C17.7933 13.7929 17.5296 14.478 17.1352 15.0914C16.7409 15.7047 16.224 16.2335 15.6158 16.646L15.5942 16.7827L18.9264 19.3124L19.1571 19.335C21.2772 17.4161 22.4997 14.5926 22.4997 11.2438"
                fill="#4285F4"
              />
              <path
                d="M11.7245 22C14.755 22 17.2992 21.0221 19.1577 19.3355L15.6156 16.6464C14.6679 17.2944 13.3958 17.7467 11.7245 17.7467C10.3051 17.7385 8.92433 17.2926 7.77814 16.472C6.63195 15.6515 5.77851 14.4981 5.33892 13.1755L5.20737 13.1865L1.74255 15.8142L1.69727 15.9376C2.63043 17.7602 4.06252 19.2925 5.83341 20.3631C7.60429 21.4337 9.64416 22.0005 11.7249 22"
                fill="#34A853"
              />
              <path
                d="M5.33889 13.1755C5.09338 12.4753 4.96669 11.7404 4.96388 11C4.9684 10.2608 5.09041 9.52685 5.32552 8.8245L5.31927 8.67868L1.81196 6.00867L1.69724 6.06214C0.910039 7.5938 0.5 9.28491 0.5 10.9999C0.5 12.7148 0.910039 14.406 1.69724 15.9376L5.33889 13.1755Z"
                fill="#FBBC05"
              />
              <path
                d="M11.7245 4.25333C13.3105 4.25333 14.7426 4.82667 15.8718 5.96L19.1577 2.67417C17.2992 0.886667 14.755 0 11.7245 0C9.64416 0 7.60429 0.566833 5.83341 1.6375C4.06252 2.70817 2.63043 4.2405 1.69727 6.06217L5.33892 8.82433C5.77851 7.50167 6.63195 6.34833 7.77814 5.52783C8.92433 4.70733 10.3051 4.2615 11.7245 4.25333Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_709_8846">
                <rect width="22" height="22" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        )}
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </>
  );
};

export default SocialSignIn;
