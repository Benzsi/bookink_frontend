import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User, Book } from '../services/api';
import { BooksService } from '../services/api';

interface HomeProps {
  user?: User | null;
}

export function Home({ user }: HomeProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const booksService = new BooksService();

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await booksService.getAllBooks();
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Könyvek lekérése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  // Ha nincs bejelentkezve, mutasd az üdvözlő képernyőt
  if (!user) {
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

  // Ha bejelentkezve van, mutasd a könyveket
  return (
    <div className="home-authenticated">
      <h1>📚 Könyvek katalógusa</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Könyvek betöltése...</div>
      ) : books.length === 0 ? (
        <div className="no-books">Jelenleg nincsenek könyvek a katalógusban.</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="cover-image"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.querySelector('.cover-placeholder')!.classList.remove('hidden-placeholder');
                    }}
                  />
                ) : null}
                <div className={`cover-placeholder ${book.coverUrl ? 'hidden-placeholder' : ''}`}>📖</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-meta">
                  <span className="badge">{book.literaryForm}</span>
                  <span className="badge badge-genre">{book.genre}</span>
                </div>
                {book.lyricNote && (
                  <p className="book-lyric-note">"{book.lyricNote}"</p>
                )}
                {book.rating && (
                  <div className="book-rating">
                    <span className="stars">{'⭐'.repeat(Math.floor(book.rating))}</span>
                    <span className="rating-value">{book.rating}/5</span>
                  </div>
                )}
                <span className="book-number">#{book.sequenceNumber}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
