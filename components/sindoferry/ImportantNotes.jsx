import { Info } from "lucide-react";
import Link from "next/link";

const ImportantNotes = () => {
  return (
    <div className="bg-yellow-100 rounded-xl border border-yellow-300 p-4 text-sm text-gray-800 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Info className="w-5 h-5 text-yellow-600" />
        <h2 className="font-semibold text-yellow-800">Informasi Penting</h2>
      </div>

      {/* Fare Rules */}
      <div>
        <p className="font-bold">Fare Rules:</p>
        <p>
          Please click{" "}
          <Link href="https://www.sindoferry.com.sg/farerules" className="text-blue-600 underline">
            here
          </Link>{" "}
          for detailed Fare Rules.
        </p>
        <p className="mt-2">
          If you are departing from <b>Tanjung Pinang</b>, please take note of
          the following fees:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>
            Tanjung Pinang confirmation fee is included in your booking. This
            is imposed by Sindo Ferry Shipping Agent.
          </li>
          <li>
            Tanjung Pinang terminal fee is excluded in your booking. All
            passengers are required to make cash payment in Rupiah (Indonesia
            currency) at Tanjung Pinang Ferry Terminal before departure. Please
            refer to{" "}
            <Link href="https://www.sindoferry.com.sg/farerules" className="text-blue-600 underline">
              here
            </Link>{" "}
            for detailed ticket fare.
          </li>
        </ul>

        <p className="mt-2">
          If you are departing from <b>Tanjung Balai</b>, please take note of
          the following fees:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>
            Tanjung Balai confirmation fee is included in your booking. This is
            imposed by Sindo Ferry Shipping Agent.
          </li>
          <li>
            Tanjung Balai terminal fee is excluded in your booking. All
            passengers are required to make cash payment in Rupiah (Indonesia
            currency) at Tanjung Balai Ferry Terminal before departure. Please
            refer to{" "}
            <Link href="https://www.sindoferry.com.sg/farerules" className="text-blue-600 underline">
              here
            </Link>{" "}
            for detailed ticket fare.
          </li>
        </ul>

        <p className="mt-2">
          You may be required to top up the difference before departure, should
          there be any tariff increase by Terminal Operator and Local Port
          Authority.
        </p>
      </div>

      {/* Travelling Time */}
      <div>
        <p className="font-bold">Travelling Time:</p>
        <p>
          WIB or Waktu Indonesian Barat is Western Indonesian Time. It’s one
          hour behind Singapore Time.
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>
            Both Departure and Arrival Time are listed in local time zone.
          </li>
          <li>
            Journey Times are approximate and subject to sea and weather
            conditions. Please see our{" "}
            <Link href="https://www.sindoferry.com.sg/terms-and-condition" target="_blank" className="text-blue-600 underline">
              terms and conditions
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImportantNotes;
