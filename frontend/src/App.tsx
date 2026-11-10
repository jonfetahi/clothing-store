import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


function App() {
  const Admin = React.lazy(() => import('./pages/admin'));
  const Public = React.lazy(() => import('./pages/public'))


  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ToastContainer />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/public/*" element={<Public />} />
          <Route path="/" element={<Navigate to="/public" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
