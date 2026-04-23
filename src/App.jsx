import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import LocationPage from './pages/LocationPage';
import RoomPage from './pages/RoomPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="location/:id" element={<LocationPage />} />
        <Route path="room/:id" element={<RoomPage />} />
        <Route path="book/:id" element={<BookingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
