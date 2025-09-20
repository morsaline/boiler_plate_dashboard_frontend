"use client"

// import { Restaurant } from "@/app/(DashboardLayout)/dashboard/restaurants/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Star, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { Restaurant } from "./Restaurant-From"

interface RestaurantModalProps {
  restaurant: Restaurant
  onClose: () => void
}

export function RestaurantModal({ restaurant, onClose }: RestaurantModalProps) {
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
                    src={restaurant.productImage || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {restaurant.menuItems.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md overflow-hidden relative"
                    >
                      <Image
                        src={item.picture || "/placeholder.svg"}
                        alt={item.name}
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
                  {restaurant.name}
                </h2>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Details</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {restaurant.description}
                  </p>
                </div>

                {/* Menu Items styled as cards */}
                <div className="space-y-4">
                  {restaurant.menuItems.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition"
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span>(2,395 reviews)</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.itemG1 && (
                            <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">
                              {item.itemG1}
                            </span>
                          )}
                          {item.itemG2 && (
                            <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">
                              {item.itemG2}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {item.price}
                        </p>
                      </div>

                      <div className="w-20 h-20 relative rounded-lg overflow-hidden ml-4">
                        <Image
                          src={item.picture || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-primary cursor-pointer hover:underline">
                    See More
                  </p>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold mb-2">Contact Info</h4>
                  <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{restaurant.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{restaurant.address || "No address provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
