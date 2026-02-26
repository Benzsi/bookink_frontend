import { StarRating } from './StarRating';

interface BookBackProps {
  title: string;
  author: string;
  averageRating: number;
  totalRatings: number;
  comments: { user: string; text: string; }[];
}

export function BookBack({ title, author, averageRating, totalRatings, comments }: BookBackProps) {
  return (
    <div className="book-back">
      <h3>{title}</h3>
      <div style={{ fontStyle: 'italic', color: '#666', marginBottom: 12 }}>{author}</div>
      
      <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: 4 }}>Átlagos értékelés:</div>
        <StarRating rating={averageRating} totalRatings={totalRatings} readonly size="medium" />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '14px' }}>Kommentek ({comments.length})</div>
        {comments.length === 0 ? (
          <div style={{ color: '#888', fontSize: 13 }}>Még nincs komment.</div>
        ) : (
          <div style={{ 
            overflow: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingRight: 4,
          }}>
            {comments.map((c, i) => (
              <div key={i} style={{ 
                fontSize: '12px',
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  color: 'var(--color-primary)',
                  marginBottom: 2,
                }}>
                  {c.user}
                </div>
                <div style={{ 
                  color: '#333',
                  lineHeight: 1.4,
                  wordWrap: 'break-word'
                }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
