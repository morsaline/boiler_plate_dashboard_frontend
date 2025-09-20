"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/lib/Loader";
import {
  useDeleteUserMutation,
  useFetchUsersQuery,
} from "@/redux/features/users/usersApi";

export default function LatestUsers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users (latest 5)
  const {
    data: apiData,
    isLoading,
    refetch,
  } = useFetchUsersQuery({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    if (apiData?.data?.data) {
      setUsers(apiData.data.data);
    }
  }, [apiData]);

  const [deleteUser] = useDeleteUserMutation();

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      const res = await deleteUser(selectedUserId).unwrap();
      toast.success(res?.message || "User deleted");
      refetch();
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="px-5">


      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium">
                Country
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              users.map((user: any, index: number) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.fullName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.phoneNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.country || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                      onClick={() => openDeleteModal(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-2xl">
            <h2 className="text-lg font-semibold text-center mb-4">
              Do you want to remove this user?
            </h2>
            <div className="flex justify-around gap-2">
              <Button
                variant="ghost"
                onClick={closeModal}
                className="text-[#FF6203]"
              >
                No
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
