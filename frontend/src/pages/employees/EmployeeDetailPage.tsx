import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddDocumentModal from '../../components/AddDocumentModal';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import RowActionsMenu from '../../components/RowActionsMenu';
import { useEmployee } from '../../hooks/employees/useEmployee';
import { useEmployeeDocuments } from '../../hooks/employees/useEmployeeDocuments';
import useClickOutside from '../../hooks/useClickOutside';
import config from '../../config';

const API_BASE = config.apiBaseUrl;

const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const navigate = useNavigate();
  const { employee, isLoading, error } = useEmployee(employeeId);
  const { documents, isLoading: docsLoading, error: docsError } = useEmployeeDocuments(employeeId);

  const queryClient = useQueryClient();
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  useClickOutside(menuRef, () => setOpenMenuId(null));

  const handleDocumentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['employeeDocuments', employeeId] });
  };

  const deleteDocMutation = useMutation({
    mutationFn: async (docId: number) => {
      const res = await fetch(`${API_BASE}/api/employees/${employeeId}/documents/${docId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeDocuments', employeeId] });
      setConfirmDeleteDocId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Could not load employee.</strong> {error.message}
        <p className="mt-2 mb-0 small">
          Make sure the backend is running on <code>{API_BASE}</code>.
        </p>
      </div>
    );
  }

  if (!employee) return null;

  const totalPages = Math.max(1, Math.ceil(documents.length / itemsPerPage));
  const pagedDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div>
      {showAddDocModal && (
        <AddDocumentModal
          employeeId={employeeId}
          onClose={() => setShowAddDocModal(false)}
          onAdd={handleDocumentAdded}
        />
      )}

      {confirmDeleteDocId !== null && (
        <ConfirmModal
          title="Delete Document"
          description="This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteDocMutation.mutate(confirmDeleteDocId)}
          onClose={() => setConfirmDeleteDocId(null)}
          confirming={deleteDocMutation.isPending}
        />
      )}

      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary flex-shrink-0" onClick={() => navigate('/employees')}>
          &larr; Back
        </button>

        <div className="card mb-0">
          <div className="card-body py-2">
            <div className="d-flex gap-4 align-items-center">
              <span><strong>ID:</strong> {employee.id}</span>
              <span><strong>Name:</strong> {employee.name}</span>
              <span><strong>Date of Birth:</strong> {new Date(employee.dateOfBirth).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Documents</h5>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowAddDocModal(true)}
        >
          Add Document
        </button>
      </div>

      {docsLoading ? (
        <div className="d-flex justify-content-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : docsError ? (
        <div className="alert alert-danger" role="alert">
          <strong>Could not load documents.</strong> {docsError.message}
        </div>
      ) : documents.length === 0 ? (
        <div className="alert alert-info">No documents found for this employee.</div>
      ) : (
        <>
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Upload Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody ref={menuRef}>
              {pagedDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.fileName}</td>
                  <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <RowActionsMenu
                      isOpen={openMenuId === doc.id}
                      onToggle={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                      onDelete={() => { setOpenMenuId(null); setConfirmDeleteDocId(doc.id); }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          />
        </>
      )}
    </div>
  );
};

export default EmployeeDetailPage;
