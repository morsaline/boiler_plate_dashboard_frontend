/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AdvertisementForm } from "@/components/Advertisements/AdvertisementForm";
import { AdvertisementList } from "@/components/Advertisements/AdvertisementList";
import AdvertisementModal from "@/components/Advertisements/AdvertisementModal";
// import { Spinner } from "@/components/ui/shadcn-io/spinner";

import TableSkeleton from "@/lib/Loader";
import {
  Advertisement,
  useDeleteAdvertisementMutation,
  useGetAllAdvertisementsQuery,
} from "@/redux/features/advertisement/advertisementApi";

import { useState } from "react";
import { toast } from "sonner";

export default function AdvertisementsPage() {
  const { data, isLoading, refetch } = useGetAllAdvertisementsQuery({
    page: 1,
    limit: 10,
    sortBy: "advertisementName",
    sortOrder: "asc",
  });

  const [deleteAdvertisement] = useDeleteAdvertisementMutation();

  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedAdvertisement, setSelectedAdvertisement] =
    useState<Advertisement | null>(null);

  // ✅ Transform API data into format expected by components
  const advertisements: Advertisement[] =
    data?.data?.data.map((item: any) => ({
      ...item,
      images: Array.isArray(item.images)
        ? item.images.map((url: any) =>
            typeof url === "string" ? url.trim() : ""
          )
        : [],
    })) || [];

  // ✅ Handle Add New Advertisement
  const handleAddNew = () => {
    setCurrentView("add");
    setSelectedAdvertisement(null);
  };

  // ✅ Handle Edit
  const handleEdit = (ad: Advertisement) => {
    setSelectedAdvertisement(ad);
    setCurrentView("edit");
  };

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAdvertisement(id).unwrap();
      // adapt to your API response shape: response.success | response.status
      if (response?.success ?? response?.status) {
        toast.success(
          response.message || "Advertisement deleted successfully."
        );
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete advertisement.");
      }
    } catch (error) {
      console.error("Failed to delete advertisement:", error);
      toast.error("Failed to delete advertisement. Please try again.");
    }
  };

  // ✅ View Details
  const handleViewDetails = (ad: Advertisement) => {
    setSelectedAdvertisement(ad);
    setCurrentView("details");
  };

  // ✅ Submit Form — called after form successfully saves
  const handleFormSubmit = (payload: any) => {
    toast.success("Advertisement saved successfully!", payload);
    refetch(); // Refresh list after create/edit
    setCurrentView("list");
    setSelectedAdvertisement(null);
  };

  // ✅ Cancel / Close Modal
  const handleCancel = () => {
    setCurrentView("list");
    setSelectedAdvertisement(null);
  };

  const handleCloseModal = () => {
    setCurrentView("list");
    setSelectedAdvertisement(null);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <AdvertisementList
          advertisements={advertisements}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {currentView === "add" && (
        <AdvertisementForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {currentView === "edit" && selectedAdvertisement && (
        <AdvertisementForm
          advertisement={selectedAdvertisement}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isEdit={true}
        />
      )}

      {/* {currentView === "details" && selectedAdvertisement && (
        <AdvertisementModal
          advertisement={selectedAdvertisement}
          onClose={handleCloseModal}
        />
      )} */}
    </div>
  );
}
