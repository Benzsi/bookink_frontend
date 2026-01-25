import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../services/api';

interface ProfileProps {
  user: User | null;
}

export function Profile({ user }: ProfileProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="auth-container">
        <h2>Bejelentkezés szükséges</h2>
        <p>Kérlek jelentkezz be a profil megtekintéséhez.</p>
        <Link to="/login" className="btn-primary">
          Bejelentkezés
        </Link>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Kérlek töltsd ki mindkét jelszó mezőt');
      return;
    }

    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (password.length < 4 || password.length > 64) {
      setError('A jelszó 4-64 karakter közötti kell legyen');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change API call
      setSuccess('Jelszó sikeresen frissítve!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Jelszó frissítése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Link to="/" className="back-btn">
        ← Vissza a főoldalra
      </Link>

      <div className="profile-section">
        <h1>Profil</h1>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Felhasználónév:</label>
            <p>{user.username}</p>
          </div>
          <div className="info-group">
            <label>Szerepkör:</label>
            <p>
              {user.role === 'ADMIN' ? '👨‍💼 Administrator' : '👤 Felhasználó'}
            </p>
          </div>
          <div className="info-group">
            <label>Létrehozva:</label>
            <p>{new Date(user.createdAt).toLocaleDateString('hu-HU')}</p>
          </div>
          <div className="info-group">
            <label>Utolsó frissítés:</label>
            <p>{new Date(user.updatedAt).toLocaleDateString('hu-HU')}</p>
          </div>
        </div>

        {user.role === 'ADMIN' && (
          <div className="admin-link">
            <Link to="/admin" className="btn-primary">
              👨‍💼 Felhasználók kezelése
            </Link>
          </div>
        )}

        <div className="password-change-section">
          <h2>Jelszó módosítása</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="password">Új jelszó</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Új jelszó"
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
                placeholder="Jelszó megerősítése"
                disabled={loading}
              />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Frissítés...' : 'Jelszó módosítása'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
