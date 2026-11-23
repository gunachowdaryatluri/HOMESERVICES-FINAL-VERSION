import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMessagesQuery, useSendMessageMutation, run } from "../app/api.js";
import { closeChat } from "../app/uiSlice.js";

// Chat for the booking whose id is stored in Redux. Polls the server every 5 seconds.
export default function Chat() {
  const id = useSelector(s => s.ui.chatBookingId);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { data, error } = useGetMessagesQuery(id, { skip: id === null, pollingInterval: 5000 });
  const [send] = useSendMessageMutation();
  if (id === null) return null;
  const submit = async () => { if (text.trim() && await run(send({ id, text }))) setText(""); };
  return (
    <section className="section">
      <h2>Chat (Booking {id})</h2>
      {error ? <p>{error.message}</p> : !data || data.messages.length === 0 ? <p>No messages yet. Say hello!</p>
        : data.messages.map((m, i) => <p key={i}><b>{m.from === data.me ? "You" : m.fromName}:</b> {m.text}</p>)}
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Type a message" style={{ width: "60%" }} />
      <button onClick={submit}>Send</button> <button onClick={() => dispatch(closeChat())}>Close</button>
    </section>
  );
}
