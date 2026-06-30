import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

function Profile({ role }) {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
  });

  const fetchProfile = async () => {
    const res = await api.get("/profile/me");
    setProfile(res.data);
    setName(res.data.name);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/profile/me", { name });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update profile");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/profile/change-password", passwordForm);

      alert("Password changed successfully");

      setPasswordForm({
        old_password: "",
        new_password: "",
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to change password");
    }
  };

  if (!profile) {
    return (
      <DashboardLayout role={role}>
        <p>Loading profile...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">
          View and update your account information.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">User ID</p>
              <p className="font-bold">{profile.id}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-bold">{profile.email}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Role</p>
              <p className="font-bold capitalize">{profile.role}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Approval Status</p>
              <p className="font-bold">
                {profile.is_approved === 1 ? "Approved" : "Pending Approval"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={updateProfile}
            className="bg-white rounded-3xl shadow p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="font-semibold text-sm">Name</label>
            <input
              className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-5">
              Save Changes
            </button>
          </form>

          <form
            onSubmit={changePassword}
            className="bg-white rounded-3xl shadow p-6"
          >
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <label className="font-semibold text-sm">Old Password</label>
            <input
              className="border rounded-xl p-3 w-full mt-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  old_password: e.target.value,
                })
              }
              required
            />

            <label className="font-semibold text-sm">New Password</label>
            <input
              className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password: e.target.value,
                })
              }
              required
            />

            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold mt-5">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;