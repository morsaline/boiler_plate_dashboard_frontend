"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, Plus, X } from "lucide-react";
import { useCrateSingleRestaurantMutation } from "@/redux/features/restaurantsApi/restaurantsApi";
import { useUploadFileMutation } from "@/redux/features/fileUploadApi/fileUploadApi";
import Image from "next/image";

export interface MenuItem {
  id: string;
  name: string;
  items: string[];
  price: string;
  picture: File | null;
}

export const fetchLatLng = async (address: string) => {
  if (!address) return { lat: 0, lng: 0 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  const data = await res.json();
  if (data.status === "OK") {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  return { lat: 0, lng: 0 };
};

export function AddRestaurants() {
  const [crateSingleRestaurant, { isLoading }] =
    useCrateSingleRestaurantMutation();
  const [uploadFile, { isLoading: isImageLoading }] = useUploadFileMutation();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    whatsapp: "",
    instagram: "",
    description: "",
    productImage: null as File | null,
    lat: 0,
    lng: 0,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", name: "", items: ["", "", ""], price: "", picture: null },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMenuItemChange = (
    index: number,
    field: string,
    value: string | File | null,
    itemIndex?: number
  ) => {
    setMenuItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (field === "items" && itemIndex !== undefined) {
          const newItems = [...item.items];
          newItems[itemIndex] = value as string;
          return { ...item, items: newItems };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const addMenuItem = () => {
    setMenuItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        items: ["", "", ""],
        price: "",
        picture: null,
      },
    ]);
  };

  const removeMenuItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Google Maps Geocoding to get lat/lng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fetch lat/lng from Google
      const { lat, lng } = await fetchLatLng(formData.address);

      // Upload main restaurant image
      let productImageUrl = "";
      if (formData.productImage) {
        const form = new FormData();
        form.append("images", formData.productImage);
        const uploadRes = await uploadFile(form).unwrap();
        productImageUrl = uploadRes.data[0];
      }

      // Upload menu images and prepare payload
      const menus = await Promise.all(
        menuItems.map(async (item) => {
          let foodPictureUrl = "";
          if (item.picture instanceof File) {
            const form = new FormData();
            form.append("images", item.picture);
            const uploadRes = await uploadFile(form).unwrap();
            foodPictureUrl = uploadRes.data[0];
          }

          const priceNumber = Number(item.price);
          if (isNaN(priceNumber) || priceNumber <= 0) {
            throw new Error(`Price for "${item.name}" must be greater than 0`);
          }

          return {
            foodName: item.name,
            price: priceNumber,
            foodPicture: foodPictureUrl,
            items: item.items.filter(Boolean),
          };
        })
      );

      // Final payload including lat/lng
      const restaurantData = {
        name: formData.name,
        address: formData.address,
        lat,
        lng,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        description: formData.description,
        productImage: productImageUrl || "",
        menus,
      };

      const res = await crateSingleRestaurant(restaurantData).unwrap();
      console.log("Restaurant created:", res);

      // Reset form
      setFormData({
        name: "",
        address: "",
        whatsapp: "",
        instagram: "",
        description: "",
        productImage: null,
        lat: 0,
        lng: 0,
      });
      setMenuItems([
        { id: "1", name: "", items: ["", "", ""], price: "", picture: null },
      ]);
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Add Restaurant
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Details */}
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
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop file or browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productImage: e.target.files?.[0] || null,
                    }))
                  }
                />
                {formData.productImage && (
                  <Image
                    width={200}
                    height={200}
                    src={URL.createObjectURL(formData.productImage)}
                    alt="Preview"
                    className="mt-4 max-h-48 mx-auto rounded"
                  />
                )}
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
                    {item.items.map((val, i) => (
                      <Input
                        key={i}
                        placeholder={`Item ${i + 1}`}
                        value={val}
                        onChange={(e) =>
                          handleMenuItemChange(
                            index,
                            "items",
                            e.target.value,
                            i
                          )
                        }
                      />
                    ))}
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
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drop file or browse
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) =>
                          handleMenuItemChange(
                            index,
                            "picture",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                      {item.picture && (
                        <Image
                          width={250}
                          height={250}
                          src={URL.createObjectURL(item.picture)}
                          alt="Menu Preview"
                          className="mt-2 max-h-32 mx-auto rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={addMenuItem}>
                <Plus className="h-4 w-4" /> Add More
              </Button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 justify-center">
              <Button variant="default" type="submit">
                {isLoading || isImageLoading ? (
                  <>
                    {/* <LoaderIcon /> */}
                    Submiting...
                  </>
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
