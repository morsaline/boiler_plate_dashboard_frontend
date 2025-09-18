/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ServiceForm } from "@/components/Services/Service-Form";
import {  Service, ServiceList } from "@/components/Services/Service-List";
import { ServiceModal } from "@/components/Services/Service-Modal";
import { useDeleteServiceMutation, useGetAllServicesQuery } from "@/redux/features/serrviceList/ServiceListApi";

import { useState } from "react";
import { toast } from "sonner";

// 👇 Updated Service Type Matching API


export default function ServicesPage() {
  const { data, error, isLoading, refetch } = useGetAllServicesQuery({
    page: 1,
    limit: 10,
    sortBy: "serviceName",
    sortOrder: "asc",
  });
  const[deleteService] = useDeleteServiceMutation();

  const [currentView, setCurrentView] = useState<"list" | "add" | "edit" | "details">("list");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // ✅ Transform API data into format expected by components
  const services: Service[] =
    data?.data?.data.map((item) => ({
      ...item,
      images: item.images.map((url) => url.trim()), // trim whitespace
    })) || [];

  // For modal/form, you can now use `serviceName`, etc.

  const handleAddNew = () => {
    setCurrentView("add");
    setSelectedService(null);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setCurrentView("edit");
  };

  const handleDelete = async(id: string) => {

    try {
    const response =  await deleteService(id).unwrap(); // call API
      // remove from local state after successful deletion

if(response?.success){
  toast.success(response?.message || "Service deleted successfully.");
  refetch();
}else{
  toast.error(response?.message);
}
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service. Please try again.");
    }


  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setCurrentView("details");
  };

  const handleFormSubmit = (serviceData: Omit<Service, "id"> & { id?: string }) => {
    console.log("Submitted:", serviceData);
    setCurrentView("list");
    setSelectedService(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    setCurrentView("list");
    setSelectedService(null);
  };

  if (isLoading) return <div className="p-8 text-center">Loading services...</div>;
  if (error)
    return (
      <div className="p-8 text-red-600">
        Failed to load services. {(error as any)?.data?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "list" && (
        <ServiceList
          services={services}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {currentView === "add" && <ServiceForm onSubmit={handleFormSubmit} onCancel={handleCancel} />}

      {currentView === "edit" && selectedService && (
        <ServiceForm service={selectedService} onSubmit={handleFormSubmit} onCancel={handleCancel} isEdit={true} />
      )}

      {currentView === "details" && selectedService && (
        <ServiceModal service={selectedService} onClose={handleCloseModal} />
      )}
    </div>
  );
}