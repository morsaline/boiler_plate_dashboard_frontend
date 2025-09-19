"use client";

import { useState, useMemo } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Restaurant } from "@/app/(DashboardLayout)/dashboard/restaurants/page";
import Pagination from "@/lib/Pagination";
import { useDeleteSingleRestaurantMutation } from "@/redux/features/restaurantsApi/restaurantsApi";
import { toast } from "sonner";
import Link from "next/link";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onAddNew: () => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onViewDetails: (restaurant: Restaurant) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  page: number;
  setPage: (val: number) => void;
  totalPages: number;
}

export function RestaurantList({
  restaurants,
  onAddNew,
  onEdit,
  onDelete,
  onViewDetails,
  searchTerm,
  setSearchTerm,
  page,
  setPage,
  totalPages,
}: RestaurantListProps) {
  const [deleteSingleRestaurant] = useDeleteSingleRestaurantMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  const itemsPerPage = 10;

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.whatsapp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, restaurants]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const openDeleteModal = (userId: string) => {
    setSelectedRestaurantId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurantId(null);
  };

  const confirmDelete = async () => {
    if (selectedRestaurantId) {
      onDelete(selectedRestaurantId);
      const res = await deleteSingleRestaurant(selectedRestaurantId).unwrap();
      toast.success(res?.message);
      closeModal();
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Restaurants List</p>
          <h1 className="text-xl font-semibold text-orange-500">
            Restaurants List
          </h1>
        </div>

        {/* Search + Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search listing..."
              className="pl-10 rounded-md border-gray-300"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Link href={"/dashboard/add-restaurants"}>
            <Button
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              + Add Restaurant
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">
                  Restaurant ID
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  Restaurant Name
                </th>
                <th className="px-6 py-3 text-left font-medium">Location</th>
                <th className="px-6 py-3 text-left font-medium">
                  What&apos;s APP
                </th>
                <th className="px-6 py-3 text-left font-medium">Instagram</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRestaurants.map((restaurant, index) => (
                <tr
                  key={restaurant.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-3 border-t">{index + 1}</td>
                  <td className="px-6 py-3 border-t">{restaurant.name}</td>
                  <td className="px-6 py-3 border-t">{restaurant.address}</td>
                  <td className="px-6 py-3 border-t">{restaurant.whatsapp}</td>
                  <td className="px-6 py-3 border-t">{restaurant.instagram}</td>
                  <td className="px-6 py-3 border-t">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-600 hover:text-gray-900"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => onEdit(restaurant)}
                          className="cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewDetails(restaurant)}
                          className="cursor-pointer"
                        >
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(restaurant.id)}
                          className="cursor-pointer text-red-500 focus:text-red-600"
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          {/* Left: info */}
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredRestaurants.length)} of{" "}
            {filteredRestaurants.length} restaurants
          </div>

          {/* Right: page numbers */}
          <div className="flex items-center gap-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-80 relative shadow-2xl">
            <h2 className="text-lg text-center font-semibold mb-4">
              Do you want to remove?
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
