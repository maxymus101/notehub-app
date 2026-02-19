import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onClick: () => void;
  isRetrying: boolean;
}

export default function ErrorMessage({
  message,
  onClick,
  isRetrying,
}: ErrorMessageProps) {
  return (
    <div className={css.error_container}>
      <h3 className={css.error_title}>{message}</h3>
      <button
        className={css.error_button}
        onClick={onClick}
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
}
