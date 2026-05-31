import React, { useState } from 'react';
import { School, Member, MonthData } from '../types';
import { Landmark, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';

interface LoanFormProps {
  schools: School[];
  members: Member[];
  monthData: MonthData;
  onApplyNewLoan: (
    memberId: string,
    loanAmount: number,
    installment: number,
    interest: number,
    startAngKe?: number
  ) => void;
}

export default function LoanForm({ schools, members, monthData, onApplyNewLoan }: LoanFormProps) {
  const [selectedRegion, setSelectedRegion] = useState<'AH' | 'AHB'>('AH');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools.find(s => !s.id.endsWith('-ahb'))?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  
  // Custom states for formula calculator
  const [loanAmount, setLoanAmount] = useState<number>(30000000); // default Rp 30.000.000
  const [interestPercent, setInterestPercent] = useState<number>(1); // default 1%
  const [tenorMonths, setTenorMonths] = useState<number>(30); // default 30 months
  
  // Custom overrides
  const [customInstallment, setCustomInstallment] = useState<number>(1000000);
  const [customInterest, setCustomInterest] = useState<number>(300000);
  const [startAngKe, setStartAngKe] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Automatically update suggested entries when loan parameters align
  const handleCalculateInstallment = () => {
    const suggestedInst = Math.round(loanAmount / tenorMonths);
    const suggestedInt = Math.round(loanAmount * (interestPercent / 100));
    setCustomInstallment(suggestedInst);
    setCustomInterest(suggestedInt);
    setIsCalculated(true);
    setSuccessMsg('');
  };

  const handleRegionChange = (region: 'AH' | 'AHB') => {
    setSelectedRegion(region);
    const firstSchool = schools.find(s => region === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));
    setSelectedSchoolId(firstSchool?.id || '');
    setSelectedMemberId('');
  };

  const filteredSchools = schools.filter(s => selectedRegion === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));
  const schoolMembers = members.filter(m => m.schoolId === selectedSchoolId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert('Pilihlah salah satu anggota terlebih dahulu.');
      return;
    }

    onApplyNewLoan(
      selectedMemberId,
      loanAmount,
      customInstallment,
      customInterest,
      startAngKe
    );

    const memberName = members.find(m => m.id === selectedMemberId)?.name || 'Anggota';
    setSuccessMsg(`Berhasil melakukan restrukturisasi pinjaman baru untuk ${memberName}! Saldo, angsuran ke-1, dan jasa 1% telah disinkronisasikan ke lembar potongan bulan ${monthData.labelText}.`);
    
    // Smooth scroll success into view or clear after 6 seconds
    setTimeout(() => {
      setSuccessMsg('');
    }, 8500);
  };

  // Helper currency format
  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="loan-form-panel">
      {/* Form Area */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">Restrukturisasi & Peminjaman Baru</h3>
            <p className="text-[11px] text-slate-400">Pendaftaran pinjaman baru yang mereset tenor dan mengkalkulasi jasa bulanan otomatis</p>
          </div>
          <Landmark className="w-5 h-5 text-slate-400" />
        </div>

        {successMsg && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-xs flex items-start gap-2.5 transition animate-fade-in" id="success-loan-alert">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Otomasi Selesai!</p>
              <p className="mt-0.5">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Region Selector Switch */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={() => handleRegionChange('AH')}
            className={`flex-1 py-1.5 text-center font-bold text-[10px] uppercase transition cursor-pointer ${
              selectedRegion === 'AH' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            Wilayah Utama AH (11 Sekolah)
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('AHB')}
            className={`flex-1 py-1.5 text-center font-bold text-[10px] uppercase transition cursor-pointer ${
              selectedRegion === 'AHB' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            Wilayah Cabang AHB (9 Sekolah)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* School Selector */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Instansi/Sekolah Anggota</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => {
                setSelectedSchoolId(e.target.value);
                setSelectedMemberId('');
              }}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Pilih Sekolah --</option>
              {filteredSchools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Member Selector */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Pilih Anggota Koperasi</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Anggota KPN --</option>
              {schoolMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100 my-4 pt-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3.5 font-mono">Kalkulator & Parameter Pinjaman</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Limit Base */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-1.5">Jumlah Sisa Pinjaman (Rp)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => {
                  setLoanAmount(parseInt(e.target.value) || 0);
                  setIsCalculated(false);
                }}
                className="bg-slate-50 border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-800"
              />
            </div>

            {/* Interest Slider/Input */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-1.5">Suku Jasa Koperasi (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestPercent}
                onChange={(e) => {
                  setInterestPercent(parseFloat(e.target.value) || 0);
                  setIsCalculated(false);
                }}
                className="bg-slate-50 border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-800"
              />
            </div>

            {/* Tenors */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-1.5">Tenor Angsuran (Bulan)</label>
              <input
                type="number"
                value={tenorMonths}
                onChange={(e) => {
                  setTenorMonths(parseInt(e.target.value) || 12);
                  setIsCalculated(false);
                }}
                className="bg-slate-50 border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleCalculateInstallment}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded transition cursor-pointer"
              id="calc-loan-btn"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Hitung Estimasi Otomatis</span>
            </button>
          </div>
        </div>

        {/* Adjusting precise offsets */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-800 font-sans uppercase tracking-wide">Review &amp; Kustomisasi Potongan Bulanan</span>
            {!isCalculated && (
              <span className="text-[10px] font-bold text-amber-600 animate-pulse">⚠️ Perlu hitung ulang</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col bg-white p-2.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold font-mono">Angsuran Pokok / Bulan</span>
              <input
                type="number"
                value={customInstallment}
                onChange={(e) => setCustomInstallment(parseInt(e.target.value) || 0)}
                className="bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-550 font-bold p-0 text-xs font-mono focus:outline-none mt-1 w-full text-slate-800"
              />
            </div>

            <div className="flex flex-col bg-white p-2.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold font-mono">Jasa Koperasi / Bulan</span>
              <input
                type="number"
                value={customInterest}
                onChange={(e) => setCustomInterest(parseInt(e.target.value) || 0)}
                className="bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-550 font-bold p-0 text-xs font-mono focus:outline-none mt-1 w-full text-blue-600"
              />
            </div>

            <div className="flex flex-col bg-white p-2.5 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold font-mono">Mulai Dari Angsuran Ke-</span>
              <input
                type="number"
                value={startAngKe}
                onChange={(e) => setStartAngKe(parseInt(e.target.value) || 1)}
                className="bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-550 font-bold p-0 text-xs font-mono focus:outline-none mt-1 w-full text-slate-850"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm transition cursor-pointer"
            id="apply-loan-btn"
          >
            <span>Daftarkan Pinjaman Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Guide Card Sidebar */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between border border-slate-800" id="loan-guide-sidebar">
        <div>
          <h3 className="text-xs font-bold tracking-wider font-mono text-blue-400 uppercase">Mengapa Menu Ini Penting?</h3>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Dahulu di Google Sheet, ketika ada anggota mendaftarkan pinjaman baru, Anda harus merevisi sisa pinjaman secara manual, mengubah hitungan persentase bunga satu-per-satu, dan mengatur penomoran angsuran secara berulang.
          </p>

          <div className="space-y-4 mt-6">
            <div className="flex gap-2 text-xs">
              <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold font-mono text-[9px] h-fit mt-0.5 uppercase tracking-wide">INTUTIF</span>
              <p className="text-slate-300">Memperbarui lembar potongan periode terpilih seketika.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold font-mono text-[9px] h-fit mt-0.5 uppercase tracking-wide">ROLLOVER</span>
              <p className="text-slate-300">Sisa saldo pinjaman otomatis disalurkan ke sisa pinjaman bulan depan seiring penekanan tombol rollover.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Metode Mutasi</span>
          <span className="text-xs text-white font-semibold mt-1 block">Siklus Potongan Bulanan Otomatis</span>
        </div>
      </div>
    </div>
  );
}
