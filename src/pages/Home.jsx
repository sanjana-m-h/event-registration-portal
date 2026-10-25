import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Loading, ErrorBox } from "../components/StatusMessage.jsx";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    Promise.all([api.getEvents(), api.getRegistrations()])
      .then(([events, registrations]) => setData({ events, registrations }))
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <Loading />;

  const { events, registrations } = data;
  const totalSeats = events.reduce((sum, e) => sum + e.capacity, 0);
  const stats = [
    { label: "Events", value: events.length },
    { label: "Registrations", value: registrations.length },
    { label: "Seats still open", value: totalSeats - registrations.length },
  ];

  return (
    <>
      <h1 className="page-title mb-1">Campus Event Registration Portal</h1>
      <p className="text-muted">
        Create campus events and register students, with seat limits tracked automatically.
      </p>
      <div className="row g-3 my-3">
        {stats.map((s) => (
          <div className="col-12 col-md-4" key={s.label}>
            <div className="card stat-card"><div className="card-body">
              <div className="text-muted">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div></div>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Link className="btn btn-primary" to="/events/new">+ Add Event</Link>
        <Link className="btn btn-outline-primary" to="/events">Manage Events</Link>
        <Link className="btn btn-success" to="/registrations/new">+ Register Student</Link>
        <Link className="btn btn-outline-success" to="/registrations">View Registrations</Link>
      </div>
    </>
  );
}