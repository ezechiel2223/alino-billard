import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();

  if (loading) return <div className="spinner" />;
  if (!session) return <Navigate to="/admin/login" replace />;

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/settings', label: 'Paramètres' },
    { to: '/admin/products', label: 'Produits' },
    { to: '/admin/promotions', label: 'Promotions' },
    { to: '/admin/vertical', label: 'Contenus 9:16' },
    { to: '/admin/training', label: 'Formation' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 24, color: '#c9a227' }}>ALINO ADMIN</div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/admin'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <button
          onClick={signOut}
          style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)' }}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
