import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function ReviewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    const res = await api.get(`/products/${id}`);
    setProduct(res.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/reviews/", {
        product_id: Number(id),
        rating: Number(form.rating),
        comment: form.comment,
      });

      alert("Review submitted successfully");
      navigate(`/customer/products/${id}`);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <DashboardLayout role="customer">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="customer">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Review Product
        </h1>
        <p className="text-slate-500 mt-1">
          Share your experience with this product.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <div className="bg-white rounded-3xl shadow overflow-hidden h-fit">
          <div className="h-80 bg-slate-100">
            {product.image ? (
              <img
                src={`http://127.0.0.1:8000/${product.image}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-6xl">
                🛍️
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="text-blue-600 font-semibold">{product.category}</p>
            <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
            <p className="text-slate-500 mt-2">{product.description}</p>
            <p className="text-2xl font-extrabold mt-4">₹{product.price}</p>
          </div>
        </div>

        <form
          onSubmit={submitReview}
          className="bg-white rounded-3xl shadow p-6 h-fit"
        >
          <h2 className="text-2xl font-bold mb-5">Write Your Review</h2>

          <label className="font-semibold text-sm">Rating</label>
          <select
            className="border rounded-xl p-3 w-full mt-2 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Bad</option>
          </select>

          <label className="font-semibold text-sm">Comment</label>
          <textarea
            className="border rounded-xl p-3 w-full mt-2 min-h-40 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-5 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ReviewProduct;