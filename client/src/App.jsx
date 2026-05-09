import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar        from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import ProductStoryPage from './pages/ProductStoryPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/product/:certificateId" element={<ProductStoryPage />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen bg-weave flex items-center justify-center">
              <div className="card text-center max-w-md">
                <h2 className="font-display text-3xl text-earth mb-2">404</h2>
                <p className="font-body text-earth/60 mb-6">Page not found.</p>
                <a href="/" className="btn-primary inline-block">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
