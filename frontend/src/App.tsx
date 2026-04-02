import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<ItemsPage />} />
        </Routes>
      </main>
    </>
  );
}
