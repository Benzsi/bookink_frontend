import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/api';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login({ username, password });
      onLoginSuccess(result.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bejelentkezés sikertelen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-btn">
        ← Vissza a főoldalra
      </Link>
      <h2>Bejelentkezés</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Felhasználónév vagy Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Felhasználónév vagy email cím"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Jelszó"
            disabled={loading}
          />
        </div>
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
        </button>
      </form>
      <div className="form-link">
        Még nincs fiókod?{' '}
        <Link to="/register">Regisztrálj itt</Link>
      </div>
    </div>
  );
}