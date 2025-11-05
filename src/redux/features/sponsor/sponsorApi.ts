/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// 🧩 Sponsor type definition
export interface Sponsor {
  id?: string;
  sponsorName: string;
  price: number;
  logo?: string;
  address?: string;
  websiteLink?: string;
  facilities?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const sponsorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Create single sponsor
    createSingleSponsor: build.mutation({
      query: (body) => ({
        url: `/sponsor/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sponsor"],
    }),

    // ✅ Get all sponsors (supports pagination & filters)
    getAllSponsors: build.query<any, Record<string, any> | undefined>({
      query: (params) => ({
        url: `/sponsor`,
        method: "GET",
        ...(params ? { params } : {}),
      }),
      providesTags: ["Sponsor"],
    }),

    // ✅ Get single sponsor by ID
    getSingleSponsor: build.query<any, string>({
      query: (id) => ({
        url: `/sponsor/${id}`,
        method: "GET",
      }),
      providesTags: ["Sponsor"],
    }),

    // ✅ Update sponsor
    updateSingleSponsor: build.mutation<
      any,
      { id: string; body: Record<string, any> }
    >({
      query: ({ id, body }) => ({
        url: `/sponsor/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sponsor"],
    }),

    // ✅ Delete sponsor
    deleteSingleSponsor: build.mutation<any, string>({
      query: (id) => ({
        url: `/sponsor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sponsor"],
    }),
  }),
});

// ✅ Export hooks for usage in components
export const {
  useCreateSingleSponsorMutation,
  useGetAllSponsorsQuery,
  useGetSingleSponsorQuery,
  useUpdateSingleSponsorMutation,
  useDeleteSingleSponsorMutation,
} = sponsorApi;
