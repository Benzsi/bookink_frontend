import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="home">
      <h1>Üdvözlünk a Bookinkben!</h1>
      <p>
        Fedezd fel a világ legszebb könyveit, ossz meg ajánlásokat az olvasók
        közösségével, és építsd ki saját könyvtáradat.
      </p>
      <div className="home-buttons">
        <Link to="/register" className="btn-primary">
          Első lépések
        </Link>
        <a href="#about" className="btn-primary" style={{ backgroundColor: '#764ba2' }}>
          Tudj meg többet
        </a>
      </div>
    </div>
  );
}
