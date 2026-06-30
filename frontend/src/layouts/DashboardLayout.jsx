import { Link, useLocation, useNavigate } from "react-router-dom";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = {
    customer: [
      { name: "Dashboard", path: "/customer/dashboard", icon: "🏠" },
      { name: "Products", path: "/customer/products", icon: "🛍️" },
      { name: "Wishlist", path: "/customer/wishlist", icon: "❤️" },
      { name: "Cart", path: "/customer/cart", icon: "🛒" },
      { name: "My Orders", path: "/customer/orders", icon: "📦" },
      { name: "Profile", path: `/${role}/profile`, icon: "👤" },
    ],
    vendor: [
      { name: "Dashboard", path: "/vendor/dashboard", icon: "🏠" },
      { name: "My Products", path: "/vendor/products", icon: "📦" },
      { name: "Add Product", path: "/vendor/add-product", icon: "➕" },
      { name: "Orders", path: "/vendor/orders", icon: "🧾" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { name: "Users", path: "/admin/users", icon: "👥" },
      { name: "Vendors", path: "/admin/vendors", icon: "🏪" },
      { name: "Products", path: "/admin/products", icon: "📦" },
      { name: "Orders", path: "/admin/orders", icon: "🧾" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden md:flex w-72 bg-slate-950 text-white flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-extrabold">
            Market<span className="text-blue-500">Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 capitalize">
            {role} Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems[role].map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-4 mb-4">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-5 md:px-8">
          <div>
            <h2 className="font-bold text-slate-900 capitalize">
              {role} Dashboard
            </h2>
            <p className="text-sm text-slate-500 hidden sm:block">
              Welcome back, {user?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="md:hidden bg-red-600 text-white px-3 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;