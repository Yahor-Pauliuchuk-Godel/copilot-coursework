import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const { count, setCount } = useAppContext();

  return (
    <div className="py-5 text-center">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body p-5">
          <h1 className="card-title display-5 fw-bold mb-3">
            Welcome to Starter App
          </h1>
          <p className="card-text text-muted mb-4">
            A minimal React + .NET 8 full-stack template. Browse the{' '}
            <strong>Items</strong> page to see data fetched from the backend API.
          </p>

          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCount(count - 1)}
            >
              −
            </button>
            <span className="fs-4 fw-semibold">{count}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCount(count + 1)}
            >
              +
            </button>
          </div>
          <p className="text-muted small mb-4">
            Counter powered by <code>useContext</code> + <code>useState</code>
          </p>

          <Link to="/items" className="btn btn-primary btn-lg">
            View Items →
          </Link>
        </div>
      </div>
    </div>
  );
}
