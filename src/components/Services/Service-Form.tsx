/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

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
import type { Service } from "./Service-List";


interface ServiceFormProps {
  service?: Service;
  onSubmit: (service: Omit<Service, "id"> & { id?: string }) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function ServiceForm({
  service,
  onSubmit,
  onCancel,
  isEdit = false,
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || "",
    address: service?.address || "",
    phone: service?.phone || "",
    facilities: service?.facilities || [""],
    image: service?.image || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData((prev) => ({ ...prev, facilities: newFacilities }));
  };

  const addFacility = () => {
    setFormData((prev) => ({ ...prev, facilities: [...prev.facilities, ""] }));
  };

  const removeFacility = (index: number) => {
    if (formData.facilities.length > 1) {
      const newFacilities = formData.facilities.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, facilities: newFacilities }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredFacilities = formData.facilities.filter(
      (facility) => facility.trim() !== ""
    );
    const serviceData = {
      ...formData,
      facilities: filteredFacilities,
      ...(isEdit && service ? { id: service.id } : {}),
    };
    onSubmit(serviceData);
  };

  const categories = [
    "Hospital",
    "Photography",
    "Transport",
    "Restaurant",
    "Hotel",
    "Tourism",
    "Entertainment",
    "Shopping",
    "Education",
    "Other",
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">
            {isEdit ? "Edit Service" : "Add Service"}
          </p>
          <h1 className="text-xl font-semibold text-orange-500">
            {isEdit ? "Edit Service" : "Add Service"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter service name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category<span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities
            </label>
            <div className="space-y-3">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Add description"
                    value={facility}
                    onChange={(e) =>
                      handleFacilityChange(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  {formData.facilities.length > 1 && (
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
              <Button
                type="button"
                variant="outline"
                onClick={addFacility}
                className="text-orange-500 border-orange-500 hover:bg-orange-50 flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            </div>
          </div>

          {/* Add Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Service"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-orange-500 border-orange-500 hover:bg-orange-50"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Drop file or browse</p>
                    <p className="text-sm text-gray-400">
                      Supports: JPG, JPEG2000, PNG
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-orange-500 border-orange-500 hover:bg-orange-50"
                  >
                    Upload File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              {isEdit ? "Done" : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
