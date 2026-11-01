import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import type { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../types';

const empty: Partial<Product> = {
  name: '', description: '', price: 0, sale_price: null, category: PRODUCT_CATEGORIES[0], image_url: '', available: true, badge: '',
};

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as Product[]);
  };

  useEffect(() => { load(); }, []);

  const set = (k: keyof Product, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadImage(f, 'products');
    if (url) set('image_url', url);
    setUploading(false);
  };

  const save = async () => {
    if (!isSupabaseConfigured) return;
    const payload = { ...form, price: Number(form.price) };
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing);
    } else {
      await supabase.from('products').insert(payload);
    }
    setForm(empty);
    setEditing(null);
    setShow(false);
    await load();
  };

  const edit = (p: Product) => {
    setForm(p);
    setEditing(p.id);
    setShow(true);
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', id);
    await load();
  };

  const toggleAvail = async (p: Product) => {
    await supabase.from('products').update({ available: !p.available }).eq('id', p.id);
    await load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Produits</h1>
        <button className="btn btn-gold btn-sm" onClick={() => { setForm(empty); setEditing(null); setShow(true); }}>+ Ajouter</button>
      </div>
      {show && (
        <div className="admin-card">
          <h3>{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
          <div className="form-group">
            <label className="form-label">Nom</label>
            <input className="form-input" value={form.name || ''} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Prix (FCFA)</label>
            <input className="form-input" type="number" value={form.price || 0} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Prix réduit (FCFA, optionnel)</label>
            <input className="form-input" type="number" value={form.sale_price ?? ''} onChange={(e) => set('sale_price', e.target.value === '' ? null : e.target.value)} />
            <small style={{ color: 'var(--text-muted)' }}>Laissez vide pour pas de réduction. Doit être inférieur au prix normal.</small>
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={form.category || ''} onChange={(e) => set('category', e.target.value)}>
              {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Badge (optionnel)</label>
            <input className="form-input" value={form.badge || ''} onChange={(e) => set('badge', e.target.value)} placeholder="Nouveau, Promotion..." />
          </div>
          <div className="form-group">
            <label className="form-label">Image</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {uploading && <span> Upload...</span>}
            {form.image_url && <img src={form.image_url} alt="" style={{ width: 120, marginTop: 8, borderRadius: 8 }} />}
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label className="form-label" style={{ margin: 0 }}>Disponible</label>
            <button className={`toggle ${form.available ? 'on' : ''}`} onClick={() => set('available', !form.available)} type="button" />
          </div>
          <div className="admin-actions">
            <button className="btn btn-gold btn-sm" onClick={save}>Enregistrer</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setShow(false); setEditing(null); }}>Annuler</button>
          </div>
        </div>
      )}

      {items.length === 0 ? <div className="empty">Aucun produit.</div> : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Dispo</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.image_url && <img src={p.image_url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{Number(p.price).toLocaleString('fr-FR')}</td>
                  <td><button className={`toggle ${p.available ? 'on' : ''}`} onClick={() => toggleAvail(p)} /></td>
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

