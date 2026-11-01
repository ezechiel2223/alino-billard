import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Bonjour Alino Billard Accessoires, je souhaite avoir plus d\'informations sur vos produits.')}`;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h1 className="section-title">Contact</h1>
          <p className="section-sub">{settings.contact_text}</p>
        </div>
        <div className="grid grid-2">
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>{settings.company_name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <MapPin size={18} color="#c9a227" /> <span>{settings.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Phone size={18} color="#c9a227" /> <span>{settings.phone}</span>
              </div>
              {settings.phone2 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Phone size={18} color="#c9a227" /> <span>{settings.phone2}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Clock size={18} color="#c9a227" /> <span>{settings.hours}</span>
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-gold" href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <iframe
              title="map"
              src="https://www.google.com/maps?q=Carrefour+Jouvence+Yaounde&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
