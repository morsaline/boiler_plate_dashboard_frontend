/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const restaurantsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    crateSingleRestaurant: build.mutation({
      query: (body) => ({
        url: `/restourants/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // ✅ key change: arg is `Record<string, any> | undefined`
    // ✅ and we only include `params` if it's defined
    getAllRestaurants: build.query<
      any, // replace with your { data: Restaurant[]; total?: number }
      Record<string, any> | undefined
    >({
      query: (params) => ({
        url: `/restourants`,
        method: "GET",
        ...(params ? { params } : {}), // <- avoids params: void
      }),
      providesTags: ["Restaurants"],
    }),

    getSingleRestaurant: build.query<any, string>({
      query: (id) => ({
        url: `/restourants/${id}`,
        method: "GET",
      }),
      providesTags: ["Restaurants"],
    }),

    updateSingleRestaurant: build.mutation<
      any,
      { id: string; body: Record<string, any> }
    >({
      query: ({ id, body }) => ({
        url: `/restourants/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Restaurants"],
    }),

    deleteSingleRestaurant: build.mutation<any, string>({
      query: (id) => ({
        url: `/restourants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurants"],
    }),
  }),
});

export const {
  useCrateSingleRestaurantMutation,
  useGetAllRestaurantsQuery,
  useGetSingleRestaurantQuery,
  useUpdateSingleRestaurantMutation,
  useDeleteSingleRestaurantMutation,
} = restaurantsApi;