import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProviderSummaryQuery, useRespondBookingMutation, useSaveProfileMutation,
  useAddPortfolioMutation, useRemovePortfolioMutation, run } from "../app/api.js";
import { openChat } from "../app/uiSlice.js";
import { CATS } from "../constants.js";
import Chat from "../components/Chat.jsx";

export default function Provider() {
  const dispatch = useDispatch();
  const { data: d } = useGetProviderSummaryQuery();
  const [respond] = useRespondBookingMutation();
  const [saveProfile] = useSaveProfileMutation();
  const [addPortfolio] = useAddPortfolioMutation();
  const [removePortfolio] = useRemovePortfolioMutation();
  const [form, setForm] = useState({ category: CATS[0], price: "", bio: "", available: true });
  const [item, setItem] = useState({ title: "", description: "", imageUrl: "" });
  const profile = d && d.profile;
  useEffect(() => { if (profile) setForm({ category: profile.category, price: profile.price, bio: profile.bio, available: profile.available }); }, [profile]);

  if (!d) return <p className="center">Loading...</p>;
  const add = async () => { if (await run(addPortfolio(item))) setItem({ title: "", description: "", imageUrl: "" }); };
  return (
    <>
      <section className="section">
        <p>{profile.verified ? "Verified provider" : "Awaiting admin verification (you are not listed to customers yet)"}</p>
        <h2>Earnings Dashboard</h2>
        <div className="stats">
          <div className="stat"><h2>₹{d.earnings}</h2>Earned (paid)</div>
          <div className="stat"><h2>₹{d.pending}</h2>Pending payment</div>
          <div className="stat"><h2>{d.bookings.length}</h2>Bookings</div>
          <div className="stat"><h2>{d.rating ? d.rating + " ★" : "-"}</h2>Rating</div>
        </div>

        <h2>My Profile</h2>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        <input type="number" min="1" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="About you" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <label><input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} /> Available</label>
        <button onClick={() => run(saveProfile(form), "Profile saved.")}>Save Profile</button>

        <h2>My Portfolio</h2>
        <input placeholder="Project title" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} />
        <input placeholder="Short description" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })} />
        <input placeholder="Image link (optional)" value={item.imageUrl} onChange={e => setItem({ ...item, imageUrl: e.target.value })} />
        <button onClick={add}>Add Item</button>
        {profile.portfolio.length === 0 ? <p>No portfolio items yet.</p> : profile.portfolio.map((i, n) => (
          <article className="booking" key={n}><div><b>{i.title}</b><p>{i.description}</p></div>
            {i.imageUrl && <img src={i.imageUrl} alt={i.title} style={{ height: 70, borderRadius: 6 }} />}
            <button onClick={() => run(removePortfolio(n))}>Remove</button></article>
        ))}

        <h2>Booking Requests</h2>
        {d.bookings.length === 0 ? <p>No bookings yet.</p> : d.bookings.map(b => (
          <article className="booking" key={b.id}>
            <div><b>{b.service}</b><p>Customer: {b.name} ({b.email})</p><p>Date: {b.date} | ₹{b.price} | {b.paid ? "Paid" : "Unpaid"}</p><p>Status: {b.status}</p></div>
            <div>
              {b.status === "Pending" && <><button onClick={() => run(respond({ id: b.id, status: "Confirmed" }))}>Accept</button><button onClick={() => run(respond({ id: b.id, status: "Cancelled" }))}>Reject</button></>}
              {b.status === "Confirmed" && <button onClick={() => run(respond({ id: b.id, status: "In Progress" }))}>Start Work</button>}
              {b.status === "In Progress" && <button onClick={() => run(respond({ id: b.id, status: "Completed" }))}>Mark Completed</button>}
              <button onClick={() => dispatch(openChat(b.id))}>Chat</button>
            </div>
          </article>
        ))}

        <h2>Customer Feedback</h2>
        {d.reviews.length === 0 ? <p>No reviews yet.</p> : d.reviews.map((v, n) => <article className="booking" key={n}><b>{"★".repeat(v.rating)}</b><span>{v.comment} - {v.customer}</span></article>)}
      </section>
      <Chat />
    </>
  );
}
