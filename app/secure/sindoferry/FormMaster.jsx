"use client";
import {
  createBooking,
  useCountries,
  useRoutes,
  useTrips,
} from "@/lib/sindoferry";
import React, { useCallback, useState } from "react";
import Loading from "@/components/Loading";
import FormRoutes from "./FormRoutes";
import FormTrips from "./FormTrips";
import FormDetail from "./FormDetail";

const FormMaster = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    isRoundTrip: false,
    outbound: {
      route: null,
      trip: null,
      tripDate: new Date(),
      tripDateFormatted: null,
    },
    return: {
      route: null,
      trip: null,
      tripDate: new Date(),
      tripDateFormatted: null,
    },
    passengers: [],
    tripClass: "ekonomi",
  });

  const {
    routes: routes,
    isLoading: isLoadingRoutes,
    isError: isErrorRoutes,
  } = useRoutes();
  const {
    countries: countries,
    isLoading: isLoadingCountries,
    isError: isErrorCountries,
  } = useCountries();

  const {
    trips: outboundTrips,
    isLoading: isLoadingOutboundTrips,
    isError: isErrorOutboundTrips,
  } = useTrips(
    formData.outbound.route?.embarkationPort?.code,
    formData.outbound.route?.destinationPort?.code,
    formData.outbound.tripDateFormatted
  );

  const {
    trips: returnTrips,
    isLoading: isLoadingReturnTrips,
    isError: isErrorReturnTrips,
  } = useTrips(
    formData.isRoundTrip ? formData.return.route?.embarkationPort?.code : null,
    formData.isRoundTrip ? formData.return.route?.destinationPort?.code : null,
    formData.isRoundTrip ? formData.return.tripDateFormatted : null
  );

  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({
      ...prev,
      ...Object.entries(newData).reduce((acc, [key, value]) => {
        acc[key] =
          typeof value === "object" && !Array.isArray(value)
            ? { ...prev[key], ...value }
            : value;
        return acc;
      }, {}),
    }));
  }, []);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);
  const resetStep = useCallback(() => setStep(1), []);


  if (isErrorCountries || isErrorRoutes) {
    return <div>Error: Failed to load route data. Please try again later.</div>;
  }

  return (
    <div className="bg-sky-500 min-h-screen text-black">
      {step === 1 && (
        <FormRoutes
          routes={routes}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          isLoading={isLoadingRoutes}
        />
      )}

      {step === 2 && (
        <FormTrips
          trips={outboundTrips}
          route={formData.outbound.route}
          passengers={formData.passengers}
          tripDate={formData.outbound.tripDate}
          tripClass={formData.tripClass}
          isLoading={isLoadingOutboundTrips}
          updateFormData={(newData) =>
            updateFormData({ outbound: { ...newData } })
          }
          prevStep={prevStep}
          nextStep={nextStep}
          resetStep={resetStep}
          direction={"outbound"}
        />
      )}

      {step === 3 && formData.isRoundTrip && (
        <FormTrips
          trips={returnTrips}
          route={formData.return.route}
          passengers={formData.passengers}
          tripDate={formData.return.tripDate}
          tripClass={formData.tripClass}
          isLoading={isLoadingReturnTrips}
          updateFormData={(newData) =>
            updateFormData({ return: { ...newData } })
          }
          prevStep={prevStep}
          nextStep={nextStep}
          resetStep={resetStep}
          direction={"return"}
        />
      )}

      {(step === 3 && !formData.isRoundTrip) ||
      (step === 4 && formData.isRoundTrip) ? (
        <FormDetail
          formData={formData}
          updateFormData={updateFormData}
          countries={countries}
          nextStep={nextStep}
          prevStep={() => {
            if (formData.isRoundTrip) {
              setStep(3);
            } else {
              setStep(2);
            }
          }}
        />
      ) : null}
    </div>
  );
};

export default FormMaster;
