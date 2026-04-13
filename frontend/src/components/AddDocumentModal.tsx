import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import config from '../config';
import '../styles/AddDocumentModal.css';

const API_BASE = config.apiBaseUrl;

interface Props {
  employeeId: number;
  onClose: () => void;
  onAdd: () => void;
}

const AddDocumentModal = ({ employeeId, onClose, onAdd }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (selected: File) => {
      const formData = new FormData();
      formData.append('file', selected);
      const res = await fetch(`${API_BASE}/api/employees/${employeeId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); mutation.reset(); }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) { setFile(selected); mutation.reset(); }
    e.target.value = '';
  };

  const handleZoneClick = () => {
    if (!mutation.isPending) fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (file) mutation.mutate(file);
  };

  const handleAdd = () => {
    onAdd();
    onClose();
  };

  const dropZoneClass = [
    'drop-zone',
    dragOver && !mutation.isPending ? 'drop-zone-active' : '',
    file && !mutation.isPending ? 'drop-zone-file-selected' : '',
    mutation.isPending ? 'drop-zone-uploading' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show modal-backdrop-clickable"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="addDocumentModalTitle">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addDocumentModalTitle">Add Document</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {mutation.isError && (
                <div className="alert alert-danger py-2" role="alert">
                  {mutation.error?.message ?? 'Unexpected error.'}
                </div>
              )}

              {/* Drop zone */}
              <div
                className={dropZoneClass}
                onClick={handleZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                aria-label="File drop zone"
                aria-disabled={mutation.isPending}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  onChange={handleFileInputChange}
                />
                {!file && (
                  <span className="text-muted">
                    Drag &amp; drop a file here, or click to browse
                  </span>
                )}
                {file && !mutation.isPending && (
                  <span className="fw-semibold">{file.name}</span>
                )}
                {mutation.isPending && (
                  <span className="text-muted">
                    <span className="spinner-border spinner-border-sm me-2 text-primary" role="status" aria-hidden="true" />
                    Uploading <strong>{file?.name}</strong>…
                  </span>
                )}
              </div>

              {/* Upload button */}
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleUpload}
                  disabled={!file || mutation.isPending || mutation.isSuccess}
                >
                  {mutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Uploading…
                    </>
                  ) : mutation.isSuccess ? (
                    '✓ Uploaded'
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAdd}
                disabled={!mutation.isSuccess}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDocumentModal;
