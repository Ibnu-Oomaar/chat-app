import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/chat'; // ✅ FIXED
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import Calls from './pages/Calls';
import Profile from './pages/Profile';

import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  // optional: ka hortag crash haddii undefined
  if (isAuthenticated === undefined) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* 🔥 muhiim: ha isticmaalin /chat */}
          <Route index element={<Navigate to="chat" />} />
          <Route path="chat" element={<Chat />} />
          <Route path="friends" element={<Friends />} />
          <Route path="settings" element={<Settings />} />
          <Route path="calls" element={<Calls />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </Router>
  );
}