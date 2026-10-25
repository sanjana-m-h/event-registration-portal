import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { validateRegistration } from "../validators.js";
import { Loading, ErrorBox } from "../components/StatusMessage.jsx";

const EMPTY = { eventId: "", studentName: "", usn: "", email: "" };

export default function RegistrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const jobs = [api.getEvents(), api.getRegistrations()];
    if (id) jobs.push(api.getRegistration(id));
    Promise.all(jobs)
      .then(([ev, reg, current]) => {
        setEvents(ev);
        setRegistrations(reg);
        if (current) setValues({ ...current, eventId: String(current.eventId) });
      })
      .catch((e) => { setApiError(e.message); setLoadFailed(true); })
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateRegistration(values, events, registrations, id ? Number(id) : null);
    setErrors(found);
    if (Object.keys(found).length) return;
    const payload = {
      eventId: Number(values.eventId),
      studentName: values.studentName.trim(),
      usn: values.usn.trim().toUpperCase(),
      email: values.email.trim().toLowerCase(),
      registeredOn: values.registeredOn || new Date().toISOString().slice(0, 10),
    };
    try {
      if (id) await api.updateRegistration(id, payload);
      else await api.createRegistration(payload);
      navigate("/registrations", {
        state: { flash: { type: "success", text: id ? "Registration updated." : "Student registered successfully." } },
      });
    } catch (err) {
      setApiError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (loadFailed) return <ErrorBox message={apiError} />;

  const input = (name, label, type = "text", placeholder = "") => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={values[name]}
        onChange={change}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="card card-form mx-auto"><div className="card-body">
      <h2 className="page-title mb-3">{id ? "Edit Registration" : "Register Student"}</h2>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <form onSubmit={submit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="eventId">Event</label>
          <select
            id="eventId"
            name="eventId"
            value={values.eventId}
            onChange={change}
            className={`form-select ${errors.eventId ? "is-invalid" : ""}`}
          >
            <option value="">Select an event…</option>
            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title} ({ev.date})</option>)}
          </select>
          {errors.eventId && <div className="invalid-feedback">{errors.eventId}</div>}
        </div>
        {input("studentName", "Student name")}
        {input("usn", "USN", "text", "1BM25CS001")}
        {input("email", "Email", "email", "name@example.com")}
        <button className="btn btn-success me-2" type="submit">{id ? "Save changes" : "Register"}</button>
        <Link className="btn btn-outline-secondary" to="/registrations">Cancel</Link>
      </form>
    </div></div>
  );
}
