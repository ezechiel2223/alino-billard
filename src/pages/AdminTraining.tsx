import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { useSettings } from '../lib/SettingsContext';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

export default function AdminTraining() {
  const { reload } = useSettings();
  const [form, setForm] = useState({
    training_title: DEFAULT_SETTINGS.training_title,
    training_description: DEFAULT_SETTINGS.training_description,
    training_image: DEFAULT_SETTINGS.training_image,
    training_button_text: DEFAULT_SETTINGS.training_button_text,
  });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        const s = data as Settings;
        setForm({
          training_title: s.training_title,
          training_description: s.training_description,
          training_image: s.training_image,
          training_button_text: s.training_button_text,
        });
      }
    })();
  }, []);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadImage(f, 'training');
    if (url) set('training_image', url);
    setUploading(false);
  };

  const save = async () => {
    if (isSupabaseConfigured) {
      await supabase.from('settings').upsert({ id: 1, ...form });
    }
    await reload();
    setMsg('Enregistré.');
  };

  return (
    <div>
      <h1 className="admin-title">Formation</h1>
      <div className="admin-card">
        <div className="form-group">
          <label className="form-label">Titre</label>
          <input className="form-input" value={form.training_title} onChange={(e) => set('training_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.training_description} onChange={(e) => set('training_description', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Texte du bouton</label>
          <input className="form-input" value={form.training_button_text} onChange={(e) => set('training_button_text', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Image</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {uploading && <span> Upload...</span>}
          {form.training_image && <img src={form.training_image} alt="" style={{ width: 200, marginTop: 8, borderRadius: 8 }} />}
        </div>
        <button className="btn btn-gold" onClick={save}>Enregistrer</button>
        {msg && <span style={{ marginLeft: 12, color: 'green' }}>{msg}</span>}
      </div>
    </div>
  );
}
