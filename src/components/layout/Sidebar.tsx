import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store';
import useTranslation from '../../hooks/useTranslation';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  Calculator, 
  UserCheck, 
  TrendingUp, 
  CreditCard, 
  Package, 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const profile = useAppStore((state) => state.profile);
  const subscription = useAppStore((state) => state.subscription);

  const menuItems = [
    { id: 'dashboard', path: '/', label: 'डैशबोर्ड (Overview)', icon: LayoutDashboard },
    { id: 'clients', path: '/clients', label: 'ग्राहक खाता (Clients)', icon: Users },
    { id: 'quotations', path: '/quotations', label: 'एस्टीमेट (Quotations)', icon: ClipboardCheck },
    { id: 'invoices', path: '/invoices', label: 'पक्का बिल (Invoices)', icon: FileText },
    { id: 'profit', path: '/profit', label: 'प्राइवेट बचत (Estimate Margin)', icon: Calculator },
    { id: 'labour', path: '/labour', label: 'हाज़िरी रजिस्टर (Labour Attendance)', icon: UserCheck },
    { id: 'expenses', path: '/expenses', label: 'कमार्इ-खर्चा (Expense Book)', icon: TrendingUp },
    { id: 'digital-card', path: '/digital-card', label: 'डिजिटल कार्ड (Visiting Card)', icon: CreditCard },
    { id: 'stock', path: '/stock', label: 'स्टॉक माल (Inventory)', icon: Package },
    { id: 'profile', path: '/settings', label: 'सेटिंग्स और प्रोफाइल (Settings)', icon: Building },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('लॉगआउट सफल रहा!');
      navigate('/signin');
    } catch (err: any) {
      toast.error('लॉगआउट में त्रुटि हुई!');
    }
  };

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } z-30 select-none`}
    >
      {/* Brand logo & collapse switch */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/25 flex items-center justify-center rounded-xl text-amber-500">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-extrabold tracking-tight text-white text-base font-sans">
              Bill<span className="text-amber-500">Karo</span>
            </span>
          </div>
        )}
        
        {collapsed && (
          <div className="mx-auto h-8 w-8 bg-amber-500/10 border border-amber-500/25 flex items-center justify-center rounded-xl text-amber-500">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User profile brief & subscription status */}
      <div className="p-4 border-b border-gray-800 bg-[#0B0F1A]/30">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-sm border-2 border-gray-800">
            {profile.ownerName?.charAt(0) || 'B'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-gray-100 truncate">{profile.ownerName || 'Ledger Owner'}</h4>
              <p className="text-[10px] text-gray-400 truncate">{profile.businessName || 'Business Name'}</p>
              
              {/* Badge */}
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  subscription === 'PRO' || subscription === 'YEARLY' 
                    ? 'bg-amber-400/10 border border-amber-500/20 text-amber-500' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {subscription === 'PRO' || subscription === 'YEARLY' ? '⭐ PRO MEMBER' : 'FREE ACCOUNT'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 font-extrabold' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-amber-500' : 'text-gray-500'}`} />
              {!collapsed && (
                <span className="text-xs font-black truncate">{t(item.label)}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout triggers */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-2 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition text-gray-400 cursor-pointer text-left"
        >
          <LogOut className="h-4.5 w-4.5 text-red-500/70" />
          {!collapsed && (
            <span className="text-xs font-black">{t('लॉगआउट (Log Out)')}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
