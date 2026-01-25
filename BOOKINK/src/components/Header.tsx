import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        📚 Bookink
      </Link>
      <div className="header-buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn btn-login">
              Bejelentkezés
            </Link>
            <Link to="/register" className="btn btn-register">
              Regisztráció
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn btn-login">
              👤 Profil
            </Link>
            <button className="btn btn-logout" onClick={onLogout}>
              Kijelentkezés
            </button>
          </>
        )}
      </div>
    </header>
  );
}
