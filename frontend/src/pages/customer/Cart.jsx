import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const res = await api.get("/cart/");
    setCartItems(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    await api.put(`/cart/${itemId}`, {
      quantity: Number(quantity),
    });

    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    fetchCart();
  };

  const checkout = async () => {
    setLoading(true);

    try {
      await api.post("/orders/checkout", {
        payment_method: "UPI",
      });

      alert("Checkout completed");
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.detail || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <DashboardLayout role="customer">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">My Cart</h1>
        <p className="text-slate-500 mt-1">
          Review your products before checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">
            Add products to your cart and checkout easily.
          </p>

          <Link
            to="/customer/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold mt-6"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow p-5 flex flex-col md:flex-row gap-5 md:items-center justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={`http://127.0.0.1:8000/${item.product.image}`}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🛍️</span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.product.name}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {item.product.category}
                    </p>
                    <p className="font-bold mt-2">₹{item.product.price}</p>
                    <p className="text-sm text-slate-500">
                      Available Stock: {item.product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="border rounded-xl p-3 w-24 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>

            <div className="flex justify-between mt-5 text-xl font-extrabold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold mt-6 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Checkout with UPI"}
            </button>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Payment is simulated for demo purpose.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Cart;