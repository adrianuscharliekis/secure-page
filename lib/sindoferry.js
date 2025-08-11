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
      const newData = data.data.records.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return newData;
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
  // Helper function to format time from "HH:mm" to "HHmm"
  const formatTime = (timeString) =>
    timeString ? timeString.replace(":", "") : "";

  // Helper function to format a date string into YYYY-MM-DD format.
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
  const { contact } = formData;
  const param = {
    ...additionalPayload,
    trxToko: "",
    asal: formData.outbound.route.embarkationPort.name,
    kodeAsal: formData.outbound.route.embarkationPort.code,
    tujuan: formData.outbound.route.destinationPort.name,
    kodeTujuan: formData.outbound.route.destinationPort.code,
    jumlahPenumpang: String(formData.passengers.length),
    emailPemesan: contact.email,
    namaPemesan: contact.fullName,
  };

  // 3. Construct the 'bookingDetails' array
  const bookingDetails = formData.passengers.map((p) => {
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
      nationality: country ? country.nationality : "UNKNOWN",
    };
  });

  // 4. Conditionally construct the 'returnCoreApiTrip' object
  let returnCoreApiTrip = null;
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
    isReturnTripOpen: false,
    departureCoreApiTrip: departureCoreApiTrip,
    returnCoreApiTrip: returnCoreApiTrip,
    param: param,
    bookingDetails: bookingDetails,
  };

  const { data } = await axiosSindoferry.post("/createBooking", finalPayload);

  if (!data.success) {
    const error = new Error(data.message || "Booking request failed.");
    error.response = { data };
    throw error;
  }

  return data;
};
