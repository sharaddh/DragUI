import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import toast from "react-hot-toast";

export default function Login() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const [form, setForm] =
    useState({
      adminId: "",
      password: "",
    });

  const submit =
    async (e) => {

      e.preventDefault();

      try {

        await login(
          form.adminId,
          form.password
        );

        toast.success(
          "Login Successful"
        );

        navigate("/");

      } catch {

        toast.error(
          "Invalid Credentials"
        );

      }

    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-black">

      <form
        onSubmit={submit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >

        <h1 className="text-white text-2xl font-bold mb-6">
          DropUI Admin
        </h1>

        <input
          placeholder="Admin ID"
          className="w-full p-3 rounded bg-zinc-800 text-white mb-4"
          value={form.adminId}
          onChange={(e) =>
            setForm({
              ...form,
              adminId:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-zinc-800 text-white mb-4"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          className="w-full bg-white text-black p-3 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}