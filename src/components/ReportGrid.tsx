"use client";
import { useState } from "react";
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import CommentSection from "@/components/CommentSection";
import OptimizedImage from "@/components/OptimizedImage";
import { getCategoryEmoji } from "@/lib/categoryEmoji";

export interface GridReport {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
  type: "hilang" | "temuan";
  status: "aktif" | "selesai";
  image_url?: string;
  created_at: string;
}

interface ReportGridProps {
  reports: GridReport[];
  showActions?: boolean;
  showComments?: boolean;
  currentUserId?: string;
  onEdit?: (reportId: string) => void;
  onComplete?: (reportId: string, currentStatus: "aktif" | "selesai") => void;
  onDelete?: (reportId: string) => void;
}

export default function ReportGrid({
  reports,
  showActions = false,
  showComments = true,
  currentUserId,
  onEdit,
  onComplete,
  onDelete,
}: ReportGridProps) {
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  
  const toggleDescription = (reportId: string) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };
  
  const toggleComments = (reportId: string) => {
    setOpenComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };
  
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-full"
        >
          {/* Image Thumbnail - Optimized for LCP */}
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {report.image_url ? (
              <OptimizedImage
                src={report.image_url}
                alt={report.title}
                fill
                priority={false}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                fallbackEmoji={getCategoryEmoji(report.category)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-7xl">
                  {getCategoryEmoji(report.category)}
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-10">
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
          <div className="p-3 sm:p-4">
            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 break-words">
              {report.title}
            </h3>

            {/* Description */}
            {report.description && (
              <div className="mb-2">
                <p className={`text-gray-600 text-xs sm:text-sm whitespace-pre-wrap transition-all duration-300 break-words ${!expandedReports.has(report.id) && report.description.length > 100 ? 'line-clamp-2' : ''}`}>
                  {report.description}
                </p>
                {report.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(report.id)}
                    className="text-xs font-semibold mt-1 hover:underline transition-colors inline-flex items-center gap-1"
                    style={{ color: 'rgba(17, 77, 145)' }}
                  >
                    {expandedReports.has(report.id) ? (
                      <>
                        Sembunyikan
                        <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Lihat selengkapnya
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Category & Location */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium rounded-md break-words max-w-full">
                {getCategoryEmoji(report.category)} {report.category}
              </span>
              {report.location && (
                <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium rounded-md break-words max-w-full">
                  📍 {report.location}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="text-[10px] sm:text-xs text-gray-500 mb-3">
              {formatDate(report.created_at)}
            </div>

            {/* Comment Toggle Button */}
            {showComments && currentUserId && (
              <button
                onClick={() => toggleComments(report.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">
                  {openComments.has(report.id) ? "Sembunyikan" : "Komentar"}
                </span>
              </button>
            )}

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

          {/* Comment Section */}
          {showComments && currentUserId && openComments.has(report.id) && (
            <div className="border-t">
              <CommentSection reportId={report.id} currentUserId={currentUserId} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
