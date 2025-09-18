import { SeoDataResponse } from "@/app/types/global";
import { baseApi } from "@/redux/api/baseApi";

export interface RoomData {
  id: string;
  roomName: string;
  beds: number;
  washrooms: number;
  parking: boolean; // ✅ fixed spelling
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
  id?: string;
  name: string;
  hotelId?: string; // optional if not always present
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
  rooms: RoomData[];
}

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createHotel: build.mutation<SeoDataResponse<HotelData>, HotelData>({
      query: (body) => ({
        url: "/hotels/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hotel"],
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllHotels: build.query<SeoDataResponse<HotelData>, Record<string, any>>({
      query: (params = {}) => ({
        url: "/hotels",
        method: "GET",
        params,
      }),
      providesTags: ["Hotel"],
    }),

    getSingleHotel: build.query<SeoDataResponse<HotelData>, string>({
      query: (id) => ({
        url: `/hotels/single/${id}`,
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),

    updateSingleHotel: build.mutation<
      SeoDataResponse<HotelData>,
      { id: string; body: HotelData }
    >({
      query: ({ id, body }) => ({
        url: `/hotels/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Hotel"],
    }),

    deleteSingleHotel: build.mutation<SeoDataResponse<HotelData>, string>({
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
