import { Clock } from "lucide-react";
import React from "react";

// Utility: calculate duration
const calculateDuration = (departure, arrival) => {
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);
  let duration = ah * 60 + am - (dh * 60 + dm);
  if (duration < 0) duration += 1440;
  const h = Math.floor(duration / 60);
  const m = duration % 60;
  return `${h > 0 ? `${h}j ` : ""}${m}m`;
};

const formatRupiah = (num) =>
  `Rp${parseInt(num, 10).toLocaleString("id-ID")}/org`;

const TripCard = ({ trip, route, onSelect }) => {
  const duration = calculateDuration(trip.departureTime, trip.arrivalTime);
  return (
    <button
      onClick={onSelect}
      className="ticket-card w-full rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-lg overflow-hidden"
    >
      <div className="grid grid-cols-3 justify-between px-4 pt-4">
        <div>
          <p className="text-md font-bold">
            {route.embarkationPort.code} {trip.departureTime} SGT
          </p>
          <p className="text-sm text-white/80">{route.embarkationPort.name}</p>
        </div>
        <div className="flex gap gap-3 justify-center px-4 pt-2 text-sm text-white/90">
          <p>
            {" "}
            <Clock />{" "}
          </p>
          <p>{duration}</p>
        </div>
        <div className="text-right">
          <p className="text-md font-bold">
            {route.destinationPort.code} {trip.arrivalTime} WIB
          </p>
          <p className="text-sm text-white/80">{route.destinationPort.name}</p>
        </div>
      </div>
      <p className="mt-1 text-xs text-start px-4 border-gray-400">
        Open Gate: {trip.gateOpen} | Close Gate: {trip.gateClose}
      </p>

      <div className="grid grid-cols-2 mt-2 gap-2 bg-white text-black p-3 text-sm font-medium">
        <div className="flex flex-col justify-start items-start">
          <p className="capitalize text-md">Harga Lokal</p>
          <p className="font-semibold text-lg">{formatRupiah(trip.price)}</p>
        </div>
        <div className="flex flex-col justify-end items-end">
          <p className="capitalize text-md">Harga Turis</p>
          <p className="font-semibold text-lg">
            {formatRupiah(trip.touristPrice)}
          </p>
        </div>
      </div>
    </button>
  );
};

export default TripCard;
