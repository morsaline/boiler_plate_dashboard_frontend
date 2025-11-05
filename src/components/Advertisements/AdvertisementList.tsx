"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Advertisement {
  id?: string;
  advertisementName: string;
  companyName: string;
  website: string;
  advertisementPictures: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface AdvertisementListProps {
  advertisements: Advertisement[];
  onAddNew: () => void;
  onEdit: (advertisement: Advertisement) => void;
  onDelete: (id: string) => void;
}

export function AdvertisementList({
  advertisements,
  onAddNew,
  onEdit,
  onDelete,
}: AdvertisementListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  const itemsPerPage = 8;

  const filteredAds = useMemo(() => {
    return advertisements.filter(
      (ad) =>
        ad.advertisementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, advertisements]);

  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAds = filteredAds.slice(startIndex, endIndex);

  const openDeleteModal = (id: string) => {
    setSelectedAdId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const confirmDelete = () => {
    if (selectedAdId) {
      onDelete(selectedAdId);
      closeModal();
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Advertisement</p>
          <h1 className="text-xl font-semibold text-orange-500">
            Advertisement List
          </h1>
        </div>

        {/* Search + Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search advertisements..."
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
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            + Add Advertisement
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 hover:bg-gray-900">
                <TableHead className="text-white font-medium">Image</TableHead>
                <TableHead className="text-white font-medium">Name</TableHead>
                <TableHead className="text-white font-medium">
                  Company
                </TableHead>
                <TableHead className="text-white font-medium">
                  Website
                </TableHead>
                <TableHead className="text-white font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentAds.length > 0 ? (
                currentAds.map((ad, index) => (
                  <TableRow
                    key={ad.id ?? index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell>
                      {ad.advertisementPictures?.[0] ? (
                        <div className="relative w-10 h-10">
                          <Image
                            src={ad.advertisementPictures[0]}
                            alt={ad.advertisementName}
                            fill
                            sizes="40px"
                            className="object-cover rounded-full border"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {ad.advertisementName}
                    </TableCell>
                    <TableCell>{ad.companyName}</TableCell>
                    <TableCell>
                      <a
                        href={ad.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {ad.website}
                      </a>
                    </TableCell>

                    <TableCell>
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
                            onClick={() => onEdit(ad)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(ad.id!)}
                            className="cursor-pointer text-red-500 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-gray-500"
                  >
                    No advertisements found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAds.length)}{" "}
            of {filteredAds.length} advertisements
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-2">
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
            </div>

            <div className="sm:hidden text-sm text-gray-600 px-2">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg text-center font-semibold mb-4">
              Do you want to remove?
            </h2>
            <div className="flex justify-around">
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
