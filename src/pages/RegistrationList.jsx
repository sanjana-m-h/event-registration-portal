import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api.js";
import { Loading, ErrorBox, Flash } from "../components/StatusMessage.jsx";

export default function RegistrationList() {
  const location = useLocation();
  const [events, setEvents] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(location.state?.flash || null);

  const load = () => {
    setError("");
    Promise.all([api.getEvents(), api.getRegistrations()])
      .then(([ev, reg]) => { setEvents(ev); setRegistrations(reg); })
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const handleDelete = async (r) => {
    if (!window.confirm(`Cancel registration of ${r.studentName}?`)) return;
    try {
      await api.deleteRegistration(r.id);
      setFlash({ type: "success", text: "Registration cancelled." });
      load();
    } catch (e) {
      setFlash({ type: "danger", text: e.message });
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!events) return <Loading />;

  const titleOf = (id) => events.find((e) => e.id === id)?.title ?? "Unknown event";
  const rows = registrations.filter((r) => !eventFilter || r.eventId === Number(eventFilter));

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="page-title m-0">Registrations</h2>
        <Link className="btn btn-success" to="/registrations/new">+ Register Student</Link>
      </div>
      <Flash flash={flash} />
      <select
        className="form-select mb-3"
        value={eventFilter}
        onChange={(e) => setEventFilter(e.target.value)}
      >
        <option value="">All events</option>
        {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
      </select>
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr><th>#</th><th>Student</th><th>USN</th><th>Email</th><th>Event</th><th>Registered on</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted py-4">No registrations found.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.studentName}</td>
                <td>{r.usn}</td>
                <td>{r.email}</td>
                <td>{titleOf(r.eventId)}</td>
                <td>{r.registeredOn}</td>
                <td className="text-end text-nowrap">
                  <Link className="btn btn-sm btn-outline-primary me-2" to={`/registrations/${r.id}/edit`}>Edit</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}