interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

const Toast = ({ message, type, onDismiss }: ToastProps) => {
  const colorClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div
        className={`toast show ${colorClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-body d-flex align-items-center justify-content-between gap-3">
          <span>{message}</span>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={onDismiss}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
