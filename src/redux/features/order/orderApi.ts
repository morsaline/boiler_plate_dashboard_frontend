import { baseApi } from "@/redux/api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ CREATE Order
    createOrder: build.mutation({
      query: (body) => ({
        url: "/orders/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ GET ALL Orders (with query params)
    getOrders: build.query({
      query: ({ page = 1, limit = 10, status = "" }) => ({
        url: `/orders/all-orders`,
        method: "GET",
        params: { page, limit, status },
      }),
      providesTags: ["Orders"],
    }),

    // ✅ GET Single Order by ID
    getOrderById: build.query({
      query: (id) => `/orders/single/${id}`,
      providesTags: ["Orders"],
    }),

    // ✅ UPDATE Order (PUT)
    updateOrder: build.mutation({
      query: ({ id, body }) => ({
        url: `/orders/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // OPTIONAL: Update only status
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/orders/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ DELETE Order
    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/orders/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
