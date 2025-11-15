/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://178.128.254.246:12022/api/v1",
    // baseUrl: "https://seoagenciaseo-backend.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User", "Posadas", "Post", "Auth", "Products", "Users", "Orders"],
  endpoints: () => ({}),
});
