export default function ReportCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>

        <div className="mb-3 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
        </div>

        {/* Image Skeleton */}
        <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer"></div>
        </div>

        {/* Comment Button */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
