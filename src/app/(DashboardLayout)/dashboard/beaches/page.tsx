/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BeachData,
  useCreateBeachMutation,
  useDeleteSingleBeachMutation,
  useGetAllBeachesQuery,
  useUpdateSingleBeachMutation,
} from "@/redux/features/beache/beachApi";
import { BeachList } from "@/components/Beaches/Beaches-List";
import { BeachForm } from "@/components/Beaches/Beaches-Form";
import { BeachModal } from "@/components/Beaches/Beach-Modal";
import Loader from "@/lib/Loader";

export default function BeachesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedBeach, setSelectedBeach] = useState<BeachData | null>(null);

  const { data: allBeaches, isLoading } = useGetAllBeachesQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  const [createBeach, { isLoading: isCreating }] = useCreateBeachMutation();
  const [updateSingleBeach, { isLoading: isUpdating }] =
    useUpdateSingleBeachMutation();
  const [deleteBeach] = useDeleteSingleBeachMutation();

  const beaches: BeachData[] =
    allBeaches?.data?.data.map((f: any) => ({
      id: f.id,
      beacheName: f.beacheName,
      category: f.category,
      address: f.address,
      averageRating: f.averageRating,
      phone: f.phone,
      facilities: f.facilities || [],
      images: f.images,
      lat: f.lat,
      lng: f.lng,
    })) || [];

  const buildBeachFormData = (
    data: Omit<BeachData, "id"> & { id?: string }
  ) => {
    const formData = new FormData();
    formData.append("beacheName", data.beacheName);
    formData.append("address", data.address);
    // formData.append("category", data.category || "");
    formData.append("averageRating", data.averageRating.toString());
    // formData.append("phone", data.phone || "");
    // (data.facilities || []).forEach((f, i) =>
    //   formData.append(`facilities[${i}]`, f)
    // );
    formData.append("lat", data.lat.toString());
    formData.append("lng", data.lng.toString());

    if (data.images instanceof File) formData.append("images", data.images);
    else if (typeof data.images === "string" && data.images)
      formData.append("images", data.images);

    return formData;
  };

  const handleFormSubmit = async (
    beach: Omit<BeachData, "id"> & { id?: string }
  ) => {
    const formData = buildBeachFormData(beach);

    try {
      if (beach.id) {
        // Update
        console.log("update");
        await updateSingleBeach({ id: beach.id, body: formData }).unwrap();
        toast.success("Beach updated successfully ✅");
      } else {
        // Create
        await createBeach(formData).unwrap();
        toast.success("Beach created successfully ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save beach ❌");
    }

    setCurrentView("list");
    setSelectedBeach(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBeach(id).unwrap();
      toast.success("Beach deleted successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Beach ❌");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <BeachList
          beaches={beaches}
          onAddNew={() => {
            setCurrentView("add");
            setSelectedBeach(null);
          }}
          onEdit={(b) => {
            setSelectedBeach(b);
            setCurrentView("edit");
          }}
          onDelete={handleDelete}
          onViewDetails={(b) => {
            setSelectedBeach(b);
            setCurrentView("details");
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={allBeaches?.data?.meta?.totalPages || 1}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {(currentView === "add" || (currentView === "edit" && selectedBeach)) && (
        <BeachForm
          beach={currentView === "edit" ? selectedBeach : undefined}
          onSubmit={handleFormSubmit}
          isCreating={isCreating}
          isUpdating={isUpdating}
          onCancel={() => {
            setCurrentView("list");
            setSelectedBeach(null);
          }}
          isEdit={currentView === "edit"}
        />
      )}

      {currentView === "details" && selectedBeach && (
        <BeachModal
          beach={selectedBeach}
          onClose={() => {
            setCurrentView("list");
            setSelectedBeach(null);
          }}
        />
      )}
    </div>
  );
}
