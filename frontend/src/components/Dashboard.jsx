import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated.");
      return;
    }
    axios.get("http://127.0.0.1:8000/api/v1/tickets/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTickets(res.data))
    .catch(() => setError("Failed to load tickets."));
  }, []);

  return (
    <div>
      <button onClick={() => {
        localStorage.removeItem("token");
        onLogout();
      }}>Logout</button>
      <h2>Your Tickets</h2>
      {error && <div>{error}</div>}
      <ul>
        {tickets.map(t => <li key={t.id}>{t.description} [{t.status}]</li>)}
      </ul>
    </div>
  );
}
