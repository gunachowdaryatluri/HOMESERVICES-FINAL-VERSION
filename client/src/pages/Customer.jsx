import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProvidersQuery, useGetMyBookingsQuery, useCreateBookingMutation, usePayBookingMutation,
  useReviewBookingMutation, useFileComplaintMutation, run } from "../app/api.js";
import { openChat, showPortfolio } from "../app/uiSlice.js";
import { CATS } from "../constants.js";
import Chat from "../components/Chat.jsx";
import Weather from "../components/Weather.jsx";

const SERVICES = [["🔧", "Plumbing", 499], ["💡", "Electrical", 599], ["🧹", "Cleaning", 799]];

export default function Customer() {
  const dispatch = useDispatch();
  const portfolioEmail = useSelector(s => s.ui.portfolioEmail);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("Vijayawada");

  const { data: pdata } = useGetProvidersQuery({ category: cat, q });
  const { data: bdata } = useGetMyBookingsQuery();
  const [createBooking] = useCreateBookingMutation();
  const [pay] = usePayBookingMutation();
  const [review] = useReviewBookingMutation();
  const [complain] = useFileComplaintMutation();
  const providers = (pdata && pdata.providers) || [];
  const mine = (bdata && bdata.bookings) || [];
  const shown = providers.find(p => p.email === portfolioEmail);

  const book = service => run(createBooking({ service }), service + " booking request submitted!");
  const bookProvider = async email => {
    if (!date) return alert("Please choose an appointment date first.");
    await run(createBooking({ providerEmail: email, date }), "Booking request sent for " + date + "!");
  };
  const rate = async id => {
    const rating = prompt("Rate the provider (1-5):"); if (!rating) return;
    await run(review({ id, rating, comment: prompt("Write a short review:") || "" }), "Thanks for your review!");
  };
  const complaint = async id => {
    const text = prompt("Describe your complaint:"); if (!text) return;
    await run(complain({ bookingId: id, text }), "Complaint submitted.");
  };

  return (
    <>
      <h2 className="center">Choose a service</h2>
      <section className="services">
        {SERVICES.map(([e, n, p]) => (
          <article className="card" key={n}><div className="emoji">{e}</div><h3>{n}</h3><p>From ₹{p}</p><button onClick={() => book(n)}>Book Service</button></article>
        ))}
      </section>

      <section className="section">
        <h2>Find Service Providers</h2>
        <input placeholder="Search providers" value={q} onChange={e => setQ(e.target.value)} />
        <select value={cat} onChange={e => setCat(e.target.value)}><option value="">All categories</option>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        <label> Appointment date: </label><input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={e => setDate(e.target.value)} />
        <label> City: </label><input value={city} onChange={e => setCity(e.target.value)} placeholder="City for weather" />
        <Weather city={city} date={date} />
        <div className="services">
          {providers.length === 0 ? <p>No providers found.</p> : providers.map(p => (
            <article className="card" key={p.email}>
              <h3>{p.name}</h3><b>{p.category} - ₹{p.price}</b>
              <p>{p.reviews ? `★ ${p.rating} (${p.reviews} reviews)` : "No reviews yet"}</p><p>{p.bio}</p>
              <button onClick={() => bookProvider(p.email)}>Book Provider</button> <button onClick={() => dispatch(showPortfolio(p.email))}>View Portfolio</button>
            </article>
          ))}
        </div>
        {shown && <div><h3>Portfolio: {shown.name}</h3>
          {(shown.portfolio || []).length === 0 ? <p>No portfolio items yet.</p> : shown.portfolio.map((i, n) => (
            <article className="booking" key={n}><div><b>{i.title}</b><p>{i.description}</p></div>
              {i.imageUrl && <img src={i.imageUrl} alt={i.title} style={{ height: 80, borderRadius: 6 }} />}</article>))}
        </div>}
      </section>

      <section className="section">
        <h2>My Bookings</h2>
        {mine.length === 0 ? <p>No bookings yet.</p> : mine.map(b => (
          <article className="booking" key={b.id}>
            <div>
              <b>{b.service}</b>
              {b.providerName && <p>Provider: {b.providerName} | Date: {b.date}</p>}
              <p>Booking ID: {b.id}</p>
              <p>Status: {b.status}{b.price ? ` | ₹${b.price} | ${b.paid ? "Paid" : "Unpaid"}` : ""}</p>
              {b.review && <p>Your review: {"★".repeat(b.review.rating)} {b.review.comment}</p>}
            </div>
            <div>
              {b.price && !b.paid && b.status !== "Cancelled" && <button onClick={() => run(pay(b.id), "Payment successful (simulated).")}>Pay ₹{b.price}</button>}
              {b.status === "Completed" && b.providerEmail && !b.review && <button onClick={() => rate(b.id)}>Rate & Review</button>}
              {b.providerEmail && <><button onClick={() => dispatch(openChat(b.id))}>Chat</button><button onClick={() => complaint(b.id)}>Complaint</button></>}
            </div>
          </article>
        ))}
      </section>
      <Chat />
    </>
  );
}
