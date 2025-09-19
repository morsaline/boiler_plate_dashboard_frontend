/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { TouristSpotList } from "@/components/TouristSpot/TouristSpot-List";
import { TouristSpotForm } from "@/components/TouristSpot/TouristSpot-Form";
import { TouristSpotModal } from "@/components/TouristSpot/TouristSpot-Modal";
import {
  useDeleteTouristMutation,
  useGetAllTouristSportsQuery,
  useAddTouristSportsMutation,
  useUpdateTouristSportsByIdMutation,
} from "@/redux/features/touristSports/touristSportsApi";
import Loader from "@/lib/Loader";
import { toast } from "sonner";

export interface TouristSpot {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];
  culture: string[];
  youtubeLink: string; // will be first link if array
  photos: string[];
  videos: string[];
  averageRating?: number;
  entryFee?: number;
  lat?: number;
  lng?: number;
}

type ViewMode = "list" | "add" | "edit" | "details";

export default function TouristSpotsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = useGetAllTouristSportsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTourist] = useDeleteTouristMutation();
  const [addTouristSpot] = useAddTouristSportsMutation();
  const [updateTouristSpot] = useUpdateTouristSportsByIdMutation();

  // Map API response
  useEffect(() => {
    if (data?.data) {
      const mappedSpots: TouristSpot[] = data.data.data.map((spot: any) => ({
        id: spot.id,
        name: spot.name,
        address: spot.address || "N/A",
        phone: spot.phone || "N/A",
        description: spot.description,
        facilities: spot.facilities || [],
        culture: spot.culture || [],
        youtubeLink: Array.isArray(spot.youtubeLink)
          ? spot.youtubeLink[0] || ""
          : spot.youtubeLink || "",
        photos: spot.images || [],
        videos: spot.videoLink ? [spot.videoLink] : [],
        averageRating: spot.averageRating,
        entryFee: spot.entryFee,
        lat: spot.lat,
        lng: spot.lng,
      }));
      setTouristSpots(mappedSpots);
    }
  }, [data]);

  const handleAddNew = () => {
    setViewMode("add");
    setSelectedSpot(null);
  };

  const handleEdit = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setViewMode("edit");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTourist(id).unwrap();
      if (res.success) {
        toast.success(res.message || "Deleted successfully.");
        setTouristSpots((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(res.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete. Please try again.");
    }
  };

  const handleViewDetails = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedSpot(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpot(null);
  };

  if (isLoading) return <Loader />;

  // Render Add/Edit Form
  if (viewMode === "add") {
    return (
      <TouristSpotForm
        onCancel={handleCancel}
      />
    );
  }

  if (viewMode === "edit" && selectedSpot) {
    return (
      <TouristSpotForm
        touristSpot={selectedSpot}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <>
      <TouristSpotList
        touristSpots={touristSpots}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={data?.data?.meta?.totalPages || 1}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {selectedSpot && (
        <TouristSpotModal
          touristSpot={selectedSpot}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}