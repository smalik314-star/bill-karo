import React, { useState } from 'react';
import useAppStore from '../store';
import { Labour } from '../types';
import { 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  DollarSign, 
  UserCheck, 
  Award 
} from 'lucide-react';

export default function LabourAttendance() {
  const { labourList, attendance, addLabour, deleteLabour, setAttendance } = useAppStore();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddWorker, setShowAddWorker] = useState(false);

  // New labour form state
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('500');
  const [newPhone, setNewPhone] = useState('');

  // Selected worker wage calculation sheet state
  const [selectedLabour, setSelectedLabour] = useState<Labour | null>(null);
  const [wagePaidInput, setWagePaidInput] = useState('');

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRate) return;

    addLabour({
      name: newName,
      dailyRate: parseFloat(newRate) || 400,
      phone: newPhone || 'NA'
    });

    setNewName('');
    setNewRate('500');
    setNewPhone('');
    setShowAddWorker(false);
    alert("Naya worker Haziri Register me add ho gaya!");
  };

  const handleAttendanceChange = (labourId: string, status: 'Present' | 'HalfDay' | 'Absent') => {
    setAttendance(labourId, selectedDate, status);
  };

  const calculateWorkerWageStats = (worker: Labour) => {
    const workerAttendance = attendance.filter(a => a.labourId === worker.id);
    const presentDays = workerAttendance.filter(a => a.status === 'Present').length;
    const halfDays = workerAttendance.filter(a => a.status === 'HalfDay').length;
    const absentDays = workerAttendance.filter(a => a.status === 'Absent').length;

    const totalDaysWorked = presentDays + (halfDays * 0.5);
    const totalEarned = totalDaysWorked * worker.dailyRate;

    return {
      presentDays,
      halfDays,
      absentDays,
      totalDaysWorked,
      totalEarned
    };
  };

  const handleRecordWagePaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabour) return;
    const amount = parseFloat(wagePaidInput);
    if (isNaN(amount) || amount <= 0) return;

    // Record this payment in transactions bookkeeping
    useAppStore.getState().addTransaction({
      type: 'Expense',
      category: 'Labour Wages Paid',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      notes: `Wage Payment of ₹${amount} made to ${selectedLabour.name}`
    });

    setWagePaidInput('');
    setSelectedLabour(null);
    alert("Dihadi Payment is recorded in Expense book! (खर्चे में मजदूरी सहेज दी गयी है!)");
  };

  return (
    <div className="space-y-4">
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-bold text-gray-100">हाज़िरी रजिस्टर (Labour Haziri Register)</h2>
        </div>
        <button
          onClick={() => setShowAddWorker(!showAddWorker)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-1.5 px-3 rounded text-xs flex items-center space-x-1 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Karigar</span>
        </button>
      </div>

      {/* Add Worker Inline Card */}
      {showAddWorker && (
        <form onSubmit={handleAddWorkerSubmit} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <h3 className="text-xs font-bold text-amber-500 uppercase">नया मजदूर / कारीगर दर्ज करें</h3>
            <button type="button" onClick={() => setShowAddWorker(false)}>
              <X className="h-4 w-4 text-gray-400 font-bold" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">नाम (Worker Name) *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Manoj Welder Aligarh"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">दहाड़ी दर (Daily Wage Rate ₹/Day) *</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 500"
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">फ़ोन नंबर (Phone No.)</label>
              <input 
                type="text" 
                maxLength={10}
                placeholder="e.g. 91xxxxxxxx"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-black py-2 rounded text-xs font-bold font-mono hover:bg-amber-400 transition"
          >
            करीगर को रजिस्टर में सहेजें (Save Worker)
          </button>
        </form>
      )}

      {/* Date Select Panel */}
      <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span className="text-xs text-gray-300 font-bold">हाजिरी की तारीख चुनें:</span>
        </div>
        <input 
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-[#0B0F1A] border border-gray-800 text-white rounded p-1.5 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Grid: Labour List Row and Attendance Options */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Today's Haziri Register Sheet</h3>
        
        {labourList.map(worker => {
          // Check custom status for this selected date
          const dayRecord = attendance.find(a => a.labourId === worker.id && a.date === selectedDate);
          const currentStatus = dayRecord ? dayRecord.status : null;

          return (
            <div 
              key={worker.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-black text-white">{worker.name}</h4>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 mt-1">
                  <span>Dihaadi: <b className="text-amber-500 font-bold">₹{worker.dailyRate}/Day</b></span>
                  <span>Contact: {worker.phone}</span>
                </div>
              </div>

              {/* Attendance quick control toggles */}
              <div className="flex items-center space-x-1.5 self-end md:self-auto">
                <button
                  onClick={() => handleAttendanceChange(worker.id, 'Present')}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition ${currentStatus === 'Present' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-[#0B0F1A] border-gray-800 text-gray-400'}`}
                >
                  पूरा दिन (Full)
                </button>
                <button
                  onClick={() => handleAttendanceChange(worker.id, 'HalfDay')}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition ${currentStatus === 'HalfDay' ? 'bg-amber-500 border-amber-400 text-[#0B0F1A]' : 'bg-[#0B0F1A] border-gray-800 text-gray-400'}`}
                >
                  आधा दिन (Half)
                </button>
                <button
                  onClick={() => handleAttendanceChange(worker.id, 'Absent')}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition ${currentStatus === 'Absent' ? 'bg-red-500 border-red-400 text-white' : 'bg-[#0B0F1A] border-gray-800 text-gray-400'}`}
                >
                  गैैर-हाजिर (Abs)
                </button>
              </div>
            </div>
          );
        })}

        {labourList.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-500 bg-gray-900 rounded-2xl border border-dashed border-gray-800">
            No Karigar found. Upar "New Karigar" daben aur haziri register chalu karein.
          </div>
        )}
      </div>

      {/* Wage Calculation Sheet Dashboard */}
      {labourList.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">मजदूरी हिसाब की बही (Karigaran Wage Ledger Summary)</h3>

          <div className="space-y-2">
            {labourList.map(worker => {
              const stats = calculateWorkerWageStats(worker);

              return (
                <div key={worker.id} className="bg-[#161B29] p-4 rounded-xl flex items-center justify-between border border-gray-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white block">{worker.name}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Present: <b>{stats.presentDays} Days</b>, HalfDay: <b>{stats.halfDays} Days</b>, Absent: <b>{stats.absentDays}</b>
                    </span>
                  </div>

                  <div className="text-right flex items-center space-x-3.5">
                    <div>
                      <span className="text-[8px] text-gray-500 block">TOTAL RECORDED WAGES</span>
                      <span className="font-black text-[#10B981] font-mono">₹{stats.totalEarned.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                      onClick={() => setSelectedLabour(worker)}
                      className="bg-amber-500 text-black px-2.5 py-1 rounded text-[10px] font-bold hover:bg-amber-400 transition"
                    >
                      हिसाब करें (Settle)
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Kya aap "${worker.name}" ko register se nikalna chahte hain?`)) {
                          deleteLabour(worker.id);
                        }
                      }}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wage settlement dialog sheet */}
      {selectedLabour && (
        <div className="fixed inset-0 bg-[#0B0F1A]/80 flex items-center justify-center p-3 z-50 animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <div>
                <span className="text-[9px] uppercase text-amber-500 font-mono block">Dihadi Settlement Journal</span>
                <h3 className="font-bold text-sm text-white">{selectedLabour.name}</h3>
              </div>
              <button onClick={() => setSelectedLabour(null)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-4 w-4 font-bold" />
              </button>
            </div>

            {/* Calculations review */}
            <div className="bg-[#161B29] border border-gray-800 p-4 rounded-xl text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Karigar Daily Wage:</span>
                <span>₹{selectedLabour.dailyRate}/Day</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Total days active:</span>
                <span className="text-amber-500 font-bold">{calculateWorkerWageStats(selectedLabour).totalDaysWorked} Days work</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-1.5">
                <span>Net wage payable:</span>
                <span className="text-lg">₹{calculateWorkerWageStats(selectedLabour).totalEarned.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment record widget */}
            <form onSubmit={handleRecordWagePaid} className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">रुपये भुगतान करें / एडवांस दें (Amount to Pay Now ₹)</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 3500"
                  value={wagePaidInput}
                  onChange={e => setWagePaidInput(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  max={calculateWorkerWageStats(selectedLabour).totalEarned}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-[#0B0F1A] font-extrabold py-2 rounded text-xs cursor-pointer"
              >
                ✓ Wage Payment Settle karein (Pay)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
