import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Download from "./pages/Download";
import Pest from "./pages/Pest";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

function PrivateRoute() {
  const token = localStorage.getItem("authToken");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pest" element={<Pest />} />
      <Route path="/download" element={<Download />} />

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
        </Route>
      </Route>
    </Routes>
  );
}

export default App;