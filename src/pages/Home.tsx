import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSettings } from '../lib/SettingsContext';
import type { Product, Promotion, VerticalPromotion } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [verticals, setVerticals] = useState<VerticalPromotion[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const [{ data: p }, { data: pr }, { data: v }] = await Promise.all([
        supabase.from('products').select('*').eq('available', true).limit(4),
        supabase.from('promotions').select('*').eq('active', true).limit(3),
        supabase.from('vertical_promotions').select('*').eq('active', true).limit(4),
      ]);
      if (p) setProducts(p as Product[]);
      if (pr) setPromotions(pr as Promotion[]);
      if (v) setVerticals(v as VerticalPromotion[]);
    })();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="container hero-content fade-in">
          <h1>{settings.hero_title}</h1>
          <p>{settings.hero_subtitle}</p>
          <div className="hero-buttons">
            <Link to="/produits" className="btn btn-gold">Découvrir nos produits</Link>
            <a
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: '#fff' }}
              href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Bonjour Alino Billard Accessoires, je souhaite avoir plus d\'informations sur vos produits.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Nos produits phares</h2>
            <p className="section-sub">Une sélection de matériel de billard professionnel.</p>
          </div>
          {products.length === 0 ? (
            <div className="empty">Aucun produit pour le moment.</div>
          ) : (
            <div className="grid grid-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/produits" className="btn btn-dark">Voir tous les produits <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-light)' }}>
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Nos promotions</h2>
              <p className="section-sub">Profitez de nos offres du moment.</p>
            </div>
            <div className="grid grid-3">
              {promotions.map((pr) => (
                <div key={pr.id} className="card fade-in">
                  <img src={pr.image_url || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?auto=format&fit=crop&w=800&q=80'} alt={pr.title} className="promo-img" />
                  <div className="promo-body">
                    <span className="badge badge-red" style={{ marginBottom: 8 }}>PROMOTION</span>
                    <h3 className="promo-title">{pr.title}</h3>
                    <p className="promo-desc">{pr.description}</p>
                    {pr.price != null && <div className="promo-price">{Number(pr.price).toLocaleString('fr-FR')} FCFA</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/promotions" className="btn btn-gold">Voir toutes les promotions</Link>
            </div>
          </div>
        </section>
      )}

      {verticals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">À la une</h2>
              <p className="section-sub">Nos contenus promotionnels.</p>
            </div>
            <div className="grid grid-4">
              {verticals.map((v) => (
                <div key={v.id} className="vp-card fade-in">
                  <div className="vp-preview">
                    <img src={v.image_url} alt={v.title} />
                    <div className="vp-overlay">
                      <h3>{v.title}</h3>
                      <p>{v.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--gray-light)' }}>
        <div className="container" style={{ display: 'grid', gap: 32, alignItems: 'center' }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <h2 className="section-title">{settings.training_title}</h2>
              <p className="section-sub">{settings.training_description}</p>
              <Link to="/formation" className="btn btn-gold">{settings.training_button_text}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
