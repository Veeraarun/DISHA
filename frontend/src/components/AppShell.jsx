import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  Settings,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "New Analysis",
    path: "/analysis/new",
    icon: FileSearch,
  },
];

function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAnalysisPage =
    location.pathname.startsWith("/analysis/");

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#172033]">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17365d] text-sm font-bold text-white">
            D
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-[#17365d]">
              DISHA
            </p>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* Brand */}
        <div className="flex h-20 items-center border-b border-slate-200 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17365d] text-lg font-bold text-white">
            D
          </div>

          <div className="ml-3">
            <p className="text-lg font-bold tracking-tight text-[#17365d]">
              DISHA
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Standards Intelligence
            </p>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">

          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-[#17365d]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#17365d]"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </NavLink>
              );
            })}

          </div>

          <p className="mt-8 px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            System
          </p>

          <div className="space-y-1">

            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#17365d]"
            >
              <FileText size={18} strokeWidth={1.8} />
              <span>Analysis Records</span>
            </NavLink>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#17365d]"
            >
              <Settings size={18} strokeWidth={1.8} />
              <span>Settings</span>
            </button>

          </div>

        </nav>

        {/* Prototype Status */}
        <div className="border-t border-slate-200 p-4">

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">

            <div className="flex items-start gap-2">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <p className="text-xs font-semibold text-blue-900">
                  Prototype Environment
                </p>

                <p className="mt-1 text-[11px] leading-4 text-blue-700">
                  Standards data is currently sourced from the prototype knowledge base.
                </p>
              </div>

            </div>

          </div>

        </div>

      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17365d] text-sm font-bold text-white">
              D
            </div>

            <div>
              <p className="font-bold text-[#17365d]">
                DISHA
              </p>

              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Standards Intelligence
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>

        </div>

        <nav className="flex-1 px-3 py-6">

          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-blue-50 text-[#17365d]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}

          </div>

        </nav>

      </aside>

      {/* Main Application Area */}
      <div className="lg:pl-64">

        {/* Desktop Top Bar */}
        <header className="hidden h-16 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

          <div>
            <p className="text-sm font-medium text-slate-700">
              Procurement Standards Intelligence
            </p>

            <p className="text-xs text-slate-400">
              Digital Indian Standards Heuristic Assistant
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <span className="text-xs font-medium text-amber-800">
                Prototype Knowledge Base
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              U
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppShell;