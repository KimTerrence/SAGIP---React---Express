import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Users, Settings, LayoutDashboard, 
  ChevronLeft, ChevronRight, LogOut, Bug,
  Database
} from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);   // for mobile
  const [sidebarMin, setSidebarMin] = useState(false);     // for desktop collapse
  const location = useLocation();
  const navigate = useNavigate();



  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-emerald-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 bg-green-900 text-white transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarMin ? "w-20" : "w-64"}
          lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-600">
          {!sidebarMin && <h2 className="text-xl font-bold">Admin</h2>}
          <button
            className="hidden lg:block text-emerald-200 hover:text-white"
            onClick={() => setSidebarMin(!sidebarMin)}
          >
            {sidebarMin ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col p-4">
          <NavItem to="/admin" label="Dashboard" icon={<LayoutDashboard size={20} />} active={location.pathname === "/admin"} sidebarMin={sidebarMin} />
          <NavItem to="/admin/pest" label="Pests" icon={<Bug size={20} />} active={location.pathname === "/admin/pest"} sidebarMin={sidebarMin} />
          <NavItem to="/admin/data" label="Data Sets" icon={<Database size={20} />} active={location.pathname === "/admin/data"} sidebarMin={sidebarMin} />
          <NavItem to="/admin/users" label="Users" icon={<Users size={20} />} active={location.pathname === "/admin/users"} sidebarMin={sidebarMin} />
          <NavItem to="/admin/settings" label="Settings" icon={<Settings size={20} />} active={location.pathname === "/admin/settings"} sidebarMin={sidebarMin} />

          {/* Logout at bottom */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded transition-colors text-emerald-100 hover:bg-emerald-600 mt-auto"
          >
            <LogOut size={20} />
            {!sidebarMin && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className={`flex items-center justify-between bg-white shadow px-4 py-3 ${sidebarMin ? "lg:ml-20" : "lg:ml-64"}`}>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-emerald-800">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarMin ? "lg:ml-20" : "lg:ml-64"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* Navigation item component */
function NavItem({ to, label, icon, active, sidebarMin }: { 
  to: string, 
  label: string, 
  icon: React.ReactNode, 
  active: boolean, 
  sidebarMin: boolean 
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded transition-colors ${
        active 
          ? "bg-emerald-800 text-white" 
          : "text-emerald-100 hover:bg-emerald-600"
      }`}
    >
      {icon}
      {!sidebarMin && <span>{label}</span>}
    </Link>
  );
}
