import { baseApi } from "@/redux/api/baseApi";
// types/touristSpot.ts

export interface TouristSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  facilities: string[];
  culture: string[];
  youtubeLink: string[];
  averageRating: number;
  videoLink: string;
  images: string[];
  entryFee: number;
  createdAt: string;
  updatedAt: string;
  sponsorLink?: string;
  sponsorTitle?: string;
  sponsorDescription?: string;
}

// Pagination meta info
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response for GET ALL
export interface TouristSpotListResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: TouristSpot[];
  };
}

// Response for GET BY ID
export interface TouristSpotDetailResponse {
  success: boolean;
  message: string;
  data: TouristSpot;
}

export const touristSportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create
   addTouristSports: build.mutation<TouristSpotListResponse, FormData>({
      query: (formData) => ({
        url: "/touristSpots/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Tourist"],
    }),

    // Get All
    getAllTouristSports: build.query<
      TouristSpotListResponse,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Record<string, any>
    >({
      query: (params = {}) => ({
        url: "/touristSpots/all-spots",
        method: "GET",
        params,
      }),
      providesTags: ["Tourist"],
    }),

    // Get By ID
    getTouristSportsById: build.query<TouristSpotDetailResponse, string>({
      query: (id) => ({
        url: `/touristSpots/tourist-spot/${id}`,
        method: "GET",
      }),
      providesTags: ["Tourist"],
    }),

    // Update (⚠️ Fix: should be PUT or PATCH, not GET)
updateTouristSportsById: build.mutation<void, { id: string; data: FormData }>({
  query: ({ id, data }) => ({
    url: `/touristSpots/update/${id}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["Tourist"],
}),
    // Delete
    deleteTourist: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/touristSpots/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tourist"],
    }),
  }),
});

export const {
  useAddTouristSportsMutation,
  useGetAllTouristSportsQuery,
  useGetTouristSportsByIdQuery,
  useDeleteTouristMutation,
  useUpdateTouristSportsByIdMutation,
} = touristSportsApi;
