import Breadcrumb from './Breadcrumb';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Breadcrumb />
        </div>
      </div>
    </nav>
  );
};

export default Header;
