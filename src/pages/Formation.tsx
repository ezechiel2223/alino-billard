import { useSettings } from '../lib/SettingsContext';

export default function Formation() {
  const { settings } = useSettings();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Bonjour Alino Billard Accessoires, je souhaite avoir plus d\'informations sur la formation.')}`;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h1 className="section-title">{settings.training_title}</h1>
          <p className="section-sub">{settings.training_description}</p>
        </div>
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div className="card">
            <img
              src={settings.training_image || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?auto=format&fit=crop&w=1200&q=80'}
              alt={settings.training_title}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 24 }}>
              {settings.training_description}
            </p>
            <a className="btn btn-gold" href={waUrl} target="_blank" rel="noopener noreferrer">
              {settings.training_button_text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
