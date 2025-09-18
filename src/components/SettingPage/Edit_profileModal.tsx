/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUpdateProfileMutation } from "@/redux/features/users/usersApi";
import { toast } from "sonner";

// Define form data shape based on actual user fields
interface EditProfileFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  country: string;
  drivingLicenseNo: string;
  vehiclesNumber: string;
  about: string;
}

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<EditProfileFormData>;
}

export default function EditProfile({ isOpen, onClose, initialData }: EditProfileProps) {
  const [updateProfile] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<EditProfileFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    country: "",
    drivingLicenseNo: "",
    vehiclesNumber: "",
    about: "",
    ...initialData,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || "",
        address: initialData.address || "",
        country: initialData.country || "",
        drivingLicenseNo: initialData.drivingLicenseNo || "",
        vehiclesNumber: initialData.vehiclesNumber || "",
        about: initialData.about || "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Create FormData to match backend expectation
    const payload = new FormData();

    // 👉 Must stringify the data and append under key "data"
    payload.append(
      "data",
      JSON.stringify({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        country: formData.country,
        drivingLicenseNo: formData.drivingLicenseNo,
        vehiclesNumber: formData.vehiclesNumber,
        about: formData.about,
      })
    );

    try {
      const result = await updateProfile(payload).unwrap();

      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        "An error occurred while updating the profile.";
      toast.error(errorMessage);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-lg rounded-2xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>

              <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contact Number</label>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      disabled
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Driving License No</label>
                    <Input
                      name="drivingLicenseNo"
                      value={formData.drivingLicenseNo}
                      onChange={handleChange}
                      placeholder="DL-XXXX-XXX"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Vehicle Number</label>
                    <Input
                      name="vehiclesNumber"
                      value={formData.vehiclesNumber}
                      onChange={handleChange}
                      placeholder="DHA-11-1234"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Introduction / About</label>
                    <Textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}