"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PassengerDetailModal from "@/components/sindoferry/PassengerDetail";
import TripCard from "@/components/sindoferry/TripCard";
import { ArrowLeft, ChevronRight, X, AlertCircle, Plus } from "lucide-react";
import { createBooking } from "@/lib/sindoferry";
import ContactDetailModal from "@/components/sindoferry/ContactDetailModal";
import TermsConfirmation from "@/components/sindoferry/TermsConfirmation";
import PriceSummary from "@/components/sindoferry/PriceSummary";
import BookingConfirmationModal from "@/components/sindoferry/BookingConfirmation";

const FormDetail = ({ formData, updateFormData, countries, prevStep }) => {
  const [modalOpenIndex, setModalOpenIndex] = useState(null);
  const [confirmation, setConfirmation] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false); // State for success message
  const [passengersFilled, setPassengersFilled] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  useEffect(() => {
    const allHaveNationality = formData.passengers.every(
      (p) => !!p.nationalityID
    );
    setPassengersFilled(allHaveNationality);
    setIsMounted(true);
  }, [formData.passengers]);

  useEffect(() => {
    if (confirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [confirmation]);
  const addPassenger = useCallback(
    (type) => {
      if (formData.passengers.length >= 9) {
        alert("Maximum 9 passengers allowed");
        return;
      }

      const newPassenger = {
        index: formData.passengers.length,
        type, // "adult" or "child"
        gender: 0,
        fullName: "",
        no: "",
        dateOfBirth: "",
        issueDate: "",
        expiryDate: "",
        nationalityID: "",
        issuanceCountryID: "",
        placeOfBirth: "",
      };

      updateFormData({
        passengers: [...formData.passengers, newPassenger],
      });
    },
    [formData.passengers, updateFormData]
  );

  const removePassenger = useCallback(
    (indexToRemove) => {
      const passengersCopy = [...formData.passengers];

      if (passengersCopy.length <= 1) return;

      if (indexToRemove >= 0 && indexToRemove < passengersCopy.length) {
        passengersCopy.splice(indexToRemove, 1);
        updateFormData({ passengers: passengersCopy });
      }
    },
    [formData.passengers, updateFormData]
  );

  const handlePassengerSubmit = useCallback(
    (index, updatedPassenger) => {
      const updated = [...formData.passengers];
      updated[index] = { ...updated[index], ...updatedPassenger };
      updateFormData({ passengers: updated });
    },
    [formData.passengers, updateFormData]
  );

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    updateFormData({
      contact: {
        ...formData.contact,
        [name]: name === "fullName" ? value.replace(/[^a-zA-Z\s]/g, "") : value,
        errors: {
          ...formData.contactDetails?.errors,
          [name]: "", 
        },
      },
    });
  };

  const validateContact = () => {
    const errors = {};
    const { phoneNumber, email, confirmEmail } = formData.contact;

    if (!/^\d{10,}$/.test(phoneNumber)) {
      errors.phoneNumber = "Nomor telepon harus minimal 10 digit angka";
    }

    if (!validateEmail(email)) {
      errors.email = "Format email tidak valid";
    }

    if (email !== confirmEmail) {
      errors.confirmEmail = "Email tidak sama";
    }

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validasi penumpang
    const allPassengersFilled = formData.passengers.every(
      (p) => p.fullName && p.fullName.trim() !== ""
    );
    if (!allPassengersFilled) {
      newErrors.passengers = "Harap lengkapi semua data penumpang.";
    }

    // Validasi kontak
    const contactErrors = validateContact(formData.contact);
    Object.assign(newErrors, contactErrors);

    // Simpan error
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setBookingSuccess(false);
      setConfirmation(true);
    }
  };

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
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const 
  submitBooking = async () => {
    setLoading(true);
    setBookingError(null);
    try {
      console.log(formData)
      const data = await createBooking(formData, countries);

      if (data && data.success && data.data) {
        setBookingSuccess(true); // Set success state to true
        const url = new URL(process.env.NEXT_PUBLIC_URL_DEEP_LINK_ISAKU);
        const param = {
          plu: data.data.plu === null ? "" : data.data.plu,
          paymentcode: data.data.data,
          trxid: data.data.trxToko,
        };
        url.search = new URLSearchParams(param).toString();

        // Redirect after a short delay to allow user to see the success message
        setTimeout(() => {
          window.location.replace(url.toString());
        }, 1500); // 1.5 second delay
      } else {
        setBookingError(data?.message || "Booking failed. Please try again.");
        // setConfirmation(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("An actual error occurred during booking:", error);
      setBookingError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
      // setConfirmation(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex sticky top-0 bg-white w-full items-center p-4 border-b gap-2 text-black z-30">
        <button onClick={prevStep}>
          <ArrowLeft className="w-7 h-7" />
        </button>
        <div className="flex flex-col">
          <h1 className="font-semibold">Detail Perjalanan</h1>
        </div>
      </div>

      {/* Booking Error Notification */}
      {bookingError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded-md relative"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
            </div>
            <div>
              <p className="font-bold">Booking Gagal</p>
              <p className="text-sm">{bookingError}</p>
            </div>
            <button
              onClick={() => setBookingError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6 pt-4">
        {/* Outbound */}
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm rounded bg-sky-100 px-2 py-1 text-sky-500 font-medium">
              Keberangkatan
            </span>
            <p className="text-sm text-gray-600">
              {formatDate(formData.outbound.tripDate)}
            </p>
          </div>
          <TripCard
            trip={formData.outbound.trip}
            route={formData.outbound.route}
            onSelect={() => {}}
          />
        </div>

        {/* Return */}
        {formData.isRoundTrip && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm bg-sky-100 px-2 py-1 text-sky-500 font-medium">
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

        <div className="p-5 px-3 bg-white space-y-6">
          {/* Contact Details Section */}
          <div className="space-y-4 border-b ">
            <h3 className="text-md text-gray-700 font-semibold">
              Lengkapi Data Kontak
            </h3>
            <button
              onClick={() => setIsOpenContact(true)}
              className="w-full flex justify-between items-center border p-4 rounded-lg bg-white text-left"
            >
              <span className="text-sky-500">
                {formData.contact.fullName?.trim() ? formData.contact.fullName : `Detail Kontak`}
              </span>
              <ChevronRight className="text-sky-500" />
            </button>
          </div>
          {/* Passengers Section */}
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-700">
              Lengkapi Data Penumpang
            </h3>
            {formData.passengers.map((passenger, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setModalOpenIndex(idx)}
                  className="w-full flex justify-between items-center border p-4 rounded-lg bg-white text-left"
                >
                  <span className="text-sky-500">
                    {passenger.fullName?.trim()
                      ? passenger.fullName
                      : `Penumpang ${idx + 1} (${
                          passenger.type === 0 ? "Dewasa" : "Anak"
                        })`}
                  </span>
                  <ChevronRight className="text-sky-500" />
                </button>

                <PassengerDetailModal
                  countries={countries}
                  passengerData={{ ...passenger, index: idx }}
                  handleOnSubmit={(data) => handlePassengerSubmit(idx, data)}
                  isOpen={modalOpenIndex === idx}
                  setIsOpen={() => setModalOpenIndex(null)}
                  handleDelete={(idx) => {
                    removePassenger(idx);
                  }}
                />
              </div>
            ))}
            {errors.passengers && (
              <p className="text-xs text-red-600 mt-1">{errors.passengers}</p>
            )}
            <button
              className="px-10 py-2.5 rounded-3xl border text-sky-500  border-sky-500 gap gap-2 flex items-center justify-center w-full"
              onClick={() => addPassenger(0)}
            >
              <span>
                <Plus />
              </span>
              <span className="font-semibold">Tambah Penumpang</span>
            </button>
          </div>
          <TermsConfirmation
            agreed={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            error={errors.terms}
          />
        </div>

        <div className="pt-24" />

        <PriceSummary
          formData={formData}
          handleContinue={handleContinue}
          passengersFilled={passengersFilled}
          isAgreed={!agreedToTerms}
        />
        <BookingConfirmationModal
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          bookingError={bookingError}
          setBookingError={setBookingError}
          bookingSuccess={bookingSuccess}
          loading={loading}
          submitBooking={submitBooking}
        />
        {/* Confirmation Modal Portal */}
      </div>
      <ContactDetailModal
        contact={formData.contact}
        isOpen={isOpenContact}
        onClose={() => {
          if (validateContact()) {
            setIsOpenContact(false);
          }
        }}
        updateContact={handleContactChange}
      />
    </div>
  );
};

export default FormDetail;
