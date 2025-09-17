"use client";

import { HotelForm } from "@/components/Hotel/Hotel-From";
import { HotelList } from "@/components/Hotel/Hotel-List";
import { HotelModal } from "@/components/Hotel/Hotel-modal";
import {
  HotelData,
  RoomData,
  useDeleteSingleHotelMutation,
  useGetAllHotelsQuery,
} from "@/redux/features/hotel/hotelApi";
import Loader from "@/lib/Loader";
import { useState } from "react";

export interface Hotel {
  id: string;
  name: string;
  address: string;
  whatsapp: string;
  instagram: string;
  phone: string;
  hotelImage?: string;
  description: string;
  productImage: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  beds: string | number;
  washroom: string | number;
  parking: boolean;
  gym: boolean;
  roomPictures?: string;
  swimming: boolean;
  wifi: boolean;
  breakfast: boolean;
  ac: boolean;
  price: number;
  picture: string[];
}

export default function HotelManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteHotel] = useDeleteSingleHotelMutation();

  const itemsPerPage = 10;

  const { data: allHotels, isLoading } = useGetAllHotelsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">(
    "list"
  );
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // Transform API data to local Hotel structure
  const hotels: Hotel[] =
    allHotels?.data?.data.map((hotel: HotelData) => ({
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      whatsapp: hotel.whatsapp,
      instagram: hotel.instagram,
      phone: hotel.phone,
      description: hotel.description,
      productImage: hotel.hotelImage,
      rooms: hotel.rooms.map((room: RoomData) => ({
        id: room.id,
        name: room.roomName,
        beds: room.beds,
        washroom: room.washrooms,
        parking: room.pariking,
        gym: room.gym,
        swimming: room.swimmingPool,
        wifi: room.wifi,
        breakfast: room.breakfast,
        ac: room.ac,
        price: room.price,
        picture: room.roomPictures,
      })),
    })) || [];

  console.log("all hotels", allHotels?.data);

  const handleSubmit = (hotel: Hotel | Omit<Hotel, "id">) => {
    // Add/edit local state if needed (optimistic update)
    setCurrentView("list");
  };

  const handleDeleteHotel = async (id: string) => {
    try {
      await deleteHotel(id).unwrap(); // unwrap to handle errors
      console.log("Hotel deleted successfully");
    } catch (err) {
      console.error("Failed to delete hotel", err);
    }
  };
  const handleViewDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  const handleEditClick = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setCurrentView("edit");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto">
        {currentView === "list" && (
          <HotelList
            hotels={hotels}
            onAddNew={() => setCurrentView("add")}
            onEdit={handleEditClick}
            onDelete={handleDeleteHotel}
            onViewDetails={handleViewDetails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={allHotels?.data?.meta?.totalPages || 1}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {currentView === "add" && (
          <HotelForm
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
          />
        )}

        {currentView === "edit" && editingHotel && (
          <HotelForm
            hotel={editingHotel}
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
            isEditing
          />
        )}
      </div>

      {selectedHotel && (
        <HotelModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  );
}
