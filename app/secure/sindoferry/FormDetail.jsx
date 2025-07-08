"use client";

import { useCallback, useMemo, useState } from "react";
import PassengerDetailModal from "@/components/sindoferry/PassengerDetail";
import TripCard from "@/components/sindoferry/TripCard";
import {
  Accessibility,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Mail,
  User,
} from "lucide-react";
import ImportantNotes from "@/components/sindoferry/ImportantNotes";
import Confirmation from "@/public/assets/jagaan detail.png";
import Image from "next/image";
import LoadingSpinner from "@/components/sindoferry/LoadingSpinner";
import { createBooking } from "@/lib/sindoferry";

const FormDetail = ({
  formData,
  updateFormData,
  countries,
  nextStep,
  prevStep,
}) => {
  const [modalOpenIndex, setModalOpenIndex] = useState(null);
  const [isCollapse, setIsCollapse] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  // State for contact details and errors is now managed locally in this component.
  const [contact, setContact] = useState(
    formData.contactDetails || { fullName: "", email: "" }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePassengerSubmit = useCallback(
    (index, updatedPassenger) => {
      const updated = [...formData.passengers];
      updated[index] = { ...updated[index], ...updatedPassenger };
      updateFormData({ passengers: updated });
    },
    [formData.passengers, updateFormData]
  );

  // Handler for contact detail changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  // Simple email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validation logic for the entire form before showing confirmation
  const validateForm = () => {
    const newErrors = {};

    // Validate all passengers have names
    const allPassengersFilled = formData.passengers.every(
      (p) => p.fullName && p.fullName.trim() !== ""
    );
    if (!allPassengersFilled) {
      newErrors.passengers = "Harap lengkapi semua data penumpang.";
    }

    // Validate contact details
    if (!contact.fullName.trim()) {
      newErrors.fullName = "Nama lengkap kontak wajib diisi";
    }
    if (!contact.email.trim()) {
      newErrors.email = "Email kontak wajib diisi";
    } else if (!validateEmail(contact.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // If valid, update the master form data and show confirmation
      updateFormData({ contactDetails: contact });
      setConfirmation(true);
    }
  };

  const totalPrice = useMemo(
    () => 200000 * formData.passengers.length * (formData.isRoundTrip ? 2 : 1),
    [formData.passengers.length, formData.isRoundTrip]
  );

  const totalWithFees = useMemo(() => totalPrice + 20000 + 50000, [totalPrice]);

  const formatDate = useCallback(
    (date) =>
      new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const ticketLabel = formData.passengers.length > 1 ? "Dewasa" : "Penumpang";
  const submitBooking = async () => {
    // setLoading(true);
    await createBooking(formData, countries);
    // setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner isOpen={loading} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex sticky top-0 bg-white w-full items-center p-4 border-b gap-2 text-black z-30">
        <button onClick={prevStep}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="font-semibold">Detail Perjalanan</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pt-4">
        {/* Outbound */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm rounded bg-sky-100 px-2 py-1 text-blue-600 font-medium">
              Keberangkatan
            </span>
            <p className="text-sm text-gray-600">
              {formatDate(formData.outbound.tripDate)}
            </p>
          </div>
          <TripCard
            trip={formData.outbound.trip}
            route={formData.outbound.route}
            onSelect={() => {}} // This is a summary card, no action needed
          />
        </div>

        {/* Return */}
        {formData.isRoundTrip && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm bg-sky-100 px-2 py-1 text-blue-600 font-medium">
                Kepulangan
              </span>
              <p className="text-sm text-gray-600">
                {formatDate(formData.return.tripDate)}
              </p>
            </div>
            <TripCard
              trip={formData.return.trip}
              route={formData.return.route}
              onSelect={() => {}}
            />
          </div>
        )}

        <div className="bg-white p-5 rounded-xl shadow-md space-y-6">
          {/* Passengers Section */}
          <div className="space-y-3">
            <h3 className="text-md font-semibold">Lengkapi Data Penumpang</h3>
            {formData.passengers.map((passenger, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setModalOpenIndex(idx)}
                  className="w-full flex justify-between items-center border p-4 rounded-lg bg-white text-left"
                >
                  <span
                    className={
                      passenger.fullName?.trim()
                        ? "text-gray-800"
                        : "text-blue-600"
                    }
                  >
                    {passenger.fullName?.trim()
                      ? passenger.fullName
                      : `Penumpang ${idx + 1} (${
                          passenger.type === 0 ? "Dewasa" : "Anak"
                        })`}
                  </span>
                  <ChevronRight className="text-gray-400" />
                </button>

                <PassengerDetailModal
                  countries={countries}
                  passengerData={{ ...passenger, index: idx }}
                  handleOnSubmit={(data) => handlePassengerSubmit(idx, data)}
                  isOpen={modalOpenIndex === idx}
                  setIsOpen={() => setModalOpenIndex(null)}
                />
              </div>
            ))}
            {errors.passengers && (
              <p className="text-xs text-red-600 mt-1">{errors.passengers}</p>
            )}
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-md font-semibold">Lengkapi Data Kontak</h3>
            <p className="text-sm text-gray-600">
              E-tiket akan dikirimkan ke email yang terdaftar di bawah ini.
            </p>

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="contactFullName"
                className="text-sm font-semibold text-gray-800"
              >
                Nama Lengkap
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="contactFullName"
                  name="fullName"
                  placeholder="Masukkan nama lengkap kontak"
                  value={contact.fullName}
                  onChange={handleContactChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="contactEmail"
                className="text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder="contoh@email.com"
                  value={contact.email}
                  onChange={handleContactChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          {/* Special Needs */}
          <div className="flex pt-4 items-center space-x-2 border-t">
            <input
              type="checkbox"
              id="specialNeeds"
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <Accessibility className="text-blue-600" />
            <label htmlFor="specialNeeds" className="text-sm text-gray-700">
              Apakah Anda memiliki kebutuhan khusus?
            </label>
          </div>
        </div>

        {/* Important Notes */}
        <ImportantNotes />

        <div className="pt-24" />

        {/* Summary Bottom Sheet */}
        <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl border-t shadow-xl px-5 pt-3 pb-6 z-40">
          {isCollapse && (
            <div className="transition-all duration-500 ease-in-out">
              <div className="mx-auto mb-4 w-12 h-1.5 rounded-full bg-gray-300" />
              <h2 className="text-lg font-semibold mb-4">Ringkasan Harga</h2>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>
                    Tiket {formData.isRoundTrip ? "Pulang Pergi" : "Pergi"} x{" "}
                    {formData.passengers.length} ({ticketLabel})
                  </span>
                  <span className="font-semibold">
                    Rp{totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan</span>
                  <span className="font-semibold">Rp20.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Terminal</span>
                  <span className="font-semibold">Rp50.000</span>
                </div>
              </div>

              <div className="my-4 border-t" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div>
                <h3 className="text-sm text-gray-500">Total Harga</h3>
                <p className="text-xl font-bold text-gray-900">
                  Rp {totalWithFees.toLocaleString("id-ID")}
                </p>
              </div>
              <button onClick={() => setIsCollapse((prev) => !prev)}>
                {isCollapse ? (
                  <ChevronDown className="cursor-pointer text-gray-500" />
                ) : (
                  <ChevronUp className="cursor-pointer text-gray-500" />
                )}
              </button>
            </div>
            <button
              className="bg-blue-600 text-white border border-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
              onClick={handleContinue}
            >
              Lanjut
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmation && (
          <>
            {/* Backdrop with a lower z-index */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setConfirmation(false)}
            />

            {/* Modal Panel with a higher z-index */}
            <div className="fixed w-full flex flex-col space-y-5 py-12 items-center justify-center inset-x-0 bottom-0 bg-white rounded-t-2xl border-t shadow-xl z-50">
              <Image src={Confirmation} width={200} alt="confirm" />
              <div className="text-center border-b py-5">
                <h1 className="font-semibold text-lg">
                  Pastikan Data Anda Telah Sesuai
                </h1>
                <p className="text-md text-gray-500 px-10 sm:px-24">
                  Data yang telah diisi tidak bisa diubah lagi
                </p>
              </div>
              <div className="flex w-full px-10 flex-col gap-5">
                <button
                  className="w-full bg-sky-500 rounded-2xl text-white px-5 py-3"
                  onClick={submitBooking}
                >
                  Pesan Sekarang
                </button>
                <button
                  className="w-full text-blue-600 rounded-2xl px-5 py-3 border border-blue-600"
                  onClick={() => setConfirmation(false)}
                >
                  Kembali
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormDetail;
