import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import App from "./App";

import {
  Toaster,
} from "react-hot-toast";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <AuthProvider>

      <Toaster />

      <App />

    </AuthProvider>

  </BrowserRouter>

);