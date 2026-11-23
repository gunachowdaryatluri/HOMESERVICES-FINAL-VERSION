import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Protected from "./components/Protected.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Customer from "./pages/Customer.jsx";
import Provider from "./pages/Provider.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer" element={<Protected role="user" title="USER MODULE"><Customer /></Protected>} />
      <Route path="/provider" element={<Protected role="provider" title="PROVIDER MODULE"><Provider /></Protected>} />
      <Route path="/admin" element={<Protected role="admin" title="ADMIN MODULE"><Admin /></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
