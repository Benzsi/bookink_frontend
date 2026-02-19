import React from 'react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string) => void;
  bookTitle: string;
}

export function CommentModal({ isOpen, onClose, onSave, bookTitle }: CommentModalProps) {
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    if (isOpen) setComment('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Komment a(z) "{bookTitle}" könyvhöz</h3>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Írd be a kommented..."
          rows={5}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={onClose}>Mégse</button>
          <button className="btn btn-primary" onClick={() => onSave(comment)} disabled={!comment.trim()}>
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
