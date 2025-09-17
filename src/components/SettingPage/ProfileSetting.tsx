/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Phone, Mail, MapPin, Eye, EyeOff } from "lucide-react";
import profilePhoto from "@/assets/image/hd.jpg";
import Image from "next/image";
import EditProfile from "./Edit_profileModal";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner"; // For user feedback

const ProfileInterface = () => {
  const [changePassword] = useChangePasswordMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Visibility states for passwords
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
    let isValid = true;

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      if (result?.success) {
        toast.success(result.message || "Password changed successfully!");
      } else {
        toast.error(
          result?.message || "Failed to change password. Please try again."
        );
      }

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to change password. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Profile</div>
          <h1 className="text-xl font-semibold text-[#FF6203]">My Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="p-8 shadow-sm border border-border rounded-md">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <Image
                  src={profilePhoto}
                  alt="Joohn Emily Carter"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>

              {/* Name & Intro */}
              <div className="space-y-3 max-w-md">
                <h2 className="text-xl font-semibold text-profile-heading">
                  Joohn Emily Carter
                </h2>
                <div>
                  <h3 className="font-medium text-profile-heading mb-1">
                    Introduction:
                  </h3>
                  <p className="text-profile-text leading-relaxed">
                    Lorem Ipsum as their for default model text, and a search for
                    &#39;lorem ipsum&#39; will uncover many web sites.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info + Edit Button */}
            <div className="relative min-w-[220px]">
              {/* Edit Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-0 right-0 p-2 hover:bg-secondary rounded-md transition-colors"
                aria-label="Edit profile"
              >
                <Edit2 className="w-4 h-4 text-profile-label" />
              </button>

              {/* Contact Details */}
              <div className="space-y-3 mt-10 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-profile-label" />
                  <div>
                    <div className="font-medium text-profile-heading">Contact</div>
                    <div className="text-profile-text">+84 0373467950</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-profile-label" />
                  <div>
                    <div className="font-medium text-profile-heading">Email</div>
                    <div className="text-profile-text">giangbanganh@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-profile-label" />
                  <div>
                    <div className="font-medium text-profile-heading">Address</div>
                    <div className="text-profile-text">Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Change Password Card */}
 {/* Change Password Card */}
<Card className="p-8 shadow-sm border border-border rounded-md">
  <h2 className="text-xl font-medium text-profile-heading mb-6">Change Password</h2>

  <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
    {/* Current Password */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-profile-heading">
        Current Password
      </label>
      <div className="relative">
        <Input
          type={showOldPassword ? "text" : "password"}
          name="oldPassword"
          placeholder="Enter current password"
          value={formData.oldPassword}
          onChange={handleChange}
          className={`w-full pr-10 ${
            errors.oldPassword ? "border-red-500" : "border-border"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowOldPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={showOldPassword ? "Hide password" : "Show password"}
        >
          {showOldPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {errors.oldPassword && (
        <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
      )}
    </div>

    {/* New Password */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-profile-heading">
        New Password
      </label>
      <div className="relative">
        <Input
          type={showNewPassword ? "text" : "password"}
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          className={`w-full pr-10 ${
            errors.newPassword ? "border-red-500" : "border-border"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowNewPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={showNewPassword ? "Hide password" : "Show password"}
        >
          {showNewPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {errors.newPassword && (
        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
      )}
    </div>

    {/* Confirm New Password */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-profile-heading">
        Confirm New Password
      </label>
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmNewPassword"
          placeholder="Confirm new password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          className={`w-full pr-10 ${
            errors.confirmNewPassword ? "border-red-500" : "border-border"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={
            showConfirmPassword ? "Hide password" : "Show password"
          }
        >
          {showConfirmPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {errors.confirmNewPassword && (
        <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>
      )}
    </div>

    <Button
      type="submit"
      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
    >
      Update Password
    </Button>
  </form>
</Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ProfileInterface;