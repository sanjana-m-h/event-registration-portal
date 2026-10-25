// Shared loading / error / flash-message helpers.
export function Loading() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2 text-muted">Loading…</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center">
      <span>
        {message} Make sure the API is running (<code>npm run server</code>).
      </span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}

export function Flash({ flash }) {
  if (!flash) return null;
  return <div className={`alert alert-${flash.type} py-2`}>{flash.text}</div>;
}
