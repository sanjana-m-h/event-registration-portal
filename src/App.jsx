import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import EventList from "./pages/EventList.jsx";
import EventForm from "./pages/EventForm.jsx";
import RegistrationList from "./pages/RegistrationList.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
          <Route path="/registrations" element={<RegistrationList />} />
          <Route path="/registrations/new" element={<RegistrationForm />} />
          <Route path="/registrations/:id/edit" element={<RegistrationForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}