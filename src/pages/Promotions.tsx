import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSettings } from '../lib/SettingsContext';
import type { Promotion } from '../types';

export default function Promotions() {
  const { settings } = useSettings();
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.from('promotions').select('*').eq('active', true).order('created_at', { ascending: false });
      if (data) setItems(data as Promotion[]);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h1 className="section-title">Nos promotions</h1>
          <p className="section-sub">Profitez de nos meilleures offres.</p>
        </div>
        {loading ? <div className="spinner" /> : items.length === 0 ? (
          <div className="empty">Aucune promotion active pour le moment.</div>
        ) : (
          <div className="grid grid-3">
            {items.map((p) => (
              <div key={p.id} className="card fade-in">
                <img src={p.image_url || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?auto=format&fit=crop&w=800&q=80'} alt={p.title} className="promo-img" />
                <div className="promo-body">
                  <span className="badge badge-red" style={{ marginBottom: 8 }}>PROMOTION</span>
                  <h3 className="promo-title">{p.title}</h3>
                  <p className="promo-desc">{p.description}</p>
                  {p.price != null && <div className="promo-price">{Number(p.price).toLocaleString('fr-FR')} FCFA</div>}
                  <div style={{ marginTop: 14 }}>
                    <a
                      className="btn btn-gold btn-sm"
                      href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Bonjour Alino Billard Accessoires, je suis intéressé par la promotion ' + p.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Commander
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
