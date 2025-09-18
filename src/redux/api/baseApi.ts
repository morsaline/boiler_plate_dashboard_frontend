/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.0.20.132:5002/api/v1",
    baseUrl: "https://seoagenciaseo-backend.onrender.com/api/v1",
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
    "Post",
    "Auth",
    "Restaurants",
    "overview",
    "Hotel",
    "Tourist",
    "Beach",
    "Fashion",
    "Review",
  ],
  endpoints: () => ({}),
});
