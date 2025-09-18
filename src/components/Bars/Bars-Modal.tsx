"use client";

import Image from "next/image";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Fashion } from "./Fashion-List";

// import { BeachData } from "@/redux/features/beache/beachApi";
import { BarData } from "@/redux/features/bar/barApi";

interface BarModalProps {
  bar: BarData;
  onClose: () => void;
}

export function BarModal({ bar, onClose }: BarModalProps) {
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
            {typeof bar.images === "string" && bar.images ? (
              <Image
                src={bar.images}
                alt={bar.barName}
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
            {bar.barName}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-800 font-medium">
              {bar.averageRating}
            </span>
            <div className="flex text-orange-500">
              {Array.from({ length: Math.ceil(bar.averageRating) }).map(
                (_, i) => (
                  <span key={i}>★</span>
                )
              )}
              {Array.from({ length: 5 - Math.ceil(bar.averageRating) }).map(
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
            <span className="text-gray-600 text-sm">{bar.address}</span>
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
