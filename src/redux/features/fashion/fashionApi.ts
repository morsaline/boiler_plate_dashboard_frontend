// import { SeoDataResponse } from "@/app/types/global";
// import { baseApi } from "@/redux/api/baseApi";

// export interface FashionData {
//   id: string;
//   fashionName: string;
//   category: string;
//   address: string;
//   lat: number;
//   lng: number;
//   averageRating: number;
//   phone: string;
//   facilities: string[]; // list of available facilities
//   images: string; // single image URL (if multiple, use string[])
//   createdAt: string;
//   updatedAt: string;
//   distance: number;
// }

// export const hotelApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     createHotel: build.mutation<SeoDataResponse<FashionData>, FashionData>({
//       query: (body) => ({
//         url: "/hotels/create",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Hotel"],
//     }),

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     getAllHotels: build.query<
//       SeoDataResponse<FashionData>,
//       Record<string, any>
//     >({
//       query: (params = {}) => ({
//         url: "/hotels",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["Hotel"],
//     }),

//     getSingleHotel: build.query<SeoDataResponse<FashionData>, string>({
//       query: (id) => ({
//         url: `/hotels/single/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Hotel"],
//     }),

//     updateSingleHotel: build.mutation<
//       SeoDataResponse<HotelData>,
//       { id: string; body: HotelData }
//     >({
//       query: ({ id, body }) => ({
//         url: `/hotels/update/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: ["Hotel"],
//     }),

//     deleteSingleHotel: build.mutation<SeoDataResponse<HotelData>, string>({
//       query: (id) => ({
//         url: `/hotels/delete/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Hotel"],
//     }),
//   }),
// });

// export const {
//   useCreateHotelMutation,
//   useGetAllHotelsQuery,
//   useGetSingleHotelQuery,
//   useUpdateSingleHotelMutation,
//   useDeleteSingleHotelMutation,
// } = hotelApi;
