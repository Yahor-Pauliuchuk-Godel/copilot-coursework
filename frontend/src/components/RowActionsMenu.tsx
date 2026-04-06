interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onDelete: () => void;
}

const RowActionsMenu = ({ isOpen, onToggle, onOpen, onDelete }: Props) => (
  <div className="dropdown">
    <button
      className="btn btn-link p-0 text-body text-decoration-none"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      &#x22EE;
    </button>
    <ul className={`dropdown-menu dropdown-menu-end${isOpen ? ' show' : ''}`}>
      <li>
        <button className="dropdown-item" onClick={onOpen}>
          Open
        </button>
      </li>
      <li>
        <button className="dropdown-item text-danger" onClick={onDelete}>
          Delete
        </button>
      </li>
    </ul>
  </div>
);

export default RowActionsMenu;
