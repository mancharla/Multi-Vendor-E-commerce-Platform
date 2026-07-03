import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount_type: "flat",
    discount_value: "",
    min_order_amount: "",
  });

  const fetchCoupons = async () => {
    const res = await api.get("/coupons/");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createCoupon = async (e) => {
    e.preventDefault();

    try {
      await api.post("/coupons/", {
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_amount: Number(form.min_order_amount || 0),
      });

      alert("Coupon created successfully");

      setForm({
        code: "",
        discount_type: "flat",
        discount_value: "",
        min_order_amount: "",
      });

      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.message || "Failed to create coupon");
    }
  };

  const toggleCoupon = async (id) => {
  try {
    await api.put(`/coupons/${id}/toggle`);
    fetchCoupons();
  } catch (err) {
    alert(err.response?.data?.detail || "Failed");
  }
};
  const deleteCoupon = async (id) => {
  if (!confirm("Delete this coupon permanently?")) return;

  try {
    await api.delete(`/coupons/${id}`);
    alert("Coupon deleted");
    fetchCoupons();
  } catch (err) {
    alert(err.response?.data?.detail || "Failed to delete coupon");
  }
};

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Coupons</h1>
        <p className="text-slate-500 mt-1">
          Create and manage discount coupons.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <form
          onSubmit={createCoupon}
          className="bg-white rounded-3xl shadow p-6 h-fit"
        >
          <h2 className="text-xl font-bold mb-5">Create Coupon</h2>

          <label className="font-semibold text-sm">Coupon Code</label>
          <input
            className="border rounded-xl p-3 w-full mt-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SAVE100"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />

          <label className="font-semibold text-sm">Discount Type</label>
          <select
            className="border rounded-xl p-3 w-full mt-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.discount_type}
            onChange={(e) =>
              setForm({ ...form, discount_type: e.target.value })
            }
          >
            <option value="flat">Flat Amount</option>
            <option value="percentage">Percentage</option>
          </select>

          <label className="font-semibold text-sm">Discount Value</label>
          <input
            className="border rounded-xl p-3 w-full mt-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="100"
            value={form.discount_value}
            onChange={(e) =>
              setForm({ ...form, discount_value: e.target.value })
            }
            required
          />

          <label className="font-semibold text-sm">Minimum Order Amount</label>
          <input
            className="border rounded-xl p-3 w-full mt-2 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="299"
            value={form.min_order_amount}
            onChange={(e) =>
              setForm({ ...form, min_order_amount: e.target.value })
            }
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
            Create Coupon
          </button>
        </form>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Coupons</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Code
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Type
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Value
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Min Order
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-bold">{coupon.code}</td>

                    <td className="p-4 capitalize">{coupon.discount_type}</td>

                    <td className="p-4">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value}`}
                    </td>

                    <td className="p-4">₹{coupon.min_order_amount}</td>

                    <td className="p-4">
                      {coupon.is_active ? (
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                    <div className="flex gap-2">
                        <button
                        onClick={() => toggleCoupon(coupon.id)}
                        className={`px-4 py-2 rounded-xl font-semibold ${
                            coupon.is_active
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"
                        }`}
                        >
                        {coupon.is_active ? "Deactivate" : "Activate"}
                        </button>
                        

                        <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold hover:bg-red-600 hover:text-white"
                        >
                        Delete
                        </button>
                    </div>
                    </td>
                  </tr>
                ))}

                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No coupons created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Coupons;