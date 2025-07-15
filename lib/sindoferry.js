// lib/sindoferry.js

import useSWR from "swr";

// I am assuming your axios instance is imported from another file like this.
// Please adjust the path if it's different.
import { axiosSindoferry } from "./axiosInstance";
import { additionalPayload } from "@/const/sindoferry";
import { redirect } from "next/navigation";

// --- Best Practice: SWR Configuration for static data ---
// This prevents SWR from refetching on window focus for data that rarely changes.
const staticDataSwrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

export const getRoutes = async (url) => {
  try {
    const { data } = await axiosSindoferry.get(url);
    if (data?.success && Array.isArray(data.data?.records)) {
      return data.data.records;
    }
    return [];
  } catch (error) {
    console.error("Network or other error in getRoutes:", error.message);
    return [];
  }
};

export const useRoutes = () => {
  const { data, error, isLoading } = useSWR(
    "/getRoutes",
    getRoutes,
    staticDataSwrOptions // Apply static data options
  );

  return {
    routes: data ?? [],
    isLoading,
    isError: !!error,
  };
};

// Get Available countries for nationality
export const getCountries = async (url) => {
  try {
    const { data } = await axiosSindoferry.get(url);
    if (
      data.success &&
      Array.isArray(data.data?.records) &&
      data.data.totalRecords > 0
    ) {
      return data.data.records;
    }
    return [];
  } catch (error) {
    console.error("Network or other error in getCountries:", error.message);
    return [];
  }
};

export const useCountries = () => {
  const { data, error, isLoading } = useSWR(
    "/getCountries",
    getCountries,
    staticDataSwrOptions // Apply static data options
  );

  return {
    countries: data ?? [],
    isLoading,
    isError: !!error,
  };
};

// Get trip schedule
// The key for this fetcher is an array, so the fetcher function receives all parts of it.
export const getTrips = async ([url, embarkation, destination, tripDate]) => {
  // Assuming 'additionalParam' is defined elsewhere in your project
  try {
    const additionalParam = {};
    const payload = {
      embarkation,
      destination,
      tripDate,
      ...additionalParam,
    };

    const { data } = await axiosSindoferry.post(url, payload);
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (error) {
    console.error("Network or other error in getTrips:", error.message);
    return [];
  }
};

export const useTrips = (embarkation, destination, tripDate) => {
  const shouldFetch = embarkation && destination && tripDate;

  const key = shouldFetch
    ? ["/getTrips", embarkation, destination, tripDate]
    : null;

  const { data, error, isLoading } = useSWR(
    key,
    getTrips,
    staticDataSwrOptions
  );

  return {
    trips: data ?? [],
    isLoading,
    isError: !!error,
  };
};

export const createBooking = async (formData, countries = []) => {
  console.log(formData);
  // Helper function to format time from "HH:mm" to "HHmm"
  // Helper function to format time from "HH:mm" to "HHmm"
  const formatTime = (timeString) =>
    timeString ? timeString.replace(":", "") : "";

  // Helper function to format a date string into YYYY-MM-DD format.
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    // Create a Date object from the input string
    const date = new Date(dateString);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Return the formatted string
    return `${year}-${month}-${day}`;
  };

  // 1. Construct the 'departureCoreApiTrip' object
  const departureCoreApiTrip = {
    Date: formatDate(formData.outbound.tripDate),
    RouteID: formData.outbound.route.id,
    Id: formData.outbound.trip.tripID,
    Time: formatTime(formData.outbound.trip.departureTime),
    GateOpen: formatTime(formData.outbound.trip.gateOpen),
    GateClose: formatTime(formData.outbound.trip.gateClose),
  };

  // 2. Construct the 'param' object
  // It combines static data with dynamic data from the form.
  const { contactDetails } = formData;
  const param = {
    ...additionalPayload,
    trxToko: "", // As per the example, this is an empty string.
    asal: formData.outbound.route.embarkationPort.name,
    kodeAsal: formData.outbound.route.embarkationPort.code,
    tujuan: formData.outbound.route.destinationPort.name,
    kodeTujuan: formData.outbound.route.destinationPort.code,
    jumlahPenumpang: String(formData.passengers.length), // API expects a string
    emailPemesan: contactDetails.email, // Passed as an argument
    namaPemesan: contactDetails.fullName, // Passed as an argument
  };

  // 3. Construct the 'bookingDetails' array
  // This maps over the passengers array from the form data.
  const bookingDetails = formData.passengers.map((p) => {
    // Find the country object that matches the passenger's nationalityID
    const country = countries.find((c) => c.id === p.nationalityID);

    return {
      type: p.type,
      no: p.no,
      fullName: p.fullName,
      gender: p.gender,
      dateOfBirth: p.dateOfBirth,
      placeOfBirth: p.placeOfBirth,
      issueDate: p.issueDate,
      expiryDate: p.expiryDate,
      nationalityID: p.nationalityID,
      issuanceCountryID: p.issuanceCountryID,
      // Use the nationality from the found country, or a default if not found.
      nationality: country ? country.nationality : "UNKNOWN",
    };
  });

  // 4. Conditionally construct the 'returnCoreApiTrip' object
  let returnCoreApiTrip = null;
  // Check if it's a round trip and if the necessary return data exists.
  if (
    formData.isRoundTrip &&
    formData.return &&
    formData.return.route &&
    formData.return.trip
  ) {
    returnCoreApiTrip = {
      Date: formatDate(formData.return.tripDate),
      RouteID: formData.return.route.id,
      Id: formData.return.trip.tripID,
      Time: formatTime(formData.return.trip.departureTime),
      GateOpen: formatTime(formData.return.trip.gateOpen),
      GateClose: formatTime(formData.return.trip.gateClose),
    };
  }

  // 5. Assemble the final payload object
  const finalPayload = {
    isRoundTrip: formData.isRoundTrip,
    isReturnTripOpen: false, // This was false in the example, adjust if needed.
    departureCoreApiTrip: departureCoreApiTrip,
    returnCoreApiTrip: returnCoreApiTrip, // Use the conditionally created object
    param: param,
    bookingDetails: bookingDetails,
  };

  try {
    const { data } = await axiosSindoferry.post("/createBooking", finalPayload);
    console.log(data);

    if (data.success && data.data) {
      const url = new URL(process.env.NEXT_PUBLIC_URL_DEEP_LINK);
      alert("hoie")
      console.log(url)
      const param = {
        plu: data.data.plu === null ? "" : data.data.plu,
        paymentcode: data.data.data,
        trxid: data.data.trxToko,
      };
      url.search = new URLSearchParams(param).toString();
      console.log("Redirecting to payment:", url.toString());
      window.location.replace(url.toString());
    } else {
      return null;
    }
  } catch (error) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("An actual error occurred during booking:", error);
  }
};
