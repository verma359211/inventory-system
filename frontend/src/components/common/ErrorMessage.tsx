interface ErrorMessageProps {
  message: string;
  title?: string;
}

export default function ErrorMessage({ message, title = "Something went wrong" }: ErrorMessageProps) {
  return (
    <div className="alert alert-error" role="alert">
      <strong className="alert-title">{title}</strong>
      <p className="alert-message">{message}</p>
    </div>
  );
}
