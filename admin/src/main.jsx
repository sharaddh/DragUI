import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";

import App from "./App";

import {
  Toaster,
} from "react-hot-toast";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <QueryClientProvider client={queryClient}>

    <BrowserRouter>

      <AuthProvider>

        <Toaster />

        <App />

      </AuthProvider>

    </BrowserRouter>

  </QueryClientProvider>

);
