/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.10.66:5002/api/v1",
    // baseUrl: "https://seoagenciaseo-backend.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Posadas",
    "Post",
    "Auth",
    "Advertisement",
    "Sponsor",
    "Restaurants",
    "overview",
    "Hotel",
    "Tourist",
    "Bar",
    "Beach",
    "Fashion",
    "Review",
    "ServiceList",
    "TouristSpots",
  ],
  endpoints: () => ({}),
});
