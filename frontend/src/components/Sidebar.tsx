import { NavLink } from 'react-router-dom';
import EmployeesIcon from '../assets/icons/Employees.svg';
import SettingsIcon from '../assets/icons/Settings.svg';

export default function Sidebar() {
  return (
    <nav className="d-flex flex-column bg-dark" style={{ width: 'max-content' }}>
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <NavLink
            to="/employees"
            className="nav-link text-white d-flex flex-column align-items-center"
            style={({ isActive }) => isActive ? { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '0.375rem' } : {}}
            end
          >
            <img src={EmployeesIcon} alt="" width={24} height={24} className="mb-1" />
            <span>Employees</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/settings"
            className="nav-link text-white d-flex flex-column align-items-center"
            style={({ isActive }) => isActive ? { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '0.375rem' } : {}}
          >
            <img src={SettingsIcon} alt="" width={24} height={24} className="mb-1" />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
