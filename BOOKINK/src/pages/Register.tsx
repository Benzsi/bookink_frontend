import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/api';

interface RegisterProps {
  onRegisterSuccess: (user: any) => void;
}

export function Register({ onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (password.length < 4 || password.length > 64) {
      setError('A jelszó 4-64 karakter közötti kell legyen');
      return;
    }

    if (username.length < 3 || username.length > 32) {
      setError('A felhasználónév 3-32 karakter közötti kell legyen');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Kérlek adj meg egy érvényes email címet');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({ username, email, password });
      onRegisterSuccess(result.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Regisztráció sikertelen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-btn">
        ← Vissza a főoldalra
      </Link>
      <h2>Regisztráció</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Felhasználónév (3-32 karakter)"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email cím</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="pelda@email.com"
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
            placeholder="Jelszó (4-64 karakter)"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Jelszó megerősítése</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Jelszó megerősítése"
            disabled={loading}
          />
        </div>
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Regisztráció...' : 'Regisztráció'}
        </button>
      </form>
      <div className="form-link">
        Van már fiókod? <Link to="/login">Lépj be itt</Link>
      </div>
    </div>
  );
}
