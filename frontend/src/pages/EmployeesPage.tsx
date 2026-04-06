import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AddEmployeeModal from '../components/AddEmployeeModal';
import Pagination from '../components/Pagination';
import RowActionsMenu from '../components/RowActionsMenu';
import { useTheme } from '../context/ThemeContext';
import { useEmployees } from '../hooks/useEmployees';
import useClickOutside from '../hooks/useClickOutside';
import config from '../config';

const API_BASE = config.apiBaseUrl;

const EmployeesPage = () => {
  const { employees, isLoading, error } = useEmployees();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const menuRef = useRef<HTMLTableSectionElement>(null);
  const { theme } = useTheme();

  useClickOutside(menuRef, () => setOpenMenuId(null));

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

  const handleEmployeeAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

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

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Employees</h2>
        <button
          className={`btn ${theme === 'dark' ? 'btn-light' : 'btn-dark'}`}
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
          <thead className="table-dark">
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
                <td>{employee.name}</td>
                <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                <td className="text-end">
                  <RowActionsMenu
                    isOpen={openMenuId === employee.id}
                    onToggle={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                    onOpen={() => {}}
                    onDelete={() => {}}
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
