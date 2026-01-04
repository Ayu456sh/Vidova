import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GlassCard from './components/GlassCard';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Public Dashboard (or semi-protected depending on reqs, leaving public for viewing, actions protected) */}
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="watch/:id" element={<Watch />} />

              {/* Protected Upload Route */}
              <Route
                path="upload"
                element={
                  <ProtectedRoute allowedRoles={['Editor', 'Admin']}>
                    <Upload />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
