/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { X, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sponsor } from "./SponsorForm";
// import { Sponsor } from "@/types/Sponsor"; // adjust import path if needed

interface SponsorModalProps {
  sponsor: Sponsor;
  onClose: () => void;
}

export function SponsorModal({ sponsor, onClose }: SponsorModalProps) {
  const mainImage =
    sponsor.images && sponsor.images.length > 0
      ? sponsor.images[0].trim()
      : "/placeholder.svg";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full h-40">
          <img
            src={mainImage}
            alt={sponsor.sponsorName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>

          {/* Text overlay */}
          <div className="absolute bottom-2 left-3 text-white">
            <h2 className="text-xl font-semibold">{sponsor.sponsorName}</h2>
            <p className="text-sm opacity-80">Explore the City</p>
          </div>

          {/* Discount badge */}
          <div className="absolute top-2 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
            50%
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4">
          {/* Agency Name & Rating */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-gray-900 font-semibold">
                {sponsor.sponsorName}
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-orange-600 font-semibold">${sponsor.price}</p>
            </div>
          </div>

          {/* Facilities Tags */}
          {sponsor.facilities && sponsor.facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sponsor.facilities
                .slice(0, 4)
                .map((facility: any, index: number) => (
                  <span
                    key={index}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                  >
                    {facility}
                  </span>
                ))}
            </div>
          )}

          {/* Address */}
          {sponsor.address && (
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{sponsor.address}</span>
            </div>
          )}

          {/* Explore Button */}
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full"
            onClick={() => {
              if (sponsor.websiteLink) {
                window.open(
                  sponsor.websiteLink,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
          >
            Explore Now
          </Button>
        </div>
      </div>
    </div>
  );
}
