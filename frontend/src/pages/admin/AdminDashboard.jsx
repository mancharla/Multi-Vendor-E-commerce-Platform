import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    setStats(res.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.total_users,
      icon: "👥",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Vendors",
      value: stats?.total_vendors,
      icon: "🏪",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Customers",
      value: stats?.total_customers,
      icon: "🛍️",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Pending Vendors",
      value: stats?.pending_vendors,
      icon: "⏳",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Products",
      value: stats?.total_products,
      icon: "📦",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Revenue",
      value: `₹${stats?.total_revenue || 0}`,
      icon: "💰",
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor users, vendors, products, orders, and platform revenue.
        </p>
      </div>

      {!stats ? (
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500">{card.title}</p>
                    <h2 className="text-3xl font-extrabold mt-2">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>

              {stats.monthly_stats.length === 0 ? (
                <p className="text-slate-500">No revenue data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthly_stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Monthly Orders</h2>

              {stats.monthly_stats.length === 0 ? (
                <p className="text-slate-500">No order data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthly_stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 mt-8">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Users By Role</h2>

              {stats.users_by_role.length === 0 ? (
                <p className="text-slate-500">No user role data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.users_by_role}
                        dataKey="count"
                        nameKey="role"
                        outerRadius={110}
                        label
                      >
                        {stats.users_by_role.map((entry, index) => (
                          <Cell key={index} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white">
              <h2 className="text-2xl font-bold">Platform Overview</h2>
              <p className="text-slate-300 mt-2">
                Manage vendor approvals, monitor orders, and keep marketplace
                operations smooth.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300 text-sm">Orders</p>
                  <h3 className="text-2xl font-bold">{stats.total_orders}</h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300 text-sm">Pending Vendors</p>
                  <h3 className="text-2xl font-bold">
                    {stats.pending_vendors}
                  </h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300 text-sm">Products</p>
                  <h3 className="text-2xl font-bold">
                    {stats.total_products}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;