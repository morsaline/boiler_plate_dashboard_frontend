/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReviewList } from "@/components/Reviews/Review-List";
import TableSkeleton from "@/lib/Loader";
import {
  useApproveReviewMutation,
  useGetAllReviewsQuery,
} from "@/redux/features/reviews/Reviews";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 👇 Shared interface – ideally extract to types/review.ts later
export interface Review {
  id: string;
  userName: string;
  reviewTo: string;
  reviewText: string;
  date: string;
  rating: number;
  published: boolean;
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getReviewToName = (receiverType: string, receiver: any): string => {
  if (!receiver) return receiverType || "Unknown Entity";
  if (receiver.serviceName) return receiver.serviceName;
  // Add sponsor name logic when available
  return receiverType;
};

export default function ReviewManagement() {
  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery({});
  const [approveReview] = useApproveReviewMutation();
  const [reviews, setReviews] = useState<Review[]>([]);

  // Transform API data when it loads
  useEffect(() => {
    if (data?.data?.data) {
      const transformed = data.data.data.map((item) => ({
        id: item.id,
        userName: item.sender.fullName,
        reviewTo: getReviewToName(item.receiverType, item.receiver),
        reviewText: item.comment,
        date: formatDate(item.createdAt),
        rating: item.rating,
        published: item.isApproved,
      }));
      setReviews(transformed);
    }
  }, [data]);

  // Handle publish toggle + call API
  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      // Optimistically update UI
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, published } : review
        )
      );

      // Call API to approve/disapprove (assuming backend handles disapproval too)
      const response = await approveReview(id).unwrap();

      if (response?.success) toast.success(response.message);
      else {
        toast.error(response.message);
      }
    } catch (error) {
      // Revert on error
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, published: !published } : review
        )
      );
      toast.error("Failed to update review status. Please try again.");
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load reviews
        </h2>
        <p className="text-gray-500 mt-2">
          Please check your connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">No reviews available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-full mx-auto">
        <ReviewList reviews={reviews} onTogglePublish={handleTogglePublish} />
      </div>
    </div>
  );
}
