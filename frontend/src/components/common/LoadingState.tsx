export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <p className="loading-state">{message}</p>;
}
