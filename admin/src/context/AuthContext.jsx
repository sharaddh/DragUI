import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const login = async (
    adminId,
    password
  ) => {

    const res =
      await api.post(
        "/admin-auth/login",
        {
          adminId,
          password,
        }
      );

    localStorage.setItem(
      "adminToken",
      res.data.token
    );

    setUser(res.data.admin);

    return res.data;
  };

  const logout = () => {

    localStorage.removeItem(
      "adminToken"
    );

    setUser(null);
  };

  const fetchProfile =
    async () => {

      try {

        const res =
          await api.get(
            "/admin-auth/profile"
          );

        setUser(
          res.data.admin
        );

      } catch {

        logout();

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    const token =
      localStorage.getItem(
        "adminToken"
      );

    if (token) {

      fetchProfile();

    } else {

      setLoading(false);

    }

  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};

export const useAuth =
() =>
  useContext(AuthContext);