/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  BarData,
  useCreateBarMutation,
  useDeleteSingleBarMutation,
  useGetAllBarsQuery,
  useUpdateSingleBarMutation,
} from "@/redux/features/bar/barApi";
import { BarList } from "@/components/Bars/Bars-List";
import { BarForm } from "@/components/Bars/Bars-Form";
import { BarModal } from "@/components/Bars/Bars-Modal";
import Loader from "@/lib/Loader";

export default function BarsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedBar, setSelectedBar] = useState<BarData | null>(null);

  const itemsPerPage = 10;
  const { data: allBars, isLoading } = useGetAllBarsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const [createBar, { isLoading: isCreating }] = useCreateBarMutation();
  const [updateSingleBar, { isLoading: isUpdating }] =
    useUpdateSingleBarMutation();
  const [deleteBar] = useDeleteSingleBarMutation();

  const bars: BarData[] =
    allBars?.data?.data.map((f: any) => ({
      id: f.id,
      barName: f.barName,
      category: f.category,
      address: f.address,
      averageRating: f.averageRating,
      phone: f.phone,
      facilities: f.facilities || [],
      images: f.images,
      lat: f.lat,
      lng: f.lng,
    })) || [];

  const buildBarFormData = (data: Omit<BarData, "id"> & { id?: string }) => {
    const formData = new FormData();
    formData.append("barName", data.barName);
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
    bar: Omit<BarData, "id"> & { id?: string }
  ) => {
    const formData = buildBarFormData(bar);

    try {
      if (bar.id) {
        // Update
        console.log("update");
        await updateSingleBar({ id: bar.id, body: formData }).unwrap();
        toast.success("Bar updated successfully ✅");
      } else {
        // Create
        await createBar(formData).unwrap();
        toast.success("Bar created successfully ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save bar ❌");
    }

    setCurrentView("list");
    setSelectedBar(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBar(id).unwrap();
      toast.success("Bar deleted successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Bar ❌");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <BarList
          bars={bars}
          onAddNew={() => {
            setCurrentView("add");
            setSelectedBar(null);
          }}
          onEdit={(b) => {
            setSelectedBar(b);
            setCurrentView("edit");
          }}
          onDelete={handleDelete}
          onViewDetails={(b) => {
            setSelectedBar(b);
            setCurrentView("details");
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={allBars?.data?.meta?.totalPages || 1}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {(currentView === "add" || (currentView === "edit" && selectedBar)) && (
        <BarForm
          bar={currentView === "edit" ? selectedBar : undefined}
          onSubmit={handleFormSubmit}
          isCreating={isCreating}
          isUpdating={isUpdating}
          onCancel={() => {
            setCurrentView("list");
            setSelectedBar(null);
          }}
          isEdit={currentView === "edit"}
        />
      )}

      {currentView === "details" && selectedBar && (
        <BarModal
          bar={selectedBar}
          onClose={() => {
            setCurrentView("list");
            setSelectedBar(null);
          }}
        />
      )}
    </div>
  );
}
