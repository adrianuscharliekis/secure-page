"use client";
import React, { useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, ArrowLeft, Ship } from "lucide-react";

const ModalRoutesSelect = ({ routes, isOpen, setIsOpen, handleSelectedRoute }) => {
  const [search, setSearch] = useState("");

  // Memoize the filtering logic so it only re-runs when the search term or routes change.
  const filteredRoutes = useMemo(() => {
    if (!search) {
      return routes;
    }
    return routes.filter(
      (route) =>
        route.embarkationPort.name.toLowerCase().includes(search.toLowerCase()) ||
        route.destinationPort.name.toLowerCase().includes(search.toLowerCase()) ||
        route.embarkationPort.code.toLowerCase().includes(search.toLowerCase()) ||
        route.destinationPort.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [routes, search]);

  // Group the filtered routes by country for rendering.
  const groupedRoutes = useMemo(() => {
    return filteredRoutes.reduce((acc, route) => {
      const country = route.embarkationPort.country || "Unknown";
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(route);
      return acc;
    }, {});
  }, [filteredRoutes]);

  const onRouteSelect = (route) => {
    handleSelectedRoute(route);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center text-black">
        <Dialog.Panel className="w-full h-full max-w-lg bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 bg-white shadow-sm">
            <button onClick={() => setIsOpen(false)}>
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari nama pelabuhan"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
               <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                  onClick={() => setSearch("")}
                  style={{ display: search ? 'block' : 'none' }}
                />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {Object.keys(groupedRoutes).length > 0 ? (
              Object.entries(groupedRoutes).map(([country, routesInGroup]) => (
                <div key={country}>
                  <h2 className="text-sm font-bold text-gray-500 uppercase px-2 pb-2">
                    {country}
                  </h2>
                  <div className="space-y-2">
                    {routesInGroup.map((route) => (
                      <div
                        key={route.id}
                        onClick={() => onRouteSelect(route)}
                        className="w-full p-4 bg-white rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer transition flex items-center gap-4"
                      >
                        <Ship className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div>
                           <p className="font-semibold text-gray-800">
                            {route.embarkationPort.name} - {route.destinationPort.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {route.embarkationPort.code} - {route.destinationPort.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-10">
                Tidak ada rute ditemukan.
              </p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalRoutesSelect;
