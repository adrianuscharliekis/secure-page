import React, { useMemo, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

// A small helper map for clarity
const PASSENGER_TYPE_MAP = {
  0: "Dewasa", // Adult
  1: "Anak", // Child
};

const PriceSummary = ({
  formData,
  passengersFilled,
  handleContinue,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { outbound, return: returnTrip, passengers, isRoundTrip } = formData;

  const groupPassengers = useMemo(() => {
    const map = {};
    if (!passengers || passengers.length === 0) return map;

    passengers.forEach((p) => {
      const ageType = PASSENGER_TYPE_MAP[p.type] || "Dewasa";
      const isLocal =
        !passengersFilled ||
        p.nationalityID === "0dbe8cd6-cb51-4e34-ff90-08d7934c8bf2";
      const nationalityLabel = isLocal ? "Warga Indonesia" : "Warga Asing";
      const key = `${ageType} - ${nationalityLabel}`;

      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [passengers, passengersFilled]);

  const calculateSubtotal = (trip) => {
    let subtotal = 0;
    Object.entries(groupPassengers).forEach(([key, count]) => {
      const isLocal = key.includes("Warga Indonesia");
      const price = isLocal ? trip.price : trip.touristPrice;
      subtotal += Number(price) * count;
    });
    subtotal += Number(trip.fee || 0) * passengers.length;
    return subtotal;
  };

  const outboundSubtotal = outbound.trip ? calculateSubtotal(outbound.trip) : 0;
  const returnSubtotal =
    isRoundTrip && returnTrip?.trip ? calculateSubtotal(returnTrip.trip) : 0;

  const totalPayment = outboundSubtotal + returnSubtotal;

  return (
    <>
      <div className="flex justify-between items-center fixed inset-x-0 bottom-0 bg-white rounded-t-3xl border-t shadow-xl px-5 pt-3 pb-6 z-50">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="text-sm text-gray-500">Total Harga</h3>
            <p className="text-xl font-bold text-gray-900">
              Rp {totalPayment.toLocaleString("id-ID")}
            </p>
          </div>
          <button onClick={() => setIsOpen(true)}>
            <ChevronUp className="cursor-pointer text-sky-500" />
          </button>
        </div>
        <button
          // Gunakan kondisi yang konsisten untuk className dan disabled
          className={`px-6 py-2.5 rounded-xl font-semibold transition border ${
            isDisabled || passengers.length === 0 // Gunakan isDisabled secara langsung
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              : "bg-primary-gradient text-white border-sky-500 hover:bg-sky-500"
          }`}
          onClick={handleContinue}
          // Gunakan isDisabled secara langsung
          disabled={isDisabled || passengers.length === 0}
        >
          Selanjutnya
        </button>
      </div>

      {/* Headless UI Dialog */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="fixed inset-x-0 bottom-0 w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-out duration-300 transform"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transition ease-in duration-200 transform"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="w-full rounded-t-2xl bg-white p-6 text-left shadow-xl transition-all">
                    <div className="space-y-5 text-sm text-gray-700">
                      <div className="flex justify-between mb-2">
                        <h2 className="text-lg font-semibold">
                          Ringkasan Harga
                        </h2>
                        <button onClick={() => setIsOpen(false)}>
                          <ChevronDown className="text-sky-500" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-gray-800 font-semibold mb-1">
                          Penumpang
                        </h3>
                        {/* CHANGED: Render the new dynamic labels */}
                        {Object.entries(groupPassengers).map(
                          ([label, count]) => (
                            <div className="flex justify-between" key={label}>
                              <span className="text-gray-600">{label}</span>
                              <span className="text-gray-600">{count}</span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="border-t my-4" />

                      <div className="space-y-3">
                        <span className="text-sm rounded bg-sky-100 px-2 py-1 text-sky-500 font-medium">
                          Keberangkatan
                        </span>
                        <h3 className="font-semibold mt-1 mb-0.5">
                          {outbound.route.code}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {outbound.route.name}
                        </p>
                        {outbound.trip && (
                          <>
                            {/* CHANGED: Loop over new groups for price breakdown */}
                            {Object.entries(groupPassengers).map(
                              ([label, count]) => {
                                const isLocal =
                                  label.includes("Warga Indonesia");
                                const price = isLocal
                                  ? outbound.trip.price
                                  : outbound.trip.touristPrice;
                                return (
                                  <div
                                    className="flex justify-between text-gray-600"
                                    key={label}
                                  >
                                    <span>
                                      Ticket ({label}) x {count}
                                    </span>
                                    <span>
                                      Rp
                                      {(Number(price) * count).toLocaleString(
                                        "id-ID"
                                      )}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                            <div className="flex justify-between text-gray-600">
                              <span>Fee x {passengers.length}</span>
                              <span>
                                Rp
                                {(
                                  Number(outbound.trip.fee) * passengers.length
                                ).toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold mt-1">
                              <span>Subtotal</span>
                              <span>
                                Rp{outboundSubtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {isRoundTrip && returnTrip?.trip && (
                        <>
                          <div className="border-t my-4" />
                          <div className="space-y-3">
                            <span className="text-sm rounded bg-sky-100 px-2 py-1 text-sky-500 font-medium">
                              Kepulangan
                            </span>
                            <h3 className="font-semibold mt-1 mb-0.5">
                              {returnTrip.route.code}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                              {returnTrip.route.name}
                            </p>
                            {/* CHANGED: Loop over new groups for price breakdown */}
                            {Object.entries(groupPassengers).map(
                              ([label, count]) => {
                                const isLocal =
                                  label.includes("Warga Indonesia");
                                const price = isLocal
                                  ? returnTrip.trip.price
                                  : returnTrip.trip.touristPrice;
                                return (
                                  <div
                                    className="flex justify-between text-gray-600"
                                    key={label}
                                  >
                                    <span>
                                      Ticket ({label}) x {count}
                                    </span>
                                    <span>
                                      Rp
                                      {(Number(price) * count).toLocaleString(
                                        "id-ID"
                                      )}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                            <div className="flex justify-between text-gray-600">
                              <span>Fee x {passengers.length}</span>
                              <span>
                                Rp
                                {(
                                  Number(returnTrip.trip.fee) *
                                  passengers.length
                                ).toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold mt-1">
                              <span>Subtotal</span>
                              <span>
                                Rp{returnSubtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="border-t my-4" />
                      <div className="flex justify-between font-bold text-base mb-4">
                        <span>Total Harga</span>
                        <span>Rp{totalPayment.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PriceSummary;
