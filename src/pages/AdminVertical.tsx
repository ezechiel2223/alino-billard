import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import type { VerticalPromotion } from '../types';

const empty: Partial<VerticalPromotion> = { title: '', description: '', image_url: '', active: true };

export default function AdminVertical() {
  const [items, setItems] = useState<VerticalPromotion[]>([]);
  const [form, setForm] = useState<Partial<VerticalPromotion>>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('vertical_promotions').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as VerticalPromotion[]);
  };
  useEffect(() => { load(); }, []);

  const set = (k: keyof VerticalPromotion, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadImage(f, 'vertical');
    if (url) set('image_url', url);
    setUploading(false);
  };

  const save = async () => {
    if (!isSupabaseConfigured) return;
    if (editing) await supabase.from('vertical_promotions').update(form).eq('id', editing);
    else await supabase.from('vertical_promotions').insert(form);
    setForm(empty); setEditing(null); setShow(false); await load();
  };

  const edit = (v: VerticalPromotion) => { setForm(v); setEditing(v.id); setShow(true); };
  const remove = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('vertical_promotions').delete().eq('id', id); await load(); };
  const toggle = async (v: VerticalPromotion) => { await supabase.from('vertical_promotions').update({ active: !v.active }).eq('id', v.id); await load(); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Contenus 9:16</h1>
        <button className="btn btn-gold btn-sm" onClick={() => { setForm(empty); setEditing(null); setShow(true); }}>+ Ajouter</button>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Gérez vos contenus verticaux pour WhatsApp Status, TikTok, Instagram et Facebook Stories.</p>

      {show && (
        <div className="admin-card">
          <h3>{editing ? 'Modifier le contenu' : 'Nouveau contenu'}</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="form-input" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Image verticale (9:16)</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {uploading && <span> Upload...</span>}
            {form.image_url && (
              <div style={{ marginTop: 12, maxWidth: 220 }}>
                <div className="vp-preview">
                  <img src={form.image_url} alt="" />
                  <div className="vp-overlay">
                    <h3>{form.title}</h3>
                    <p>{form.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label className="form-label" style={{ margin: 0 }}>Actif</label>
            <button className={`toggle ${form.active ? 'on' : ''}`} onClick={() => set('active', !form.active)} type="button" />
          </div>
          <div className="admin-actions">
            <button className="btn btn-gold btn-sm" onClick={save}>Enregistrer</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setShow(false); setEditing(null); }}>Annuler</button>
          </div>
        </div>
      )}

      {items.length === 0 ? <div className="empty">Aucun contenu.</div> : (
        <div className="grid grid-4">
          {items.map((v) => (
            <div key={v.id} className="vp-card fade-in">
              <div className="vp-preview">
                <img src={v.image_url} alt={v.title} />
                <div className="vp-overlay">
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button className={`toggle ${v.active ? 'on' : ''}`} onClick={() => toggle(v)} />
                <button className="btn btn-outline btn-sm" onClick={() => edit(v)}>Modif.</button>
                <button className="btn btn-sm" style={{ background: '#e53935', color: '#fff' }} onClick={() => remove(v.id)}>Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
