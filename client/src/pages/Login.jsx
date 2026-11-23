import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useLoginMutation } from "../app/api.js";
import { home } from "../constants.js";

export default function Login() {
  const nav = useNavigate();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const submit = async e => {
    e.preventDefault();
    const res = await login({ email: email.trim().toLowerCase(), password });
    if (!res.error) return nav(home(res.data.user.role));
    const { status, message: m } = res.error;
    status === "FETCH_ERROR" || status === 429 ? setMessage(m) : setMessage("Invalid email or password");
  };
  return (
    <Layout>
      <section className="form-area">
        <form className="form-box" onSubmit={submit}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label><input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button className="button">Login</button>
          <p>{message}</p>
         
          <p>New user? <Link to="/signup">Signup</Link></p>
        </form>
      </section>
    </Layout>
  );
}
