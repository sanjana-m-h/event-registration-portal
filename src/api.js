// Connectivity layer: every call to the JSON Server REST API goes through here.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  // Events
  getEvents: () => request("/events"),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (data) => request("/events", send("POST", data)),
  updateEvent: (id, data) => request(`/events/${id}`, send("PUT", data)),
  // _dependent removes the event's registrations too (no orphan records)
  deleteEvent: (id) =>
    request(`/events/${id}?_dependent=registrations`, { method: "DELETE" }),

  // Registrations
  getRegistrations: () => request("/registrations"),
  getRegistration: (id) => request(`/registrations/${id}`),
  createRegistration: (data) => request("/registrations", send("POST", data)),
  updateRegistration: (id, data) =>
    request(`/registrations/${id}`, send("PUT", data)),
  deleteRegistration: (id) =>
    request(`/registrations/${id}`, { method: "DELETE" }),
};