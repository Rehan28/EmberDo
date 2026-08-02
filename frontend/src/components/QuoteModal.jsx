export default function QuoteModal({ quote, onAnother, onClose }) {
  if (!quote) return <div className="modal-overlay hidden" />;
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-tag">{quote.tag}</div>
        <div className="modal-quote">&ldquo;{quote.text}&rdquo;</div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onAnother}>
            Another
          </button>
          <button className="btn-primary" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
