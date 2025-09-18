/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeoDataResponse } from "@/app/types/global";
import { baseApi } from "@/redux/api/baseApi";

export interface BeachData {
  id?: string;
  beacheName: string;
  category?: string;
  address: string;
  lat: number;
  lng: number;
  averageRating: number;
  phone?: string;
  facilities?: string[]; // list of available facilities
  images: string | File; // single image URL (if multiple, use string[])
}

export const beachApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBeach: build.mutation<SeoDataResponse<BeachData>, FormData>({
      query: (body) => ({
        url: "/beaches/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Beach"],
    }),

    updateSingleBeach: build.mutation<
      SeoDataResponse<BeachData>,
      { id: string; body: FormData } // ✅ FormData allowed
    >({
      query: ({ id, body }) => ({
        url: `/beaches/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Beach"],
    }),

    getAllBeaches: build.query<SeoDataResponse<BeachData>, Record<string, any>>(
      {
        query: (params = {}) => ({
          url: "/beaches/all-beache",
          method: "GET",
          params,
        }),
        providesTags: ["Beach"],
      }
    ),

    deleteSingleBeach: build.mutation<SeoDataResponse<BeachData>, string>({
      query: (id) => ({
        url: `/beaches/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Beach"],
    }),
  }),
});

export const {
  useCreateBeachMutation,
  useUpdateSingleBeachMutation,
  useGetAllBeachesQuery,
  useDeleteSingleBeachMutation,
} = beachApi;
