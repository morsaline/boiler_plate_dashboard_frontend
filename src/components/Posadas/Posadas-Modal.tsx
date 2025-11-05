"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PosadasData } from "@/redux/features/posadas/posadasApi";
import {
  BedDouble,
  Bath,
  Car,
  Wifi,
  Utensils,
  X,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface PosadasModalProps {
  posadas: PosadasData;
  onClose: () => void;
}

export function PosadasModal({ posadas, onClose }: PosadasModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-10 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
        <CardContent className="p-0">
          <div className="relative">
            {/* Close Button */}
            <Button
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white shadow hover:bg-gray-100"
            >
              <X className="h-10 w-10 text-red-500 text-2xl" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Left Column - Images */}
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden relative">
                  <Image
                    src={posadas.posadaImage || "/placeholder.svg"}
                    alt={posadas.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {posadas.rooms.slice(0, 3).map((room, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md overflow-hidden relative"
                    >
                      <Image
                        src={room.roomPictures[0] || "/placeholder.svg"}
                        alt={room.roomName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground">
                  {posadas.name}
                </h2>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Details
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {posadas.description}
                  </p>
                </div>

                {/* Room Items styled as cards */}
                <div className="space-y-4">
                  {posadas?.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-4 bg-white shadow rounded-lg p-4"
                    >
                      {/* ✅ Next.js Image */}
                      <div className="relative w-32 h-24">
                        <Image
                          src={room.roomPictures[0]}
                          alt={room.roomName}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, 200px"
                        />
                      </div>

                      {/* Room Details */}
                      <div className="flex flex-col justify-center">
                        <h2 className="text-lg font-semibold">
                          {room.roomName}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <BedDouble size={16} /> {room.beds} Rooms
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath size={16} /> {room.washrooms} Washroom
                          </span>

                          {/* Conditionally render features */}
                          {room.parking && (
                            <span className="flex items-center gap-1">
                              <Car size={16} /> Parking
                            </span>
                          )}
                          {room.breakfast && (
                            <span className="flex items-center gap-1">
                              <Utensils size={16} /> Breakfast Included
                            </span>
                          )}
                          {room.wifi && (
                            <span className="flex items-center gap-1">
                              <Wifi size={16} /> Wifi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold mb-2">Contact Info</h4>
                  <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{posadas.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{posadas.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{posadas.address || "No address provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
