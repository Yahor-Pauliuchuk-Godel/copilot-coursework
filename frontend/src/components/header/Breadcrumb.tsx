import { useLocation, useMatch } from 'react-router-dom';
import EmployeesIcon from '../../assets/icons/Employees.svg';
import SettingsIcon from '../../assets/icons/Settings.svg';

const Breadcrumb = () => {
  const location = useLocation();
  const detailMatch = useMatch('/employees/:id');

  if (detailMatch) {
    return (
      <>
        <span className="vr mx-3" />
        <img src={EmployeesIcon} alt="" width={20} height={20} className="me-2" />
        <span className="text-body">{`Employees / Details: ${detailMatch.params.id}`}</span>
      </>
    );
  }

  if (location.pathname.startsWith('/employees')) {
    return (
      <>
        <span className="vr mx-3" />
        <img src={EmployeesIcon} alt="" width={20} height={20} className="me-2" />
        <span className="text-body">Employees</span>
      </>
    );
  }

  if (location.pathname.startsWith('/settings')) {
    return (
      <>
        <span className="vr mx-3" />
        <img src={SettingsIcon} alt="" width={20} height={20} className="me-2" />
        <span className="text-body">Settings</span>
      </>
    );
  }

  return null;
};

export default Breadcrumb;
