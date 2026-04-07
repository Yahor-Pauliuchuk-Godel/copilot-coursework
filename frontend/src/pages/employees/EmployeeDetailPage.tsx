import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee } from '../../hooks/employees/useEmployee';
import config from '../../config';

const API_BASE = config.apiBaseUrl;

const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const navigate = useNavigate();
  const { employee, isLoading, error } = useEmployee(employeeId);

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

  return (
    <div className="d-flex align-items-center gap-3">
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
  );
};

export default EmployeeDetailPage;
