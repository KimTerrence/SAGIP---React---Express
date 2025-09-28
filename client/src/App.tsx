import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Download from "./pages/Download";
import Pest from "./pages/Pest";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import User from "./pages/admin/User";
import Data from "./pages/admin/Data";
import AdminPest from "./pages/admin/AdminPest";

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

          <Route path="/admin/users" element={<User />} /> 
          <Route path="/admin/pest" element={<AdminPest />} /> 
          <Route path="/admin/data" element={<Data />} />       
        </Route>
      </Route>
    </Routes>
  );
}

export default App; 