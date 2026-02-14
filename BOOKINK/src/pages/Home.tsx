import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User, Book } from '../services/api';
import { BooksService, RatingsService } from '../services/api';
import { StarRating } from '../components/StarRating';

interface HomeProps {
  user?: User | null;
}

interface BookWithRating extends Book {
  averageRating?: number;
  totalRatings?: number;
}

export function Home({ user }: HomeProps) {
  const [books, setBooks] = useState<BookWithRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const booksService = new BooksService();
  const ratingsService = new RatingsService();

  useEffect(() => {
    if (user) {
      fetchBooks();
      loadUserRatings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await booksService.getAllBooks();
      
      // Lekérjük az átlagos értékeléseket is
      const booksWithRatings = await Promise.all(
        data.map(async (book) => {
          try {
            const bookRating = await ratingsService.getBookRating(book.id);
            return {
              ...book,
              averageRating: bookRating.averageRating || 0,
              totalRatings: bookRating.totalRatings || 0,
            };
          } catch {
            return {
              ...book,
              averageRating: 0,
              totalRatings: 0,
            };
          }
        })
      );
      
      setBooks(booksWithRatings);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Könyvek lekérése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  const loadUserRatings = async () => {
    if (!user) return;
    try {
      const ratings = await ratingsService.getUserRatings(user.id);
      const ratingsMap: Record<number, number> = {};
      ratings.forEach((r: any) => {
        ratingsMap[r.bookId] = r.rating;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error('Felhasználó értékelésének lekérése sikertelen:', err);
    }
  };

  const handleRate = async (bookId: number, rating: number) => {
    if (!user) return;
    try {
      await ratingsService.rateBook(user.id, bookId, rating);
      setUserRatings({ ...userRatings, [bookId]: rating });
      // Frissítjük a könyvek listáját az új átlaggal
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba az értékelés során');
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
                
                {/* Átlagos értékelés megjelenítése */}
                <div className="book-rating-section" style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                    Átlagos értékelés:
                  </div>
                  <StarRating
                    rating={book.averageRating || 0}
                    totalRatings={book.totalRatings || 0}
                    readonly
                    size="small"
                  />
                </div>

                {/* Felhasználó értékelése */}
                <div className="user-rating-section" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                    {userRatings[book.id] ? 'Az értékelésed:' : 'Értékeld te is:'}
                  </div>
                  <StarRating
                    rating={userRatings[book.id] || 0}
                    onRate={(rating) => handleRate(book.id, rating)}
                    size="medium"
                  />
                </div>
                
                {book.lyricNote && (
                  <p className="book-lyric-note">"{book.lyricNote}"</p>
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
