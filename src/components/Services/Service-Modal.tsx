/* eslint-disable @next/next/no-img-element */
"use client";

import { X, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";


import { Service } from "@/redux/features/serrviceList/ServiceListApi";

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  // Trim image URLs and get first one safely
  const mainImage = service.images?.length > 0 
    ? service.images[0].trim() 
    : "/placeholder.svg";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Service Image */}
{/* Service Image */}
<div className="px-6 pb-4">
  <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative">
    <img
      src={mainImage}
      alt={service.serviceName}
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder.svg";
      }}
    />
  </div>
</div>

        {/* Service Details */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{service.serviceName}</h2>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{service.address}</span>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {service.category}
            </span>
          </div>

          {/* Facilities */}
          {service.facilities && service.facilities.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Facilities</h3>
              <ul className="space-y-1">
                {service.facilities.map((facility, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                    {facility.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Contact Info</h3>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{service.phone}</span>
            </div>

            {/* View Map Button */}
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${service.lat},${service.lng}`,
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
            >
              View Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}