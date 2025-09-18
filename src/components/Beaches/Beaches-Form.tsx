"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

import { fetchLatLng } from "../Restaurant/AddRestaurants";
import { BeachData } from "@/redux/features/beache/beachApi";

interface BeachFormProps {
  beach?: BeachData | null; // ✅ allow null
  onSubmit: (data: Omit<BeachData, "id"> & { id?: string }) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function BeachForm({
  beach,
  onSubmit,
  onCancel,
  isEdit = false,
}: BeachFormProps) {
  const [formData, setFormData] = useState({
    beacheName: beach?.beacheName || "",
    category: beach?.category || "",
    address: beach?.address || "",
    averageRating: beach?.averageRating || 5,
    phone: beach?.phone || "",
    facilities: beach?.facilities || [],
    images: beach?.images || "",
    lat: beach?.lat || 0,
    lng: beach?.lng || 0,
  });

  const [facilityInput, setFacilityInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, images: e.target.files![0] }));
    }
  };

  const handleAddFacility = () => {
    if (!facilityInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, facilityInput.trim()],
    }));
    setFacilityInput("");
  };

  const handleRemoveFacility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { lat, lng } = await fetchLatLng(formData.address);
    const payload: Omit<BeachData, "id"> & { id?: string } = {
      ...formData,
      lat,
      lng,
      id: beach?.id, // include ID if editing
    };

    onSubmit(payload);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen flex justify-center">
      <div className="w-full">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm text-gray-400 mb-1">
            {isEdit ? "Edit Fashion" : "Add Fashion"}
          </p>
          <h1 className="text-xl md:text-2xl font-semibold text-orange-500">
            {isEdit ? "Edit Fashion" : "Add Fashion"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-xl p-4 space-y-6"
        >
          {/* Fashion Name */}
          <div>
            <label className="block mb-1 font-medium">Beach Name</label>
            <Input
              placeholder="Enter name"
              value={formData.beacheName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  beacheName: e.target.value,
                }))
              }
            />
          </div>

          {/* Category */}
          {/* <div>
            <label className="block mb-1 font-medium">Category</label>
            <Input
              placeholder="Enter category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div> */}

          {/* Review */}
          <div>
            <label className="block mb-1 font-medium">Review</label>
            <div className="grid grid-cols-2 sm:flex sm:gap-6 gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="review"
                    value={star}
                    checked={Math.ceil(formData.averageRating) === star}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, averageRating: star }))
                    }
                    className="hidden"
                  />
                  <span
                    className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
                      formData.averageRating === star
                        ? "bg-orange-500 border-orange-500"
                        : "border-orange-500"
                    }`}
                  />
                  {star} Star
                </label>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <Input
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          {/* Phone */}
          {/* <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input
              placeholder="Enter phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div> */}

          {/* Facilities */}
          {/* <div>
            <label className="block mb-1 font-medium">Facilities</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add facility"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
              />
              <Button type="button" onClick={handleAddFacility}>
                Add
              </Button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {formData.facilities.map((facility, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg"
                >
                  <span>{facility}</span>
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => handleRemoveFacility(i)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Add Image</label>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Drop file or browse</p>
              <p className="text-xs text-gray-400">
                Format: .jpeg, .png, .mp4 & Max 25MB
              </p>
              <label
                htmlFor="file-upload"
                className="mt-3 cursor-pointer rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
              >
                Browse Files
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".jpeg,.jpg,.png,.mp4"
                className="hidden"
                onChange={handleFileChange}
              />
              {formData.images && (
                <p className="mt-2 text-sm text-green-600 break-words">
                  Selected:{" "}
                  {typeof formData.images === "string"
                    ? formData.images
                    : formData.images.name}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
