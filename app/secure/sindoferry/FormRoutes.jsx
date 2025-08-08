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
  isError,
}) => {
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [showTripCalendar, setShowTripCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [sectorRoutes, setSectorRoutes] = useState([]);
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
    let newReturnData = {
      route: null,
      trip: null,
      tripDate: new Date(),
      tripDateFormatted: null,
    };
    let availableReturnRoutes = [];

    if (newIsRoundTrip && formData.outbound.route) {
      const nextSectorId = formData.outbound.route.sector?.nextSector?.id;
      if (nextSectorId) {
        const matchingReturnRoutes = routes.filter(
          (r) => r.sector.id === nextSectorId
        );
        availableReturnRoutes = matchingReturnRoutes;
        newReturnData.route = matchingReturnRoutes[0] || routes[1] || routes[0];
      } else {
        const fallbackRoute = routes[1] || routes[0];
        availableReturnRoutes = [fallbackRoute];
        newReturnData.route = fallbackRoute;
      }
    }

    updateFormData({
      isRoundTrip: newIsRoundTrip,
      return: newReturnData,
      availableReturnRoutes: availableReturnRoutes, // <-- UPDATE PARENT STATE
    });
  }, [formData.isRoundTrip, formData.outbound.route, updateFormData, routes]);

  const handleSelectedRoute = useCallback(
    (route) => {
      let returnRouteUpdate = {};
      let availableReturnRoutes = [];

      if (formData.isRoundTrip) {
        const nextSectorId = route.sector?.nextSector?.id;
        if (nextSectorId) {
          const matchingReturnRoutes = routes.filter(
            (r) => r.sector.id === nextSectorId
          );
          availableReturnRoutes = matchingReturnRoutes;
          // Also update the selected return route
          returnRouteUpdate = {
            route: matchingReturnRoutes[0] || routes[1] || routes[0],
          };
        } else {
          const fallbackRoute = routes[1] || routes[0];
          availableReturnRoutes = [fallbackRoute];
          returnRouteUpdate = { route: fallbackRoute };
        }
      }

      updateFormData({
        outbound: { route },
        return: returnRouteUpdate,
        availableReturnRoutes: availableReturnRoutes, // <-- UPDATE PARENT STATE
      });
      setIsRouteModalOpen(false);
    },
    [formData.isRoundTrip, routes, updateFormData]
  );

  const handleSelectedReturnRoute = useCallback(
    (route) => {
      updateFormData({ return: { route } });
      setIsReturnModalOpen(false);
    },
    [updateFormData]
  );

  

  
  const adultCount = formData.passengers.filter((p) => p.type === 0).length;
  const childCount = formData.passengers.filter((p) => p.type === 1).length;



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
  if (isError || routes.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm min-h-screen w-full text-center">
          <h2 className="text-lg font-semibold mb-2 text-red-600">
            Gagal Mendapatkan Rute
          </h2>
          <p className="text-gray-700 mb-4">Gagal memuat rute perjalanan.</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Halaman
          </button>
        </div>
      </div>
    );
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
                  <ArrowLeft className="w-6 h-6 text-blue-500 border border-sky-500 rounded-full p-1" />
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

            {/* Show error message if routes are empty */}
            {routes.length === 0 && (
              <p className="text-sm text-red-500 text-center">
                Gagal mendapatkan rute perjalanan
              </p>
            )}
            <button
              className={`w-full mt-4 py-3 rounded-full font-semibold shadow-md transition-colors ${
                routes.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={handleSubmit}
              disabled={routes.length === 0}
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
        routes={formData.availableReturnRoutes}
        isOpen={isReturnModalOpen}
        setIsOpen={setIsReturnModalOpen}
        handleSelectedRoute={handleSelectedReturnRoute}
      />
    </div>
  );
};

export default FormRoutes;
