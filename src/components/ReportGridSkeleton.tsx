export default function ReportGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md overflow-hidden w-full"
        >
          {/* Image Skeleton */}
          <div className="relative w-full h-48 bg-gray-200">
            <div className="absolute inset-0 bg-gray-200"></div>
            {/* Status Badge Skeleton */}
            <div className="absolute top-3 right-3">
              <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 sm:p-4">
            {/* Title Skeleton */}
            <div className="mb-2 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-2 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>

            {/* Category & Location Skeleton */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            </div>

            {/* Date Skeleton */}
            <div className="h-3 w-28 bg-gray-200 rounded mb-3"></div>

            {/* Comment Button Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
