"use client";
import { useState } from "react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
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
  latitude?: number;
  longitude?: number;
}

interface ReportGridProps {
  reports: GridReport[];
  showActions?: boolean;
  showComments?: boolean;
  currentUserId?: string;
  onEdit?: (reportId: string) => void;
  onComplete?: (reportId: string, currentStatus: "aktif" | "selesai") => void;
  onDelete?: (reportId: string) => void;
  isHistoryMode?: boolean;
}

export default function ReportGrid({
  reports,
  showActions = false,
  showComments = true,
  currentUserId,
  onEdit,
  onComplete,
  onDelete,
  isHistoryMode = false,
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
      {reports.map((report, index) => (
        <div
          key={report.id}
          className="bg-white rounded-xl shadow-md overflow-hidden w-full relative"
        >
          {/* Gray Overlay for History Mode */}
          {isHistoryMode && (
            <div className="absolute inset-0 z-10 pointer-events-none rounded-xl" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)' }}></div>
          )}
          {/* Image Thumbnail - Optimized for LCP with priority loading for first 3 images */}
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {report.image_url ? (
              <OptimizedImage
                src={report.image_url}
                alt={report.title}
                fill
                priority={index < 3}
                className="object-cover"
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

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {report.title}
            </h3>

            {/* Description */}
            {report.description && (
              <div className="mb-3">
                <p className={`text-sm text-gray-600 leading-relaxed ${
                  expandedReports.has(report.id) ? '' : 'line-clamp-2'
                }`}>
                  {report.description}
                </p>
                {report.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(report.id)}
                    className="text-xs font-semibold mt-1 px-2 py-1 rounded"
                    style={{ color: 'rgba(17, 77, 145)' }}
                  >
                    {expandedReports.has(report.id) ? 'Lihat lebih sedikit' : 'Lihat selengkapnya'}
                  </button>
                )}
              </div>
            )}

            {/* Coordinates Section */}
            {report.latitude && report.longitude && (
              <div className="mb-3">
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'rgb(16, 185, 129)',
                    border: '2px solid rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(16, 185, 129)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    e.currentTarget.style.color = 'rgb(16, 185, 129)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Lihat di Maps</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            )}

            {/* Date */}
            <div className="text-[10px] sm:text-xs text-gray-500 mb-3">
              {formatDate(report.created_at)}
            </div>

            {/* Comment Toggle Button */}
            {showComments && currentUserId && (
              <button
                onClick={() => toggleComments(report.id)}
                className="flex items-center gap-2 text-gray-600 mb-3 text-sm"
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

            {/* Action Buttons (only show if showActions is true) - Compact Icon Style */}
            {showActions && (
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                {/* Edit Button - Icon Only */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(report.id)}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow-md"
                    title="Edit Laporan"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Complete/Activate Button - Icon Only */}
                {onComplete && (
                  <button
                    onClick={() => onComplete(report.id, report.status)}
                    className={`p-2 rounded-lg transition-colors shadow-sm hover:shadow-md ${
                      report.status === "aktif"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-400 hover:bg-gray-500 text-white"
                    }`}
                    title={report.status === "aktif" ? "Tandai Selesai" : "Aktifkan Kembali"}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Delete Button - Icon Only */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(report.id)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm hover:shadow-md"
                    title="Hapus Laporan"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comment Section */}
          {showComments && currentUserId && openComments.has(report.id) && (
            <div className="border-t">
              <CommentSection reportId={report.id} currentUserId={currentUserId} isHistoryMode={isHistoryMode} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
