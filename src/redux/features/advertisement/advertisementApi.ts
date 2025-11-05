// File: /redux/features/advertisement/AdvertisementApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";

// File: /redux/types/AdvertisementTypes.ts

export interface Advertisement {
  id?: string;
  advertisementName: string;
  companyName: string;
  website: string;
  advertisementPictures: string[]; // URLs or filenames of uploaded images
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvertisementCreatePayload {
  advertisementName: string;
  companyName: string;
  website: string;
  advertisementPictures?: File[]; // for uploads
}

export const advertisementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /advertisements?page=1&limit=10...
    getAllAdvertisements: builder.query<any, any>({
      query: (params = {}) => ({
        url: `/advertisements`,
        method: "GET",
        params,
      }),
      providesTags: ["Advertisement"],
    }),

    // GET /advertisements/:id
    getAdvertisementById: builder.query<any, string>({
      query: (id) => ({
        url: `/advertisements/${id}`,
        method: "GET",
      }),
      providesTags: ["Advertisement"],
    }),

    // POST /advertisements  (expects multipart FormData for file uploads)
    createAdvertisement: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/advertisements`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Advertisement"],
    }),

    // PATCH /advertisements/:id
    updateAdvertisement: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/advertisements/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Advertisement"],
    }),

    // DELETE /advertisements/:id
    deleteAdvertisement: builder.mutation<any, string>({
      query: (id) => ({
        url: `/advertisements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllAdvertisementsQuery,
  useGetAdvertisementByIdQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
} = advertisementApi;
