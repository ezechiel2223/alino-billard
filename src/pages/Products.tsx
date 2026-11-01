import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'Tous';
  const q = params.get('q') || '';
  const [search, setSearch] = useState(q);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => { setSearch(q); }, [q]);

  const filtered = products.filter((p) => {
    if (cat !== 'Tous' && p.category !== cat) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        (p.description || '').toLowerCase().includes(s) ||
        (p.category || '').toLowerCase().includes(s) ||
        (p.badge || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  const onSearch = (v: string) => {
    setSearch(v);
    const next: any = {};
    if (cat !== 'Tous') next.cat = cat;
    if (v.trim()) next.q = v;
    setParams(next);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h1 className="section-title">Nos produits</h1>
          <p className="section-sub">Tables, queues, accessoires et matériel professionnel.</p>
        </div>

        <div style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <input
            className="form-input"
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ borderRadius: 999, padding: '12px 18px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28, justifyContent: 'center' }}>
          {['Tous', ...PRODUCT_CATEGORIES].map((c) => (
            <button
              key={c}
              className={c === cat ? 'btn btn-gold btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setParams(c === 'Tous' ? (search ? { q: search } : {}) : { cat: c, ...(search ? { q: search } : {}) })}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty">Aucun produit dans cette catégorie.</div>
        ) : (
          <div className="grid grid-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
