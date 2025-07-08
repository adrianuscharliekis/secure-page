"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Loading from "@/components/Loading";

export default function LoginHandler() {
  const searchParams = useSearchParams();
  const ca_code = searchParams.get("ca_code");
  const payload = searchParams.get("payload");
  const timestamp = searchParams.get("timestamp");
  const redirect = searchParams.get("redirect") || "/secure";
  const splitted = redirect.split("/");
  const productType = splitted[splitted.length - 1];

  useEffect(() => {
    if (!ca_code || !payload) {
        console.error("Login parameters are missing.");
        return;
    }
    
    const login = async () => {
      await signIn("credentials", {
        ca_code,
        payload,
        timestamp,
        productType,
        redirect: true,
        callbackUrl: redirect,
      });
    };

    login();
  }, [ca_code, payload, timestamp, redirect, productType]); // Added all dependencies

  return <Loading isOpen={true} text="Logging you in, please wait..." />;
}