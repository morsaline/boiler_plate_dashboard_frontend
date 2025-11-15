import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ CREATE User
    createUser: build.mutation({
      query: (body) => ({
        url: "/users/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ READ All Users
    getUsers: build.query({
      query: (params) => ({
        url: "/users/admin/all-user",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),

    // ✅ READ Single User by ID
    getUserById: build.query({
      query: (id) => `/users/single/${id}`,
      providesTags: ["Users"],
    }),

    // ✅ UPDATE User
    updateUser: build.mutation({
      query: ({ id, body }) => ({
        url: `/users/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ DELETE User
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/users/admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
