import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api, useLogoutMutation } from "../app/api.js";

// Semantic page frame: header + nav, main, footer
export default function Layout({ user, title, children }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const onLogout = async () => {
    await logout();
    dispatch(api.util.resetApiState());   // forget every cached response of the previous user
    nav("/");
  };
  return (
    <>
      <header className="header">
        <div className="logo">Home<span>Services</span></div>
        <nav className="menu">
          {user ? <><span>Hi, {user.name}</span> | <button onClick={onLogout}>Logout</button></>
                : <><Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link></>}
        </nav>
      </header>
      {title && <div className="title">{title}</div>}
      <main>{children}</main>
      <footer className="footer">© HomeServices | SDC Project #59</footer>
    </>
  );
}
