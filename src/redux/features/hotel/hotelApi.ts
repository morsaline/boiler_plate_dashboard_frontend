import { baseApi } from "@/redux/api/baseApi";

export interface RoomData {
  id: string;
  roomName: string;
  beds: number;
  washrooms: number;
  pariking: boolean;
  gym: boolean;
  swimmingPool: boolean;
  wifi: boolean;
  ac: boolean;
  breakfast: boolean;
  price: number;
  roomPictures: string[];
  createdAt: string;
  updatedAt: string;
  hotelId: string;
}

export interface HotelData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  whatsapp: string;
  phone: string;
  type: string;
  instagram: string;
  averageRating: number;
  description: string;
  hotelImage: string;
  createdAt: string;
  updatedAt: string;
  rooms: RoomData[];
  distance: number;
}

export interface GetAllHotelsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: HotelData[];
  };
}

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createHotel: build.mutation<GetAllHotelsResponse, HotelData>({
      query: (body) => ({
        url: "/hotels/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hotel"],
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllHotels: build.query<GetAllHotelsResponse, Record<string, any>>({
      query: (params = {}) => ({
        url: "/hotels",
        method: "GET",
        params,
      }),
      providesTags: ["Hotel"],
    }),

    getSingleHotel: build.query<GetAllHotelsResponse, string>({
      query: (id) => ({
        url: `/hotels/single/${id}`,
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),

    updateSingleHotel: build.mutation<
      GetAllHotelsResponse,
      { id: string; body: GetAllHotelsResponse }
    >({
      query: ({ id, body }) => ({
        url: `/hotels/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Hotel"],
    }),

    deleteSingleHotel: build.mutation<GetAllHotelsResponse, string>({
      query: (id) => ({
        url: `/hotels/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotel"],
    }),
  }),
});

export const {
  useCreateHotelMutation,
  useGetAllHotelsQuery,
  useGetSingleHotelQuery,
  useUpdateSingleHotelMutation,
  useDeleteSingleHotelMutation,
} = hotelApi;
