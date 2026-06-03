import Spinner from "./Spinner";

interface LoadingStateProps {
  message?: string;
  variant?: "inline" | "centered";
}

export default function LoadingState({
  message = "Loading...",
  variant = "centered",
}: LoadingStateProps) {
  return (
    <div className={`loading-state loading-state-${variant}`} role="status">
      <Spinner label={message} />
      <p>{message}</p>
    </div>
  );
}
