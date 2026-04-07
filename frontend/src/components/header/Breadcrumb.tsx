import { Link, matchPath, useLocation } from 'react-router-dom';
import EmployeesIcon from '../../assets/icons/Employees.svg';
import SettingsIcon from '../../assets/icons/Settings.svg';

type BreadcrumbEntry = {
  pattern: string;
  icon?: string;
  label: string | ((params: Record<string, string | undefined>) => string);
  parent?: { to: string; icon: string; label: string };
};

const BREADCRUMBS: BreadcrumbEntry[] = [
  { pattern: '/employees/:id', label: p => `Details: ${p.id}`, parent: { to: '/employees', icon: EmployeesIcon, label: 'Employees' } },
  { pattern: '/employees', icon: EmployeesIcon, label: 'Employees' },
  { pattern: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Breadcrumb = () => {
  const location = useLocation();

  let matched: BreadcrumbEntry | undefined;
  let params: Record<string, string | undefined> = {};

  for (const entry of BREADCRUMBS) {
    const result = matchPath(entry.pattern, location.pathname);
    if (result) {
      matched = entry;
      params = result.params as Record<string, string | undefined>;
      break;
    }
  }

  if (!matched) return null;

  const label = typeof matched.label === 'function' ? matched.label(params) : matched.label;

  return (
    <>
      <span className="vr mx-3" />
      <nav aria-label="breadcrumb" className="d-flex align-items-center">
        {matched.parent && (
          <>
            <Link to={matched.parent.to} className="d-flex align-items-center link-body-emphasis">
              <img src={matched.parent.icon} alt="" role="presentation" width={20} height={20} className="me-2" />
              {matched.parent.label}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span aria-current="page" className="d-flex align-items-center">
          {matched.icon && <img src={matched.icon} alt="" role="presentation" width={20} height={20} className="me-2" />}
          {label}
        </span>
      </nav>
    </>
  );
};

export default Breadcrumb;
