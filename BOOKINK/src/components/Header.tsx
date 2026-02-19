import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="header" style={{ paddingLeft: 350, paddingRight: 350 }}>
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
