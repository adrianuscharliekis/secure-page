import { ArrowLeft, ArrowRight, Calendar, ChevronRight } from "lucide-react";

const FormRoutesSkeleton = () => {
  return (
    // The main container no longer has animate-pulse to prevent the entire component from becoming transparent.
    <div>
      {/* Header Skeleton */}
      <div className="fixed w-full top-0 left-0 bg-white px-5 py-3 z-30 shadow-md">
        {/* Pulse is applied directly to the placeholder element */}
        <div className="h-7 w-1/3 mx-auto bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Hero Image Skeleton */}
      <div className="bg-gray-200 h-48 w-full animate-pulse"></div>

      <div className="relative w-full -mt-10 z-20 px-5">
        {/* This white card provides the solid background and does NOT pulse. */}
        <div className="bg-white mx-auto -mt-16 w-full max-w-md rounded-2xl shadow-lg p-5 space-y-5">
          {/* Rute Perjalanan Switch Skeleton */}
          {/* Pulse is applied to the container of this section */}
          <div className="flex justify-between items-center animate-pulse">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-6 w-28 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-11 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Route Selection Skeleton */}
          <div className="grid grid-cols-3 gap-5 items-center border-y py-3 w-full animate-pulse">
            <div className="text-center space-y-1">
              <div className="h-5 w-10 mx-auto bg-gray-200 rounded-md"></div>
              <div className="h-7 w-12 mx-auto bg-gray-300 rounded-md"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex justify-center items-center">
              {/* Icon does not pulse */}
              <ArrowRight className="w-6 h-6 text-gray-300 border border-gray-300 rounded-full p-1" />
            </div>
            <div className="text-center space-y-1">
              <div className="h-5 w-10 mx-auto bg-gray-200 rounded-md"></div>
              <div className="h-7 w-12 mx-auto bg-gray-300 rounded-md"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Return Route Selection Skeleton */}
          <div className="grid grid-cols-3 gap-5 items-center border-b pb-3 w-full animate-pulse">
            <div className="text-center space-y-1">
              <div className="h-5 w-10 mx-auto bg-gray-200 rounded-md"></div>
              <div className="h-7 w-12 mx-auto bg-gray-300 rounded-md"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex justify-center items-center">
              <ArrowLeft className="w-6 h-6 text-gray-300 border border-gray-300 rounded-full p-1" />
            </div>
            <div className="text-center space-y-1">
              <div className="h-5 w-10 mx-auto bg-gray-200 rounded-md"></div>
              <div className="h-7 w-12 mx-auto bg-gray-300 rounded-md"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Date Selection Skeleton */}
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            <div className="flex flex-col items-start space-y-1">
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="text-gray-300" size={16} />
                <div className="h-5 w-28 bg-gray-300 rounded-md"></div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="text-gray-300" size={16} />
                <div className="h-5 w-28 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Passenger Counts Skeleton */}
          <div className="grid grid-cols-2 gap-4 items-center animate-pulse">
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-9 w-32 bg-gray-300 rounded-full"></div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-9 w-32 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Kelas Selection Skeleton */}
          <div className="flex justify-between items-center border-t pt-4 animate-pulse">
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-5 w-20 bg-gray-300 rounded-md"></div>
            </div>
            <ChevronRight className="text-gray-300" />
          </div>

          {/* Search Button Skeleton */}
          <div className="w-full mt-4 h-12 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FormRoutesSkeleton;
