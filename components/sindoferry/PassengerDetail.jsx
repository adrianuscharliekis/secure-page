import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";

const PassengerDetailModal = ({
  countries,
  passengerData,
  handleOnSubmit,
  isOpen,
  setIsOpen,
}) => {
  const [passenger, setPassenger] = useState(passengerData || {});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert gender string to number
    if (name === "gender") {
      setPassenger((prev) => ({ ...prev, gender: value === "L" ? 0 : 1 }));
    } else {
      setPassenger((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!passenger.fullName)
      newErrors.fullName =
        "Wajib diisi sesuai paspor (tanpa tanda baca dan gelar)";
    if (!passenger.no) newErrors.no = "Wajib diisi";
    if (!passenger.dateOfBirth) newErrors.dateOfBirth = "Wajib diisi";
    if (!passenger.issueDate) newErrors.issueDate = "Wajib diisi";
    if (!passenger.expiryDate) newErrors.expiryDate = "Wajib diisi";
    if (!passenger.nationalityID) newErrors.nationalityID = "Wajib diisi";
    if (!passenger.issuanceCountryID)
      newErrors.issuanceCountryID = "Wajib diisi";
    if (!passenger.placeOfBirth) newErrors.placeOfBirth = "Wajib diisi";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      type: passenger.type || 0,
      no: passenger.no || "",
      fullName: passenger.fullName || "",
      gender: passenger.gender ?? 0,
      dateOfBirth: passenger.dateOfBirth || "",
      placeOfBirth: passenger.placeOfBirth || null,
      issueDate: passenger.issueDate || "",
      expiryDate: passenger.expiryDate || "",
      nationalityID: passenger.nationalityID || "",
      issuanceCountryID: passenger.issuanceCountryID || "",
    };

    handleOnSubmit(payload);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 text-black"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end justify-center">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 relative overflow-y-auto max-h-full">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>

          <h2 className="text-xl font-bold">
            Penumpang {passenger.index + 1} (
            {passenger.type === 0 ? "Dewasa" : "Anak"})
          </h2>

          <p className="text-sm text-gray-500 mb-2">Isi detail penumpang</p>

          {/* Gender */}
          <div className="flex items-center gap-10">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="L"
                checked={passenger.gender === 0}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              Laki-laki
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="P"
                checked={passenger.gender === 1}
                onChange={handleChange}
              />
              Perempuan
            </label>
            {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                placeholder="Masukkan nama lengkap"
                value={passenger.fullName || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
              <p className="text-xs text-gray-500">
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
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Tanggal Lahir</label>
              <input
                type="date"
                name="dateOfBirth"
                value={passenger.dateOfBirth || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Tanggal Terbit</label>
              <input
                type="date"
                name="issueDate"
                value={passenger.issueDate || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
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
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Kewarganegaraan</label>
              <select
                name="nationalityID"
                value={passenger.nationalityID || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Pilih kewarganegaraan</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.nationality}
                  </option>
                ))}
              </select>
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">
                Negara Penerbit Paspor
              </label>
              <select
                name="issuanceCountryID"
                value={passenger.issuanceCountryID || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Pilih negara</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Tempat Lahir</label>
              <input
                type="text"
                name="placeOfBirth"
                value={passenger.placeOfBirth || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.no ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.no && <p className="text-xs text-red-600">{errors.no}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-6"
          >
            Simpan
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PassengerDetailModal;
