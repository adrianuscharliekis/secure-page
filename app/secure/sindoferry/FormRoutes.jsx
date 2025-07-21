"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Hero from "@/public/assets/BG Hero banner.png";
import { Switch } from "@headlessui/react";
import { ArrowLeft, ArrowRight, Calendar, ChevronRight } from "lucide-react";
import ModalRoutesSelect from "@/components/sindoferry/RoutesModal";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Import the default styles for DayPicker
import { format } from "date-fns";
import ModalSelectClass from "@/components/sindoferry/ClassModal";
import FormRoutesSkeleton from "@/components/sindoferry/skeleton/FormRoutesSkeleton";

const FormRoutes = ({
  routes,
  formData,
  updateFormData,
  nextStep,
  isLoading,
}) => {
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [showTripCalendar, setShowTripCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const maxPassenger = 9;

  // Effect to initialize the form with default routes when it loads.
  useEffect(() => {
    if (routes.length > 0 && formData.outbound.route === null) {
      const newFormData = {
        outbound: {
          route: routes[0],
          tripDate: new Date(),
        },
        passengers: [
          {
            index: 0,
            type: 0,
            gender: 0,
            fullName: "",
            no: "",
            dateOfBirth: "",
            issueDate: "",
            expiryDate: "",
            nationalityID: "",
            issuanceCountryID: "",
            placeOfBirth: "",
          },
        ],
      };

      if (formData.isRoundTrip) {
        newFormData.return = {
          route: routes[1] || routes[0],
          tripDate: new Date(),
        };
      } else {
        newFormData.return = null;
      }

      updateFormData(newFormData);
    }
  }, [routes, formData.outbound.route, formData.isRoundTrip, updateFormData]);

  const handleRoundTrip = useCallback(() => {
    const newIsRoundTrip = !formData.isRoundTrip;

    updateFormData({
      isRoundTrip: newIsRoundTrip,
      return: newIsRoundTrip
        ? {
            route: routes[1] || routes[0], // pick second if exists, otherwise fallback
            tripDate: new Date(),
          }
        : {
            route: null,
            trip: null,
            tripDate: new Date(),
            tripDateFormatted: null,
          },
    });
  }, [formData.isRoundTrip, updateFormData, routes]);

  const handleSelectedRoute = useCallback(
    (route) => {
      updateFormData({ outbound: { route } });
      setIsRouteModalOpen(false);
    },
    [updateFormData]
  );

  const handleSelectedReturnRoute = useCallback(
    (route) => {
      updateFormData({ return: { route } });
      setIsReturnModalOpen(false);
    },
    [updateFormData]
  );

  const handleSelectedClass = useCallback(
    (tripClass) => {
      updateFormData({ tripClass });
      setIsClassModalOpen(false);
    },
    [updateFormData]
  );

  const addPassenger = useCallback(
    (type) => {
      const newPassenger = {
        index: formData.passengers.length,
        type, // "adult" or "child"
        gender: 0,
        fullName: "",
        no: "",
        dateOfBirth: "",
        issueDate: "",
        expiryDate: "",
        nationalityID: "",
        issuanceCountryID: "",
        placeOfBirth: "",
      };
      updateFormData({
        passengers: [...formData.passengers, newPassenger],
      });
    },
    [formData.passengers, updateFormData]
  );

  const removePassenger = useCallback(
    (type) => {
      const passengersCopy = [...formData.passengers];
      const indexToRemove = passengersCopy
        .map((p, i) => ({ ...p, originalIndex: i }))
        .reverse()
        .find((p) => p.type === type)?.originalIndex;

      if (indexToRemove !== undefined) {
        passengersCopy.splice(indexToRemove, 1);
        updateFormData({ passengers: passengersCopy });
      }
    },
    [formData.passengers, updateFormData]
  );
  const adultCount = formData.passengers.filter((p) => p.type === 0).length;
  const childCount = formData.passengers.filter((p) => p.type === 1).length;

  const updatePassengerCount = useCallback(
    (type, newCount) => {
      const current = formData.passengers.filter((p) => p.type === type).length;
      const delta = newCount - current;

      if (delta > 0) {
        for (let i = 0; i < delta; i++) addPassenger(type);
      } else if (delta < 0) {
        for (let i = 0; i < Math.abs(delta); i++) removePassenger(type);
      }
    },
    [formData.passengers, addPassenger, removePassenger]
  );

  function formatDateToYYYYMMDD(date) {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  const handleSubmit = () => {
    updateFormData({
      outbound: {
        tripDateFormatted: formatDateToYYYYMMDD(formData.outbound.tripDate),
      },
      return: {
        tripDateFormatted: formatDateToYYYYMMDD(formData.return?.tripDate),
      },
    });

    nextStep();
  };

  if (isLoading) {
    return <FormRoutesSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="absolute lg:relative w-full h-64 lg:h-auto lg:w-1/2">
        <Image src={Hero} alt="hero" fill className="object-cover" priority />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen">
        {/* Form Card */}
        <div className="relative w-full z-20 px-5 lg:mt-0 lg:px-0">
          <div className="bg-white mx-auto   w-full max-w-md  rounded-2xl shadow-lg p-5 space-y-5">
            {/* Rute Perjalanan Switch */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Rute Perjalanan</p>
                <p className="font-semibold">
                  {formData.isRoundTrip ? "Pulang Pergi" : "Sekali Jalan"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Pulang pergi?</span>
                <Switch
                  checked={formData.isRoundTrip}
                  onChange={handleRoundTrip}
                  className={`${
                    formData.isRoundTrip ? "bg-blue-600" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      formData.isRoundTrip ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Outbound Route Selection */}
            {formData.outbound.route && (
              <button
                className="grid grid-cols-3 gap-5 items-center border-y py-3 w-full"
                onClick={() => setIsRouteModalOpen(true)}
              >
                <div className="text-center">
                  <p className="text-sm text-sky-500 bg-sky-100">Dari</p>
                  <p className="text-xl font-bold">
                    {formData.outbound.route.embarkationPort.code}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {formData.outbound.route.embarkationPort.name}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <ArrowRight className="w-6 h-6 text-blue-500 border border-sky-500 rounded-full p-1" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-sky-500 bg-sky-100">Ke</p>
                  <p className="text-xl font-bold">
                    {formData.outbound.route.destinationPort.code}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {formData.outbound.route.destinationPort.name}
                  </p>
                </div>
              </button>
            )}

            {/* Return Route Selection */}
            {formData.isRoundTrip && formData.return?.route && (
              <button
                className="grid grid-cols-3 gap-5 items-center border-b pb-3 w-full"
                onClick={() => setIsReturnModalOpen(true)}
              >
                <div className="text-center">
                  <p className="text-sm text-sky-500 bg-sky-100">Dari</p>
                  <p className="text-xl font-bold">
                    {formData.return.route.embarkationPort.code}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {formData.return.route.embarkationPort.name}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <ArrowLeft className="w-6 h-6 text-gray-500 border border-gray-400 rounded-full p-1" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-sky-500 bg-sky-100">Ke</p>
                  <p className="text-xl font-bold">
                    {formData.return.route.destinationPort.code}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {formData.return.route.destinationPort.name}
                  </p>
                </div>
              </button>
            )}

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              {/* Outbound Date Picker */}
              <div className="relative flex flex-col items-start">
                <p className="text-sky-500 bg-sky-100 p-1 text-sm">
                  Tanggal Pergi
                </p>
                <button
                  onClick={() => setShowTripCalendar((prev) => !prev)}
                  className="flex items-center gap-2 mt-1 text-left"
                >
                  <Calendar className="text-gray-500" size={16} />
                  <span className="text-sm font-semibold">
                    {formData.outbound.tripDate
                      ? format(formData.outbound.tripDate, "dd/MM/yyyy")
                      : "Pilih Tanggal"}
                  </span>
                </button>
                {showTripCalendar && (
                  <div className="absolute top-full mt-2 z-10 bg-white rounded-lg shadow-lg border p-5">
                    <DayPicker
                      mode="single"
                      selected={formData.outbound.tripDate}
                      onSelect={(date) => {
                        if (!date) return;
                        updateFormData({ outbound: { tripDate: date } });
                        setShowTripCalendar(false);
                      }}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                )}
              </div>

              {/* Return Date Picker */}
              {formData.isRoundTrip && formData.return?.tripDate && (
                <div className="relative flex flex-col items-end">
                  <p className="text-sky-500 bg-sky-100 p-1 text-sm">
                    Tanggal Pulang
                  </p>
                  <button
                    onClick={() => setShowReturnCalendar((prev) => !prev)}
                    className="flex items-center gap-2 mt-1 text-left"
                  >
                    <Calendar className="text-gray-500" size={16} />
                    <span className="text-sm font-semibold">
                      {formData.return.tripDate
                        ? format(formData.return.tripDate, "dd/MM/yyyy")
                        : "Pilih Tanggal"}
                    </span>
                  </button>
                  {showReturnCalendar && (
                    <div className="absolute top-full mt-2 z-10 bg-white rounded-lg shadow-lg border p-5">
                      <DayPicker
                        mode="single"
                        selected={formData.return.tripDate}
                        onSelect={(date) => {
                          if (!date) return;
                          updateFormData({ return: { tripDate: date } });
                          setShowReturnCalendar(false);
                        }}
                        disabled={{
                          before: formData.outbound.tripDate || new Date(),
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Passenger Counts */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-blue-500 text-sm mb-1">
                  Dewasa (&gt;12 Tahun)
                </p>
                <div className="flex items-center justify-between border rounded-full px-3 py-1 w-full">
                  <button
                    onClick={() =>
                      updatePassengerCount(0, Math.max(adultCount - 1, 1))
                    }
                  >
                    −
                  </button>
                  <span>{adultCount}</span>
                  <button
                    onClick={() => updatePassengerCount(0, adultCount + 1)}
                    disabled={formData.passengers.length >= maxPassenger}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="text-blue-500 text-sm mb-1">Anak (0–11 Tahun)</p>
                <div className="flex items-center justify-between border rounded-full px-3 py-1 w-full">
                  <button
                    onClick={() =>
                      updatePassengerCount(1, Math.max(childCount - 1, 0))
                    }
                  >
                    −
                  </button>
                  <span>{childCount}</span>
                  <button
                    onClick={() =>
                      updatePassengerCount(1, Math.min(childCount + 1, 9))
                    }
                    disabled={formData.passengers.length >= maxPassenger}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Kelas Selection */}
            <div
              className="flex justify-between items-center border-t pt-4"
              onClick={() => setIsClassModalOpen(true)}
            >
              <div>
                <p className="text-gray-500 text-sm">Pilih Kelas</p>
                <p className="font-medium capitalize">{formData.tripClass}</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>

            {/* Search Button */}
            <button
              className="w-full mt-4 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Cari Tiket
            </button>
          </div>
        </div>
      </div>
      <ModalRoutesSelect
        routes={routes}
        isOpen={isRouteModalOpen}
        setIsOpen={setIsRouteModalOpen}
        handleSelectedRoute={handleSelectedRoute}
      />
      <ModalRoutesSelect
        routes={routes}
        isOpen={isReturnModalOpen}
        setIsOpen={setIsReturnModalOpen}
        handleSelectedRoute={handleSelectedReturnRoute}
      />
      <ModalSelectClass
        isOpen={isClassModalOpen}
        setIsOpen={setIsClassModalOpen}
        handleSelectedClass={handleSelectedClass}
      />
    </div>
  );
};

export default FormRoutes;
