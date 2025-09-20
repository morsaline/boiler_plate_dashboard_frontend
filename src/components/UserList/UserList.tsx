/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteUserMutation,
  useFetchUsersQuery,
} from "@/redux/features/users/usersApi";
import Pagination from "@/lib/Pagination";
import { toast } from "sonner";
import Loader from "@/lib/Loader";

// --- Simple debounce hook ---
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function UserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 450);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Reset to page 1 when the *debounced* term changes (prevents jumpiness on every keystroke)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const queryArgs = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [currentPage, itemsPerPage, debouncedSearch]
  );

  const {
    data: apiData,
    isLoading,
    isFetching, // <- fetching after initial load
    refetch,
  } = useFetchUsersQuery(queryArgs, {
    // keeps previous data visible while new data loads, but we'll indicate it with isFetching
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    // Optional: cache page results briefly so moving between pages feels instant
    // keepUnusedDataFor: 30, // seconds
  });

  const users = apiData?.data?.data ?? [];
  const totalPages = apiData?.data?.meta?.totalPages ?? 1;

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
      toast.success(res?.message ?? "User deleted");
      // refetch with existing args so the list is up to date
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Failed to delete user");
    } finally {
      closeModal();
    }
  };

  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">User list</p>
          <h1 className="text-2xl font-semibold text-orange-500">User List</h1>
        </div>

        {/* Search */}
        <div className="mb-6 relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">#</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Country</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Inline fetch indicator: shows while new data for the current args is being fetched */}
              {isFetching && (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Loader />
                  </td>
                </tr>
              )}

              {!isFetching && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}

              {!isFetching &&
                users.length > 0 &&
                users.map((user: any, index: number) => (
                  <tr
                    key={user.id ?? `${index}-${user.email}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
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
                        aria-label={`Delete ${user.fullName ?? user.email}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
