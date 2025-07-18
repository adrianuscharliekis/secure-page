import { Suspense } from "react";
import LoginHandler from "@/components/LoginHandler"; // Adjust path if needed
import Loading from "@/components/Loading";

// This page remains a Server Component, which is good practice.
export const metadata = {
  title: "Secure Page KIS",
  description: "Secure page from KIS for booking ticket",
};
export default function LoginPage() {
  return (
    <Suspense fallback={<Loading text=" Preparing login..." />}>
      <LoginHandler />
    </Suspense>
  );
}