"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, Plus, X, LoaderIcon, ArrowLeft } from "lucide-react";
import { useUploadFileMutation } from "@/redux/features/fileUploadApi/fileUploadApi";
import Image from "next/image";

export interface MenuItem {
  id: string;
  name: string;
  itemG1: string;
  itemG2: string;
  itemG3: string;
  price: string;
  picture: string; // uploaded URL
}

export interface Restaurant {
  productImage: string | null;
  id?: string;
  name: string;
  address: string;
  whatsapp: string;
  instagram: string;
  description: string;
  menuItems: MenuItem[];
}

interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSubmit: (restaurant: Restaurant | Omit<Restaurant, "id">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function RestaurantForm({
  restaurant,
  onSubmit,
  onCancel,
  isEditing = false,
}: RestaurantFormProps) {
  const [uploadFile, { isLoading: isImageLoading }] = useUploadFileMutation();

  const [formData, setFormData] = useState({
    name: restaurant?.name || "",
    address: restaurant?.address || "",
    whatsapp: restaurant?.whatsapp || "",
    instagram: restaurant?.instagram || "",
    description: restaurant?.description || "",
    productImage: restaurant?.productImage || null,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    restaurant?.menuItems || [
      {
        id: "1",
        name: "",
        itemG1: "",
        itemG2: "",
        itemG3: "",
        price: "",
        picture: "",
      },
    ]
  );

  // ✅ Upload restaurant main image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("images", file);
    try {
      const res = await uploadFile(form).unwrap();
      setFormData((prev) => ({ ...prev, productImage: res.data[0] }));
    } catch (err) {
      console.error("Main image upload failed:", err);
    }
  };

  // ✅ Upload menu item image
  const handleMenuItemFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("images", file);
    try {
      const res = await uploadFile(form).unwrap();
      const url = res.data[0];
      setMenuItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, picture: url } : item))
      );
    } catch (err) {
      console.error("Menu item image upload failed:", err);
    }
  };

  const addMenuItem = () => {
    setMenuItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        itemG1: "",
        itemG2: "",
        itemG3: "",
        price: "",
        picture: "",
      },
    ]);
  };

  const removeMenuItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMenuItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const restaurantData = {
      ...formData,
      menuItems,
      ...(isEditing && restaurant ? { id: restaurant.id } : {}),
    };
    onSubmit(restaurantData as Restaurant);
  };

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onCancel}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Restaurant" : "Add Restaurant"}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp*</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram*</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                required
              />
            </div>

            {/* Product Image */}
            <div className="space-y-2">
              <Label>Product Image*</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center relative">
                {isImageLoading ? (
                  <LoaderIcon className="animate-spin mx-auto h-8 w-8" />
                ) : formData.productImage ? (
                  <div className="relative">
                    <Image
                      src={formData.productImage}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="mx-auto h-40 w-auto object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, productImage: null }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Menu Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Add Menu</h3>
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg mb-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Menu Item {index + 1}</h4>
                    {menuItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMenuItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Food name*"
                      value={item.name}
                      onChange={(e) =>
                        handleMenuItemChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder="Item 01*"
                      value={item.itemG1}
                      onChange={(e) =>
                        handleMenuItemChange(index, "itemG1", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder="Item 02"
                      value={item.itemG2}
                      onChange={(e) =>
                        handleMenuItemChange(index, "itemG2", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Item 03"
                      value={item.itemG3}
                      onChange={(e) =>
                        handleMenuItemChange(index, "itemG3", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Price*"
                      value={item.price}
                      onChange={(e) =>
                        handleMenuItemChange(index, "price", e.target.value)
                      }
                      required
                    />
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
                      {item.picture ? (
                        <div className="relative">
                          <Image
                            src={item.picture}
                            width={128}
                            height={128}
                            alt="Menu Preview"
                            className="mx-auto h-24 w-auto rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() =>
                              setMenuItems((prev) =>
                                prev.map((m, i) =>
                                  i === index ? { ...m, picture: "" } : m
                                )
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleMenuItemFileUpload(e, index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={addMenuItem}>
                <Plus className="h-4 w-4" /> Add More
              </Button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 justify-end">
              <Button variant="default" type="submit">
                {isImageLoading ? (
                  <>
                    <LoaderIcon className="animate-spin mr-2" /> Uploading...
                  </>
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
