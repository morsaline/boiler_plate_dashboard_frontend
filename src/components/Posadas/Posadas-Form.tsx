/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, Plus, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
  useCrateMultipleUploadFileMutation,
  useCrateSingleUploadFileMutation,
} from "@/redux/features/image/imageApi";
import { PosadasData, RoomData } from "@/redux/features/posadas/posadasApi";
import { fetchLatLng } from "../Restaurant/AddRestaurants";

interface PosadasFormProps {
  posadas?: PosadasData;
  onSubmit: (posadas: PosadasData | Omit<PosadasData, "id">) => void;
  onCancel: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isEditing?: boolean;
}

export function PosadasForm({
  posadas,
  onSubmit,
  onCancel,
  isCreating,
  isUpdating,
  isEditing = false,
}: PosadasFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: posadas?.name || "",
    address: posadas?.address || "",
    whatsapp: posadas?.whatsapp || "",
    instagram: posadas?.instagram || "",
    phone: posadas?.phone || "",
    description: posadas?.description || "",
    posadasImage: posadas?.posadaImage || (null as string | null),
  });

  const [rooms, setRooms] = useState<RoomData[]>(
    posadas?.rooms || [
      {
        id: "",
        roomName: "",
        beds: 0,
        washrooms: 0,
        parking: false,
        gym: false,
        swimmingPool: false,
        wifi: false,
        ac: false,
        breakfast: false,
        price: 0,
        roomPictures: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        posadasId: "",
      },
    ]
  );

  const [crateSingleUploadFile] = useCrateSingleUploadFileMutation();
  const [crateMultipleUploadFile] = useCrateMultipleUploadFileMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoomChange = <K extends keyof RoomData>(
    index: number,
    field: K,
    value: RoomData[K]
  ) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: "",
        roomName: "",
        beds: 0,
        washrooms: 0,
        parking: false,
        gym: false,
        swimmingPool: false,
        wifi: false,
        ac: false,
        breakfast: false,
        price: 0,
        roomPictures: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        posadasId: "",
      },
    ]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // --- Posadas Image Upload & Preview ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);

    // Show preview only
    setPreviewImage(previewUrl);
  };

  const confirmUpload = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault(); // <-- prevent form submit

    if (!previewImage) return;
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (!fileInput?.files || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const uploadedUrl = await crateSingleUploadFile(formDataUpload).unwrap();
      const finalUrl: string = Array.isArray(uploadedUrl)
        ? uploadedUrl[0]
        : uploadedUrl?.data || null;

      setFormData((prev) => ({ ...prev, posadasImage: finalUrl }));
      setPreviewImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Remove preview
  const removePreview = () => {
    setPreviewImage(null);
    (document.getElementById("file-upload") as HTMLInputElement).value = "";
  };

  const handleRoomFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    roomIndex: number
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append("images", file));

    try {
      const response = await crateMultipleUploadFile(formDataUpload).unwrap();

      setRooms((prev) =>
        prev.map((room, i) =>
          i === roomIndex
            ? {
                ...room,
                roomPictures: [...room.roomPictures, ...response.data],
              }
            : room
        )
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const openRoomFileDialog = (index: number) => {
    document.getElementById(`room-upload-${index}`)?.click();
  };

  const removeRoomImage = (roomIndex: number, imgUrl: string) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? {
              ...room,
              roomPictures: room.roomPictures.filter(
                (img: any) => img !== imgUrl
              ),
            }
          : room
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const posadasData = {
      ...formData,
      rooms,
      ...(isEditing && posadas ? { id: posadas.id } : {}),
    } as any;

    const { lat, lng } = await fetchLatLng(formData.address);
    const payload: PosadasData = {
      ...posadasData,
      lat,
      lng,
      type: "POSADAS",
      averageRating: 0,
      posadasImage: formData?.posadasImage || "",
    } as PosadasData;

    onSubmit(payload);
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
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Posadas List
          </h1>
          {!isEditing && (
            <h2 className="text-lg font-semibold text-primary mb-4">
              Add Posadas
            </h2>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Posadas Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Restaurant and Posadas Name*
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address*
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-medium">
                  WhatsApp*
                </Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  placeholder="Enter WhatsApp number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm font-medium">
                  Instagram*
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  placeholder="Enter Instagram account name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone*
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description*
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Add description"
                rows={4}
                required
              />
            </div>

            {/* Posadas Image */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {previewImage || formData.posadasImage ? (
                <>
                  <div className="relative w-48 h-48 mx-auto mb-2">
                    <Image
                      src={previewImage || formData.posadasImage!}
                      alt="Posadas"
                      fill
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>

                  {previewImage && (
                    <div className="flex justify-center gap-2 mb-4">
                      <Button size="sm" onClick={confirmUpload}>
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={removePreview}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop file or browse
                  </p>
                </>
              )}

              <Button
                type="button"
                variant="default"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Room Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Add Room</h3>
              {rooms.map((room, index) => (
                <div
                  key={room.id || index}
                  className="p-4 border rounded-lg mb-4 space-y-4"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Room Name*</h4>
                    {rooms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Text Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Room name"
                      value={room.roomName}
                      onChange={(e) =>
                        handleRoomChange(index, "roomName", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Beds"
                      value={room.beds}
                      onChange={(e) =>
                        handleRoomChange(
                          index,
                          "beds",
                          parseInt(e.target.value || "0")
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Washrooms"
                      value={room.washrooms}
                      onChange={(e) =>
                        handleRoomChange(
                          index,
                          "washrooms",
                          parseInt(e.target.value || "0")
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={room.price}
                      onChange={(e) =>
                        handleRoomChange(
                          index,
                          "price",
                          parseFloat(e.target.value || "0")
                        )
                      }
                    />
                  </div>

                  {/* Boolean Options */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.parking}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "parking",
                            e.target.checked as any
                          )
                        }
                      />
                      <span>Parking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.gym}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "gym",
                            e.target.checked as any
                          )
                        }
                      />
                      <span>Gym</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.swimmingPool}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "swimmingPool",
                            e.target.checked as any
                          )
                        }
                      />
                      <span>Swimming Pool</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.ac}
                        onChange={(e) =>
                          handleRoomChange(index, "ac", e.target.checked as any)
                        }
                      />
                      <span>AC</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.wifi}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "wifi",
                            e.target.checked as any
                          )
                        }
                      />
                      <span>Wifi</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={room.breakfast}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "breakfast",
                            e.target.checked as any
                          )
                        }
                      />
                      <span>Breakfast</span>
                    </label>
                  </div>

                  {/* Room Pictures */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Room Pictures</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {room.roomPictures.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          {room.roomPictures.map((src, idx) => (
                            <div key={idx} className="relative w-full h-32">
                              <Image
                                src={src}
                                alt={`Room ${index + 1} - ${idx + 1}`}
                                fill
                                className="rounded-lg object-cover"
                                unoptimized
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                onClick={() => removeRoomImage(index, src)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drop files or browse
                          </p>
                        </>
                      )}

                      <Button
                        type="button"
                        variant="default"
                        className="text-white hover:bg-primary/90 mt-2"
                        onClick={() => openRoomFileDialog(index)}
                      >
                        Browse Files
                      </Button>

                      <input
                        id={`room-upload-${index}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleRoomFileChange(e, index)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant={"ghost"} onClick={addRoom}>
                <Plus className="h-4 w-4" /> Add More
              </Button>
            </div>

            {/* Submit & Cancel */}
            <div className="flex gap-4 pt-6 justify-around">
              {isEditing && (
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={onCancel}
                  className="px-24"
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="default"
                type="submit"
                className="px-24"
                disabled={isUpdating || isCreating}
              >
                {isUpdating || isCreating
                  ? isEditing
                    ? "Updating..."
                    : "Submitting..."
                  : isEditing
                  ? "Update"
                  : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PosadasForm;
