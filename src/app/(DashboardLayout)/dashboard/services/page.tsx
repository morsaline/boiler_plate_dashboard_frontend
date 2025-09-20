/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ServiceForm } from "@/components/Services/Service-Form";
import { Service, ServiceList } from "@/components/Services/Service-List";
import { ServiceModal } from "@/components/Services/Service-Modal";
// import { Spinner } from "@/components/ui/shadcn-io/spinner";
import TableSkeleton from "@/lib/Loader";
import {
  useDeleteServiceMutation,
  useGetAllServicesQuery,
} from "@/redux/features/serrviceList/ServiceListApi";

import { useState } from "react";
import { toast } from "sonner";

export default function ServicesPage() {
  const { data, error, isLoading, refetch } = useGetAllServicesQuery({
    page: 1,
    limit: 10,
    sortBy: "serviceName",
    sortOrder: "asc",
  });

  const [deleteService] = useDeleteServiceMutation();

  const [currentView, setCurrentView] = useState<
    "list" | "add" | "edit" | "details"
  >("list");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // ✅ Transform API data into format expected by components
  const services: Service[] =
    data?.data?.data.map((item) => ({
      ...item,
      images: item.images.map((url) => url.trim()), // trim whitespace
    })) || [];

  // ✅ Handle Add New Service
  const handleAddNew = () => {
    setCurrentView("add");
    setSelectedService(null);
  };

  // ✅ Handle Edit
  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setCurrentView("edit");
  };

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteService(id).unwrap();
      if (response.success) {
        toast.success(response.message || "Service deleted successfully.");
        refetch();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service. Please try again.");
    }
  };

  // ✅ View Details
  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setCurrentView("details");
  };

  // ✅ Submit Form — called after form successfully saves
  const handleFormSubmit = () => {
    toast.success("Service saved successfully!");
    refetch(); // Refresh list after create/edit
    setCurrentView("list");
    setSelectedService(null);
  };

  // ✅ Cancel / Close Modal
  const handleCancel = () => {
    setCurrentView("list");
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    setCurrentView("list");
    setSelectedService(null);
  };


if(isLoading){
return <TableSkeleton/>
}
 
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

      {currentView === "add" && (
        <ServiceForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
      )}

      {currentView === "edit" && selectedService && (
        <ServiceForm
          service={selectedService}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isEdit={true}
        />
      )}

      {currentView === "details" && selectedService && (
        <ServiceModal service={selectedService} onClose={handleCloseModal} />
      )}
    </div>
  );
}
