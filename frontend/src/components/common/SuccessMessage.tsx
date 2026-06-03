import { useEffect } from "react";

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export default function SuccessMessage({
  message,
  onDismiss,
  autoDismissMs = 5000,
}: SuccessMessageProps) {
  useEffect(() => {
    if (!onDismiss || autoDismissMs <= 0) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, autoDismissMs]);

  return (
    <div className="alert alert-success" role="status">
      <p className="alert-message">{message}</p>
      {onDismiss && (
        <button type="button" className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
