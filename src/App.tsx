import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import NewQuotation from './pages/NewQuotation';
import Invoices from './pages/Invoices';
import ProfitCalculator from './components/profit/ProfitCalculator';
import BusinessCard from './pages/BusinessCard';
import Labour from './pages/Labour';
import Expenses from './pages/Expenses';
import StockInventory from './components/StockInventory';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';

function MainAppContent() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Toast notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Global Header (Only displayed if not on auth pages) */}
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && (
          <Header />
        )}

        {/* Active router views */}
        <div id="active-viewport" className="animate-fadeIn mt-2">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Dashboard onNavigate={(tab) => {
              const tabPathMap: Record<string, string> = {
                dashboard: '/',
                clients: '/clients',
                quotations: '/quotations',
                invoices: '/invoices',
                profit: '/profit',
                labour: '/labour',
                expenses: '/expenses',
                'digital-card': '/digital-card',
                stock: '/stock',
                profile: '/profile'
              };
              navigate(tabPathMap[tab] || '/');
            }} />} />
            
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/quotations" element={<NewQuotation />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/profit" element={<ProfitCalculator />} />
            <Route path="/labour" element={<Labour />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/digital-card" element={<BusinessCard />} />
            <Route path="/stock" element={<StockInventory />} />
            <Route path="/profile" element={<ProfileSetup />} />
          </Routes>
        </div>
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainAppContent />
    </BrowserRouter>
  );
}
