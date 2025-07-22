"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Loading from "@/components/Loading";

export default function LoginHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ca_code = searchParams.get("ca_code");
  const payload = searchParams.get("signature");
  const timestamp = searchParams.get("timestamp");
  const productType = searchParams.get("product");
  const externalId = searchParams.get("externalId");

  const redirect = "/secure/" + productType;

  useEffect(() => {
    if (!ca_code || !payload || !timestamp || !productType || !externalId) {
      console.error("Login parameters are missing.");
      router.replace("/unauthorized"); // Replace to prevent back navigation
      return;
    }

    const login = async () => {
      const result = await signIn("credentials", {
        ca_code,
        payload,
        timestamp,
        productType,
        externalId,
        redirect: false, // Important: prevent automatic redirect
      });

      if (result?.ok) {
        window.location.replace(redirect);
      } else {
        router.replace("/unauthorized");
      }
    };

    login();
  }, [ca_code, payload, timestamp, redirect, productType, externalId, router]);

  return <Loading isOpen={true} text="Logging you in, please wait..." />;
}
