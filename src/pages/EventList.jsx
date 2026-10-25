import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api.js";
import { Loading, ErrorBox, Flash } from "../components/StatusMessage.jsx";

export default function EventList() {
  const location = useLocation();
  const [events, setEvents] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(location.state?.flash || null);

  const load = () => {
    setError("");
    Promise.all([api.getEvents(), api.getRegistrations()])
      .then(([ev, reg]) => { setEvents(ev); setRegistrations(reg); })
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const handleDelete = async (event) => {
    const count = registrations.filter((r) => r.eventId === event.id).length;
    const msg = count
      ? `Delete "${event.title}" and its ${count} registration(s)?`
      : `Delete "${event.title}"?`;
    if (!window.confirm(msg)) return;
    try {
      await api.deleteEvent(event.id);
      setFlash({ type: "success", text: `Event "${event.title}" deleted.` });
      load();
    } catch (e) {
      setFlash({ type: "danger", text: e.message });
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!events) return <Loading />;

  const filtered = events.filter((e) =>
    `${e.title} ${e.venue} ${e.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="page-title m-0">Events</h2>
        <Link className="btn btn-primary" to="/events/new">+ Add Event</Link>
      </div>
      <Flash flash={flash} />
      <input
        className="form-control mb-3"
        placeholder="Search by title, venue or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr><th>#</th><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Seats</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted py-4">No events found.</td></tr>
            )}
            {filtered.map((e) => {
              const taken = registrations.filter((r) => r.eventId === e.id).length;
              const full = taken >= e.capacity;
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.category}</td>
                  <td>{e.date}</td>
                  <td>{e.venue}</td>
                  <td>
                    <span className={`badge ${full ? "seat-badge-full" : "bg-success"}`}>
                      {taken}/{e.capacity}{full ? " FULL" : ""}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link className="btn btn-sm btn-outline-primary me-2" to={`/events/${e.id}/edit`}>Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}