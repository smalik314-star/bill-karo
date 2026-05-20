import React, { useState } from 'react';
import useAppStore from '../store';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Check, 
  X, 
  Filter, 
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

export default function ExpenseTracker() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    recurringExpenses, 
    addRecurringExpense, 
    toggleRecurringPaid, 
    deleteRecurringExpense 
  } = useAppStore();

  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);

  // New Transaction states
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Materials (सामग्री)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // New Recurring states
  const [recName, setRecName] = useState('');
  const [recAmount, setRecAmount] = useState('');
  const [recDueDate, setRecDueDate] = useState('5th of month');
  const [recCategory, setRecCategory] = useState<'Rent' | 'Electricity' | 'EMI' | 'Salary' | 'Other'>('Rent');

  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    addTransaction({
      type: txType,
      category,
      amount: parseFloat(amount),
      date,
      notes: notes || 'Direct general entry'
    });

    setAmount('');
    setNotes('');
    setShowAddTx(false);
    alert("Hinglish: Naya lena/dena transactions register me note ho gaya!");
  };

  const handleAddRecurringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName.trim() || !recAmount) return;

    addRecurringExpense({
      name: recName,
      amount: parseFloat(recAmount) || 0,
      dueDate: recDueDate,
      category: recCategory
    });

    setRecName('');
    setRecAmount('');
    setShowAddRecurring(false);
    alert("Monthly custom fixed kharcha system me add ho gaya!");
  };

  const handleMarkRecurringPaid = (id: string, name: string) => {
    toggleRecurringPaid(id);
    alert(`Safalta Se: ${name} ko is month paid mark karke, bahi-khata ledger entry automatic likh di gayi hai!`);
  };

  // Filtered transactions
  const filteredTx = filterType === 'All' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  return (
    <div className="space-y-4">
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-bold text-gray-100">Kharche aur Kamai (Grahak Ledger + General Book)</h2>
        </div>
        <div className="flex space-x-1.5">
          <button
            onClick={() => setShowAddTx(!showAddTx)}
            className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white font-bold py-1 px-2.5 rounded text-[10px] transition cursor-pointer"
          >
            + Exp (खर्चा)
          </button>
          <button
            onClick={() => {
              setTxType('Income');
              setCategory('Project Pay (पेमेंट मिला)');
              setShowAddTx(true);
            }}
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black font-bold py-1 px-2.5 rounded text-[10px] transition cursor-pointer"
          >
            + Inc (कमार्इ)
          </button>
        </div>
      </div>

      {/* Write transaction inline form box */}
      {showAddTx && (
        <form onSubmit={handleAddTxSubmit} className="bg-[#151D30] border border-[#222E4A] rounded-xl p-4 space-y-3.5 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-[#222E4A]">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-tight">नयी एंट्री दर्ज करें (Scribble Ledger Record)</h3>
            <button type="button" onClick={() => setShowAddTx(false)}>
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#0B0F1A] p-1 rounded border border-[#222E4A]">
            <button
              type="button"
              onClick={() => setTxType('Expense')}
              className={`py-1 rounded text-[10px] font-bold text-center ${txType === 'Expense' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Expense (खर्चा)
            </button>
            <button
              type="button"
              onClick={() => setTxType('Income')}
              className={`py-1 rounded text-[10px] font-bold text-center ${txType === 'Income' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Income (कमार्इ)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">रकम (Amount ₹) *</label>
              <input 
                type="number"
                required
                placeholder="₹ 500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-[#222E4A] rounded p-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">दिनांक (Date)</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-[#222E4A] text-white rounded p-1 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">श्रेणी (Category)</label>
              {txType === 'Expense' ? (
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-[#222E4A] rounded p-1.5 text-xs text-white"
                >
                  <option value="Materials (सामग्री)">Materials (सामग्री)</option>
                  <option value="Karigar Dihaadi (Wages)">Karigar Dihaadi (Wages)</option>
                  <option value="Tea & Snacks (चाय-समोसा)">Tea & Snacks (चाय-समोसा)</option>
                  <option value="Electricity / Bijli (बिजली)">Electricity / Bijli (बिजली)</option>
                  <option value="Workshop Rent (किराया)">Workshop Rent (किराया)</option>
                  <option value="Petrol / Transport (डीजल)">Petrol / Transport (डीजल)</option>
                  <option value="Other Repairs (मशीन मरम्मत)">Other Repairs (मशीन मरम्मत)</option>
                </select>
              ) : (
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-[#222E4A] rounded p-1.5 text-xs text-secondary"
                >
                  <option value="Project Pay (पेमेंट मिला)">Project Pay (पेमेंट मिला)</option>
                  <option value="Advance Cash received">Advance Cash (एडवांस मिला)</option>
                  <option value="Retail customer payment">Retail payment (फुटकर बिक्री)</option>
                  <option value="Scrap Sale (लोहा कबाड़)">Scrap Sale (लोहा कबाड़)</option>
                </select>
              )}
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">टिप्पणी / विवरण (Remarks)</label>
              <input 
                type="text" 
                placeholder="e.g. Pappu Saria Malhotra metal list"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-[#222E4A] rounded p-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-2 rounded text-xs transition ${txType === 'Expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-black'}`}
          >
            दर्ज करें (Record in Register)
          </button>
        </form>
      )}

      {/* Tab: General accounting grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Side listing of Transactions */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex justify-between items-center bg-gray-900 p-3 rounded-2xl border border-gray-800">
            <span className="text-xs text-gray-400 font-bold uppercase font-mono">Ledger History Log</span>
            <div className="flex space-x-1.5">
              {['All', 'Income', 'Expense'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab as any)}
                  className={`px-2 py-0.5 rounded text-[9.5px] transition-all font-bold ${filterType === tab ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                >
                  {tab === 'All' ? 'Sabhi (सारे)' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {filteredTx.map(t => (
              <div 
                key={t.id}
                className="bg-gray-900 border border-gray-800 p-3.5 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-gray-100">{t.category}</span>
                    <span className={`text-[8px] font-bold uppercase font-mono px-1 border rounded ${t.type === 'Income' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-400/5'}`}>
                      {t.type}
                    </span>
                  </div>
                  <span className="text-[9.5px] text-gray-500 block leading-tight font-sans mt-0.5">{t.notes} — <b className="font-mono">{t.date}</b></span>
                </div>

                <div className="text-right flex items-center space-x-3 ml-2 shrink-0">
                  <span className={`font-mono text-xs font-black ${t.type === 'Income' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {t.type === 'Income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm("Kya aap ye transaction ledger nikalna chahte hain?")) deleteTransaction(t.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredTx.length === 0 && (
              <span className="text-xs text-gray-500 text-center block py-12">Register me abhi tak koi digital entry nahi hai.</span>
            )}
          </div>
        </div>

        {/* Right Side: Module 9 - Fixed/Recurring Expenses (Pakka Monthly Kharach) */}
        <div className="space-y-3">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <div>
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">Monthly fixed karcha</h3>
                <span className="text-[9px] text-gray-400 font-bold">Rent, Bijli bill, Loan EMI</span>
              </div>
              <button
                onClick={() => setShowAddRecurring(!showAddRecurring)}
                className="bg-amber-500 text-black p-1 rounded-xl hover:bg-amber-400 shrink-0 cursor-pointer"
                title="Add Recurring"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Config Recurring fixed cost form */}
            {showAddRecurring && (
              <form onSubmit={handleAddRecurringSubmit} className="bg-[#161B29] p-3 rounded-xl border border-gray-800 space-y-2.5 animate-fadeIn">
                <input 
                  type="text" 
                  required
                  placeholder="खर्चे का नाम (e.g. Shop Rent)"
                  value={recName}
                  onChange={e => setRecName(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white placeholder-gray-600 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    required
                    placeholder="₹ Amount"
                    value={recAmount}
                    onChange={e => setRecAmount(e.target.value)}
                    className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <select
                    value={recCategory}
                    onChange={e => setRecCategory(e.target.value as any)}
                    className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Electricity">Electricity</option>
                    <option value="EMI">EMI Loan</option>
                    <option value="Salary">Salary Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <input 
                  type="text" 
                  placeholder="Due date statement (e.g. Monthly 5 Tarikh)"
                  value={recDueDate}
                  onChange={e => setRecDueDate(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                />

                <button type="submit" className="w-full bg-amber-500 text-black py-1.5 rounded-xl text-[10px] font-bold uppercase font-mono cursor-pointer">
                  Save Template
                </button>
              </form>
            )}

            {/* List and Actions over recurring expenses */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {recurringExpenses.map(item => (
                <div key={item.id} className="bg-[#161B29] border border-gray-800 p-3 rounded-xl text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-gray-200 block truncate max-w-[140px]">{item.name}</span>
                      <span className="text-[9px] text-gray-500 font-mono">Due: {item.dueDate}</span>
                    </div>
                    <span className="font-bold font-mono text-gray-200 text-xs shrink-0 pl-1">₹{item.amount}</span>
                  </div>

                  {/* Connect recurring toggle to ledger transactions logs */}
                  <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-gray-800 text-[9.5px]">
                    <button
                      onClick={() => handleMarkRecurringPaid(item.id, item.name)}
                      className={`font-semibold px-2 py-0.5 rounded-xl flex items-center space-x-1 border cursor-pointer ${item.isPaidThisMonth ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400'}`}
                    >
                      <span>{item.isPaidThisMonth ? '✓ IS MONTH PAID' : '✗ MARK AS PAID'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecurringExpense(item.id)}
                      className="text-gray-500 hover:text-red-400 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
