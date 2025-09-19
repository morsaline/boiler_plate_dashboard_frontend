/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useAddTouristSportsMutation, useUpdateTouristSportsByIdMutation } from "@/redux/features/touristSports/touristSportsApi";
import Image from "next/image";
import { toast } from "sonner";
import { fetchLatLng } from "../Restaurant/AddRestaurants";

interface TouristSpotFormProps {
  onCancel: () => void;
  touristSpot?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    description: string;
    facilities: string[];
    culture: string[];
    youtubeLink: string;
    photos: string[];
    videos: string[];
  };
}

export function TouristSpotForm({ onCancel, touristSpot }: TouristSpotFormProps) {
  const isEditing = !!touristSpot;

  // Form fields
  const [formData, setFormData] = useState({
    name: touristSpot?.name || "",
    address: touristSpot?.address || "",
    phone: touristSpot?.phone || "",
    description: touristSpot?.description || "",
    youtubeLink: touristSpot?.youtubeLink || "",
  });

  const [facilities, setFacilities] = useState<string[]>(touristSpot?.facilities || [""]);
  const [culture, setCulture] = useState<string[]>(touristSpot?.culture || [""]);

  // Files
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Previews (existing + new)
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(touristSpot?.photos || []);
  const [videoPreview, setVideoPreview] = useState<string | null>(touristSpot?.videos?.[0] || null);

  // Validation states
  const [youtubeError, setYoutubeError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Mutations
  const [addTouristSpot, { isLoading: isCreating }] = useAddTouristSportsMutation();
  const [updateTouristSpot, { isLoading: isUpdating }] = useUpdateTouristSportsByIdMutation();

  const isLoading = isCreating || isUpdating;

  // Max limits
  const MAX_IMAGES = 5;
  const MAX_VIDEO_SIZE_MB = 100;

  // YouTube validator
  const validateYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return youtubeRegex.test(url.trim());
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "youtubeLink") {
      if (value && !validateYouTubeUrl(value)) {
        setYoutubeError("Please enter a valid YouTube link.");
      } else {
        setYoutubeError("");
      }
    }
  };

  // Array helpers
  const addArrayItem = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => setArray([...array, ""]);

  const removeArrayItem = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index));
    }
  };

  const handleArrayChange = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  // Image handlers
  const handleImageChangeAsFiles = (files: File[]) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webm"];
    const validFiles = files.filter(f => validTypes.includes(f.type));
    const invalidCount = files.length - validFiles.length;

    if (invalidCount > 0) toast.warning(`${invalidCount} non-image(s) ignored.`);
    if (validFiles.length + imageFiles.length > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed.`);
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    setPhotoPreviews(prev => [
      ...prev,
      ...validFiles.map(file => URL.createObjectURL(file))
    ]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleImageChangeAsFiles(Array.from(e.target.files));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    photoPreviews.forEach(url => URL.revokeObjectURL(url));
    setPhotoPreviews([]);
    setImageFiles([]);
  };

  // Video handlers
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!["video/mp4", "video/webm"].includes(file.type)) {
        toast.error("Only MP4/WebM supported.");
        return;
      }

      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        toast.error(`Video must be under ${MAX_VIDEO_SIZE_MB}MB.`);
        return;
      }

      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setVideoFile(null);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateYouTubeUrl(formData.youtubeLink)) {
      toast.error("Invalid YouTube link.");
      return;
    }

    const formDataToSend = new FormData();

    // Geocode address
    let latStr = "0", lngStr = "0";
    try {
      const { lat, lng } = await fetchLatLng(formData.address);
      latStr = String(lat);
      lngStr = String(lng);
    } catch (err: any) {
      toast.error("Could not get location. Check address.");
      return;
    }

    const dataPayload = {
      name: formData.name,
      address: formData.address,
      // phone: formData.phone,
      description: formData.description,
      facilities: facilities.filter(f => f.trim() !== ""),
      culture: culture.filter(c => c.trim() !== ""),
      youtubeLink: formData.youtubeLink ? [formData.youtubeLink] : [],
      entryFee: 0,
      lat: latStr,
      lng: lngStr,
    };

    formDataToSend.append("data", JSON.stringify(dataPayload));

    // Append only new files
    imageFiles.forEach(file => formDataToSend.append("images", file));
    if (videoFile) formDataToSend.append("video", videoFile);

    try {
      if (isEditing && touristSpot?.id) {
        await updateTouristSpot({ id: touristSpot.id, data: formDataToSend }).unwrap();
        toast.success("✅ Updated successfully!");
      } else {
        await addTouristSpot(formDataToSend).unwrap();
        toast.success("🎉 Created successfully!");
      }
      onCancel(); // Go back
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.data?.message || "Failed to save.");
    }
  };

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {isEditing ? "Edit Tourist Spot" : "Add Tourist Spot"}
          </h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the place..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <Label>Facilities</Label>
              {facilities.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(facilities, setFacilities, index, e.target.value)
                    }
                    placeholder="e.g., Parking"
                    disabled={isLoading}
                  />
                  {facilities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(facilities, setFacilities, index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(facilities, setFacilities)}
                className="border-orange-500 text-orange-500 bg-orange-50 hover:bg-orange-100"
                disabled={isLoading}
              >
                + Add More
              </Button>
            </div>

            {/* Culture */}
            <div className="space-y-4">
              <Label>Culture</Label>
              {culture.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(culture, setCulture, index, e.target.value)
                    }
                    placeholder="e.g., Local festivals"
                    disabled={isLoading}
                  />
                  {culture.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(culture, setCulture, index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(culture, setCulture)}
                className="border-orange-500 text-orange-500 bg-orange-50 hover:bg-orange-100"
                disabled={isLoading}
              >
                + Add More
              </Button>
            </div>

            {/* YouTube Link */}
            <div className="space-y-2">
              <Label>YouTube Video Link</Label>
              <Input
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isLoading}
              />
              {youtubeError && (
                <p className="text-sm text-red-500 mt-1">{youtubeError}</p>
              )}
            </div>

            {/* Photos Upload */}
            <div className="space-y-2">
              <Label>Photos *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                  isDragOver ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleImageChangeAsFiles(Array.from(e.dataTransfer.files));
                }}
                onClick={() => document.getElementById("photos")?.click()}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP (max 5)</p>
              </div>

              <Input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {imageFiles.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    {imageFiles.length} new image(s) added
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllImages}
                    className="text-red-500"
                    disabled={isLoading}
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Show previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {photoPreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <Image src={src} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="z-10 scale-90 hover:scale-100"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>Intro Video (Optional)</Label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-orange-400"
                onClick={() => document.getElementById("video")?.click()}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Click to upload video</p>
                <p className="text-xs text-gray-400">MP4/WebM, max 100MB</p>
              </div>

              <Input
                id="video"
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={handleVideoChange}
              />

              {videoPreview && (
                <div className="mt-4 relative group">
                  <video controls width="100%" className="rounded-lg">
                    <source src={videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={removeVideo}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                disabled={isLoading}
              >
                {isLoading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}