/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FashionData,
  useCreateFashionMutation,
  useDeleteSingleFashionMutation,
  useGetAllFashionsQuery,
  useUpdateSingleFashionMutation,
} from "@/redux/features/fashion/fashionApi";
import { FashionForm } from "@/components/Fashions/Fashion-Form";
import { FashionList } from "@/components/Fashions/Fashion-List";
import { FashionModal } from "@/components/Fashions/Fashion-Modal";

export default function FashionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedFashion, setSelectedFashion] = useState<FashionData | null>(
    null
  );

  const itemsPerPage = 10;

  const { data: allFashions } = useGetAllFashionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const [createFashion] = useCreateFashionMutation();
  const [updateSingleFashion] = useUpdateSingleFashionMutation();
  const [deleteFashion] = useDeleteSingleFashionMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fashions: FashionData[] =
    allFashions?.data?.data.map((f: any) => ({
      id: f.id,
      fashionName: f.fashionName,
      category: f.category,
      address: f.address,
      averageRating: f.averageRating,
      phone: f.phone,
      facilities: f.facilities || [],
      images: f.images,
      lat: f.lat,
      lng: f.lng,
    })) || [];

  const buildFashionFormData = (
    data: Omit<FashionData, "id"> & { id?: string }
  ) => {
    const formData = new FormData();
    formData.append("fashionName", data.fashionName);
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
    fashion: Omit<FashionData, "id"> & { id?: string }
  ) => {
    const formData = buildFashionFormData(fashion);

    try {
      if (fashion.id) {
        // Update
        console.log("update");
        await updateSingleFashion({ id: fashion.id, body: formData }).unwrap();
        toast.success("Fashion updated successfully ✅");
      } else {
        // Create
        await createFashion(formData).unwrap();
        toast.success("Fashion created successfully ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save fashion ❌");
    }

    setCurrentView("list");
    setSelectedFashion(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFashion(id).unwrap();
      toast.success("Fashion deleted successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete fashion ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <FashionList
          Fashions={fashions}
          onAddNew={() => {
            setCurrentView("add");
            setSelectedFashion(null);
          }}
          onEdit={(f) => {
            setSelectedFashion(f);
            setCurrentView("edit");
          }}
          onDelete={handleDelete}
          onViewDetails={(f) => {
            setSelectedFashion(f);
            setCurrentView("details");
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={allFashions?.data?.meta?.totalPages || 1}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {(currentView === "add" ||
        (currentView === "edit" && selectedFashion)) && (
        <FashionForm
          fashion={currentView === "edit" ? selectedFashion : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setCurrentView("list");
            setSelectedFashion(null);
          }}
          isEdit={currentView === "edit"}
        />
      )}

      {currentView === "details" && selectedFashion && (
        <FashionModal
          fashion={selectedFashion}
          onClose={() => {
            setCurrentView("list");
            setSelectedFashion(null);
          }}
        />
      )}
    </div>
  );
}
