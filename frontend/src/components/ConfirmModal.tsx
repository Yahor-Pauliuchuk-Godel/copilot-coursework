import '../styles/Modal.css';

interface Props {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  confirming?: boolean;
}

const ConfirmModal = ({ title, description, confirmLabel, onConfirm, onClose, confirming = false }: Props) => (
  <>
    {/* Backdrop */}
    <div
      className="modal-backdrop fade show modal-backdrop-clickable"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmModalTitle">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <p className="mb-0">{description}</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={confirming}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Deleting…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ConfirmModal;
