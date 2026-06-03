import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={`form-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="required-indicator" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}
      <div className="form-control-wrap">
        {children}
      </div>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
