import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import type { Promotion } from '../types';

const empty: Partial<Promotion> = { title: '', description: '', price: 0, image_url: '', active: true };

export default function AdminPromotions() {
  const [items, setItems] = useState<Promotion[]>([]);
  const [form, setForm] = useState<Partial<Promotion>>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as Promotion[]);
  };
  useEffect(() => { load(); }, []);

  const set = (k: keyof Promotion, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadImage(f, 'promotions');
    if (url) set('image_url', url);
    setUploading(false);
  };

  const save = async () => {
    if (!isSupabaseConfigured) return;
    const payload = { ...form, price: form.price != null ? Number(form.price) : null };
    if (editing) await supabase.from('promotions').update(payload).eq('id', editing);
    else await supabase.from('promotions').insert(payload);
    setForm(empty); setEditing(null); setShow(false); await load();
  };

  const edit = (p: Promotion) => { setForm(p); setEditing(p.id); setShow(true); };
  const remove = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('promotions').delete().eq('id', id); await load(); };
  const toggle = async (p: Promotion) => { await supabase.from('promotions').update({ active: !p.active }).eq('id', p.id); await load(); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Promotions</h1>
        <button className="btn btn-gold btn-sm" onClick={() => { setForm(empty); setEditing(null); setShow(true); }}>+ Ajouter</button>
      </div>
      {show && (
        <div className="admin-card">
          <h3>{editing ? 'Modifier la promotion' : 'Nouvelle promotion'}</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="form-input" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Prix (FCFA, optionnel)</label>
            <input className="form-input" type="number" value={form.price ?? ''} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Image</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {uploading && <span> Upload...</span>}
            {form.image_url && <img src={form.image_url} alt="" style={{ width: 120, marginTop: 8, borderRadius: 8 }} />}
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label className="form-label" style={{ margin: 0 }}>Active</label>
            <button className={`toggle ${form.active ? 'on' : ''}`} onClick={() => set('active', !form.active)} type="button" />
          </div>
          <div className="admin-actions">
            <button className="btn btn-gold btn-sm" onClick={save}>Enregistrer</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setShow(false); setEditing(null); }}>Annuler</button>
          </div>
        </div>
      )}

      {items.length === 0 ? <div className="empty">Aucune promotion.</div> : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Titre</th><th>Prix</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.image_url && <img src={p.image_url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />}</td>
                  <td>{p.title}</td>
                  <td>{p.price != null ? Number(p.price).toLocaleString('fr-FR') : '-'}</td>
                  <td><button className={`toggle ${p.active ? 'on' : ''}`} onClick={() => toggle(p)} /></td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => edit(p)}>Modifier</button>
                      <button className="btn btn-sm" style={{ background: '#e53935', color: '#fff' }} onClick={() => remove(p.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

