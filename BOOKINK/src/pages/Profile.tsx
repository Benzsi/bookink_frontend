import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../services/api';

interface ProfileProps {
  user: User | null;
}

export function Profile({ user }: ProfileProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
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
            <label>Email cím:</label>
            {isEditingEmail ? (
              <div className="email-edit-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email cím"
                />
                <button
                  className="btn-small btn-save"
                  onClick={() => {
                    // TODO: Implement email update API call
                    setIsEditingEmail(false);
                    setSuccess('Email sikeresen frissítve!');
                    setTimeout(() => setSuccess(''), 3000);
                  }}
                >
                  ✓ Mentés
                </button>
                <button
                  className="btn-small btn-cancel"
                  onClick={() => {
                    setEmail(user.email || '');
                    setIsEditingEmail(false);
                  }}
                >
                  ✕ Mégsem
                </button>
              </div>
            ) : (
              <p>
                {user.email || 'Nincs megadva'}
                <button
                  className="btn-small btn-edit"
                  onClick={() => setIsEditingEmail(true)}
                  style={{ marginLeft: '10px' }}
                >
                  ✎ Szerkesztés
                </button>
              </p>
            )}
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
      </div>
    </div>
  );
}
