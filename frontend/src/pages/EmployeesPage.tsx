import { useEffect, useRef, useState } from 'react';
import AddEmployeeModal from '../components/AddEmployeeModal';

const API_BASE = 'https://localhost:5001';

interface Employee {
  id: number;
  name: string;
  dateOfBirth: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/employees`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json() as Promise<Employee[]>;
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        <strong>Could not load employees.</strong> {error}
        <p className="mt-2 mb-0 small">
          Make sure the backend is running on{' '}
          <code>{API_BASE}</code>.
        </p>
      </div>
    );
  }

  function handleEmployeeAdded(employee: Employee) {
    setEmployees((prev) => [...prev, employee]);
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

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Employees</h2>
        <button
          className="btn btn-dark"
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
                  <div className="dropdown">
                    <button
                      className="btn btn-link p-0 text-body text-decoration-none"
                      onClick={() =>
                        setOpenMenuId(openMenuId === employee.id ? null : employee.id)
                      }
                      aria-expanded={openMenuId === employee.id}
                    >
                      &#x22EE;
                    </button>
                    <ul
                      className={`dropdown-menu dropdown-menu-end${openMenuId === employee.id ? ' show' : ''}`}
                    >
                      <li>
                        <button className="dropdown-item" onClick={() => {}}>
                          Open
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => {}}>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="itemsPerPage" className="form-label mb-0 small">
              Rows per page
            </label>
            <select
              id="itemsPerPage"
              className="form-select form-select-sm w-auto"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <span className="small">
            Page {currentPage} of {totalPages}
          </span>

          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              «
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ‹
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              ›
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
