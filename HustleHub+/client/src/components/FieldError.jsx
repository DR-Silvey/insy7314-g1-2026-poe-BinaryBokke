export default function FieldError({ children }) {
  return children ? <p className="field-error" role="alert">{children}</p> : null;
}
