import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <nav className="navbar" style={{ width: '100%' }}>
        <Link to="/" className="header-logo">
          📚 Bookink
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
        {isAuthenticated && (
          <Link to="/mylists" className="navbar-link">
            Saját listáim
          </Link>
        )}
        {isAuthenticated ? (
          <div className="navbar-profile-dropdown">
            <Link to="/profile" className="btn btn-login">
              👤 Profil
            </Link>
            <button
              className="btn btn-logout"
              onClick={onLogout}
              style={{ marginLeft: 8 }}
            >
              Kijelentkezés
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">
              Bejelentkezés
            </Link>
            <Link to="/register" className="btn btn-register">
              Regisztráció
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
