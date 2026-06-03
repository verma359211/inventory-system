export function formatCurrency(value: string | number): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isNaN(amount) ? 0 : amount);
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
