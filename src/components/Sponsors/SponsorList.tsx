"use client";

import React, { useState, useMemo } from "react";

import { MoreVertical } from "lucide-react";
import {
  Sponsor,
  useDeleteSingleSponsorMutation,
  useGetAllSponsorsQuery,
} from "@/redux/features/sponsor/sponsorApi";
import Pagination from "@/lib/Pagination";
// adjust path to your Pagination component

const PAGE_SIZE = 10;

export default function SponsorList() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllSponsorsQuery({});
  const [deleteSponsor] = useDeleteSingleSponsorMutation();

  const sponsors = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sponsors;
    return sponsors.filter(
      (s: Sponsor) =>
        s.sponsorName.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
    );
  }, [sponsors, query]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedSponsors = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sponsor?")) {
      await deleteSponsor(id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-600">
        Sponsor List
      </h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Search listing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
          + Add Sponsor
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2">Restauranter ID</th>
              <th className="px-4 py-2">Sponsor Name</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Sponsor</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedSponsors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No sponsors found.
                </td>
              </tr>
            ) : (
              paginatedSponsors.map((s: Sponsor, i: number) => (
                <tr key={s.id || i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">12345</td>
                  <td className="px-4 py-2">{s.sponsorName}</td>
                  <td className="px-4 py-2">{s.address || "N/A"}</td>
                  <td className="px-4 py-2">017022554477</td>
                  <td className="px-4 py-2">Photography</td>
                  <td className="px-4 py-2 text-right">
                    <div className="relative inline-block text-left">
                      <button className="p-2 rounded hover:bg-gray-100">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                        <button className="block w-full px-3 py-1 text-left text-sm hover:bg-gray-100">
                          Edit
                        </button>
                        <button className="block w-full px-3 py-1 text-left text-sm hover:bg-gray-100">
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(s.id!)}
                          className="block w-full px-3 py-1 text-left text-sm text-red-600 hover:bg-gray-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + PAGE_SIZE, filtered.length)} of{" "}
          {filtered.length} sponsors
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
