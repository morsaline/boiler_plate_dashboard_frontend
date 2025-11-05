"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Advertisement } from "@/redux/features/advertisement/advertisementApi";

interface AdvertisementFormProps {
  onSubmit: (formData: FormData) => Promise<void> | void;
  onCancel: () => void;
  advertisement?: Advertisement; // ✅ optional for edit mode
  isEdit?: boolean;
}

export function AdvertisementForm({ onSubmit }: AdvertisementFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    advertisementName: "",
    companyName: "",
    website: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Handle input fields
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length === 0) {
      toast.error("Please upload valid image files (jpeg, png, webp).");
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { advertisementName, companyName, website } = formData;
    if (!advertisementName || !companyName || !website) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please add at least one advertisement image.");
      return;
    }

    const payload = new FormData();
    payload.append("advertisementName", advertisementName);
    payload.append("companyName", companyName);
    payload.append("website", website);

    selectedFiles.forEach((file) => {
      payload.append("advertisementPictures", file);
    });

    await onSubmit(payload);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Advertisement List</p>
          <h1 className="text-xl font-semibold text-orange-500">
            Add Advertisement
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advertisement Name<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter name"
                value={formData.advertisementName}
                onChange={(e) =>
                  handleInputChange("advertisementName", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Name"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter Website Link"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>

          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Advertisement Picture
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-6 w-6 text-gray-400" />
                <p className="text-gray-500 text-sm">
                  Drop file or browse — .jpeg, .png (max 25MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Preview Images */}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
