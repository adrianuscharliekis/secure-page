import { ArrowLeft, ArrowRight } from "lucide-react";

const FormTripsSkeleton = () => {
  return (
    // The animate-pulse class is removed from the main container.
    <div className="min-h-screen bg-sky-50 pb-10">
      {/* Skeleton Header */}
      {/* The pulse is applied to the content wrapper inside the header */}
      <div className="flex sticky items-center px-4 py-2 border-b gap-2 text-gray-700 bg-white">
        <ArrowLeft className="w-5 h-5 text-gray-300" />
        <div className="flex flex-col gap-1 animate-pulse">
          {/* Route Skeleton */}
          <div className="font-semibold flex items-center gap-1">
            <div className="h-6 w-10 bg-gray-300 rounded-md"></div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className="h-6 w-10 bg-gray-300 rounded-md"></div>
          </div>
          {/* Date and Passenger Skeleton */}
          <div className="text-sm text-gray-500">
            <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Filters */}
      <div className="px-4 mt-3 flex gap-2 animate-pulse">
        <div className="bg-gray-200 h-7 w-24 rounded-full"></div>
        <div className="bg-gray-200 h-7 w-28 rounded-full"></div>
      </div>

      {/* Skeleton Trip List */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {/* Create a few placeholder cards to simulate a list */}
        {[...Array(4)].map((_, index) => (
          // The white card provides the solid background, while the content inside pulses.
          <div key={index} className="bg-white p-4 rounded-xl shadow-md border">
            <div className="space-y-3 animate-pulse">
                {/* Top part: Time and Duration */}
                <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>
                {/* Bottom part: Price */}
                <div className="flex justify-between items-center border-t pt-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-7 w-28 bg-gray-300 rounded"></div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormTripsSkeleton;
