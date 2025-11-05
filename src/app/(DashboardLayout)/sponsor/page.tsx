/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SponsorForm } from "@/components/Sponsors/SponsorForm";
import SponsorList from "@/components/Sponsors/SponsorList";
import SponsorModal from "@/components/Sponsors/SponsorModal";
import TableSkeleton from "@/lib/Loader";
import {
  Sponsor,
  useDeleteSingleSponsorMutation,
  useGetAllSponsorsQuery,
} from "@/redux/features/sponsor/sponsorApi";

import { useState } from "react";
import { toast } from "sonner";

export default function SponsorsPage() {
  const { data, isLoading, refetch } = useGetAllSponsorsQuery({
    page: 1,
    limit: 10,
    sortBy: "sponsorName",
    sortOrder: "asc",
  });

  const [deleteSponsor] = useDeleteSingleSponsorMutation();

  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  // ✅ Transform API data into format expected by components
  const sponsors: Sponsor[] =
    data?.data?.data.map((item: any) => ({
      ...item,
      images: Array.isArray(item.images)
        ? item.images.map((url: any) =>
            typeof url === "string" ? url.trim() : ""
          )
        : [],
    })) || [];

  // ✅ Handle Add New Sponsor
  const handleAddNew = () => {
    setCurrentView("add");
    setSelectedSponsor(null);
  };

  // ✅ Handle Edit
  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setCurrentView("edit");
  };

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSponsor(id).unwrap();
      if (response?.success ?? response?.status) {
        toast.success(response.message || "Sponsor deleted successfully.");
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete sponsor.");
      }
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
      toast.error("Failed to delete sponsor. Please try again.");
    }
  };

  // ✅ View Details
  const handleViewDetails = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setCurrentView("details");
  };

  // ✅ Submit Form — called after form successfully saves
  const handleFormSubmit = (payload: any) => {
    toast.success("Sponsor saved successfully!", payload);
    refetch();
    setCurrentView("list");
    setSelectedSponsor(null);
  };

  // ✅ Cancel / Close Modal
  const handleCancel = () => {
    setCurrentView("list");
    setSelectedSponsor(null);
  };

  const handleCloseModal = () => {
    setCurrentView("list");
    setSelectedSponsor(null);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <SponsorList
          sponsors={sponsors}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {currentView === "add" && (
        <SponsorForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
      )}

      {currentView === "edit" && selectedSponsor && (
        <SponsorForm
          sponsor={selectedSponsor}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isEdit={true}
        />
      )}

      {currentView === "details" && selectedSponsor && (
        <SponsorModal sponsor={selectedSponsor} onClose={handleCloseModal} />
      )}
    </div>
  );
}
