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
import Pagination from "@/lib/Pagination";

export interface TouristSpot {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];
  culture: string[];
  youtubeLink: string;
  photos: string[];
  videos: string[];
}

export interface TouristSpotListProps {
  touristSpots: TouristSpot[];
  onAddNew: () => void;
  onEdit: (spot: TouristSpot) => void;
  onDelete: (id: string) => void;
  onViewDetails: (spot: TouristSpot) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export function TouristSpotList({
  touristSpots,
  onAddNew,
  onEdit,
  onDelete,
  onViewDetails,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
}: TouristSpotListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const openDeleteModal = (spotId: string) => {
    setSelectedSpotId(spotId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpotId(null);
  };

  const confirmDelete = () => {
    if (selectedSpotId) {
      onDelete(selectedSpotId);
      closeModal();
    }
  };

  // Filter spots based on searchTerm
  const filteredSpots = useMemo(
    () =>
      touristSpots.filter((spot) =>
        spot.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [touristSpots, searchTerm]
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Tourist Spot List</p>
          <h1 className="text-xl font-semibold text-orange-500">
            Tourist Spot List
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
                setCurrentPage(1); // reset to first page on search
              }}
            />
          </div>

          <Button
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            + Add Tourist Spot
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Location</th>
                <th className="px-6 py-3 text-left font-medium">Phone</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot, index) => (
                  <tr
                    key={spot.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-3 border-t">{spot.id}</td>
                    <td className="px-6 py-3 border-t">{spot.name}</td>
                    <td className="px-6 py-3 border-t">{spot.address}</td>
                    <td className="px-6 py-3 border-t">{spot.phone}</td>
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
                            onClick={() => onEdit(spot)}
                            className="cursor-pointer"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewDetails(spot)}
                            className="cursor-pointer"
                          >
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(spot.id)}
                            className="cursor-pointer text-red-500 focus:text-red-600"
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {currentPage} of {totalPages} tourist spots
          </div>
          <div className="flex items-center gap-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
            <div className="flex justify-center gap-2">
              <Button
                variant="ghost"
                onClick={closeModal}
                className="text-[#FF6203] px-7"
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
