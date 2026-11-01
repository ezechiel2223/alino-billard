import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { useSettings } from '../lib/SettingsContext';

export default function AdminSettings() {
  const { reload } = useSettings();
  const [form, setForm] = useState<Settings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setForm({ ...DEFAULT_SETTINGS, ...data } as Settings);
    })();
  }, []);

  const set = (k: keyof Settings, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadImage(f, 'logo');
    if (url) set('logo_url', url);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    if (isSupabaseConfigured) {
      await supabase.from('settings').upsert({ id: 1, ...form });
    }
    await reload();
    setSaving(false);
    setMsg('Enregistré.');
  };

  return (
    <div>
      <h1 className="admin-title">Paramètres</h1>
      <div className="admin-card">
        <div className="form-group">
          <label className="form-label">Logo (image)</label>
          <input type="file" accept="image/*" onChange={onLogo} />
          {uploading && <span> Upload...</span>}
          {form.logo_url && <img src={form.logo_url} alt="logo" style={{ height: 48, marginTop: 8, borderRadius: 8 }} />}
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>Laissez vide pour afficher l'initiale "A".</small>
        </div>
        <div className="form-group">
          <label className="form-label">Numéro WhatsApp</label>
          <input className="form-input" value={form.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} />
          <small style={{ color: 'var(--text-muted)' }}>Format international sans +, ex: 237681504830</small>
        </div>
        <div className="form-group">
          <label className="form-label">Téléphone 2 (contact)</label>
          <input className="form-input" value={form.phone2 || ''} onChange={(e) => set('phone2', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nom de l'entreprise</label>
          <input className="form-input" value={form.company_name} onChange={(e) => set('company_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input className="form-input" value={form.address} onChange={(e) => set('address', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Téléphone affiché</label>
          <input className="form-input" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Horaires</label>
          <input className="form-input" value={form.hours || ''} onChange={(e) => set('hours', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Titre hero</label>
          <input className="form-input" value={form.hero_title} onChange={(e) => set('hero_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Sous-titre hero</label>
          <textarea className="form-textarea" value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Texte de contact</label>
          <textarea className="form-textarea" value={form.contact_text} onChange={(e) => set('contact_text', e.target.value)} />
        </div>
        <button className="btn btn-gold" onClick={save} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
        {msg && <span style={{ marginLeft: 12, color: 'green' }}>{msg}</span>}
      </div>
    </div>
  );
}
