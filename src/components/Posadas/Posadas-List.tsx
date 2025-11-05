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
import { PosadasData } from "@/redux/features/posadas/posadasApi";

interface PosadasListProps {
  posadas: PosadasData[];
  onAddNew: () => void;
  onEdit: (posada: PosadasData) => void;
  onDelete: (id: string) => void;
  onViewDetails: (posada: PosadasData) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function PosadasList({
  posadas,
  onAddNew,
  onEdit,
  onDelete,
  onViewDetails,
  currentPage,
  setCurrentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
}: PosadasListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosadasId, setSelectedPosadasId] = useState<string | null>(null);

  const openDeleteModal = (posadasId: string) => {
    setSelectedPosadasId(posadasId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPosadasId(null);
  };

  const confirmDelete = () => {
    if (selectedPosadasId) {
      onDelete(selectedPosadasId);
      closeModal();
    }
  };

  // Filter posadas based on search term
  const filteredPosadas = useMemo(
    () =>
      posadas.filter((posada) =>
        posada.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [posadas, searchTerm]
  );

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Posadas List</p>
        <h1 className="text-xl font-semibold text-orange-500">Posadas List</h1>
      </div>

      {/* Search + Add */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posadas..."
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
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        >
          + Add Posadas
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Posadas ID</th>
              <th className="px-6 py-3 text-left font-medium">Posadas Name</th>
              <th className="px-6 py-3 text-left font-medium">Location</th>
              <th className="px-6 py-3 text-left font-medium">WhatsApp</th>
              <th className="px-6 py-3 text-left font-medium">Instagram</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosadas.length > 0 ? (
              filteredPosadas.map((posada, index) => (
                <tr
                  key={posada.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-3 border-t">{index + 1}</td>
                  <td className="px-6 py-3 border-t">{posada.name}</td>
                  <td className="px-6 py-3 border-t">{posada.address}</td>
                  <td className="px-6 py-3 border-t">{posada.whatsapp}</td>
                  <td className="px-6 py-3 border-t">{posada.instagram}</td>
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
                        <DropdownMenuItem onClick={() => onEdit(posada)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDetails(posada)}>
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(posada?.id || "")}
                          className="text-red-500 focus:text-red-600"
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
                  colSpan={6}
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
          Showing {filteredPosadas.length > 0 ? 1 : 0} to {filteredPosadas.length}{" "}
          of {posadas.length} posadas
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
