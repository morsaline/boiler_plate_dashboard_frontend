/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Pagination from "@/lib/Pagination";
import StaticOrdersStats from "./StaticOrderStats";
import { useGetOrdersQuery } from "@/redux/features/order/orderApi";

const OrderPage = () => {
  // ------------------------
  // Backend query params
  // ------------------------
  const [statusFilter, setStatusFilter] = useState(""); // backend filter
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 7;

  // ------------------------
  // Frontend search
  // ------------------------
  const [search, setSearch] = useState("");

  // ------------------------
  // Call API (only page, limit, status)
  // ------------------------
  const { data, isLoading } = useGetOrdersQuery({
    page: currentPage,
    limit,
    status: statusFilter,
  });

  // Backend Data
  const orders = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // ------------------------
  // FRONTEND SEARCH
  // ------------------------
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orders;

    return orders.filter(
      (order: any) =>
        order.id.toLowerCase().includes(q) ||
        order.itemName.toLowerCase().includes(q) ||
        order.storeName.toLowerCase().includes(q)
    );
  }, [search, orders]);

  return (
    <div className="w-full border border-gray-200 p-6 bg-white rounded-xl shadow-md">
      <StaticOrdersStats />

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        {/* 🔍 FRONTEND SEARCH */}
        <input
          type="text"
          placeholder="Search by name, store or ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="border border-gray-300 min-w-4xl text-base rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7f5]"
        />

        {/* 🔥 BACKEND FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 text-base rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">All Orders</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-[#b2f7f5] text-gray-700 text-lg">
              <th className="py-3 px-5">Order ID</th>
              <th className="py-3 px-5">Item Name</th>
              <th className="py-3 px-5">Store Name</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Qty</th>
              <th className="py-3 px-5">Price</th>
              <th className="py-3 px-5">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-5">{order.id}</td>
                  <td className="py-3 px-5">{order.itemName}</td>
                  <td className="py-3 px-5">{order.storeName}</td>
                  <td className="py-3 px-5">{order.date}</td>
                  <td className="py-3 px-5">{order.quantity}</td>
                  <td className="py-3 px-5">{order.price}</td>

                  <td
                    className={`py-3 px-5 font-semibold ${
                      order.status === "complete"
                        ? "text-green-600"
                        : order.status === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Backend Controlled) */}
      <div className="mt-6 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default OrderPage;
