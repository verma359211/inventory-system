import { useState, type FormEvent } from "react";
import type { CustomerCreate } from "../../types/customer";
import ErrorMessage from "../common/ErrorMessage";

interface CustomerFormProps {
  onSubmit: (data: CustomerCreate) => Promise<void>;
  onCancel: () => void;
  serverError: string | null;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CustomerForm({
  onSubmit,
  onCancel,
  serverError,
}: CustomerFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim()) {
      setClientError("Full name is required");
      return;
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      setClientError("A valid email is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setClientError("Phone number is required");
      return;
    }

    setClientError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
      });
      setFullName("");
      setEmail("");
      setPhoneNumber("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Full Name
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Phone Number
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </label>
      {(clientError || serverError) && (
        <ErrorMessage message={clientError ?? serverError ?? ""} />
      )}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Create customer"}
        </button>
      </div>
    </form>
  );
}
