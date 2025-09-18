/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/servicesApi.ts

import { baseApi } from "@/redux/api/baseApi";

// ===== TYPES =====
export interface Service {
  id: string;
  serviceName: string;
  name: string;
  image: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  averageRating: number;
  phone: string;
  facilities: string[];
  images: string[]; // URLs may have trailing spaces (trim if needed)
  createdAt: string;
  updatedAt: string;
  distance?: number; // optional, computed field
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: Service[];
  };
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  [key: string]: any; // allows dynamic filters (e.g., category, etc.)
}

// ===== API ENDPOINTS =====
export const serviceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllServices: build.query<ServicesResponse, ServiceQueryParams>({
      query: (params) => ({
        url: "/services/all-services",
        method: "GET",
        params, // Automatically converts object to URL query string
      }),
      providesTags: ["ServiceList"],
    }),

    deleteService: build.mutation<ServicesResponse, string>({
      query: (id) => ({
        url: `/services/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceList"],
    }),



  }),
});

// Export hooks
export const { useGetAllServicesQuery, useDeleteServiceMutation } = serviceApi;

export default serviceApi;