import { baseApi } from "@/redux/api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchUsers: build.query({
      query: (params = {}) => ({
        url: "/users/all-users",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    getUserById: build.query({
      query: (id) => `users/${id}`,
      providesTags: [{ type: "User", id: "SINGLE" }],
    }),

getme: build.query({
  query: () => ({
    url: "/users/get-me",
    method: "GET",
  }),
  providesTags: ["User"],
}),

updateProfilePicture: build.mutation({
  query: (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return {
      url: "/users/profile-picture",
      method: "PATCH",
      body: formData,
    };
  },
  invalidatesTags: ["User"],
}),
  updateProfile: build.mutation({
      query: (formData) => {
        return {
          url: "/users/update-profile",
          method: "PATCH",
          body: formData,

        };
      },
      invalidatesTags: ["User"], // Refetch getMe after update
    }),

    updateUser: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: [{ type: "User", id: "SINGLE" }],
    }),


    deleteUser: build.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useGetmeQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateProfilePictureMutation,
  useUpdateProfileMutation
} = usersApi;



// {
//     "success": true,
//     "message": "User profile updated successfully",
//     "data": {
//         "id": "68bc8baab72b5289839b44c7",
//         "fullName": "John Doe Updated",
//         "email": "admin@seoagenciaseo.com",
//         "phoneNumber": "+8801711223344",
//         "password": "$2b$12$HPR1.cUCHys71j/QraaN5ugljh.7DwgBGKjr0EcveA4enL.oD6nK2",
//         "gender": "Male",
//         "country": "Bangladesh",
//         "address": "Banani, Dhaka",
//         "drivingLicenseNo": "DL-2025-XYZ",
//         "vehiclesNumber": "DHA-11-1234",
//         "lat": 23.8103,
//         "lng": 90.4125,
//         "fcmToken": "new-fcm-token-123",
//         "profileImage": "https://nyc3.digitaloceanspaces.com/freashstart/nathancloud/1758153940217_e61d3601-bf1e-4b39-9472-603a90c22bfc_3d-rendering-modern-dining-room-living-room-with-luxury-decor.jpg",
//         "about": "I am a professional driver with 5 years experience.",
//         "isVerifyEmail": true,
//         "otp": 9905,
//         "otpExpiresAt": "2025-09-13T00:27:17.587Z",
//         "role": "ADMIN",
//         "status": "ACTIVE",
//         "createdAt": "2025-09-06T19:29:46.988Z",
//         "updatedAt": "2025-09-18T00:14:03.530Z"
//     }
// }
