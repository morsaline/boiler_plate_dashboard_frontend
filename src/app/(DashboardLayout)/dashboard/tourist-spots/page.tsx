/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { TouristSpotList } from "@/components/TouristSpot/TouristSpot-List";
import { TouristSpotForm } from "@/components/TouristSpot/TouristSpot-Form";
import { TouristSpotModal } from "@/components/TouristSpot/TouristSpot-Modal";
import {
  useDeleteTouristMutation,
  useGetAllTouristSportsQuery,
} from "@/redux/features/touristSports/touristSportsApi";
import Loader from "@/lib/Loader";

export interface TouristSpot {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];
  culture: string[];
  youtubeLink: string; // single string
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

  const { data, isLoading, isError } = useGetAllTouristSportsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTourist] = useDeleteTouristMutation();

  // Map API response to TouristSpot type
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
        youtubeLink: spot.youtubeLink || [],
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
    setSelectedSpot(null);
    setViewMode("add");
  };

  const handleEdit = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setViewMode("edit");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTourist(id).unwrap(); // call API
      // remove from local state after successful deletion
      setTouristSpots((prev) => prev.filter((spot) => spot.id !== id));
      toast.success("Delete successfully .");
    } catch (error) {
      console.error("Failed to delete tourist spot:", error);
      toast.error("Failed to delete tourist spot. Please try again.");
    }
  };

  const handleViewDetails = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleSubmit = (spotData: TouristSpot) => {
    if (viewMode === "add") {
      const newSpot = { ...spotData, id: Date.now().toString() };
      setTouristSpots((prev) => [...prev, newSpot]);
    } else if (viewMode === "edit" && selectedSpot) {
      setTouristSpots((prev) =>
        prev.map((spot) => (spot.id === selectedSpot.id ? spotData : spot))
      );
    }
    setViewMode("list");
    setSelectedSpot(null);
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

  if (viewMode === "add" || viewMode === "edit") {
    return (
      <TouristSpotForm
        touristSpot={selectedSpot || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={viewMode === "edit"}
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
