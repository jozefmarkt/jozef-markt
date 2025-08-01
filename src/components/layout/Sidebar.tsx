import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

const Sidebar: React.FC = () => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="p-4 md:hidden"
        aria-label="Toggle navigation"
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="mt-8 flex flex-col gap-2 p-4">
          <Link to="/" onClick={() => setOpen(false)} className="sidebar-link">{t('nav.home')}</Link>
          <Link to="/products" onClick={() => setOpen(false)} className="sidebar-link">{t('nav.products')}</Link>
          <Link to="/offers" onClick={() => setOpen(false)} className="sidebar-link">{t('nav.offers')}</Link>
          <Link to="/account" onClick={() => setOpen(false)} className="sidebar-link">{t('nav.account')}</Link>
        </nav>
      </aside>

      {/* Overlay when sidebar open on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 