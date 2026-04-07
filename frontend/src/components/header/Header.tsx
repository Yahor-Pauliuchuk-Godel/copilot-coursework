import Breadcrumb from './Breadcrumb';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span className="navbar-brand mb-0">
            Skill Extraction Tool
          </span>
          <Breadcrumb />
        </div>
      </div>
    </nav>
  );
};

export default Header;
