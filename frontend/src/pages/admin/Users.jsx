import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  const roleClass = (role) => {
    if (role === "admin") return "bg-red-100 text-red-700";
    if (role === "vendor") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Users</h1>
        <p className="text-slate-500 mt-1">
          View all registered users on the platform.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left text-sm font-bold text-slate-600">ID</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">User</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Email</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Role</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Approved</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">{user.id}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center">
                        👤
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">User Account</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600">{user.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${roleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    {user.is_approved === 1 ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Users;