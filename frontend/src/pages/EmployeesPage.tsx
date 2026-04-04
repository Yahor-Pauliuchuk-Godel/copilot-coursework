import { useEffect, useRef, useState } from 'react';

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Employees</h2>
        <span className="badge bg-secondary">{employees.length} total</span>
      </div>

      {employees.length === 0 ? (
        <div className="alert alert-info">
          No employees found. Add some via the API with a POST to{' '}
          <code>{API_BASE}/api/employees</code>.
        </div>
      ) : (
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
            {employees.map((employee) => (
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
      )}
    </div>
  );
}
