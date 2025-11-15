"use client";

import { useGetOrdersQuery } from "@/redux/features/order/orderApi";
import React from "react";

const StaticOrdersStats = () => {
  const { data, isLoading } = useGetOrdersQuery({});

  console.log(data);
  const stats = data?.stats || {};
  console.log(stats);

  return (
    <div className=" my-5">
      <h1 className="text-xl font-bold">Orders Manageement</h1>

      <div className="flex gap-3 w-full mt-3">
        {/* Total Orders */}
        <div className="border border-gray-200 rounded-md px-6 py-3 w-full text-center bg-[#b2f7f5]">
          <p className="text-gray-700 text-sm font-bold">Total Orders</p>
          <p className="text-gray-900 font-semibold text-lg mt-1">
            {isLoading ? "..." : stats.total}
          </p>
        </div>

        {/* Completed */}
        <div className="border border-gray-200 rounded-md px-6 py-3 w-full text-center bg-[#b2f7f5]">
          <p className="text-gray-700 text-sm font-bold">Completed</p>
          <p className="text-gray-900 font-semibold text-lg mt-1">
            {isLoading ? "..." : stats.completed}
          </p>
        </div>

        {/* Pending */}
        <div className="border border-gray-200 rounded-md px-6 py-3 w-full text-center bg-[#b2f7f5]">
          <p className="text-gray-700 text-sm font-bold">Pending</p>
          <p className="text-gray-900 font-semibold text-lg mt-1">
            {isLoading ? "..." : stats.pending}
          </p>
        </div>

        {/* Cancelled */}
        <div className="border border-gray-200 rounded-md px-6 py-3 w-full text-center bg-[#b2f7f5]">
          <p className="text-gray-700 text-sm font-bold">Cancelled</p>
          <p className="text-gray-900 font-semibold text-lg mt-1">
            {isLoading ? "..." : stats.canceled}
          </p>
        </div>

        {/* Active (Confirmed) */}
        <div className="border border-gray-200 rounded-md px-6 py-3 w-full text-center bg-[#b2f7f5]">
          <p className="text-gray-700 text-sm font-bold">Active</p>
          <p className="text-gray-900 font-semibold text-lg mt-1">
            {isLoading ? "..." : stats.confirmed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaticOrdersStats;
