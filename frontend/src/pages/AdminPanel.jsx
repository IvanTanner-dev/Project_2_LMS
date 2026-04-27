import React, { useState, useEffect } from "react";
import api from "../api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use the correct admin users endpoint
      const response = await api.get("/api/admin/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      // Fallback/Mock data if endpoint doesn't exist yet
      setUsers([
        {
          id: 1,
          username: "teacher_joe",
          email: "joe@example.com",
          role: "teacher",
          first_name: "Joe",
          last_name: "Teacher",
        },
        {
          id: 2,
          username: "student_ann",
          email: "ann@example.com",
          role: "student",
          first_name: "Ann",
          last_name: "Student",
        },
        {
          id: 3,
          username: "admin_user",
          email: "admin@example.com",
          role: "admin",
          first_name: "Admin",
          last_name: "User",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.delete(`/api/users/${userId}/`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to remove user. (Mock: removed from UI only)");
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Admin Control Center
          </h1>
          <p className="text-slate-500 font-medium">
            Manage platform users and roles.
          </p>
        </div>
        <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
          + Add New User
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or username..."
            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "admin", "teacher", "student"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filterRole === role
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-slate-400">
                          @{user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "teacher"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label={`Edit ${user.username}`}
                        title="Edit User"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${user.username}`}
                        title="Remove User"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && !loading && (
          <div className="py-20 text-center text-slate-400 font-medium">
            No users found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
