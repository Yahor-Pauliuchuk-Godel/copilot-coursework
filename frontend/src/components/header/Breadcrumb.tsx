import { Link, useLocation, useMatch } from 'react-router-dom';
import EmployeesIcon from '../../assets/icons/Employees.svg';
import SettingsIcon from '../../assets/icons/Settings.svg';

const Breadcrumb = () => {
  const location = useLocation();
  const detailMatch = useMatch('/employees/:id');

  if (detailMatch) {
    return (
      <>
        <span className="vr mx-3" />
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/employees">
                <img src={EmployeesIcon} alt="" role="presentation" width={20} height={20} className="me-2" />
                Employees
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {`Details: ${detailMatch.params.id}`}
            </li>
          </ol>
        </nav>
      </>
    );
  }

  if (location.pathname.startsWith('/employees')) {
    return (
      <>
        <span className="vr mx-3" />
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active" aria-current="page">
              <img src={EmployeesIcon} alt="" role="presentation" width={20} height={20} className="me-2" />
              Employees
            </li>
          </ol>
        </nav>
      </>
    );
  }

  if (location.pathname.startsWith('/settings')) {
    return (
      <>
        <span className="vr mx-3" />
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active" aria-current="page">
              <img src={SettingsIcon} alt="" role="presentation" width={20} height={20} className="me-2" />
              Settings
            </li>
          </ol>
        </nav>
      </>
    );
  }

  return null;
};

export default Breadcrumb;
