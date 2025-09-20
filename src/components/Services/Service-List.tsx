 
"use client"

import { useState, useMemo } from "react"
import { Search, MoreVertical, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

// 🔼 Make sure this matches exactly
export interface Service {
  id: string
  serviceName: string
  category: string
  address: string
  lat: number
  lng: number
  averageRating: number
  phone: string
  facilities: string[]
  images: string[]
  createdAt: string
  updatedAt: string
  distance?: number
  name: string
  image: string
}

interface ServiceListProps {
  services: Service[]
  onAddNew: () => void
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
  onViewDetails: (service: Service) => void
}

export function ServiceList({ services, onAddNew, onEdit, onDelete, onViewDetails }: ServiceListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const itemsPerPage = 10

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.phone.includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, services])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = filteredServices.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1)

  const openDeleteModal = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedServiceId(null)
  }

  const confirmDelete = () => {
    if (selectedServiceId) {
      onDelete(selectedServiceId)
      closeModal()
    }
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i)
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i)
      }
    }
    return pages
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Services List</p>
          <h1 className="text-xl font-semibold text-orange-500">Services List</h1>
        </div>

        {/* Search + Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              className="pl-10 rounded-md border-gray-300"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <Button
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            + Add Service
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 hover:bg-gray-900">
                <TableHead className="text-white font-medium">ID</TableHead>
                <TableHead className="text-white font-medium">Name</TableHead>
                <TableHead className="text-white font-medium">Location</TableHead>
                <TableHead className="text-white font-medium">Phone</TableHead>
                <TableHead className="text-white font-medium">Category</TableHead>
                <TableHead className="text-white font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.length > 0 ? (
                currentServices.map((service, index) => (
                  <TableRow key={service.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{service.serviceName}</TableCell>
                    <TableCell>{service.address}</TableCell>
                    <TableCell>{service.phone}</TableCell>
                    <TableCell>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        {service.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => onEdit(service)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewDetails(service)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(service.id)}
                            className="cursor-pointer text-red-500 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {currentServices.length > 0 ? (
            currentServices.map((service) => (
              <Card key={service.id} className="shadow border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{service.serviceName}</h3>
                      <p className="text-sm text-gray-500">ID: {service.id.slice(-4)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => onEdit(service)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDetails(service)} className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(service.id)}
                          className="cursor-pointer text-red-500 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <p className="text-sm">{service.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <p className="text-sm">{service.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs ml-2">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow border border-gray-200">
              <CardContent className="p-8 text-center text-gray-500">No services found.</CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length}{" "}
            services
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  className={
                    currentPage === pageNum
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <div className="sm:hidden text-sm text-gray-600 px-2">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg text-center font-semibold mb-4">Do you want to remove?</h2>
            <div className="flex justify-around">
              <Button variant="ghost" onClick={closeModal} className="text-[#FF6203]">
                No
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
