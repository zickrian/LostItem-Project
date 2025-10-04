"use client";
import { useState } from "react";
import Image from "next/image";
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/solid";

// Fungsi untuk mendapatkan emoji berdasarkan kategori
const getCategoryEmoji = (category: string): string => {
  const categoryLower = category.toLowerCase().trim();
  
  // Switch case untuk exact match dulu
  switch (categoryLower) {
    // Elektronik
    case "elektronik":
    case "hp":
    case "handphone":
    case "smartphone":
      return "📱";
    case "laptop":
    case "notebook":
      return "💻";
    
    // Dokumen
    case "dokumen":
    case "surat":
      return "📄";
    case "ktp":
    case "kartu":
    case "id card":
      return "🪪";
    
    // Kunci
    case "kunci":
      return "🔑";
    
    // Tas & Dompet
    case "tas":
    case "ransel":
    case "backpack":
      return "🎒";
    case "dompet":
    case "wallet":
      return "👛";
    
    // Pakaian
    case "pakaian":
    case "baju":
    case "kaos":
    case "kemeja":
      return "👕";
    case "sepatu":
    case "sandal":
      return "👟";
    
    // Aksesoris
    case "jam":
    case "jam tangan":
    case "watch":
      return "⌚";
    case "kacamata":
    case "glasses":
      return "🕶️";
    
    // Buku & Alat Tulis
    case "buku":
    case "novel":
    case "book":
      return "📚";
    case "alat tulis":
    case "pensil":
    case "pulpen":
      return "✏️";
    
    // Lainnya
    case "lainnya":
    case "other":
      return "📦";
  }
  
  // Fallback dengan includes untuk partial match
  if (categoryLower.includes("kunci")) return "🔑";
  if (categoryLower.includes("hp") || categoryLower.includes("handphone")) return "📱";
  if (categoryLower.includes("laptop")) return "💻";
  if (categoryLower.includes("elektronik")) return "📱";
  if (categoryLower.includes("dokumen") || categoryLower.includes("surat")) return "📄";
  if (categoryLower.includes("ktp") || categoryLower.includes("kartu")) return "🪪";
  if (categoryLower.includes("tas")) return "🎒";
  if (categoryLower.includes("dompet")) return "👛";
  if (categoryLower.includes("baju") || categoryLower.includes("pakaian")) return "👕";
  if (categoryLower.includes("sepatu")) return "👟";
  if (categoryLower.includes("jam")) return "⌚";
  if (categoryLower.includes("kacamata")) return "🕶️";
  if (categoryLower.includes("buku")) return "📚";
  if (categoryLower.includes("pensil") || categoryLower.includes("alat tulis")) return "✏️";
  
  // Default
  return "📦";
};

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
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  
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
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-7xl">
                  {getCategoryEmoji(report.category)}
                </div>
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
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
              {report.title}
            </h3>

            {/* Description */}
            {report.description && (
              <div className="mb-2">
                <p className={`text-gray-600 text-sm whitespace-pre-wrap transition-all duration-300 ${!expandedReports.has(report.id) && report.description.length > 100 ? 'line-clamp-2' : ''}`}>
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
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                {getCategoryEmoji(report.category)} {report.category}
              </span>
              {report.location && (
                <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                  📍 {report.location}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="text-xs text-gray-500 mb-3">
              {formatDate(report.created_at)}
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
