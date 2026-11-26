import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppLoader } from './shared/components/AppLoader';
import { ProtectedRoute } from './shared/components/ProtectedRoute';


function App() {
  const Admin = React.lazy(() => import('./pages/admin'));
  const Public = React.lazy(() => import('./pages/public'))


  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoader/>}>
        <ToastContainer />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
          <Route path="/public/*" element={<Public />} />
          <Route path="/" element={<Navigate to="/public" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
