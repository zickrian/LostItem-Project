"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url?: string;
  };
}

interface CommentSectionProps {
  reportId: string;
  currentUserId: string;
}

export default function CommentSection({ reportId, currentUserId }: CommentSectionProps) {
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, commentId: "", title: "", message: "" });
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    
    // Subscribe to new comments
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const channel = supabase
      .channel(`comments-${reportId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `report_id=eq.${reportId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:user_id (
            name,
            avatar_url
          )
        `)
        .eq("report_id", reportId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      toast.error("Gagal memuat komentar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          report_id: reportId,
          user_id: currentUserId,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment("");
      toast.success("Komentar berhasil ditambahkan");
    } catch (error) {
      toast.error("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    // open confirm dialog
    setConfirmDialog({
      isOpen: true,
      commentId,
      title: "Hapus Komentar",
      message: "Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.",
    });
  }

  async function confirmDeleteComment() {
    const commentId = confirmDialog.commentId;
    setConfirmDialog({ isOpen: false, commentId: "", title: "", message: "" });
    if (!commentId) return;

    // optimistic UI: mark as deleting to animate fade
    setDeletingCommentId(commentId);

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) throw error;

      // remove from local state
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Komentar berhasil dihapus");
    } catch (err) {
      // revert: refetch comments
      toast.error("Gagal menghapus komentar.");
      fetchComments();
    } finally {
      setDeletingCommentId(null);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Memuat komentar...</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 bg-gray-50">
      {/* Comments List */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-80 sm:max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">Belum ada komentar</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`flex gap-2 sm:gap-3 transition-opacity duration-300 ${deletingCommentId === comment.id ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={comment.user.avatar_url || "/default-avatar.svg"}
                alt={comment.user.name}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-gray-300 object-cover flex-shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/default-avatar.svg";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{comment.user.name}</p>
                    {comment.user_id === currentUserId && (
                      <button
                        onClick={() => setConfirmDialog({ isOpen: true, commentId: comment.id, title: 'Hapus Komentar', message: 'Apakah Anda yakin ingin menghapus komentar ini?' })}
                        className="text-red-500 hover:text-red-700 text-[10px] sm:text-xs whitespace-nowrap ml-2"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">{comment.content}</p>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 ml-2 sm:ml-3">{formatDate(comment.created_at)}</p>
              </div>
            </div>
          ))
        )}
      </div>

  {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex gap-1.5 sm:gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar..."
          className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-xs sm:text-sm text-black placeholder:text-gray-400"
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(17, 77, 145, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
          style={{ backgroundColor: !newComment.trim() || submitting ? undefined : 'rgba(17, 77, 145)' }}
          onMouseEnter={(e) => {
            if (newComment.trim() && !submitting) {
              e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)';
            }
          }}
          onMouseLeave={(e) => {
            if (newComment.trim() && !submitting) {
              e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)';
            }
          }}
        >
          {submitting ? "..." : "Kirim"}
        </button>
      </form>
      {/* Confirm Dialog for deletion */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDeleteComment}
        onCancel={() => setConfirmDialog({ isOpen: false, commentId: "", title: "", message: "" })}
        type="danger"
      />
    </div>
  );
}
