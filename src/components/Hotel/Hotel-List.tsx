"use client";

import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hotel } from "@/app/(DashboardLayout)/dashboard/hotels/page";
import Pagination from "@/lib/Pagination";

interface HotelListProps {
  hotels: Hotel[];
  onAddNew: () => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
  onViewDetails: (hotel: Hotel) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  searchTerm: string; // new
  setSearchTerm: (term: string) => void; // new
}

export function HotelList({
  hotels,
  onAddNew,
  onEdit,
  onDelete,
  onViewDetails,
  currentPage,
  setCurrentPage,
  totalPages,
  searchTerm, 
  setSearchTerm, 
}: HotelListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const openDeleteModal = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotelId(null);
  };

  const confirmDelete = () => {
    if (selectedHotelId) {
      onDelete(selectedHotelId);
      closeModal();
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Hotels List</p>
        <h1 className="text-xl font-semibold text-orange-500">Hotels List</h1>
      </div>

      {/* Search + Add */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search listing..."
            className="pl-10 rounded-md border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={onAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        >
          + Add Hotels
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Hotel ID</th>
              <th className="px-6 py-3 text-left font-medium">Hotels Name</th>
              <th className="px-6 py-3 text-left font-medium">Location</th>
              <th className="px-6 py-3 text-left font-medium">WhatsApp</th>
              <th className="px-6 py-3 text-left font-medium">Instagram</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel, index) => (
              <tr
                key={hotel.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-3 border-t">{hotel.id}</td>
                <td className="px-6 py-3 border-t">{hotel.name}</td>
                <td className="px-6 py-3 border-t">{hotel.address}</td>
                <td className="px-6 py-3 border-t">{hotel.whatsapp}</td>
                <td className="px-6 py-3 border-t">{hotel.instagram}</td>
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
                      <DropdownMenuItem onClick={() => onEdit(hotel)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewDetails(hotel)}>
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteModal(hotel.id)}
                        className="text-red-500 focus:text-red-600"
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
        <div className="text-sm text-gray-500">
          Showing {hotels.length > 0 ? 1 : 0} to {hotels.length} of{" "}
          {hotels.length} hotels
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative shadow-2xl">
            <h2 className="text-lg text-center font-semibold mb-4">
              Do you want to remove?
            </h2>
            <div className="flex justify-center gap-2">
              <Button
                variant="ghost"
                onClick={closeModal}
                className="text-[#FF6203] px-7 hover:text-orange-50"
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
