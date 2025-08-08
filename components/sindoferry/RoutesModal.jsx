"use client";
import React, { useMemo, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ArrowLeft, Ship } from "lucide-react";

const ModalRoutesSelect = ({ routes, isOpen, setIsOpen, handleSelectedRoute }) => {
  const [search, setSearch] = useState("");

  const filteredRoutes = useMemo(() => {
    if (!search) return routes;
    return routes.filter(
      (route) =>
        route.embarkationPort.name.toLowerCase().includes(search.toLowerCase()) ||
        route.destinationPort.name.toLowerCase().includes(search.toLowerCase()) ||
        route.embarkationPort.code.toLowerCase().includes(search.toLowerCase()) ||
        route.destinationPort.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [routes, search]);

  const onRouteSelect = (route) => {
    handleSelectedRoute(route);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        {/* Overlay Transition */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Panel Transition */}
        <div className="fixed inset-x-0 bottom-0 flex justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Dialog.Panel className="h-screen w-full bg-gray-50 flex flex-col shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-white shadow-sm rounded-t-2xl">
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
                    style={{ display: search ? "block" : "none" }}
                  />
                </div>
              </div>

              {/* List of Routes */}
              <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
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
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-10">
                    Tidak ada rute ditemukan.
                  </p>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalRoutesSelect;
