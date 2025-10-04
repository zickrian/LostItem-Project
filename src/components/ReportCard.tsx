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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full border-2 overflow-hidden" style={{ borderColor: 'rgba(17, 77, 145)' }}>
              <Image
                src={report.user.avatar_url || "/default-avatar.svg"}
                alt={report.user.name}
                width={40}
                height={40}
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{report.user.name}</p>
              <p className="text-xs text-gray-500">{formatDate(report.created_at)}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(report.id)}
                  className="text-sm font-medium"
                  style={{ color: 'rgba(17, 77, 145)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(17, 77, 145, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(17, 77, 145)'}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(report.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Hapus
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              report.type === "hilang"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {report.type === "hilang" ? "🔍 Hilang" : "✅ Temuan"}
          </span>
        </div>

        <div className="mb-3">
          <p className={`text-gray-600 text-sm whitespace-pre-wrap transition-all duration-300 ${!isDescriptionExpanded && isDescriptionLong ? 'line-clamp-3' : ''}`}>
            {report.description}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm font-semibold mt-2 hover:underline transition-colors inline-flex items-center gap-1"
              style={{ color: 'rgba(17, 77, 145)' }}
            >
              {isDescriptionExpanded ? (
                <>
                  Sembunyikan
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  Lihat selengkapnya
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {getCategoryEmoji(report.category)} {report.category}
          </span>
          {report.location && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
              📍 {report.location}
            </span>
          )}
          {report.status === "selesai" && (
            <span className="px-2 py-1 text-xs rounded-md" style={{ backgroundColor: 'rgba(17, 77, 145, 0.1)', color: 'rgba(17, 77, 145)' }}>
              ✔️ Selesai
            </span>
          )}
        </div>

        {/* Image or Icon - Optimized for LCP */}
        <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden bg-gray-100">
          {report.image_url ? (
            <OptimizedImage
              src={report.image_url}
              alt={report.title}
              fill
              priority={false}
              className="object-cover"
              fallbackEmoji={getCategoryEmoji(report.category)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-8xl">
                {getCategoryEmoji(report.category)}
              </div>
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 transition-colors duration-200"
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(17, 77, 145)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(75, 85, 99)'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-medium">
            {showComments ? "Sembunyikan" : "Tampilkan"} Komentar
          </span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="border-t">
          <CommentSection reportId={report.id} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}
