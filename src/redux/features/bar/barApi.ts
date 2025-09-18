/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeoDataResponse } from "@/app/types/global";
import { baseApi } from "@/redux/api/baseApi";

export interface BarData {
  id?: string;
  barName: string;
  category?: string;
  address: string;
  lat: number;
  lng: number;
  averageRating: number;
  phone?: string;
  facilities?: string[]; // list of available facilities
  images: string | File; // single image URL (if multiple, use string[])
}

export const barApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBar: build.mutation<SeoDataResponse<BarData>, FormData>({
      query: (body) => ({
        url: "/bars/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bar"],
    }),

    updateSingleBar: build.mutation<
      SeoDataResponse<BarData>,
      { id: string; body: FormData } // ✅ FormData allowed
    >({
      query: ({ id, body }) => ({
        url: `/bars/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bar"],
    }),

    getAllBars: build.query<SeoDataResponse<BarData>, Record<string, any>>({
      query: (params = {}) => ({
        url: "/bars/all-bars",
        method: "GET",
        params,
      }),
      providesTags: ["Bar"],
    }),

    deleteSingleBar: build.mutation<SeoDataResponse<BarData>, string>({
      query: (id) => ({
        url: `/bars/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bar"],
    }),
  }),
});

export const {
  useCreateBarMutation,
  useUpdateSingleBarMutation,
  useGetAllBarsQuery,
  useDeleteSingleBarMutation,
} = barApi;
