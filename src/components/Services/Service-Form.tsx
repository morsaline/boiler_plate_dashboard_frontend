/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetServiceCategoriesQuery, useAddServiceMutation, Service } from "@/redux/features/serrviceList/ServiceListApi"; // ✅ Fixed: useAddServiceMutation
import { toast } from "sonner";

interface ServiceFormProps {
  onSubmit: () => void;
  onCancel: () => void;
    service?: Service; // Add the service property here 
     isEdit?: boolean; // Add the isEdit property with a nullable type

}

export function ServiceForm({ onSubmit: onSuccess, onCancel }: ServiceFormProps) {
  const { data: categories, isLoading: loadingCategories } = useGetServiceCategoriesQuery();
  const [addService] = useAddServiceMutation(); // ✅ Fixed: useAddServiceMutation

  const facilityRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [facilityInputs, setFacilityInputs] = useState([""]);

  // Add new facility input
  const addFacility = () => {
    setFacilityInputs((prev) => [...prev, ""]);
  };

  // Remove facility input
  const removeFacility = (index: number) => {
    if (facilityInputs.length > 1) {
      setFacilityInputs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle change in facilities
  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...facilityInputs];
    newFacilities[index] = value;
    setFacilityInputs(newFacilities);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // === Gather all data ===

    // Get text fields
    const serviceName = formData.get("serviceName") as string;
    const category = formData.get("category") as string;
    const address = formData.get("address") as string;
    const lat = parseFloat(formData.get("lat") as string) || 0;
    const lng = parseFloat(formData.get("lng") as string) || 0;
    const phone = formData.get("phone") as string;

    // Filter out empty facilities
    const filteredFacilities = facilityInputs
      .map((f) => f.trim())
      .filter(Boolean);

    // Create service data object
    const serviceData = {
      serviceName,
      category,
      address,
      lat,
      lng,
      phone,
      facilities: filteredFacilities,
    };

    // Create final FormData for API
    const payload = new FormData();

    // Append JSON string under "data"
    payload.append("data", JSON.stringify(serviceData));

    // Append images
    const imageFiles = imageInputRef.current?.files;
    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        if (file.type.startsWith("image/")) {
          payload.append("images", file);
        }
      });
    }

    // Append video
    const videoFile = videoInputRef.current?.files?.[0];
    if (videoFile && videoFile.type.startsWith("video/")) {
      payload.append("video", videoFile);
    }

    // === Submit to API ===
    try {
      await addService(payload).unwrap(); // ✅ Now works!
      toast.success("Service created successfully!");
      onSuccess(); // Notify parent to refresh list or close modal
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(error.data?.message || "Failed to create service.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Add New Service</p>
          <h1 className="text-xl font-semibold text-orange-500">Add Service</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name<span className="text-red-500">*</span>
              </label>
              <Input
                name="serviceName"
                placeholder="Enter service name"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category<span className="text-red-500">*</span>
              </label>
              {loadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                <Select name="category" required>
                  <SelectTrigger className="w-full" disabled={!categories?.data?.length}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.data.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Address and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address<span className="text-red-500">*</span>
              </label>
              <Input
                name="address"
                placeholder="Enter address"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone<span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                placeholder="Enter phone number"
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Coordinates (Optional) */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <Input
                name="lat"
                type="number"
                step="any"
                placeholder="e.g. 23.8103"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <Input
                name="lng"
                type="number"
                step="any"
                placeholder="e.g. 90.4125"
                className="w-full"
              />
            </div>
          </div> */}

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities
            </label>
            <div ref={facilityRef} className="space-y-3">
              {facilityInputs.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Add facility"
                    value={value}
                    onChange={(e) => handleFacilityChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {facilityInputs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFacility(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addFacility}
              className="mt-2 text-orange-500 border-orange-500 hover:bg-orange-50 flex items-center gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" /> Add Facility
            </Button>
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={imageInputRef}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                <Upload className="h-4 w-4 mr-2" /> Choose Images
              </Button>
              {imageInputRef.current?.files?.length ? (
                <p className="mt-2 text-sm text-gray-600">
                  {imageInputRef.current.files.length} image(s) selected
                </p>
              ) : null}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Video (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={videoInputRef}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                <Upload className="h-4 w-4 mr-2" /> Choose Video
              </Button>
              {videoInputRef.current?.files?.[0] && (
                <p className="mt-2 text-sm text-green-600">
                  {videoInputRef.current.files[0].name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Create Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}