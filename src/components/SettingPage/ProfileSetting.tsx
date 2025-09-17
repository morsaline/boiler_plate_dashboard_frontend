 
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Edit2, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import EditProfile from "./Edit_profileModal";
import ChangePasswordForm from "./ChangePassword";
import profilePhoto from "@/assets/image/hd.jpg"; // fallback image
import { useGetmeQuery } from "@/redux/features/users/usersApi";

const ProfileInterface = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const { data: userData, isLoading, isError } = useGetmeQuery({});

  // Extract user info safely
  const user = userData?.data;

  // Fallback values if data not loaded yet
  const fullName = user?.fullName || "User Name";
  const email = user?.email || "Not provided";
  const phoneNumber = user?.phoneNumber || "Not provided";
  const address = user?.address || "Not provided";
  const about = user?.about || "No introduction available.";
  const profileImage = user?.profileImage ? user.profileImage.trim() : "";

  // Handle file selection (for local preview only)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Use uploaded image first, then server image, then fallback
  const imageUrl = uploadedImage || (profileImage && profileImage) || profilePhoto.src;

  const handleUploadClick = () => {
    document.getElementById("profile-upload-input")?.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-6 flex justify-center items-center">
        <p className="text-lg text-red-600">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Profile</div>
          <h1 className="text-xl font-semibold text-[#FF6203]">My Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="p-8 shadow-sm border border-border rounded-md bg-white">
          <div className="flex items-start justify-between">
            {/* Left Side: Avatar + Name & Intro */}
            <div className="flex gap-6 flex-1">
              {/* Profile Photo with Edit Overlay */}
              <div className="relative group">
                <Image
                  src={imageUrl}
                  alt={`${fullName}'s profile`}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />

                {/* Edit Overlay - appears on hover */}
                <div
                  className="absolute inset-0 rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  id="profile-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name & Introduction */}
              <div className="space-y-2 flex-1">
                <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">Introduction:</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{about}</p>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Info + Edit Button */}
            <div className="min-w-[220px] relative">
              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Edit profile"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>

              {/* Contact Details */}
              <div className="mt-10 space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Contact</div>
                    <div className="text-gray-600">{phoneNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">{email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-600">{address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className="p-8 shadow-sm border border-border rounded-md">
          <ChangePasswordForm />
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