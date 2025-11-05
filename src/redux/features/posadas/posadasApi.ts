/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeoDataResponse } from "@/app/types/global";
import { baseApi } from "@/redux/api/baseApi";

export interface RoomData {
  id: string;
  roomName: string;
  beds: number;
  washrooms: number;
  parking: boolean;
  gym: boolean;
  swimmingPool: boolean;
  wifi: boolean;
  ac: boolean;
  breakfast: boolean;
  price: number;
  roomPictures: string[];
  createdAt: string;
  updatedAt: string;
  posadasId: string;
}

export interface PosadasData {
  id?: string;
  name: string;
  posadaId?: string;
  address: string;
  lat: number;
  lng: number;
  whatsapp: string;
  phone: string;
  type: string;
  instagram: string;
  averageRating: number;
  description: string;
  posadaImage: string;
  rooms: RoomData[];
}

export const posadasApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPosadas: build.mutation<SeoDataResponse<PosadasData>, PosadasData>({
      query: (body) => ({
        url: "/posadas/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posadas"],
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllPosadas: build.query<
      SeoDataResponse<PosadasData>,
      Record<string, any>
    >({
      query: (params = {}) => ({
        url: "/posadas",
        method: "GET",
        params,
      }),
      providesTags: ["Posadas"],
    }),

    getSinglePosadas: build.query<SeoDataResponse<PosadasData>, string>({
      query: (id) => ({
        url: `/posadas/single/${id}`,
        method: "GET",
      }),
      providesTags: ["Posadas"],
    }),

    updateSinglePosadas: build.mutation<
      SeoDataResponse<PosadasData>,
      { id: string; body: PosadasData }
    >({
      query: ({ id, body }) => ({
        url: `/posadas/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Posadas"],
    }),

    deleteSinglePosadas: build.mutation<SeoDataResponse<PosadasData>, string>({
      query: (id) => ({
        url: `/posadas/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posadas"],
    }),
  }),
});

export const {
  useCreatePosadasMutation,
  useGetAllPosadasQuery,
  useGetSinglePosadasQuery,
  useUpdateSinglePosadasMutation,
  useDeleteSinglePosadasMutation,
} = posadasApi;
