import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Sidebar from './components/Sidebar';
import EmployeesPage from './pages/employees/EmployeesPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Header />
        <main className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/employees" replace />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
