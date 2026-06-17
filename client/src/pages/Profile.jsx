import { useState } from "react";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

        <div className="card">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl uppercase">
                {user.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <User size={16} className="text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail size={16} className="text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar size={16} className="text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-gray-700">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
