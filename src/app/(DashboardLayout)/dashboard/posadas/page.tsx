/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  PosadasData,
  RoomData,
  useCreatePosadasMutation,
  useDeleteSinglePosadasMutation,
  useGetAllPosadasQuery,
  useUpdateSinglePosadasMutation,
} from "@/redux/features/posadas/posadasApi";
import { useState } from "react";
import Loader from "@/lib/Loader";
import { toast } from "sonner";

import PosadasForm from "@/components/Posadas/Posadas-Form";
import { PosadasList } from "@/components/Posadas/Posadas-List";
import { PosadasModal } from "@/components/Posadas/Posadas-Modal";
export default function PosadasManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePosadas] = useDeleteSinglePosadasMutation();

  const itemsPerPage = 10;

  const { data: allPosadas, isLoading } = useGetAllPosadasQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const posadas: PosadasData[] =
    allPosadas?.data?.data.map((posada: PosadasData) => ({
      id: posada.id,
      name: posada.name,
      posadaId: posada.posadaId,
      address: posada.address,
      lat: posada.lat,
      lng: posada.lng,
      whatsapp: posada.whatsapp,
      instagram: posada.instagram,
      phone: posada.phone,
      type: posada.type,
      averageRating: posada.averageRating,
      description: posada.description,
      posadaImage: posada.posadaImage,
      rooms: posada.rooms.map((room: RoomData) => ({
        id: room.id,
        roomName: room.roomName,
        beds: room.beds,
        washrooms: room.washrooms,
        parking: room.parking,
        gym: room.gym,
        swimmingPool: room.swimmingPool,
        wifi: room.wifi,
        ac: room.ac,
        breakfast: room.breakfast,
        price: room.price,
        roomPictures: room.roomPictures,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        posadasId: room.posadasId,
      })),
    })) || [];

  const [createPosadas, { isLoading: isCreating }] = useCreatePosadasMutation();
  const [updateSinglePosadas, { isLoading: isUpdating }] =
    useUpdateSinglePosadasMutation();

  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">(
    "list"
  );
  const [selectedPosada, setSelectedPosada] = useState<PosadasData | null>(
    null
  );
  const [editingPosada, setEditingPosada] = useState<PosadasData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (
    posada: PosadasData | Omit<PosadasData, "id">
  ) => {
    if ("id" in posada) {
      // Edit
      if (!posada.id) {
        throw new Error("Posada ID is required");
      }

      const res = await updateSinglePosadas({
        id: posada?.id,
        body: posada,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Posada updated successfully");
        setEditingPosada(null);
      } else {
        toast.error(res?.message);
      }
    } else {
      // Add
      const newPosada: Omit<PosadasData, "id"> = {
        ...posada,
        posadaId: `P${String(Date.now()).slice(-3).padStart(3, "0")}`,
      };
      try {
        const res = await createPosadas(newPosada).unwrap();

        if (res?.success) {
          toast.success(res?.message || "Posada added successfully");
        } else {
          toast.error(res?.message);
        }
      } catch (error: any) {
        toast.error("Failed to create posada");
      }
    }
    setCurrentView("list");
  };

  const handleDeletePosadas = async (id: string) => {
    try {
      const res = await deletePosadas(id).unwrap();

      if (res.success) {
        toast.success(res?.message || "Posada deleted successfully");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Failed to delete posada", err);
    }
  };

  const handleViewDetails = (posada: PosadasData) => {
    setSelectedPosada(posada);
    setShowModal(true);
  };

  const handleEditClick = (posada: PosadasData) => {
    setEditingPosada(posada);
    setCurrentView("edit");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto">
        {/* Posadas List */}
        {currentView === "list" && (
          <PosadasList
            posadas={posadas}
            onAddNew={() => setCurrentView("add")}
            onEdit={handleEditClick}
            onDelete={handleDeletePosadas}
            onViewDetails={handleViewDetails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={allPosadas?.data?.meta?.totalPages || 1}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {/* Add Posadas */}
        {currentView === "add" && (
          <PosadasForm
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
            isCreating={isCreating}
            isUpdating={isUpdating}
          />
        )}

        {/* Edit Posadas */}
        {currentView === "edit" && editingPosada && (
          <PosadasForm
            posadas={editingPosada}
            isCreating={isCreating}
            isUpdating={isUpdating}
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
            isEditing
          />
        )}
      </div>

      {/* View Posadas Modal */}
      {showModal && selectedPosada && (
        <PosadasModal
          posadas={selectedPosada}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
