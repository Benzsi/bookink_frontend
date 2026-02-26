import { Link } from 'react-router-dom';
import logo from '../assets/bookink_logo.png';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="header" style={{ paddingLeft: 350, paddingRight: 350 }}>
      <nav className="navbar" style={{ width: '100%' }}>
        <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Bookink logo" style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 8, background: '#fff', marginRight: 8 }} />
            Bookink
          </span>
        </Link>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="navbar-search-inline">
            <input
              type="text"
              placeholder="Könyv keresése..."
              className="navbar-search-input"
            />
          </div>
        </div>
        <Link to="/ai-search" className="navbar-link">
          🤖 AI Keresés
        </Link>
        {isAuthenticated && (
          <Link to="/mylists" className="navbar-link">
            Saját listáim
          </Link>
        )}
        {isAuthenticated ? (
          <Link to="/profile" className="navbar-link">
            👤 Profil
          </Link>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Bejelentkezés
            </Link>
            <Link to="/register" className="navbar-link">
              Regisztráció
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
