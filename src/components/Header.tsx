import React from 'react';
import useAppStore from '../store';
import { ShieldCheck, Award, Zap, Building, Clock } from 'lucide-react';

export default function Header() {
  const { profile, subscription, setSubscription } = useAppStore();

  return (
    <header className="bg-[#0B0F1A] border-b border-gray-800 sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Brand & Active Dhandha */}
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20 text-lg">
            BK
          </div>
          <div>
            <h1 className="text-[#F59E0B] font-extrabold text-base tracking-tight leading-none">
              BillKaro
            </h1>
            <span className="text-[10px] text-gray-400 font-mono font-medium flex items-center mt-0.5">
              <Building className="h-2.5 w-2.5 mr-1 text-amber-500/80" />
              {profile.businessName || 'Mera Karobar'}
            </span>
          </div>
        </div>

        {/* Subscription Tier Controller */}
        <div className="flex items-center space-x-1 bg-gray-900 p-1 rounded-full border border-gray-800">
          <button
            onClick={() => setSubscription('FREE')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              subscription === 'FREE'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            FREE
          </button>
          <button
            onClick={() => setSubscription('PRO')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-0.5 ${
              subscription === 'PRO'
                ? 'bg-amber-500 text-[#0B0F1A]'
                : 'text-amber-500/80 hover:text-amber-400'
            }`}
          >
            <Zap className="h-2.5 w-2.5 fill-current" />
            <span>PRO</span>
          </button>
          <button
            onClick={() => setSubscription('YEARLY')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-0.5 ${
              subscription === 'YEARLY'
                ? 'bg-emerald-500 text-[#0B0F1A]'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="h-2.5 w-2.5" />
            <span>साल (₹1499)</span>
          </button>
        </div>
      </div>

      {/* Mini notification banner if on free */}
      {subscription === 'FREE' && (
        <div className="mt-2 text-center bg-amber-500/10 border border-amber-500/20 rounded py-1 px-2 flex items-center justify-between">
          <span className="text-[10px] text-amber-500 flex items-center font-medium">
            <Award className="h-3 w-3 mr-1 animate-pulse" />
            Free Trial active. Cards may have watermark. Limit: 5 Client maximum.
          </span>
          <button 
            onClick={() => setSubscription('PRO')}
            className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold hover:bg-amber-400"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </header>
  );
}
