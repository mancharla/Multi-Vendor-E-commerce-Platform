import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function CustomerDashboard() {
  return (
    <DashboardLayout role="customer">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Customer Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Browse products, manage cart, and track your orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/customer/products"
          className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition"
        >
          <div className="text-4xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold">Browse Products</h2>
          <p className="text-slate-500 mt-2">
            Explore products from multiple vendors.
          </p>
        </Link>

        <Link
          to="/customer/cart"
          className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition"
        >
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-xl font-bold">My Cart</h2>
          <p className="text-slate-500 mt-2">
            Review products before checkout.
          </p>
        </Link>

        <Link
          to="/customer/orders"
          className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition"
        >
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold">My Orders</h2>
          <p className="text-slate-500 mt-2">
            Track order status and purchase history.
          </p>
        </Link>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
        <h2 className="text-2xl font-bold">Start Shopping Today</h2>
        <p className="mt-2 text-blue-100">
          Find the best products from trusted vendors.
        </p>

        <Link
          to="/customer/products"
          className="inline-block mt-5 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold"
        >
          Explore Products
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;