import { Dialog, Transition } from "@headlessui/react";
import { Trash2 } from "lucide-react";
import { Fragment, useState, useEffect } from "react";

const PassengerDetailModal = ({
  countries = [],
  passengerData,
  handleOnSubmit,
  isOpen,
  setIsOpen,
}) => {
  const [passenger, setPassenger] = useState(passengerData || {});
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      if (!passengerData.issueDate) {
        const today = new Date();

        const tenYearsAgo = new Date(today);
        tenYearsAgo.setFullYear(today.getFullYear() - 10);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        setPassenger((prev) => ({
          ...prev,
          issueDate: yesterday.toISOString().split("T")[0],
          dateOfBirth: tenYearsAgo.toISOString().split("T")[0],
          expiryDate: tomorrow.toISOString().split("T")[0],
        }));
      } else {
        setPassenger(passengerData || {});
        setErrors({});
      }
    }
  }, [isOpen, passengerData, today]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
      setPassenger((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === "no") {
      const filteredValue = value.replace(/[^0-9]/g, "");
      setPassenger((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === "dateOfBirth") {
      // Calculate age
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      const type = age <= 11 ? 1 : 0;

      setPassenger((prev) => ({
        ...prev,
        dateOfBirth: value,
        type,
      }));
    } else {
      setPassenger((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    const todayStr = new Date().toISOString().split("T")[0];

    if (!passenger.fullName) {
      newErrors.fullName = "Wajib diisi";
    } else if (!/^[a-zA-Z\s]+$/.test(passenger.fullName)) {
      newErrors.fullName = "Nama lengkap hanya boleh berisi huruf dan spasi";
    }

    if (!passenger.no) {
      newErrors.no = "Wajib diisi";
    } else if (!/^[0-9]+$/.test(passenger.no)) {
      newErrors.no = "Nomor paspor hanya boleh berisi angka";
    }

    if (!passenger.issueDate) {
      newErrors.issueDate = "Wajib diisi";
    } else if (passenger.issueDate > todayStr) {
      newErrors.issueDate = "Tanggal terbit tidak boleh di masa depan";
    }

    if (!passenger.expiryDate) {
      newErrors.expiryDate = "Wajib diisi";
    } else if (passenger.expiryDate <= todayStr) {
      newErrors.expiryDate = "Tanggal habis berlaku harus di masa depan";
    } else if (
      passenger.issueDate &&
      passenger.expiryDate <= passenger.issueDate
    ) {
      newErrors.expiryDate =
        "Tanggal habis berlaku harus setelah tanggal terbit";
    }

    if (!passenger.dateOfBirth) newErrors.dateOfBirth = "Wajib diisi";
    if (!passenger.nationalityID) newErrors.nationalityID = "Wajib diisi";
    if (!passenger.issuanceCountryID)
      newErrors.issuanceCountryID = "Wajib diisi";
    if (!passenger.placeOfBirth) newErrors.placeOfBirth = "Wajib diisi";
    if (passenger.gender === undefined) newErrors.gender = "Wajib diisi";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      type: passenger.type || 0,
      no: passenger.no || "",
      fullName: passenger.fullName || "",
      gender: passenger.gender,
      dateOfBirth: passenger.dateOfBirth || "",
      placeOfBirth: passenger.placeOfBirth || "",
      issueDate: passenger.issueDate || "",
      expiryDate: passenger.expiryDate || "",
      nationalityID: passenger.nationalityID || "",
      issuanceCountryID: passenger.issuanceCountryID || "",
    };

    handleOnSubmit(payload);
    setIsOpen(false);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-end justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Dialog.Panel className="w-full bg-white rounded-t-xl md:rounded-xl p-6 max-h-[95vh] overflow-y-auto">
              {/* Modal Content Header */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">
                  Data Penumpang {passenger.index + 1}
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Isi detail penumpang</p>

              <div>
                <label className="text-sm font-semibold">Jenis Kelamin</label>
                <div className="flex items-center gap-10 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={0}
                      checked={passenger.gender === 0}
                      onChange={(e) =>
                        setPassenger((p) => ({ ...p, gender: 0 }))
                      }
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                    />
                    Laki-laki
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={1}
                      checked={passenger.gender === 1}
                      onChange={(e) =>
                        setPassenger((p) => ({ ...p, gender: 1 }))
                      }
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                    />
                    Perempuan
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-semibold">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Masukkan nama lengkap"
                    value={passenger.fullName || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border mt-1 ${
                      errors.fullName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Sesuai paspor (tanpa tanda baca dan gelar)
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold">Nomor Paspor</label>
                  <input
                    type="text"
                    name="no"
                    placeholder="Masukkan nomor paspor"
                    value={passenger.no || ""}
                    onChange={handleChange}
                    maxLength={10}
                    minLength={10}
                    className={`w-full px-3 py-2 rounded border mt-1 ${
                      errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.no && (
                    <p className="text-xs text-red-600 mt-1">{errors.no}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={passenger.dateOfBirth || ""}
                    onChange={handleChange}
                    max={today} // Cannot be born in the future
                    className={`appearance-none w-full px-3 py-2 rounded border mt-1 ${
                      errors.dateOfBirth
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={passenger.issueDate || ""}
                    onChange={handleChange}
                    max={today} // --- FIX: Cannot select a future date ---
                    className={`appearance-none w-full px-3 py-2 rounded border mt-1 ${
                      errors.issueDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.issueDate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.issueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Tanggal Habis Berlaku
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={passenger.expiryDate || ""}
                    onChange={handleChange}
                    min={
                      passenger.issueDate
                        ? new Date(
                            new Date(passenger.issueDate).getTime() + 86400000
                          )
                            .toISOString()
                            .split("T")[0]
                        : new Date(
                            new Date().setMonth(new Date().getMonth() + 6) // 6 months from today
                          )
                            .toISOString()
                            .split("T")[0]
                    }
                    className={`appearance-none w-full px-3 py-2 rounded border mt-1 ${
                      errors.expiryDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Kewarganegaraan
                  </label>
                  <select
                    name="nationalityID"
                    value={passenger.nationalityID || ""}
                    onChange={handleChange}
                    className={`appearance-none w-full px-3 py-2 rounded border mt-1 bg-white ${
                      errors.nationalityID
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Pilih kewarganegaraan</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.nationality}
                      </option>
                    ))}
                  </select>
                  {errors.nationalityID && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.nationalityID}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Negara Penerbit Paspor
                  </label>
                  <select
                    name="issuanceCountryID"
                    value={passenger.issuanceCountryID || ""}
                    onChange={handleChange}
                    className={`appearance-none w-full px-3 py-2 rounded border mt-1 bg-white ${
                      errors.issuanceCountryID
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Pilih negara</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.issuanceCountryID && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.issuanceCountryID}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">Tempat Lahir</label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={passenger.placeOfBirth || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border mt-1 ${
                      errors.placeOfBirth
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.placeOfBirth && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.placeOfBirth}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Simpan
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PassengerDetailModal;
