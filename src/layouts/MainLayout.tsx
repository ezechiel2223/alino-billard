import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Menu, X, MessageCircle, Search } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [showSug, setShowSug] = useState(false);
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('products').select('id,name,category,image_url,price').eq('available', true);
      if (data) setProducts(data as Product[]);
    })();
  }, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const s = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(s)).slice(0, 6);
  }, [search, products]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/produits?q=${encodeURIComponent(search.trim())}`);
      setShowSug(false);
    }
  };

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/produits', label: 'Produits' },
    { to: '/promotions', label: 'Promotions' },
    { to: '/formation', label: 'Formation' },
    { to: '/contact', label: 'Contact' },
  ];

  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, 'Bonjour Alino Billard Accessoires, je souhaite avoir plus d\'informations sur vos produits.');

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="logo">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} style={{ height: 36, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <span className="logo-mark">A</span>
            )}
            <span>{settings.company_name}</span>
          </NavLink>
          <nav className="nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions" style={{ position: 'relative' }}>
            <form onSubmit={submitSearch} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="search"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowSug(true); }}
                  onFocus={() => setShowSug(true)}
                  onBlur={() => setTimeout(() => setShowSug(false), 150)}
                  style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, width: 150 }}
                />
                {showSug && suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginTop: 6, overflow: 'hidden', zIndex: 70, minWidth: 220 }}>
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={() => { navigate(`/produits?q=${encodeURIComponent(p.name)}`); setShowSug(false); setSearch(''); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, color: '#1a1a1a' }}
                      >
                        {p.image_url && <img src={p.image_url} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4 }} />}
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" aria-label="Rechercher" style={{ color: '#fff', padding: 6 }}>
                <Search size={16} />
              </button>
            </form>
            <a className="btn btn-gold btn-sm" href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <button className="hamburger" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          <button className="close" onClick={() => setOpen(false)} aria-label="Fermer">
            <X size={28} />
          </button>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{ color: '#25D366' }}>
            WhatsApp
          </a>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <Footer />

      <a className="wa-float" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <MessageCircle size={26} />
      </a>
    </>
  );
}

function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>{settings.company_name}</h4>
            <p>Premium billiards tables, cues, accessories and professional equipment. Yaoundé, Cameroun.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <NavLink to="/">Accueil</NavLink>
              <NavLink to="/produits">Produits</NavLink>
              <NavLink to="/promotions">Promotions</NavLink>
              <NavLink to="/formation">Formation</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <p>{settings.address}</p>
            <p style={{ marginTop: 8 }}>{settings.phone}</p>
            <p style={{ marginTop: 8 }}>{settings.hours}</p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {settings.company_name} — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
