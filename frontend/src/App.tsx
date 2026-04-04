import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import EmployeesPage from './pages/EmployeesPage';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
        </Routes>
      </main>
    </>
  );
}
