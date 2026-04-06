import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../config';
import type { Employee } from '../hooks/useEmployees';
import './AddEmployeeModal.css';

const API_BASE = config.apiBaseUrl;

const NAME_REGEX = /^[a-zA-Z\s'\-]*$/;

interface Props {
  onClose: () => void;
  onAdd: (employee: Employee) => void;
}

const AddEmployeeModal = ({ onClose, onAdd }: Props) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.length > 0 && !NAME_REGEX.test(value)) {
      setNameError('Name must contain only letters, spaces, hyphens, or apostrophes.');
    } else {
      setNameError(null);
    }
  }

  const isValid = name.trim().length > 0 && nameError === null && dateOfBirth !== null;

  const handleAdd = async () => {
    if (!isValid || !dateOfBirth) return;

    setSubmitting(true);
    setServerError(null);

    const body = {
      name: name.trim(),
      dateOfBirth: dateOfBirth.toLocaleDateString('en-CA'), // YYYY-MM-DD
    };

    try {
      const res = await fetch(`${API_BASE}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const created: Employee = await res.json();
      onAdd(created);
      onClose();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show modal-backdrop-clickable"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="addEmployeeModalTitle">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEmployeeModalTitle">Add Employee</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {serverError && (
                <div className="alert alert-danger py-2" role="alert">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div className="mb-3">
                <label htmlFor="employeeName" className="form-label">Name</label>
                <input
                  id="employeeName"
                  type="text"
                  className={`form-control${nameError ? ' is-invalid' : ''}`}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter full name"
                  autoComplete="off"
                />
                {nameError && (
                  <div className="invalid-feedback">{nameError}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="mb-3">
                <label htmlFor="employeeDob" className="form-label">Date of Birth</label>
                <div>
                  <DatePicker
                    id="employeeDob"
                    selected={dateOfBirth}
                    onChange={(date: Date | null) => setDateOfBirth(date)}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select date of birth"
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAdd}
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Adding…
                  </>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeModal;
