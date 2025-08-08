import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Confirmation from "@/public/assets/jagaan detail.png";

export default function BookingConfirmationModal({
  confirmation,
  setConfirmation,
  bookingError,
  setBookingError,
  bookingSuccess,
  loading,
  submitBooking,
}) {
  return (
    <Transition show={confirmation} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !loading && setConfirmation(false)}>
        {/* Overlay */}
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

        {/* This container is now full-width */}
        <div className="fixed inset-0 flex items-end"> {/* CHANGED: Removed justify-center and px-4 */}
          {/* Panel Transition */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            {/* The panel is now scrollable on small screens */}
            <Dialog.Panel className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl border-t shadow-xl p-6 space-y-6"> {/* CHANGED: Added max-h and overflow */}
              {bookingError ? (
                <div className="text-center border-b pb-4">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h1 className="font-semibold text-lg">Booking Gagal</h1>
                  <p className="text-md text-gray-500 px-4">{bookingError}</p>
                </div>
              ) : bookingSuccess ? (
                <div className="text-center border-b pb-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h1 className="font-semibold text-lg">Booking Berhasil!</h1>
                  <p className="text-md text-gray-500 px-4">Anda akan dialihkan ke halaman pembayaran.</p>
                </div>
              ) : (
                <>
                  <Image src={Confirmation} width={200} alt="confirm" className="mx-auto" />
                  <div className="text-center border-b py-4">
                    <h1 className="font-semibold text-lg">Pastikan Data Anda Telah Sesuai</h1>
                    <p className="text-md text-gray-500 px-4">Data yang telah diisi tidak bisa diubah lagi</p>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-4">
                {bookingError ? (
                  <button
                    className="w-full text-sky-500 rounded-2xl px-5 py-3 border border-blue-600"
                    onClick={() => {
                      setConfirmation(false);
                      setBookingError(null);
                    }}
                  >
                    Kembali
                  </button>
                ) : bookingSuccess ? (
                  <button
                    className="w-full bg-sky-500 rounded-2xl text-white px-5 py-3 flex items-center justify-center disabled:bg-sky-400 disabled:cursor-not-allowed"
                    disabled
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Mengalihkan...</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full bg-sky-500 rounded-2xl text-white px-5 py-3 flex items-center justify-center disabled:bg-sky-400 disabled:cursor-not-allowed"
                      onClick={submitBooking}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Memproses...</span>
                        </>
                      ) : (
                        'Pesan Sekarang'
                      )}
                    </button>
                    <button
                      className="w-full text-sky-500 rounded-2xl px-5 py-3 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setConfirmation(false)}
                      disabled={loading}
                    >
                      Kembali
                    </button>
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}