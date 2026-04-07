import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h4>Settings</h4>

      <div className="mt-4">
        <h5>Appearance</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="themeToggle"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <label className="form-check-label" htmlFor="themeToggle">
            Dark mode
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
