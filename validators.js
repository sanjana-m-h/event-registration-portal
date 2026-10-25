// Pure validation functions (easy to unit-test, no React needed).
export const CATEGORIES = ["Technical", "Workshop", "Cultural", "Sports & Games"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USN_RE = /^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$/; // e.g. 1BM25CS001

export function validateEvent(values) {
  const errors = {};
  if (!values.title || values.title.trim().length < 3)
    errors.title = "Title is required (minimum 3 characters).";
  if (!values.category || !CATEGORIES.includes(values.category))
    errors.category = "Please choose a category.";
  if (!values.date) errors.date = "Event date is required.";
  if (!values.venue || !values.venue.trim()) errors.venue = "Venue is required.";
  const cap = Number(values.capacity);
  if (!Number.isInteger(cap) || cap < 1 || cap > 1000)
    errors.capacity = "Capacity must be a whole number between 1 and 1000.";
  return errors;
}

// registrations = all existing registrations, events = all events
export function validateRegistration(values, events, registrations, editingId = null) {
  const errors = {};
  if (!values.eventId) errors.eventId = "Please select an event.";
  if (!values.studentName || values.studentName.trim().length < 3)
    errors.studentName = "Student name is required (minimum 3 characters).";
  if (!values.usn || !USN_RE.test(values.usn.trim()))
    errors.usn = "Enter a valid USN, e.g. 1BM25CS001.";
  if (!values.email || !EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!errors.eventId) {
    const eventId = Number(values.eventId);
    const event = events.find((e) => e.id === eventId);
    const others = registrations.filter(
      (r) => r.eventId === eventId && r.id !== editingId
    );
    if (event && others.length >= event.capacity)
      errors.eventId = `"${event.title}" is full (${event.capacity}/${event.capacity} seats taken).`;
    else if (
      !errors.usn &&
      others.some((r) => r.usn.toLowerCase() === values.usn.trim().toLowerCase())
    )
      errors.usn = "This student is already registered for the selected event.";
  }
  return errors;
}