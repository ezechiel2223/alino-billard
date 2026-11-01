import { useSettings } from '../lib/SettingsContext';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings();
  const hasSale = product.sale_price != null && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price);
  const displayPrice = hasSale ? Number(product.sale_price) : Number(product.price);
  const orderMsg = `Bonjour Alino Billard Accessoires, je suis intéressé par la ${product.name} au prix de ${displayPrice.toLocaleString('fr-FR')} FCFA.`;

  return (
    <div className={`card fade-in ${!product.available ? 'unavailable' : ''}`}>
      <img
        src={product.image_url || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?auto=format&fit=crop&w=800&q=80'}
        alt={product.name}
        className="product-img"
      />
      <div className="product-body">
        <div className="product-cat">{product.category}</div>
        <div className="product-name">{product.name}</div>
        {hasSale && <span className="badge badge-red" style={{ marginBottom: 6 }}>PROMO</span>}
        {product.badge && !hasSale && <span className="badge badge-gold" style={{ marginBottom: 6 }}>{product.badge}</span>}
        <p className="product-desc">{product.description}</p>
        <div className="product-foot">
          <div>
            {hasSale && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {Number(product.price).toLocaleString('fr-FR')} FCFA
              </div>
            )}
            <div className="product-price" style={hasSale ? { color: '#e53935' } : undefined}>
              {displayPrice.toLocaleString('fr-FR')} <span>FCFA</span>
            </div>
          </div>
          {product.available ? (
            <a
              className="btn btn-gold btn-sm"
              href={buildWhatsAppUrl(settings.whatsapp_number, orderMsg)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Commander
            </a>
          ) : (
            <span className="badge badge-dark">Indisponible</span>
          )}
        </div>
      </div>
    </div>
  );
}
