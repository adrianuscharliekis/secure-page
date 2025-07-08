import { Suspense } from "react";
import LoginHandler from "@/components/LoginHandler"; // Adjust path if needed
import Loading from "@/components/Loading";

// This page remains a Server Component, which is good practice.
export default function LoginPage() {
  return (
    <Suspense fallback={<Loading text="Preparing login..." />}>
      <LoginHandler />
    </Suspense>
  );
}