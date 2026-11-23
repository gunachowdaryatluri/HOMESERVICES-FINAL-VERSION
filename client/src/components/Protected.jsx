import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../app/api.js";
import { home } from "../constants.js";
import Layout from "./Layout.jsx";

// Role guard: asks the server who is logged in (JWT cookie), then shows the page or redirects
export default function Protected({ role, title, children }) {
  const nav = useNavigate();
  const { data, error } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true }); // always re-check the login when a page opens
  const user = data && data.user;
  useEffect(() => {
    if (error) { error.status === "FETCH_ERROR" ? alert(error.message) : nav("/login"); }
    else if (user && user.role !== role) nav(home(user.role));
  }, [error, user]);
  return user && user.role === role ? <Layout user={user} title={title}>{children}</Layout> : <p className="center">Loading...</p>;
}
