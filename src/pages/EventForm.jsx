import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { CATEGORIES, validateEvent } from "../validators.js";
import { Loading, ErrorBox } from "../components/StatusMessage.jsx";

const EMPTY = { title: "", category: "", date: "", venue: "", capacity: "", description: "" };

export default function EventForm() {
  const { id } = useParams(); // present only in edit mode
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(Boolean(id));
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getEvent(id)
      .then(setValues)
      .catch((e) => setApiError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    const payload = {
      ...values,
      title: values.title.trim(),
      venue: values.venue.trim(),
      capacity: Number(values.capacity),
    };
    try {
      if (id) await api.updateEvent(id, payload);
      else await api.createEvent(payload);
      navigate("/events", {
        state: { flash: { type: "success", text: id ? "Event updated successfully." : "Event created successfully." } },
      });
    } catch (err) {
      setApiError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (apiError && id && !values.id) return <ErrorBox message={apiError} />;

  const field = (name, label, type = "text", extra = {}) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={change}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        {...extra}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="card card-form mx-auto"><div className="card-body">
      <h2 className="page-title mb-3">{id ? "Edit Event" : "Add Event"}</h2>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <form onSubmit={submit} noValidate>
        {field("title", "Event title")}
        <div className="mb-3">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={change}
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>
        <div className="row">
          <div className="col-md-6">{field("date", "Date", "date")}</div>
          <div className="col-md-6">{field("capacity", "Capacity (seats)", "number", { min: 1 })}</div>
        </div>
        {field("venue", "Venue")}
        <div className="mb-3">
          <label className="form-label" htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="form-control"
            value={values.description}
            onChange={change}
          />
        </div>
        <button className="btn btn-primary me-2" type="submit">{id ? "Save changes" : "Create event"}</button>
        <Link className="btn btn-outline-secondary" to="/events">Cancel</Link>
      </form>
    </div></div>
  );
}