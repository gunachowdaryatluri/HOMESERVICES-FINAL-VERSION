import React from "react";
import { useGetAdminSummaryQuery, useSetBookingStatusMutation, useVerifyProviderMutation, useResolveComplaintMutation, run } from "../app/api.js";
import { STATUSES } from "../constants.js";

export default function Admin() {
  const { data: d } = useGetAdminSummaryQuery();
  const [setStatus] = useSetBookingStatusMutation();
  const [verify] = useVerifyProviderMutation();
  const [resolve] = useResolveComplaintMutation();

  const report = async () => {
    const res = await fetch("/api/admin/report", { credentials: "same-origin" });
    if (!res.ok) return alert("Could not generate report");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(await res.blob()); a.download = "bookings-report.csv"; a.click();
  };

  if (!d) return <p className="center">Loading...</p>;
  const customers = d.users.filter(u => u.role === "user");
  const providers = d.users.filter(u => u.role === "provider");
  return (
    <section className="section">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat"><h2>{d.bookings.length}</h2>Total Bookings</div>
        <div className="stat"><h2>{customers.length}</h2>Registered Users</div>
        <div className="stat"><h2>{providers.length}</h2>Providers</div>
        <div className="stat"><h2>₹{d.revenue}</h2>Revenue (paid)</div>
        <div className="stat"><h2>{d.complaints.filter(c => c.status === "Open").length}</h2>Open Complaints</div>
      </div>

      <button onClick={report}>Download Bookings Report (CSV)</button>
      <h2>Manage Bookings</h2>
      {d.bookings.length === 0 ? <p>No bookings yet.</p> : d.bookings.map(b => (
        <article className="booking" key={b.id}>
          <div>
            <b>{b.service}</b><p>Customer: {b.name}</p>
            {b.providerName && <p>Provider: {b.providerName} | {b.date} | ₹{b.price} | {b.paid ? "Paid" : "Unpaid"}</p>}
            <p>Booking ID: {b.id}</p><p>Status: {b.status}</p>
          </div>
          <select value={b.status} onChange={e => run(setStatus({ id: b.id, status: e.target.value }))}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </article>
      ))}

      <h2>Service Providers</h2>
      {providers.length === 0 ? <p>No providers yet.</p> : providers.map(p => (
        <article className="booking" key={p.email}>
          <div><b>{p.name}</b><p>{p.category} | ₹{p.price} | {p.email}</p><p>{p.verified ? "Verified" : "Not verified"}</p></div>
          <button onClick={() => run(verify({ email: p.email, verified: !p.verified }))}>{p.verified ? "Revoke" : "Verify"}</button>
        </article>
      ))}

      <h2>Customer Complaints</h2>
      {d.complaints.length === 0 ? <p>No complaints.</p> : d.complaints.map(c => (
        <article className="booking" key={c.id}>
          <div><b>{c.name}</b><p>{c.text}</p><p>Booking: {c.bookingId || "-"} | {c.status}</p></div>
          {c.status === "Open" && <button onClick={() => run(resolve(c.id))}>Mark Resolved</button>}
        </article>
      ))}

      <h2>Registered Users</h2>
      {customers.length === 0 ? <p>No registered users yet.</p> : customers.map(u => <article className="booking" key={u.email}><b>{u.name}</b><span>{u.email}</span></article>)}
    </section>
  );
}
