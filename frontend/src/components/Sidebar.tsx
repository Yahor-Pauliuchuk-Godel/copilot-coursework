import { NavLink } from 'react-router-dom';
import EmployeesIcon from '../assets/icons/Employees.svg';
import SettingsIcon from '../assets/icons/Settings.svg';
import MainIcon from '../assets/icons/Main-icon.svg';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="d-flex flex-column bg-body-tertiary sidebar">
      <div className="d-flex justify-content-center pt-3 pb-2">
        <img src={MainIcon} alt="Skill Extraction Tool" width={24} height={24} />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `nav-link text-body d-flex flex-column align-items-center${isActive ? ' nav-link-active' : ''}`
            }
          >
            <img src={EmployeesIcon} alt="" width={24} height={24} className="mb-1" />
            <span>Employees</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link text-body d-flex flex-column align-items-center${isActive ? ' nav-link-active' : ''}`
            }
          >
            <img src={SettingsIcon} alt="" width={24} height={24} className="mb-1" />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
