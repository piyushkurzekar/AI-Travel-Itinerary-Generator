import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from "../api/auth.api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    setUser(res.data.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    setUser(res.data.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
