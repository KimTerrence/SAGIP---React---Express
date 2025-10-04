import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Users, Settings, LayoutDashboard,
  ChevronLeft, ChevronRight, LogOut, Bug, Database,
} from "lucide-react";
import PestHeader from "../../components/PestHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);   // for mobile
  const [sidebarMin, setSidebarMin] = useState(false);     // for desktop collapse
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"card" | "list">("card");
  const [pests, setPests] = useState<any[]>([]); 



  // Logout
  const handleLogout = () => {
    alert("do you want to logout?");
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
        className={`fixed z-30 inset-y-0 left-0 bg-green-900 text-white transform transition-all duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarMin ? "w-20" : "w-64"}
          lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-600 h-16">

          {!sidebarMin && <div className="flex items-center gap-2"> <img src="/icon.png" className="h-10 rounded"  /><h1 className="text-xl font-bold">Admin</h1></div>}
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
          <NavItem to="/admin/data" label="Datasets" icon={<Database size={20} />} active={location.pathname === "/admin/data"} sidebarMin={sidebarMin} />
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
       <header
  className={`sticky top-0 z-10 flex items-center justify-between bg-white shadow px-4 py-3 ${
    sidebarMin ? "lg:ml-20" : "lg:ml-64"
  }`}
>
  <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
    <Menu size={24} />
  </button>

  {/* Dynamic Header Content */}
  <div className="flex-1 flex items-center justify-between gap-4">
    {location.pathname === "/admin/pest" ? (
     <PestHeader
  search={search}
  setSearch={setSearch}
  filter={filter}
  setFilter={setFilter}
  view={view}
  setView={setView}
  pests={pests}   // 👈 added
/>

    ) : (
      <h1 className="text-lg font-semibold text-gray-800">
        {location.pathname === "/admin"
          ? "Dashboard"
          : location.pathname === "/admin/data"
          ? "Datasets"
          : location.pathname === "/admin/users"
          ? "Users"
          : location.pathname === "/admin/settings"
          ? "Settings"
          : "Admin Panel"}
      </h1>
    )}
  </div>

  {/* Logo */}
  <img src="/logo.png" className="h-10 ml-4 hidden sm:flex" />
</header>

        {/* Page content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarMin ? "lg:ml-20" : "lg:ml-64"}`}>
        <Outlet context={{ search, filter, view, pests, setPests, setFilter, setSearch, setView }} />
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
