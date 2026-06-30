import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { Link } from "react-router-dom";

function Wishlist() {
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    const res = await api.get("/wishlist/");
    setItems(res.data);
  };

  const removeItem = async (wishlistId) => {
    await api.delete(`/wishlist/${wishlistId}`);
    fetchWishlist();
  };

  const addToCart = async (productId) => {
    await api.post("/cart/add", {
      product_id: productId,
      quantity: 1,
    });

    alert("Added to cart");
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <DashboardLayout role="customer">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Wishlist</h1>
        <p className="text-slate-500 mt-1">
          Save products you like and buy them later.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold">Wishlist is empty</h2>
          <p className="text-slate-500 mt-2">
            Add products to wishlist from product details page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"
            >
            <Link to={`/customer/products/${item.product_id}`}>
            <div className="h-48 bg-slate-100 cursor-pointer overflow-hidden">
                {item.product?.image ? (
                <img
                    src={`http://127.0.0.1:8000/${item.product.image}`}
                    alt={item.product.name}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                />
                ) : (
                <div className="h-full flex items-center justify-center text-5xl">
                    🛍️
                </div>
                )}
            </div>
            </Link>

              <div className="p-5">
                <h2 className="font-bold text-lg text-slate-900">
                  {item.product?.name}
                </h2>
                <p className="text-slate-500 text-sm">
                  {item.product?.category}
                </p>

                <p className="text-2xl font-extrabold mt-4">
                  ₹{item.product?.price}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => addToCart(item.product_id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    Add Cart
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-1 bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Wishlist;