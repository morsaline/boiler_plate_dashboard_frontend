/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/reviewsApi.ts

import { baseApi } from "@/redux/api/baseApi";

// ===== TYPES =====
export interface Review {
  id: string;
  senderId: string;
  receiverId: string;
  receiverType: "SPONSOR" | "SERVICE";
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  sender: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
  };
  receiver: Receiver | null;
}

export type Receiver =
  | {
      id: string;
      serviceName: string;
      images: string[];
    }
  | {
      id: string;
      [key: string]: unknown; // future sponsor fields
    };

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: Review[];
  };
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  receiverId?: string;
  receiverType?: "SPONSOR" | "SERVICE";
  isApproved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any; // allow dynamic filters
}

// Fixed: Added 'data' property for the returned review object
export interface ApprovalResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    senderId: string;
    receiverId: string;
    receiverType: "SPONSOR" | "SERVICE";
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    sender?: {
      id: string;
      fullName: string;
      email: string;
      profileImage: string;
    };
    receiver?: Receiver | null;
  };
}

// ===== API ENDPOINTS =====
export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllReviews: build.query<ReviewsResponse, ReviewQueryParams>({
      query: (params) => ({
        url: "/reviews/all-reviews",
        method: "GET",
        params,
      }),
      providesTags: ["Review"],
    }),

    getReviewById: build.query<Review, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    approveReview: build.mutation<ApprovalResponse, string>({
      query: (id) => ({
        url: `/reviews/approve-review/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useApproveReviewMutation, // added missing hook export
} = reviewsApi;

// Also export the reducer path or enhancer if needed manually (optional)
export default reviewsApi;