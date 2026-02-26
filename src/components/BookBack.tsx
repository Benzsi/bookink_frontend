import React from 'react';
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
      <div style={{ fontStyle: 'italic', color: '#666', marginBottom: 8 }}>{author}</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: 2 }}>Átlagos értékelés:</div>
        <StarRating rating={averageRating} totalRatings={totalRatings} readonly size="medium" />
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Kommentek:</div>
        {comments.length === 0 ? (
          <div style={{ color: '#888', fontSize: 14 }}>Még nincs komment.</div>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {comments.map((c, i) => (
              <li key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
                <span style={{ fontWeight: 500 }}>{c.user}:</span> {c.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
