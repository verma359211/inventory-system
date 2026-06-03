interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export default function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <div className="success-banner" role="status">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="btn-text" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
