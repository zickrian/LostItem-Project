"use client";
import { useState } from "react";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";
import OptimizedImage from "@/components/OptimizedImage";
import { getCategoryEmoji } from "@/lib/categoryEmoji";

export interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  type: "hilang" | "temuan";
  image_url?: string;
  status: "aktif" | "selesai";
  created_at: string;
  user: {
    name: string;
    avatar_url?: string;
  };
}

interface ReportCardProps {
  report: Report;
  currentUserId: string;
  onDelete?: (reportId: string) => void;
  onEdit?: (reportId: string) => void;
}

export default function ReportCard({ report, currentUserId, onDelete, onEdit }: ReportCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const isOwner = report.user_id === currentUserId;
  
  // Check if description is long (more than 150 characters)
  const isDescriptionLong = report.description.length > 150;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full border-3 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105" style={{ borderColor: 'rgba(17, 77, 145)', borderWidth: '3px' }}>
              <Image
                src={report.user.avatar_url || "/default-avatar.svg"}
                alt={report.user.name}
                width={44}
                height={44}
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm sm:text-base">{report.user.name}</p>
              <p className="text-xs text-gray-500 font-medium">{formatDate(report.created_at)}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(report.id)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: 'rgba(17, 77, 145, 0.1)', 
                    color: 'rgba(17, 77, 145)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                    e.currentTarget.style.color = 'rgba(17, 77, 145)';
                  }}
                >
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(report.id)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 hover:shadow-md"
                >
                  🗑️ Hapus
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight flex-1">{report.title}</h3>
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex-shrink-0 ${
              report.type === "hilang"
                ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
            }`}
          >
            {report.type === "hilang" ? "🔍 Hilang" : "✅ Temuan"}
          </span>
        </div>

        <div className="mb-4">
          <p className={`text-gray-600 text-sm sm:text-base whitespace-pre-wrap transition-all duration-300 leading-relaxed ${!isDescriptionExpanded && isDescriptionLong ? 'line-clamp-3' : ''}`}>
            {report.description}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm font-bold mt-2 px-3 py-1 rounded-lg transition-all duration-200 inline-flex items-center gap-1.5 hover:shadow-sm"
              style={{ 
                backgroundColor: 'rgba(17, 77, 145, 0.1)', 
                color: 'rgba(17, 77, 145)' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)'}
            >
              {isDescriptionExpanded ? (
                <>
                  Sembunyikan
                  <svg className="w-4 h-4 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  Lihat selengkapnya
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 shadow-sm">
            {getCategoryEmoji(report.category)} {report.category}
          </span>
          {report.location && (
            <span className="px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-sm" style={{ 
              backgroundColor: 'rgba(17, 77, 145, 0.05)', 
              color: 'rgba(17, 77, 145)',
              borderColor: 'rgba(17, 77, 145, 0.2)'
            }}>
              📍 {report.location}
            </span>
          )}
          {report.status === "selesai" && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm">
              ✔️ Selesai
            </span>
          )}
        </div>

        {/* Image or Icon - Optimized for LCP */}
        <div className="relative w-full h-64 sm:h-72 mb-4 rounded-xl overflow-hidden bg-gray-100 shadow-inner group/image">
          {report.image_url ? (
            <OptimizedImage
              src={report.image_url}
              alt={report.title}
              fill
              priority={false}
              className="object-cover transition-transform duration-500 group-hover/image:scale-105"
              fallbackEmoji={getCategoryEmoji(report.category)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
              <div className="text-7xl sm:text-8xl transition-transform duration-300 group-hover/image:scale-110">
                {getCategoryEmoji(report.category)}
              </div>
            </div>
          )}
          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2"
          style={{
            backgroundColor: showComments ? 'rgba(17, 77, 145)' : 'rgba(17, 77, 145, 0.05)',
            color: showComments ? 'white' : 'rgba(17, 77, 145)',
            borderColor: showComments ? 'rgba(17, 77, 145)' : 'rgba(17, 77, 145, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!showComments) {
              e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(17, 77, 145, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showComments) {
              e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(17, 77, 145, 0.2)';
            }
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>
            {showComments ? "Sembunyikan Komentar" : "Tampilkan Komentar"}
          </span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="border-t-2 border-gray-100 bg-gray-50">
          <CommentSection reportId={report.id} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}
