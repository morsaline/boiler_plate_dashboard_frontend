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
import { FashionData } from "@/redux/features/fashion/fashionApi";
import Pagination from "@/lib/Pagination";

// export interface Fashion {
//   id: string;
//   storeName: string;
//   review: 1 | 2 | 3 | 4 | 5 | number;
//   address: string;
//   image?: File | string | null;
// }

interface ServiceListProps {
  Fashions: FashionData[];
  onAddNew: () => void;
  onEdit: (fashion: FashionData) => void;
  onDelete: (id: string) => void;
  onViewDetails: (fashion: FashionData) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FashionList({
  Fashions,
  onAddNew,
  onEdit,
  onDelete,
  onViewDetails,
  currentPage,
  setCurrentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
}: ServiceListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFashionId, setSelectedFashionId] = useState<string | null>(
    null
  );

  const filteredFashions = useMemo(() => {
    return Fashions?.filter(
      (service) =>
        service.fashionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, Fashions]);

  const openDeleteModal = (fashionId: string) => {
    setSelectedFashionId(fashionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFashionId(null);
  };

  const confirmDelete = () => {
    if (selectedFashionId) {
      onDelete(selectedFashionId);
      closeModal();
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Fashions List</p>
          <h1 className="text-xl md:text-2xl font-semibold text-orange-500">
            Fashions List
          </h1>
        </div>

        {/* Search + Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-72">
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

          <Button
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            + Add Fashion
          </Button>
        </div>

        {/* Table Wrapper for mobile scroll */}
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                  Fashion ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                  Fashion Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(filteredFashions && filteredFashions.length > 0
                ? filteredFashions
                : Fashions
              )?.length > 0 ? (
                (filteredFashions && filteredFashions.length > 0
                  ? filteredFashions
                  : Fashions
                ).map((fashion, index) => (
                  <tr
                    key={fashion.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 sm:px-6 py-3 border-t">{index + 1}</td>
                    <td className="px-4 sm:px-6 py-3 border-t">
                      {fashion.fashionName}
                    </td>
                    <td className="px-4 sm:px-6 py-3 border-t">
                      {fashion.address}
                    </td>

                    <td className="px-4 sm:px-6 py-3 border-t">
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
                            onClick={() => onEdit(fashion)}
                            className="cursor-pointer"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewDetails(fashion)}
                            className="cursor-pointer"
                          >
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(fashion?.id || "")}
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
                    colSpan={4}
                    className="px-4 sm:px-6 py-6 border-t text-center text-gray-500"
                  >
                    No Fashions Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          {/* Left: info */}
          <div className="text-sm text-gray-500">
            Showing {filteredFashions.length > 0 ? 1 : 0} to{" "}
            {filteredFashions.length} of {Fashions.length} Fashions
          </div>

          {/* Right: page numbers */}
          {/* <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                size="sm"
                variant={currentPage === pageNum ? "default" : "ghost"}
                className={
                  currentPage === pageNum
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div> */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative shadow-2xl">
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
