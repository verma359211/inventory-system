import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AppNotice from "../components/common/AppNotice";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/customers", label: "Customers" },
  { to: "/orders", label: "Orders" },
];

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <AppNotice />

      <div className="app-body">
        {menuOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          />
        )}

        <aside
          id="app-sidebar"
          className={`sidebar ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="sidebar-brand">
            <span className="brand-mark" aria-hidden="true">
              IM
            </span>
            <div>
              <p className="brand-title">Inventory</p>
              <p className="brand-subtitle">Management</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="main-column">
          <header className="mobile-topbar">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
              <span className="visually-hidden">Toggle navigation</span>
            </button>
            <p className="mobile-topbar-title">Inventory Management</p>
          </header>

          <main className="content" id="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
