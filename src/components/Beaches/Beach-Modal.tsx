"use client";

import Image from "next/image";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Fashion } from "./Fashion-List";

import { BeachData } from "@/redux/features/beache/beachApi";

interface BeachModalProps {
  beach: BeachData;
  onClose: () => void;
}

export function BeachModal({ beach, onClose }: BeachModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Fashion Image */}
        <div className="px-6 pb-4">
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative">
            {typeof beach.images === "string" && beach.images ? (
              <Image
                src={beach.images}
                alt={beach.beacheName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Fashion Details */}
        <div className="px-6 pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {beach.beacheName}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-800 font-medium">
              {beach.averageRating}
            </span>
            <div className="flex text-orange-500">
              {Array.from({ length: Math.ceil(beach.averageRating) }).map(
                (_, i) => (
                  <span key={i}>★</span>
                )
              )}
              {Array.from({ length: 5 - Math.ceil(beach.averageRating) }).map(
                (_, i) => (
                  <span key={i} className="text-gray-300">
                    ★
                  </span>
                )
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-6">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{beach.address}</span>
          </div>

          {/* View Map Button */}
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            View Map
          </Button>
        </div>
      </div>
    </div>
  );
}
