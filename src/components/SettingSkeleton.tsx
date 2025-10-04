export default function SettingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="h-10 w-48 bg-gray-200 rounded mb-6 sm:mb-8"></div>

      {/* Profile Settings Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4 sm:mb-6"></div>

        {/* Avatar Section */}
        <div className="flex items-center gap-4 sm:gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Role Badge */}
        <div className="mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>

        {/* Save Button */}
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </div>

      {/* Notification Settings Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>

        {/* Toggle Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Save Button */}
        <div className="h-12 w-full bg-gray-200 rounded-lg mt-6"></div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-red-200">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
        <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
        <div className="h-12 w-full bg-red-200 rounded-lg"></div>
      </div>
    </div>
  );
}
