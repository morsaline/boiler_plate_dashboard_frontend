/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface Sponsor {
  id?: string;
  sponsorName: string;
  price: number;
  logo?: string;
  address?: string;
  websiteLink?: string;
  facilities?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SponsorFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  sponsor?: Sponsor;
  isEdit?: boolean;
}

export function SponsorForm({
  onSubmit,
  onCancel,
  sponsor,
  isEdit = false,
}: SponsorFormProps) {
  const logoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    sponsorName: sponsor?.sponsorName || "",
    price: sponsor?.price?.toString() || "",
    address: sponsor?.address || "",
    websiteLink: sponsor?.websiteLink || "",
  });

  const [facilities, setFacilities] = useState<string[]>(
    sponsor?.facilities?.length ? sponsor.facilities : [""]
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const updated = [...facilities];
    updated[index] = value;
    setFacilities(updated);
  };

  const addFacility = () => setFacilities((prev) => [...prev, ""]);
  const removeFacility = (index: number) =>
    setFacilities((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { sponsorName, price, address, websiteLink } = formData;
    if (!sponsorName || !price) {
      toast.error("Sponsor name and price are required.");
      return;
    }

    const filteredFacilities = facilities.map((f) => f.trim()).filter(Boolean);

    const data = {
      sponsorName,
      price: Number(price),
      address,
      websiteLink,
      facilities: filteredFacilities,
    };

    const payload = new FormData();
    payload.append("data", JSON.stringify(data));

    // Append logo
    const logoFile = logoRef.current?.files?.[0];
    if (logoFile && logoFile.type.startsWith("image/")) {
      payload.append("logo", logoFile);
    }

    // Append images
    const imageFiles = imageRef.current?.files;
    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        if (file.type.startsWith("image/")) {
          payload.append("images", file);
        }
      });
    }

    try {
      await onSubmit(payload);
      toast.success(
        isEdit ? "Sponsor updated successfully!" : "Sponsor added successfully!"
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to save sponsor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400 mb-1">
          {isEdit ? "Edit Sponsor" : "Add Sponsor"}
        </p>
        <h1 className="text-xl font-semibold text-orange-500">
          {isEdit ? "Edit Sponsor" : "Add Sponsor"}
        </h1>
      </div>

      {/* Sponsor Name & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Sponsor Name<span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter name"
            value={formData.sponsorName}
            onChange={(e) => handleInputChange("sponsorName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price<span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Add Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={logoRef}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => logoRef.current?.click()}
            className="bg-orange-50"
          >
            <Upload className="h-4 w-4 mr-2" /> Browse Files
          </Button>
          {logoRef.current?.files?.[0] && (
            <p className="mt-2 text-sm text-gray-600">
              {logoRef.current.files[0].name}
            </p>
          )}
        </div>
      </div>

      {/* Address & Website Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <Input
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Website Link</label>
          <Input
            placeholder="Enter website link"
            value={formData.websiteLink}
            onChange={(e) => handleInputChange("websiteLink", e.target.value)}
          />
        </div>
      </div>

      {/* Facilities */}
      <div>
        <label className="block text-sm font-medium mb-2">Facilities</label>
        <div className="space-y-3">
          {facilities.map((facility, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Add description"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
              />
              {facilities.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeFacility(index)}
                  className="text-red-500"
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
          className="mt-2 flex items-center gap-2 text-orange-500 border-orange-500"
        >
          <Plus className="h-4 w-4" /> Add More
        </Button>
      </div>

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Add Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={imageRef}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => imageRef.current?.click()}
            className="bg-orange-50"
          >
            <Upload className="h-4 w-4 mr-2" /> Browse Files
          </Button>
          {imageRef.current?.files?.length ? (
            <p className="mt-2 text-sm text-gray-600">
              {imageRef.current.files.length} image(s) selected
            </p>
          ) : null}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isEdit ? "Update Sponsor" : "Upload"}
        </Button>
      </div>
    </form>
  );
}
