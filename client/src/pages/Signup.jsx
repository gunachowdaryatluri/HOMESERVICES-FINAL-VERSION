import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useSignupMutation } from "../app/api.js";
import { CATS } from "../constants.js";

export default function Signup() {
  const nav = useNavigate();
  const [signup] = useSignupMutation();
  const [f, setF] = useState({ role: "user", name: "", email: "", password: "", confirm: "", category: CATS[0], price: 500, bio: "" });
  const [message, setMessage] = useState("");
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    if (f.password !== f.confirm) return setMessage("Passwords do not match");
    if (f.password.length < 8) return setMessage("Password must be at least 8 characters");
    const data = { name: f.name.trim(), email: f.email.trim().toLowerCase(), password: f.password, confirm: f.confirm };
    if (f.role === "provider") Object.assign(data, { role: "provider", category: f.category, price: f.price, bio: f.bio });
    const res = await signup(data);
    if (res.error) return setMessage(res.error.message || "Signup failed");
    alert("Signup successful. Please login.");
    nav("/login");
  };
  return (
    <Layout>
      <section className="form-area">
        <form className="form-box" onSubmit={submit}>
          <h1>Create Account</h1>
          <label htmlFor="role">Register as</label>
          <select id="role" value={f.role} onChange={set("role")}><option value="user">Customer</option><option value="provider">Service Provider</option></select>
          {f.role === "provider" && <>
            <label htmlFor="category">Service Category</label>
            <select id="category" value={f.category} onChange={set("category")}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
            <label htmlFor="price">Price (₹)</label><input id="price" type="number" min="1" value={f.price} onChange={set("price")} />
            <label htmlFor="bio">About you</label><input id="bio" value={f.bio} onChange={set("bio")} />
          </>}
          <label htmlFor="name">Full Name</label><input id="name" required value={f.name} onChange={set("name")} />
          <label htmlFor="email">Email</label><input id="email" type="email" required value={f.email} onChange={set("email")} />
          <label htmlFor="password">Password (8+ characters)</label><input id="password" type="password" minLength="8" required value={f.password} onChange={set("password")} />
          <label htmlFor="confirm">Confirm Password</label><input id="confirm" type="password" minLength="8" required value={f.confirm} onChange={set("confirm")} />
          <button className="button">Signup</button><p>{message}</p>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </section>
    </Layout>
  );
}
