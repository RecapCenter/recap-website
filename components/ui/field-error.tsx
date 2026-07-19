type FieldErrorProps = {
  id: string;
  message?: string;
};

/** Inline validation error shown directly beneath a form field. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-accent-red mt-1 text-xs">
      {message}
    </p>
  );
}
