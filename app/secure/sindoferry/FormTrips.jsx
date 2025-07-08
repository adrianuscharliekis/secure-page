"use client";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TripCard from "@/components/sindoferry/TripCard";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import NotFound from "@/public/assets/notFound_trip.jpg";
import Image from "next/image";
import TripSkeleton from "@/components/sindoferry/TripSkeleton";
import FormTripsSkeleton from "@/components/sindoferry/skeleton/FormTripsSkeleton";
const FormTrips = ({
  trips,
  route,
  passengers,
  tripDate,
  tripClass,
  direction,
  updateFormData,
  nextStep,
  prevStep,
  resetStep,
  isLoading
}) => {
  const embark = route?.embarkationPort?.code ?? "???";
  const dest = route?.destinationPort?.code ?? "???";
  const handleSelectTrip = (trip) => {
    updateFormData({ trip });
    nextStep();
  };
  const totalAdults = passengers.filter((p) => p.type === 0).length;
  const totalChildren = passengers.filter((p) => p.type === 1).length;
  const formattedDate = tripDate
    ? format(tripDate, "EEE, dd/MM/yyyy", { locale: id })
    : "";
  const passengerLabel = [
    totalAdults > 0 ? `${totalAdults} Dewasa` : null,
    totalChildren > 0 ? `${totalChildren} Anak` : null,
  ]
    .filter(Boolean)
    .join(" | ");


  if (isLoading){
    return <FormTripsSkeleton/>
  }
  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Header */}
      <div className="flex sticky items-center px-4 py-2 border-b gap-2 text-gray-700">
        <button onClick={prevStep}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <div className="font-semibold flex items-center gap-1">
            <span>{embark}</span>
            <ArrowRight className="w-4 h-4" />
            <span>{dest}</span>
          </div>
          <div className="text-sm text-gray-500">
            {formattedDate}
            {passengerLabel && ` | Tiket ${passengerLabel}`}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mt-3 flex gap-2">
        <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">
          Ekonomi
        </span>
        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
          Semua Kelas
        </span>
      </div>
    {/* Trip List */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {trips===null?(
          <TripSkeleton/>
        ):trips.length>0?(
          trips.map((trip) => (
            <TripCard
              key={trip.tripID}
              trip={trip}
              route={route}
              onSelect={() => handleSelectTrip(trip)}
            />
          ))
        ):(
          <div className="flex flex-col gap gap-10 text-md items-center justify-center min-h-full pt-10">
            <Image src={NotFound} width={200} alt="Not Found" />
            <div className="text-center space-y-3">
              <h1 className="font-semibold text-lg">Jadwal Tidak Tersedia</h1>
              <p className=" text-gray-700">
                Jadwal untuk rute dan tanggal yang dipilih tidak tersedia.
                Silahkan coba ubah rute atau tanggal.
              </p>
            </div>
            <button
              className="px-5 py-3 bg-sky-500 rounded-xl text-white text-lg"
              onClick={resetStep}
            >
              Ubah Pencarian
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default FormTrips;
