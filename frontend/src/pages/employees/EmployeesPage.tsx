import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddEmployeeModal from '../../components/AddEmployeeModal';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import RowActionsMenu from '../../components/RowActionsMenu';
import { useEmployees } from '../../hooks/employees/useEmployees';
import useClickOutside from '../../hooks/useClickOutside';
import useLocalStorage from '../../hooks/useLocalStorage';
import config from '../../config';

const API_BASE = config.apiBaseUrl;

const EmployeesPage = () => {
  const { employees, isLoading, error } = useEmployees();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useLocalStorage('itemsPerPage', 5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  useClickOutside(menuRef, () => setOpenMenuId(null));

  const handleEmployeeAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setConfirmDeleteId(null);
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
        <strong>Could not load employees.</strong> {error.message}
        <p className="mt-2 mb-0 small">
          Make sure the backend is running on{' '}
          <code>{API_BASE}</code>.
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));
  const pagedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div>
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleEmployeeAdded}
        />
      )}

      {confirmDeleteId !== null && (
        <ConfirmModal
          title="Delete Employee"
          description="This action can not be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteMutation.mutate(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
          confirming={deleteMutation.isPending}
        />
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Employees</h4>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="alert alert-info">
          No employees found. Add some via the API with a POST to{' '}
          <code>{API_BASE}/api/employees</code>.
        </div>
      ) : (
        <>
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th></th>
            </tr>
          </thead>
          <tbody ref={menuRef}>
            {pagedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  <button
                    className="btn btn-link p-0 text-body text-decoration-underline"
                    onClick={() => navigate(`/employees/${employee.id}`)}
                  >
                    {employee.name}
                  </button>
                </td>
                <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                <td className="text-end">
                  <RowActionsMenu
                    isOpen={openMenuId === employee.id}
                    onToggle={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                    onOpen={() => navigate(`/employees/${employee.id}`)}
                    onDelete={() => { setOpenMenuId(null); setConfirmDeleteId(employee.id); }}
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

export default EmployeesPage;
