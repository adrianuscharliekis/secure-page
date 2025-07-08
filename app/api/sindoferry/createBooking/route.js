import { fetchWithToken } from "@/lib/axiosInstance";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { accessToken, externalKey, partnerKey } = await getToken({ req });
  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        data: null,
      },
      {
        status: 401,
      }
    );
  }
  try {
    const reqPayload = await req.json();
    if (reqPayload === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request",
          data: null,
        },
        {
          status: 400,
        }
      );
    }
    const { data } = await fetchWithToken(
      "/createBooking",
      accessToken,
      reqPayload,
      {
        "X-PARTNER-ID": partnerKey,
        "X-EXTERNAL-ID": externalKey,
      }
    );
    if (data?.data) {
      return NextResponse.json(
        {
          success: true,
          message: data.message,
          data: data,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: data?.message,
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Sindoferry API Error:",
      error.response?.data || error.message
    );
    if (error.response?.status === 401) {
      // If the gateway says the token is invalid, propagate the 401 status.
      return NextResponse.json(
        { message: "Session expired or invalid. Please log in again." },
        { status: 401 }
      );
    }
    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.response.data?.message ||
            "An error occurred with the external service.",
          data: null,
        },
        { status: 502 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Internal Server Error: Could not connect to external service.",
          data: null,
        },
        { status: 500 }
      );
    }
  }
};
