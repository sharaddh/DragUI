/* eslint-disable react-refresh/only-export-components */
// The context object and its useAuth hook intentionally live beside AuthProvider
// so consumers import from a single auth surface.
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../api/axios";

import PropTypes from "prop-types";

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

  const logout = useCallback(
    () => {
      localStorage.removeItem(
        "adminToken"
      );
      setUser(null);
    },
    []
  );

  const fetchProfile =
    useCallback(
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

      },
      [logout]
    );

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

  }, [fetchProfile]);

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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};