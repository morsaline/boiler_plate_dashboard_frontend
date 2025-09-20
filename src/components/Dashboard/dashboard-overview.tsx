"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/Dashboard/revenue-chart";
import { Users, UserCheck, Home, Coffee } from "lucide-react";
import UserListTable from "./user-list-table";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import TableSkeleton from "@/lib/Loader";

export function DashboardOverview() {
  const { data , isLoading} = useGetDashboardStatsQuery();

  const statsData = data?.data
    ? [
        {
          title: "Total Users",
          value: data.data.totalUsers,
          icon: Users,
          iconColor: "text-blue-900",
          bgColor: "bg-blue-100",
        },
        {
          title: "Total Sponsors",
          value: data.data.totalSponsors,
          icon: UserCheck,
          iconColor: "text-orange-500",
          bgColor: "bg-orange-100",
        },
        {
          title: "Total Restaurants",
          value: data.data.totalRestaurants,
          icon: Home,
          iconColor: "text-green-700",
          bgColor: "bg-green-100",
        },
        {
          title: "Total Bars",
          value: data.data.totalBars,
          icon: Coffee,
          iconColor: "text-purple-700",
          bgColor: "bg-purple-100",
        },
        {
          title: "Total Hotels",
          value: data.data.totalHotels,
          icon: Home,
          iconColor: "text-red-600",
          bgColor: "bg-red-100",
        },
        {
          title: "Total Visitors",
          value: data.data.totalVisitors,
          icon: Users,
          iconColor: "text-yellow-700",
          bgColor: "bg-yellow-100",
        },
      ]
    : [];


if(isLoading){
  return <TableSkeleton/>
}

  console.log(data, "all the dashboard data");

  return (
    <div className="space-y-6 p-6 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-md text-gray-500 mb-1">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-full">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-white rounded-xl border py-4 shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="bg-white rounded-xl border py-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-500">
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={data?.data.last7DaysVisitors || []} />
        </CardContent>
      </Card>

      {/* User List */}
      <Card className="bg-white rounded-xl border py-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-orange-500">
            Latest Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UserListTable />
        </CardContent>
      </Card>
    </div>
  );
}
