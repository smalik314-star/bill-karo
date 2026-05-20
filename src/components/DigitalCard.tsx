import React, { useState } from 'react';
import useAppStore from '../store';
import { 
  CreditCard, 
  Phone, 
  Send, 
  CheckCircle, 
  Share2, 
  Check, 
  Sparkles, 
  Award,
  Plus,
  Trash2
} from 'lucide-react';

export default function DigitalCard() {
  const { profile, subscription, setSubscription } = useAppStore();

  // Customizer state
  const [theme, setTheme] = useState<'amber' | 'slate' | 'emerald' | 'crimson' | 'indigo'>('amber');
  const [tagline, setTagline] = useState('मजबूत काम, सही दाम और भरोसा!');
  const [newService, setNewService] = useState('');
  const [services, setServices] = useState<string[]>([
    'Iron Gate, Grill & Railings Designer',
    'Specialist Steel Shed and Roof fitting',
    'Laser iron sheet Cutting and CNC design',
    'Specialist electric arc Welding'
  ]);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    setServices([...services, newService.trim()]);
    setNewService('');
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, idx) => idx !== index));
  };

  // Color theme generator
  const getThemeClass = () => {
    switch (theme) {
      case 'amber':
        return {
          card: 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-600 text-[#0B0F1A]',
          accent: 'bg-[#0B0F1A] text-amber-500',
          badge: 'bg-[#0B0F1A]/10 text-black',
          button: 'bg-amber-500 hover:bg-amber-400 text-black',
        };
      case 'emerald':
        return {
          card: 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-800 text-white',
          accent: 'bg-white text-emerald-700',
          badge: 'bg-white/10 text-white',
          button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        };
      case 'crimson':
        return {
          card: 'bg-gradient-to-tr from-rose-800 via-red-700 to-amber-700 text-white',
          accent: 'bg-white text-rose-800',
          badge: 'bg-white/10 text-white',
          button: 'bg-rose-600 hover:bg-rose-500 text-white',
        };
      case 'indigo':
        return {
          card: 'bg-gradient-to-tr from-indigo-800 via-indigo-600 to-purple-800 text-white',
          accent: 'bg-white text-indigo-800',
          badge: 'bg-white/10 text-white',
          button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        };
      default: // slate
        return {
          card: 'bg-gradient-to-tr from-gray-900 via-slate-800 to-slate-950 text-gray-100',
          accent: 'bg-amber-500 text-black',
          badge: 'bg-slate-700/55 text-white',
          button: 'bg-slate-700 hover:bg-slate-600 text-white',
        };
    }
  };

  const style = getThemeClass();

  const handleCopyCard = () => {
    const cardText = `
*${profile.businessName || 'Mera Karobar'}*
_Digital Visiting Card_
__________________________
👤 Malik: ${profile.ownerName}
📞 Phone: ${profile.phone}
📍 Pata: ${profile.address}
💼 Tagline: "${tagline}"

 हमारे यहाँ ये बेहतरीन सेवाएं मिलती हैं:
${services.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}
__________________________
UPI Payment accepted: ${profile.upiId || 'Yes'}
Made via BillKaro App
    `;
    navigator.clipboard.writeText(cardText.trim());
    alert("Hinglish: WhatsApp share format successfully clipboard pe copy ho gaya hai!");
  };

  return (
    <div className="space-y-4">
      {/* Visual Header */}
      <div className="flex items-center space-x-2 pb-1 border-b border-gray-800">
        <CreditCard className="h-5 w-5 text-amber-500" />
        <h2 className="text-base font-bold text-gray-100">डिजिटल बिजनेस कार्ड (Insta Visiting Card Maker)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Interactive Card Mock-up */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Visiting Card Live Preview</span>
          
          <div className={`${style.card} rounded-2xl p-5 shadow-2xl relative min-h-[220px] flex flex-col justify-between border border-white/10 animate-fadeIn`}>
            
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest font-mono opacity-80 block">Verified Business</span>
                <h3 className="text-sm font-extrabold tracking-tight uppercase leading-tight mt-0.5">
                  {profile.businessName || 'Dhandhe Ka Name'}
                </h3>
                <p className="text-[9.5px] italic opacity-90 inline-block font-sans mt-0.5">
                  "{tagline}"
                </p>
              </div>
              
              <div className="h-8 w-8 rounded-lg bg-black/15 flex items-center justify-center font-bold text-xs">
                {profile.businessName ? profile.businessName.substring(0, 2).toUpperCase() : 'BK'}
              </div>
            </div>

            {/* Middle Services Scroll columns */}
            <div className="my-3 space-y-1">
              <span className="text-[8px] font-mono uppercase opacity-70 tracking-widest block font-bold">Services & Specialty</span>
              <div className="grid grid-cols-1 gap-1">
                {services.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="flex items-center text-[10px] space-x-1 opacity-90 font-medium">
                    <span className="h-1 w-1 rounded-full bg-current"></span>
                    <span className="truncate">{s}</span>
                  </div>
                ))}
                {services.length > 3 && (
                  <span className="text-[8px] italic opacity-60">+ {services.length - 3} aur specialty...</span>
                )}
              </div>
            </div>

            {/* Bottom metadata panel */}
            <div className="border-t border-black/10 pt-2 flex justify-between items-end text-[10px] font-mono mt-auto">
              <div>
                <span className="block text-[8px] uppercase opacity-70">Malik / Contact</span>
                <span className="font-extrabold">{profile.ownerName || 'Aman Sharma'}</span>
                <p className="flex items-center text-[9px] mt-0.5"><Phone className="h-2 w-2 mr-1" /> {profile.phone || '987XXXXXXXX'}</p>
              </div>
              <div className="text-right">
                <span className="block text-[8px] uppercase opacity-70">Address details</span>
                <span className="block text-[9px] truncate max-w-[150px]">{profile.address || 'Aligarh, India'}</span>
              </div>
            </div>

            {/* Watermark of FREE subscription */}
            {subscription === 'FREE' ? (
              <div className="mt-3 text-center border-t border-dashed border-black/10 pt-1 flex justify-between items-center text-[8.5px] opacity-75 font-mono">
                <span>⚡ Made with BillKaro App</span>
                <span className="bg-[#0B0F1A]/10 text-[#0B0F1A] px-1 rounded font-bold animate-pulse">Watermarked</span>
              </div>
            ) : (
              <div className="mt-3 text-center border-t border-dashed border-white/10 pt-1 text-[8.5px] opacity-60 font-mono text-right font-bold">
                ✓ Premium Member VIP Card
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCopyCard}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-[#0B0F1A] font-bold py-2 rounded text-xs transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>WhatsApp Copy & Share (WhatsApp पर भेजें)</span>
            </button>
          </div>
        </div>

        {/* Customizer settings */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Card Setup Settings</h3>

          {/* Theme choices of visiting cards */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">कार्ड कलर थीम (Accent Color Theme)</label>
            <div className="grid grid-cols-5 gap-1">
              {[
                { id: 'amber', class: 'bg-amber-500', name: 'Amber' },
                { id: 'slate', class: 'bg-slate-700', name: 'Charcoal' },
                { id: 'emerald', class: 'bg-emerald-600', name: 'Emerald' },
                { id: 'crimson', class: 'bg-rose-700', name: 'Crimson' },
                { id: 'indigo', class: 'bg-indigo-600', name: 'Indigo' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`py-1.5 rounded text-[9.5px] font-bold text-center border transition ${theme === t.id ? 'border-amber-500 text-white font-extrabold pb-1 px-1' : 'border-transparent text-gray-400'} ${t.class}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Business Tagline */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">व्यापार का नारा (Business Slogan/Tagline)</label>
            <input 
              type="text" 
              placeholder="e.g. Quality and Sincerity in Steel Structures"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full bg-[#0B0F1A] border border-gray-800 rounded p-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Business services adder */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 block">अपनी सेवाएँ जोड़ें (Customize Specialties)</label>
            <form onSubmit={handleAddService} className="flex space-x-1.5">
              <input 
                type="text" 
                placeholder="e.g. SS Staircase manufacturing, Aligarh works"
                value={newService}
                onChange={e => setNewService(e.target.value)}
                className="flex-1 bg-[#0B0F1A] border border-gray-800 rounded p-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-amber-500 text-black px-3.5 rounded text-xs font-bold font-mono"
              >
                Add
              </button>
            </form>

            <div className="space-y-1 max-h-[110px] overflow-y-auto">
              {services.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] bg-[#161B29] p-2 rounded-xl border border-gray-800">
                  <span className="text-gray-200 truncate pr-2">{item}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveService(idx)}
                    className="text-red-400 hover:text-red-300 transition shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
