import React, { useState } from 'react';
import { School, Member, MonthData, MonthlyRecord } from '../types';
import { Search, Plus, UserX, AlertTriangle, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface WorksheetProps {
  schools: School[];
  members: Member[];
  monthData: MonthData;
  onUpdateRecord: (memberId: string, updatedFields: Partial<MonthlyRecord>) => void;
  onAddMember: (name: string, schoolId: string) => void;
  onDeleteMember: (id: string) => void;
  onRollOverMonth: () => void;
  monthsList: MonthData[];
  selectedMonthId: string;
  onChangeMonth: (id: string) => void;
}

export default function Worksheet({
  schools,
  members,
  monthData,
  onUpdateRecord,
  onAddMember,
  onDeleteMember,
  onRollOverMonth,
  monthsList,
  selectedMonthId,
  onChangeMonth
}: WorksheetProps) {
  const [selectedRegion, setSelectedRegion] = useState<'AH' | 'AHB'>('AH');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools.find(s => !s.id.endsWith('-ahb'))?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filter schools by selected region
  const activeRegionSchools = schools.filter(s => selectedRegion === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));

  const handleRegionChange = (region: 'AH' | 'AHB') => {
    setSelectedRegion(region);
    const firstSchool = schools.find(s => region === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));
    if (firstSchool) {
      setSelectedSchoolId(firstSchool.id);
    }
  };

  // Custom modal states
  const [showConfirmRollOver, setShowConfirmRollOver] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filter members by selected school and search pattern
  const schoolMembers = members.filter(m => m.schoolId === selectedSchoolId);
  const filteredMembers = schoolMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedSchoolId) return;
    onAddMember(newMemberName.trim().toUpperCase(), selectedSchoolId);
    setNewMemberName('');
    setIsAdding(false);
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

  // Aggregated Sum totals of listed members
  let sumOutstanding = 0;
  let sumInstallment = 0;
  let sumInterest = 0;
  let sumSavings = 0;
  let sumTotal = 0;
  let sumRemaining = 0;

  filteredMembers.forEach(m => {
    const rec = monthData.records[m.id];
    if (rec) {
      if (!rec.isTidakBayar) {
        sumOutstanding += rec.jumlahPinjaman;
        sumInstallment += rec.angsuran;
        sumInterest += rec.jasa;
        sumSavings += rec.simpananWajib;
        sumTotal += rec.angsuran + rec.jasa + rec.simpananWajib;
        sumRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
      } else {
        sumOutstanding += rec.jumlahPinjaman;
        sumSavings += rec.simpananWajib; // Usually savings are still calculated or kept
        sumTotal += rec.simpananWajib;   
        sumRemaining += rec.jumlahPinjaman;
      }
    }
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="worksheet-panel">
      {/* Region / Wilayah Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100 divide-x divide-slate-200">
        <button
          type="button"
          onClick={() => handleRegionChange('AH')}
          className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedRegion === 'AH'
              ? 'bg-blue-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 bg-slate-100'
          }`}
          id="toggle-region-ah"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedRegion === 'AH' ? 'bg-white' : 'bg-blue-500'}`}></span>
          <span>WILAYAH UTAMA (AH) — 11 Sekolah</span>
        </button>
        <button
          type="button"
          onClick={() => handleRegionChange('AHB')}
          className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedRegion === 'AHB'
              ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 bg-slate-100'
          }`}
          id="toggle-region-ahb"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedRegion === 'AHB' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          <span>WILAYAH CABANG AHB (Air Hangat Barat) — 9 Sekolah</span>
        </button>
      </div>

      {/* Worksheet Control Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Month Chooser */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-mono">Periode Potongan</label>
            <select
              value={selectedMonthId}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              id="month-select"
            >
              {monthsList.map(m => (
                <option key={m.id} value={m.id}>{m.labelText}</option>
              ))}
            </select>
          </div>

          {/* School Selector */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-mono font-sans">Instansi / Sekolah</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              id="school-select"
            >
              {activeRegionSchools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Global actions: Increment Month / Skip toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowConfirmRollOver(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white rounded text-xs font-bold shadow-sm transition self-end md:self-auto uppercase tracking-wide cursor-pointer"
            title="Lanjutkan sisa pinjaman bulan ini menjadi saldo pinjaman pokok untuk bulan depan"
            id="roll-over-month-btn"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Otomasi Bulan Berikutnya</span>
          </button>
        </div>
      </div>

      {/* Grid Filter and Member Quick Add */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        {/* Search Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 font-medium"
            id="search-input"
          />
        </div>

        {/* Form Quick Add Member */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 text-blue-700 font-bold rounded text-xs transition uppercase tracking-wide cursor-pointer"
            id="add-member-toggle-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Anggota Baru</span>
          </button>
        ) : (
          <form onSubmit={handleAddMemberSubmit} className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded border border-slate-250">
            <input
              type="text"
              placeholder="NAMA LENGKAP ANGGOTA"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-xs uppercase font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              id="new-member-name-input"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-650 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wide"
              id="new-member-submit-btn"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-xs"
              id="new-member-cancel-btn"
            >
              Batal
            </button>
          </form>
        )}
      </div>

      {/* Spreadsheet List Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="worksheet-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-250 text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider sticky top-0 z-10">
              <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200">No</th>
              <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-200">Nama Anggota</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Sisa Pinjaman</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Potongan Angsuran</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Jasa Koperasi (1%)</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Simpanan Wajib</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Jumlah Total</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200">Sisa Akhir</th>
              <th className="py-2.5 px-3 w-16 text-center border-r border-slate-200">Ang Ke</th>
              <th className="py-2.5 px-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-xs">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 font-medium italic">
                  {searchQuery ? 'Tidak ada anggota yang cocok dengan kata kunci.' : 'Belum ada anggota di instansi/sekolah ini.'}
                </td>
              </tr>
            ) : (
              filteredMembers.map((m, idx) => {
                const rec = monthData.records[m.id];
                if (!rec) return null;

                const deductionTotal = rec.isTidakBayar
                  ? rec.simpananWajib 
                  : (rec.angsuran + rec.jasa + rec.simpananWajib);

                const computedRemaining = rec.isTidakBayar
                  ? rec.jumlahPinjaman
                  : Math.max(0, rec.jumlahPinjaman - rec.angsuran);

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      rec.isTidakBayar ? 'bg-amber-50/35 text-slate-400' : ''
                    }`}
                    id={`row-member-${m.id}`}
                  >
                    {/* No */}
                    <td className="py-1 px-3 text-center font-mono text-slate-450 border-r border-slate-150">
                      {idx + 1}
                    </td>

                    {/* Member name */}
                    <td className="py-1 px-3 font-semibold text-slate-850 border-r border-slate-150">
                      <div className="flex flex-col">
                        <span className={rec.isTidakBayar ? "line-through text-slate-400" : "text-slate-900"}>{m.name}</span>
                        {rec.isTidakBayar && (
                          <span className="text-[8px] font-bold text-amber-600 font-mono tracking-wider uppercase mt-0.5">
                            ⚠️ POTONGAN DITANGGUHKAN
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Jumlah Pinjaman (Pokok) */}
                    <td className="py-1 px-3 text-right font-mono border-r border-slate-150">
                      <input
                        type="number"
                        value={isNaN(rec.jumlahPinjaman) ? 0 : (rec.jumlahPinjaman ?? 0)}
                        onChange={(e) =>
                          onUpdateRecord(m.id, { jumlahPinjaman: parseInt(e.target.value) || 0 })
                        }
                        className="w-full text-right bg-transparent border-0 border-b border-transparent hover:border-slate-350 focus:border-blue-500 focus:ring-0 p-0.5 font-mono text-[11px] focus:outline-none focus:bg-white"
                      />
                    </td>

                    {/* Angsuran */}
                    <td className="py-1 px-3 text-right font-mono border-r border-slate-150">
                      <input
                        type="number"
                        value={isNaN(rec.angsuran) ? 0 : (rec.angsuran ?? 0)}
                        disabled={rec.isTidakBayar}
                        onChange={(e) =>
                          onUpdateRecord(m.id, { angsuran: parseInt(e.target.value) || 0 })
                        }
                        className={`w-full text-right bg-transparent border-0 border-b border-transparent hover:border-slate-350 focus:border-blue-500 focus:ring-0 p-0.5 font-mono text-[11px] focus:outline-none focus:bg-white ${
                          rec.isTidakBayar ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      />
                    </td>

                    {/* Jasa 1% */}
                    <td className="py-1 px-3 text-right font-mono border-r border-slate-150">
                      <input
                        type="number"
                        value={isNaN(rec.jasa) ? 0 : (rec.jasa ?? 0)}
                        disabled={rec.isTidakBayar}
                        onChange={(e) =>
                          onUpdateRecord(m.id, { jasa: parseInt(e.target.value) || 0 })
                        }
                        className={`w-full text-right bg-transparent border-0 border-b border-transparent hover:border-slate-350 focus:border-blue-500 focus:ring-0 p-0.5 font-mono text-[11px] focus:outline-none focus:bg-white ${
                          rec.isTidakBayar ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      />
                    </td>

                    {/* Simpanan Wajib */}
                    <td className="py-1 px-3 text-right font-mono border-r border-slate-150">
                      <input
                        type="number"
                        value={isNaN(rec.simpananWajib) ? 0 : (rec.simpananWajib ?? 0)}
                        onChange={(e) =>
                          onUpdateRecord(m.id, { simpananWajib: parseInt(e.target.value) || 0 })
                        }
                        className="w-full text-right bg-transparent border-0 border-b border-transparent hover:border-slate-355 focus:border-blue-500 focus:ring-0 p-0.5 font-mono text-[11px] focus:outline-none focus:bg-white"
                      />
                    </td>

                    {/* Total Potongan */}
                    <td className="py-1 px-3 text-right font-bold text-slate-900 font-mono border-r border-slate-150 bg-slate-50/50">
                      {formatRp(deductionTotal)}
                    </td>

                    {/* Sisa Pinjaman */}
                    <td className="py-1 px-3 text-right font-mono text-slate-600 border-r border-slate-150">
                      {formatRp(computedRemaining)}
                    </td>

                    {/* Ang Ke */}
                    <td className="py-1 px-3 text-center font-mono border-r border-slate-150">
                      <input
                        type="text"
                        value={rec.angKe === null ? '' : rec.angKe}
                        disabled={rec.isTidakBayar && rec.jumlahPinjaman === 0}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value);
                          onUpdateRecord(m.id, { angKe: isNaN(parsed) ? null : parsed });
                        }}
                        placeholder="-"
                        className="w-10 text-center bg-transparent border-0 border-b border-transparent hover:border-slate-350 focus:border-blue-500 focus:ring-0 p-0.5 font-mono text-[11px] focus:outline-none focus:bg-white"
                      />
                    </td>

                    {/* Actions column */}
                    <td className="py-1 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Skip payment toggle button */}
                        <button
                          onClick={() => onUpdateRecord(m.id, { isTidakBayar: !rec.isTidakBayar })}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-tight transition cursor-pointer ${
                            rec.isTidakBayar
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-slate-100 text-slate-550 hover:bg-amber-50 hover:text-amber-850'
                          }`}
                          title="Tangguhkan / Lewati Potongan Anggota Bulan Ini"
                          id={`toggle-skip-${m.id}`}
                        >
                          {rec.isTidakBayar ? 'Aktifkan' : 'Tangguhkan'}
                        </button>

                        {/* Delete member button */}
                        <button
                          type="button"
                          onClick={() => {
                            setMemberToDelete({ id: m.id, name: m.name });
                          }}
                          className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition cursor-pointer"
                          title="Hapus Anggota"
                          id={`delete-member-${m.id}`}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}

            {/* Aggregated totals row */}
            {filteredMembers.length > 0 && (
              <tr className="bg-slate-200/40 font-bold border-t-2 border-slate-300">
                <td className="py-2 px-3 text-center font-mono border-r border-slate-200"></td>
                <td className="py-2 px-3 text-slate-800 uppercase tracking-widest font-mono text-[10px] border-r border-slate-200">TOTAL SEKOLAH</td>
                <td className="py-2 px-3 text-right font-mono text-xs border-r border-slate-200">{formatRp(sumOutstanding)}</td>
                <td className="py-2 px-3 text-right font-mono text-xs border-r border-slate-200">{formatRp(sumInstallment)}</td>
                <td className="py-2 px-3 text-right font-mono text-xs border-r border-slate-200">{formatRp(sumInterest)}</td>
                <td className="py-2 px-3 text-right font-mono text-xs border-r border-slate-200">{formatRp(sumSavings)}</td>
                <td className="py-2 px-3 text-right font-mono text-blue-700 text-xs border-r border-slate-200 bg-slate-200/50">{formatRp(sumTotal)}</td>
                <td className="py-2 px-3 text-right font-mono text-xs border-r border-slate-200">{formatRp(sumRemaining)}</td>
                <td className="py-2 px-3 text-center font-mono text-[9px] border-r border-slate-200">-</td>
                <td className="py-2 px-3 bg-slate-200/20"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Guidance and explanatory footnotes */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Informasi: Anda dapat mengubah nominal Pokok, Angsuran, Jasa &amp; Simpanan langsung di tabel atas (Auto-Save).</span>
        </div>
        <div className="font-bold text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 tracking-wide uppercase">
          REKAPITULASI DUA WILAYAH
        </div>
      </div>

      {/* Confirmation Modals for Worksheet Actions */}
      <ConfirmModal
        isOpen={showConfirmRollOver}
        title="Otomasi Bulan Berikutnya"
        message={`Apakah Anda yakin ingin memproses data dari bulan "${monthData.labelText}" dan membuat bulan baru dengan melanjutkan saldo sisa pinjaman secara otomatis?`}
        type="info"
        confirmText="Ya, Otomasikan"
        cancelText="Batal"
        onConfirm={() => {
          onRollOverMonth();
          setShowConfirmRollOver(false);
        }}
        onCancel={() => setShowConfirmRollOver(false)}
      />

      <ConfirmModal
        isOpen={!!memberToDelete}
        title="Hapus Anggota Koperasi"
        message={`Apakah Anda yakin ingin menghapus data anggota "${memberToDelete?.name || ''}"? Segala histori potongan anggota ini juga akan terhapus secara permanen dari dashboard.`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (memberToDelete) {
            onDeleteMember(memberToDelete.id);
          }
          setMemberToDelete(null);
        }}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  );
}
