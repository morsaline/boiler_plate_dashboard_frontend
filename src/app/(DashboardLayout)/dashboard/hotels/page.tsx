"use client";

import { HotelForm } from "@/components/Hotel/Hotel-From";
import { HotelList } from "@/components/Hotel/Hotel-List";
import { HotelModal } from "@/components/Hotel/Hotel-modal";
import {
  HotelData,
  RoomData,
  useCreateHotelMutation,
  useDeleteSingleHotelMutation,
  useGetAllHotelsQuery,
  useUpdateSingleHotelMutation,
} from "@/redux/features/hotel/hotelApi";
// import { Loader } from "lucide-react";
import { useState } from "react";

import Loader from "@/lib/Loader";
import { toast } from "sonner";

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

  const hotels: HotelData[] =
    allHotels?.data?.data.map((hotel: HotelData) => ({
      id: hotel.id,
      name: hotel.name,
      hotelId: hotel.hotelId, // optional but included
      address: hotel.address,
      lat: hotel.lat,
      lng: hotel.lng,
      whatsapp: hotel.whatsapp,
      instagram: hotel.instagram,
      phone: hotel.phone,
      type: hotel.type,
      averageRating: hotel.averageRating,
      description: hotel.description,
      hotelImage: hotel.hotelImage, // ✅ must stay `hotelImage`
      rooms: hotel.rooms.map((room: RoomData) => ({
        id: room.id,
        roomName: room.roomName, // ✅ must stay `roomName`
        beds: room.beds,
        washrooms: room.washrooms,
        parking: room.parking,
        gym: room.gym,
        swimmingPool: room.swimmingPool,
        wifi: room.wifi,
        ac: room.ac,
        breakfast: room.breakfast,
        price: room.price,
        roomPictures: room.roomPictures, // ✅ must stay `roomPictures`
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        hotelId: room.hotelId,
      })),
    })) || [];

  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateSingleHotel, { isLoading: isUpdating }] =
    useUpdateSingleHotelMutation();

  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">(
    "list"
  );
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [editingHotel, setEditingHotel] = useState<HotelData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (hotel: HotelData | Omit<HotelData, "id">) => {
    if ("id" in hotel) {
      // Edit
      console.log(hotel, "update");
      if (!hotel.id) {
        throw new Error("Hotel ID is required");
      }
      // setHotels(hotels.map((h) => (h.id === hotel.id ? hotel : h)));
      const res = await updateSingleHotel({
        id: hotel?.id,
        body: hotel,
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "update hotel succesfully");
        setEditingHotel(null);
      } else {
        toast.error(res?.message);
      }

      // hotelRefecth();
    } else {
      console.log(hotel, "add hotels");
      // Add
      const newHotel: Omit<HotelData, "id"> = {
        ...hotel,
        hotelId: `H${String(Date.now()).slice(-3).padStart(3, "0")}`,
      };
      try {
        const res = await createHotel(newHotel).unwrap();

        if (res?.success) {
          toast.success(res?.message || "add hotel succesfully");
          console.log("hotelResponse ", res);
        } else {
          toast.error(res?.message);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (error: any) {}
      console.log(newHotel, "hotel Data");
      // setHotels([...hotels, newHotel]);
    }
    setCurrentView("list");
  };

  const handleDeleteHotel = async (id: string) => {
    try {
      const res = await deleteHotel(id).unwrap(); // unwrap to handle errors

      if (res.success) {
        toast.success(res?.message || "Hotel deleted successfully");
      } else {
        toast.error(res.message);
      }

      console.log("Hotel deleted successfully");
    } catch (err) {
      console.error("Failed to delete hotel", err);
    }
  };

  const handleViewDetails = (hotel: HotelData) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleEditClick = (hotel: HotelData) => {
    setEditingHotel(hotel);
    setCurrentView("edit");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto">
        {/* Hotel List */}
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

        {/* Add Hotel */}
        {currentView === "add" && (
          <HotelForm
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
            isCreating={isCreating}
            isUpdating={isUpdating}
          />
        )}

        {/* Edit Hotel */}
        {currentView === "edit" && editingHotel && (
          <HotelForm
            hotel={editingHotel}
            isCreating={isCreating}
            isUpdating={isUpdating}
            onSubmit={handleSubmit}
            onCancel={() => setCurrentView("list")}
            isEditing
          />
        )}
      </div>

      {/* View Hotel Modal */}
      {showModal && selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
