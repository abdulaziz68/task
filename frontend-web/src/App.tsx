import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShopDrawingsPage from './pages/ShopDrawingsPage';
import RFIsPage from './pages/RFIsPage';
import MeetingsPage from './pages/MeetingsPage';
import EngineersPage from './pages/EngineersPage';
import TasksPage from './pages/TasksPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/shop-drawings"
              element={
                <PrivateRoute>
                  <Layout>
                    <ShopDrawingsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/rfis"
              element={
                <PrivateRoute>
                  <Layout>
                    <RFIsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <PrivateRoute>
                  <Layout>
                    <MeetingsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/engineers"
              element={
                <PrivateRoute>
                  <Layout>
                    <EngineersPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Layout>
                    <TasksPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
