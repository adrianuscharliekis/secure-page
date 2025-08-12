import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { InfoIcon } from "lucide-react";

const ContactDetailModal = ({ contact, isOpen, onClose, updateContact }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
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

        {/* Bottom Sheet Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="fixed inset-x-0 bottom-0 w-full">
              {/* Bottom Sheet Panel */}
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="w-full rounded-t-2xl bg-white p-6 px-3 text-left shadow-xl transition-all">
                  {/* Header bar */}
                  <div className="w-full px-2 pt-2 pb-2">
                    <div className="flex justify-center mb-4">
                      <div className="h-1 w-12 bg-gray-300 rounded-full" />
                    </div>

                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      Detail Kontak
                    </Dialog.Title>

                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Isi detail kontak
                    </p>

                    <form
                      className="space-y-4"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={contact.fullName}
                          onChange={updateContact}
                          name="fullName"
                          placeholder="Masukkan nama lengkap"
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Nomor Telepon
                        </label>
                        <input
                          type="number"
                          value={contact.phoneNumber}
                          onChange={updateContact}
                          name="phoneNumber"
                          placeholder="08xxxxxxxxxx"
                          maxLength={10}
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 ${
                            contact.errors?.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {contact.errors?.phoneNumber && (
                          <p className="text-xs text-red-600 mt-1">
                            {contact.errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={contact.email}
                          onChange={updateContact}
                          placeholder="Masukkan email"
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 ${
                            contact.errors?.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {contact.errors?.email && (
                          <p className="text-xs text-red-600 mt-1">
                            {contact.errors.email}
                          </p>
                        )}
                      </div>

                      {/* Confirm Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Konfirmasi Email
                        </label>
                        <input
                          type="email"
                          name="confirmEmail"
                          value={contact.confirmEmail}
                          onChange={updateContact}
                          placeholder="Masukkan ulang email"
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 ${
                            contact.errors?.confirmEmail
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {contact.errors?.confirmEmail && (
                          <p className="text-xs text-red-600 mt-1">
                            {contact.errors.confirmEmail}
                          </p>
                        )}
                      </div>

                      {/* Info Box */}
                      <div className="flex items-start gap-2 rounded-md bg-blue-100 p-3 text-sm text-gray-700">
                        <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p>
                          Sindo Ferry akan menghubungi nomor ini jika ada perubahan
                          pada pemesanan atau jadwal, dan akan mengirimkan tiket ke email ini.
                        </p>
                      </div>
                    </form>
                  </div>

                  {/* Save Button */}
                  <div className="px-2 pb-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold text-center"
                    >
                      Simpan
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContactDetailModal;
