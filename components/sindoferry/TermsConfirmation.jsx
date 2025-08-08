import { InfoIcon } from "lucide-react";

const TermsConfirmation = ({ agreed, onChange, error }) => {
  return (
    <div className="rounded-lg bg-orange-100 border border-orange-300 p-4 text-sm text-gray-800 space-y-3">
      <div className="flex items-center space-x-2">
        <InfoIcon className="text-orange-600 w-5 h-5" />
        <h3 className="font-semibold text-orange-800">Syarat & Ketentuan</h3>
      </div>

      <p>
        I confirm that all passenger data entered here is accurate and every
        passenger holds a valid travelling document (min 6 months from travel
        date), entry, exit visa(s) and other required documents. I have checked
        and verified the data of every passenger and understand and accept the
        consequences for failing to comply with the requirements.
      </p>
      <p className="font-medium">
        We will not seek compensation or refund from Sindo Ferry in these cases.
      </p>

      <label className="flex items-start space-x-2 mt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={onChange}
          className="mt-1"
        />
        <span>Saya menyetujui syarat & ketentuan di atas</span>
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          Anda harus menyetujui syarat & ketentuan.
        </p>
      )}
    </div>
  );
};

export default TermsConfirmation;
