
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MatchFinder from './pages/MatchFinder';
import GroupWorkspace from './pages/GroupWorkspace';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <AppRoutes />
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/find" element={<ProtectedRoute><MatchFinder /></ProtectedRoute>} />
      <Route path="/group/:id" element={<ProtectedRoute><GroupWorkspace /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
