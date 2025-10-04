"use client";
import Image from "next/image";
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/solid";

export interface GridReport {
  id: string;
  title: string;
  category: string;
  type: "hilang" | "temuan";
  status: "aktif" | "selesai";
  image_url?: string;
  created_at: string;
}

interface ReportGridProps {
  reports: GridReport[];
  showActions?: boolean;
  onEdit?: (reportId: string) => void;
  onComplete?: (reportId: string, currentStatus: "aktif" | "selesai") => void;
  onDelete?: (reportId: string) => void;
}

export default function ReportGrid({
  reports,
  showActions = false,
  onEdit,
  onComplete,
  onDelete,
}: ReportGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Belum ada laporan
        </h3>
        <p className="text-gray-500">
          Laporan yang Anda buat akan muncul di sini
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          {/* Image Thumbnail */}
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {report.image_url ? (
              <Image
                src={report.image_url}
                alt={report.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-gray-300">📦</div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  report.type === "hilang"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {report.type === "hilang" ? "Hilang" : "Temuan"}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
              {report.title}
            </h3>

            {/* Category & Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                {report.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(report.created_at)}
              </span>
            </div>

            {/* Action Buttons (only show if showActions is true) */}
            {showActions && (
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(report.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110"
                    title="Edit laporan"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}

                {/* Complete/Activate Button */}
                {onComplete && (
                  <button
                    onClick={() => onComplete(report.id, report.status)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 ${
                      report.status === "aktif"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-400 hover:bg-gray-500 text-white"
                    }`}
                    title={report.status === "aktif" ? "Tandai selesai" : "Aktifkan kembali"}
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(report.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110"
                    title="Hapus laporan"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
