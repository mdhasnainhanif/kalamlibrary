"use client";

import { useTransition } from "react";
import { toast } from "react-hot-toast";
import {
  adminApproveReview,
  adminDeleteReview,
  adminEditReviewMessage,
  adminRejectReview,
  adminToggleFeatured,
} from "@/app/admin/actions";
import type { AdminReviewRow } from "@/utils/reviewsData";

type Props = { review: AdminReviewRow };

export default function AdminReviewRowActions({ review }: Props) {
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<void>) => {
    start(async () => {
      try {
        await fn();
        toast.success("Saved");
      } catch {
        toast.error("Action failed");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 border-t border-emerald-500/10 pt-3">
      <div className="flex flex-wrap gap-2">
        {review.status === "pending" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => adminApproveReview(review.id))}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
          >
            Approve
          </button>
        ) : null}
        {review.status !== "rejected" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => adminRejectReview(review.id))}
            className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs text-amber-200"
          >
            Reject
          </button>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => adminDeleteReview(review.id))}
          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-200"
        >
          Delete
        </button>
        {review.status === "approved" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => adminToggleFeatured(review.id, !review.is_featured))}
            className="rounded-lg border border-gold-500/30 px-3 py-1.5 text-xs text-gold-200"
          >
            {review.is_featured ? "Unfeature" : "Mark featured"}
          </button>
        ) : null}
      </div>
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const message = String(fd.get("message") || "");
          const note = String(fd.get("note") || "");
          run(() => adminEditReviewMessage(review.id, message, note));
        }}
      >
        <label className="block text-xs text-gray-400">Edit message (typo fix)</label>
        <textarea
          name="message"
          defaultValue={review.message}
          rows={3}
          className="w-full rounded-lg border border-emerald-500/20 bg-black/30 px-2 py-1 text-xs"
        />
        <input
          name="note"
          placeholder="Optional note"
          className="w-full rounded-lg border border-emerald-500/20 bg-black/30 px-2 py-1 text-xs"
        />
        <button type="submit" disabled={pending} className="rounded-lg border border-emerald-500/30 px-3 py-1 text-xs">
          Save text
        </button>
      </form>
    </div>
  );
}
