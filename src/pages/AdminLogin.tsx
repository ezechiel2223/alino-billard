import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function AdminLogin() {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else navigate('/admin');
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Administration</h1>
        <p>Connexion administrateur Alino Billard.</p>
        {!isConfigured && (
          <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            Supabase non configuré. Définissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans un fichier .env.
          </div>
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: '#e53935', fontSize: 14 }}>{error}</p>}
          <button className="btn btn-gold btn-block" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
