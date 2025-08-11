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
        <div className="text-left">
          <p className="text-md font-bold">
            {route.embarkationPort.code} {trip.departureTime} WIB
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

      <div className="flex justify-between items-center bg-white mt-5 text-black px-4 py-2 text-sm font-medium border-t border-gray-200">
        <div className="flex flex-col items-start gap-1">
          <p className="text-green-600 font-semibold">Tersedia</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {/* spacer to match height */}
          <div className="flex justify-between items-center gap gap-2">
            <div className="text-start">
              <p className="text-xs text-gray-500">Warga Asing</p>
              <p className="text-lg font-bold">
                {formatRupiah(trip.touristPrice)}
              </p>
            </div>
            <p className="text-xl text-sky-500">|</p>
            <div className="text-end">
              <p className="text-xs text-gray-500">Warga Indonesia</p>
              <p className="text-lg font-bold">{formatRupiah(trip.price)}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TripCard;
