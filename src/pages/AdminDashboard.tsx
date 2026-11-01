import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, promotions: 0, verticals: 0 });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const [p, pr, v] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('promotions').select('id', { count: 'exact', head: true }),
        supabase.from('vertical_promotions').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        products: p.count ?? 0,
        promotions: pr.count ?? 0,
        verticals: v.count ?? 0,
      });
    })();
  }, []);

  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>
      <div className="grid grid-3">
        <div className="admin-card">
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c9a227' }}>{counts.products}</div>
          <div>Produits</div>
        </div>
        <div className="admin-card">
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c9a227' }}>{counts.promotions}</div>
          <div>Promotions</div>
        </div>
        <div className="admin-card">
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c9a227' }}>{counts.verticals}</div>
          <div>Contenus 9:16</div>
        </div>
      </div>
      <div className="admin-card">
        <p>Bienvenue dans l'administration. Utilisez le menu pour gérer les produits, promotions, paramètres, contenus verticaux et la formation.</p>
      </div>
    </div>
  );
}
