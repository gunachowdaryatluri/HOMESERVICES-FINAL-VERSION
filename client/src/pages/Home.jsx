import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const SERVICES = [["🔧", "Plumbing", "Tap and pipe repairs", 499], ["💡", "Electrical", "Lights and switch repairs", 599], ["🧹", "Cleaning", "Basic home cleaning", 799]];

export default function Home() {
  return (
    <Layout>
      <section className="banner">
        <h1>Home services, made easy.</h1>
        <p>Book trusted help for plumbing, electrical work and cleaning.</p>
        <Link className="button" to="/signup">Get Started</Link>
      </section>
      <div className="title">AVAILABLE SERVICES</div>
      <section className="services" aria-label="Available services">
        {SERVICES.map(([e, n, d, p]) => <article className="card" key={n}><div className="emoji">{e}</div><h3>{n}</h3><p>{d}</p><b>From ₹{p}</b></article>)}
      </section>
    </Layout>
  );
}
