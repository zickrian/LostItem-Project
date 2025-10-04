export default function StatistikSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="h-10 w-56 bg-gray-200 rounded mb-6 sm:mb-8"></div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-gray-200 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Category Chart Skeleton */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="relative">
              {/* Pie chart skeleton */}
              <div className="w-40 h-40 rounded-full bg-gray-200 shimmer-effect"></div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Skeleton */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="h-6 w-56 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded flex items-end justify-around px-4 py-6">
            {/* Bar chart skeleton */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-t w-12 shimmer-effect"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Location Distribution Skeleton */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="relative">
              {/* Pie chart skeleton */}
              <div className="w-40 h-40 rounded-full bg-gray-200 shimmer-effect"></div>
            </div>
          </div>
        </div>

        {/* Status Overview Skeleton */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded flex items-end justify-around px-4 py-6">
            {/* Bar chart skeleton */}
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-t w-20 shimmer-effect"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
            ))}
          </div>
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
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::after {
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
