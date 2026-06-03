import { useMemo, useState, type FormEvent } from "react";
import type { CustomerCreate } from "../../types/customer";
import ErrorMessage from "../common/ErrorMessage";
import FormField from "../common/FormField";

interface CustomerFormProps {
  onSubmit: (data: CustomerCreate) => Promise<void>;
  onCancel: () => void;
  serverError: string | null;
}

interface FieldErrors {
  full_name?: string;
  email?: string;
  phone_number?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateFields(
  fullName: string,
  email: string,
  phoneNumber: string,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!fullName.trim()) errors.full_name = "Full name is required";
  if (!email.trim() || !validateEmail(email.trim())) {
    errors.email = "A valid email address is required";
  }
  if (!phoneNumber.trim()) errors.phone_number = "Phone number is required";
  return errors;
}

export default function CustomerForm({
  onSubmit,
  onCancel,
  serverError,
}: CustomerFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      Object.keys(validateFields(fullName, email, phoneNumber)).length === 0,
    [fullName, email, phoneNumber],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateFields(fullName, email, phoneNumber);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
      setFieldErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField id="customer-name" label="Full name" required error={fieldErrors.full_name}>
        <input
          id="customer-name"
          type="text"
          className={fieldErrors.full_name ? "input-invalid" : ""}
          value={fullName}
          placeholder="Jane Doe"
          onChange={(e) => setFullName(e.target.value)}
          aria-invalid={Boolean(fieldErrors.full_name)}
        />
      </FormField>

      <FormField id="customer-email" label="Email" required error={fieldErrors.email}>
        <input
          id="customer-email"
          type="email"
          className={fieldErrors.email ? "input-invalid" : ""}
          value={email}
          placeholder="jane@company.com"
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
        />
      </FormField>

      <FormField
        id="customer-phone"
        label="Phone number"
        required
        error={fieldErrors.phone_number}
      >
        <input
          id="customer-phone"
          type="tel"
          className={fieldErrors.phone_number ? "input-invalid" : ""}
          value={phoneNumber}
          placeholder="+1 555 0100"
          onChange={(e) => setPhoneNumber(e.target.value)}
          aria-invalid={Boolean(fieldErrors.phone_number)}
        />
      </FormField>

      {serverError && (
        <div className="form-server-error">
          <ErrorMessage message={serverError} title="Unable to save customer" />
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !isValid}
        >
          {submitting ? "Saving..." : "Create customer"}
        </button>
      </div>
    </form>
  );
}
