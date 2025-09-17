 
"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// 👉 Define interface here or import from shared location
export interface Review {
  id: string;
  userName: string;
  reviewTo: string;
  reviewText: string;
  date: string;
  rating: number;
  published: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  onTogglePublish: (id: string, published: boolean) => void;
}

export function ReviewList({ reviews, onTogglePublish }: ReviewListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter reviews by search term
  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (review) =>
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, reviews]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Handle empty filtered state
  if (filteredReviews.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Review</p>
          <h1 className="text-xl font-semibold text-orange-500">All Reviews</h1>
        </div>
        <div className="bg-white rounded-md shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reviews match your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Review</p>
          <h1 className="text-xl font-semibold text-orange-500">All Reviews</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              className="pl-10 rounded-md border-gray-300 focus-visible:ring-orange-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset pagination on search
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-900 text-white uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left font-medium">User Name</th>
                <th className="px-6 py-3 text-left font-medium">Review To</th>
                <th className="px-6 py-3 text-left font-medium">Review Text</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Rating</th>
                <th className="px-6 py-3 text-left font-medium">Publish</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr
                  key={review.id}
                  className="transition-colors hover:bg-orange-50 border-b border-gray-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-gray-900">{review.userName}</td>
                  <td className="px-6 py-4 text-gray-700">{review.reviewTo}</td>
                  <td
                    className="px-6 py-4 text-gray-600 max-w-xs truncate"
                    title={review.reviewText}
                  >
                    {review.reviewText}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{review.date}</td>
                  <td className="px-6 py-4">{renderStars(review.rating)}</td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={review.published}
                      onCheckedChange={(checked) => onTogglePublish(review.id, checked)}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50 hover:text-gray-700"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

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

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 disabled:opacity-50 hover:text-gray-700"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}