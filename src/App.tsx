/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { School, Member, MonthData, MonthlyRecord, SignerConfig } from './types';
import {
  INITIAL_SCHOOLS,
  INITIAL_MEMBERS,
  DEFAULT_SIGNERS,
  getInitialMonths
} from './data';
import StatsOverview from './components/StatsOverview';
import Worksheet from './components/Worksheet';
import LoanForm from './components/LoanForm';
import PdfReport from './components/PdfReport';
import Settings from './components/Settings';
import SchoolApproval from './components/SchoolApproval';
import ArrearsViewer from './components/ArrearsViewer';
import { GasService } from './services/gasService';
import {
  Layers,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Calculator,
  Printer,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Database,
  ShieldAlert,
  Landmark
} from 'lucide-react';

const STORAGE_KEY_SCHOOLS = 'kpn_schools_db';
const STORAGE_KEY_MEMBERS = 'kpn_members_db';
const STORAGE_KEY_MONTHS = 'kpn_months_db';
const STORAGE_KEY_CONFIG = 'kpn_config_db';
const STORAGE_DB_VERSION_KEY = 'kpn_db_version_v5_jan_2026';

export default function App() {
  // --- CORE STATE ---
  const [schools, setSchools] = useState<School[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [months, setMonths] = useState<MonthData[]>([]);
  const [config, setConfig] = useState<SignerConfig>(DEFAULT_SIGNERS);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('jan-2026');
  const [activeTab, setActiveTab] = useState<'worksheet' | 'loan-wizard' | 'reports' | 'settings' | 'approval-sekolah' | 'tunggakan'>('worksheet');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Trigger automated backend state synchronization
  const reloadBackendState = async () => {
    setIsSyncing(true);
    try {
      const activeLoans = await GasService.execute<any[]>('getDataPinjamanAktif');
      const allMembers = await GasService.execute<any[]>('getDataMasterAnggota');
      
      if (allMembers && allMembers.length > 0) {
        const mappedMembers: Member[] = allMembers.map(m => ({
          id: m.nomor || m.id,
          name: m.nama,
          schoolId: m.sekolah || m.schoolId
        }));
        setMembers(mappedMembers);
        
        setMonths(prevMonths => {
          return prevMonths.map(mMonth => {
            const updatedRecords = { ...mMonth.records };
            mappedMembers.forEach(mem => {
              const loan = activeLoans.find(l => l.nomor === mem.id);
              if (loan) {
                updatedRecords[mem.id] = {
                  memberId: mem.id,
                  jumlahPinjaman: loan.sisaPinjaman,
                  angsuran: loan.angsuran,
                  jasa: loan.jasa,
                  simpananWajib: loan.iuranWajib || 100000,
                  angKe: updatedRecords[mem.id]?.angKe || 1,
                  isTidakBayar: loan.sisaPinjaman === 0 && loan.angsuran === 0 ? true : (updatedRecords[mem.id]?.isTidakBayar || false)
                };
              } else {
                updatedRecords[mem.id] = {
                  memberId: mem.id,
                  jumlahPinjaman: 0,
                  angsuran: 0,
                  jasa: 0,
                  simpananWajib: 100000,
                  angKe: null,
                  isTidakBayar: false
                };
              }
            });
            return {
              ...mMonth,
              records: updatedRecords
            };
          });
        });
      }
    } catch (e) {
      console.warn("Failed to synchronize local state with backend database on start: ", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Synchronize on load
  useEffect(() => {
    reloadBackendState();
  }, []);

  // --- INITIAL LOAD & LOCAL STORAGE SYNC ---
  useEffect(() => {
    try {
      const currentVersion = localStorage.getItem(STORAGE_DB_VERSION_KEY);
      if (currentVersion !== 'v5_jan_2026') {
        localStorage.removeItem(STORAGE_KEY_SCHOOLS);
        localStorage.removeItem(STORAGE_KEY_MEMBERS);
        localStorage.removeItem(STORAGE_KEY_MONTHS);
        localStorage.setItem(STORAGE_DB_VERSION_KEY, 'v5_jan_2026');

        setSchools(INITIAL_SCHOOLS);
        setMembers(INITIAL_MEMBERS);
        setMonths(getInitialMonths());
        setConfig(DEFAULT_SIGNERS);
        return;
      }

      const cachedSchools = localStorage.getItem(STORAGE_KEY_SCHOOLS);
      const cachedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS);
      const cachedMonths = localStorage.getItem(STORAGE_KEY_MONTHS);
      const cachedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);

      if (cachedSchools && cachedMembers && cachedMonths) {
        let loadedSchools = JSON.parse(cachedSchools) as School[];
        let loadedMembers = JSON.parse(cachedMembers) as Member[];
        let loadedMonths = JSON.parse(cachedMonths) as MonthData[];
        let updated = false;

        // Check if any school from INITIAL_SCHOOLS is missing or has a renamed name
        INITIAL_SCHOOLS.forEach(initSch => {
          const matched = loadedSchools.find(s => s.id === initSch.id);
          if (!matched) {
            loadedSchools.push(initSch);
            updated = true;
          } else if (matched.name !== initSch.name) {
            matched.name = initSch.name;
            updated = true;
          }
        });

        // Keep order of INITIAL_SCHOOLS for default schools, but also fully preserve any custom/sheets schools
        const initialSchIds = INITIAL_SCHOOLS.map(s => s.id);
        const defaultSchools = loadedSchools.filter(s => initialSchIds.includes(s.id));
        const customSchools = loadedSchools.filter(s => !initialSchIds.includes(s.id));

        const sortedDefaultSchools = [...defaultSchools].sort(
          (a, b) => initialSchIds.indexOf(a.id) - initialSchIds.indexOf(b.id)
        );

        const newAllSchools = [...sortedDefaultSchools, ...customSchools];
        const currentSchIds = loadedSchools.map(s => s.id).join(',');
        const targetSchIds = newAllSchools.map(s => s.id).join(',');

        if (currentSchIds !== targetSchIds) {
          loadedSchools = newAllSchools;
          updated = true;
        }

        // Check if any member from INITIAL_MEMBERS is missing or belongs to a different school/has different name now
        INITIAL_MEMBERS.forEach(initMem => {
          const matched = loadedMembers.find(m => m.id === initMem.id);
          if (!matched) {
            loadedMembers.push(initMem);
            updated = true;
          } else if (matched.name !== initMem.name || matched.schoolId !== initMem.schoolId) {
            matched.name = initMem.name;
            matched.schoolId = initMem.schoolId;
            updated = true;
          }
        });

        // Load pristine database numbers as defaults only if records are missing,
        // allowing user updates and Google Sheet synchronizations to persist reliably.
        const tempMonths = getInitialMonths();
        loadedMonths = loadedMonths.map((mMonth, monthIdx) => {
          // Ensure every month has records for all members
          loadedMembers.forEach(mem => {
            if (!mMonth.records[mem.id]) {
              const initialRecordForMem = tempMonths[monthIdx]?.records[mem.id] || {
                memberId: mem.id,
                jumlahPinjaman: 0,
                angsuran: 0,
                jasa: 0,
                simpananWajib: 100000,
                angKe: null,
                isTidakBayar: true
              };
              mMonth.records[mem.id] = initialRecordForMem;
              updated = true;
            }
          });
          return mMonth;
        });

        setSchools(loadedSchools);
        setMembers(loadedMembers);
        setMonths(loadedMonths);
        if (cachedConfig) setConfig(JSON.parse(cachedConfig));

        if (updated) {
          localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(loadedSchools));
          localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(loadedMembers));
          localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(loadedMonths));
          console.log("Database synchronized with new master schools/members successfully.");
        }
      } else {
        // First load, populate with initial data
        setSchools(INITIAL_SCHOOLS);
        setMembers(INITIAL_MEMBERS);
        const initM = getInitialMonths();
        setMonths(initM);
        setConfig(DEFAULT_SIGNERS);
      }
    } catch (e) {
      console.error('Failed to parse cached data. Resetting state...', e);
      setSchools(INITIAL_SCHOOLS);
      setMembers(INITIAL_MEMBERS);
      setMonths(getInitialMonths());
      setConfig(DEFAULT_SIGNERS);
    }
  }, []);

  // Save changes to LocalStorage whenever state updates
  useEffect(() => {
    if (schools.length > 0) localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    if (members.length > 0) localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (months.length > 0) localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
  }, [months]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  // Active Month Finder
  const activeMonthData = months.find(m => m.id === selectedMonthId) || months[0];

  // --- HANDLERS ---

  // Update specific cells inside the worksheet
  const handleUpdateRecord = (memberId: string, updatedFields: Partial<MonthlyRecord>) => {
    setMonths(prevMonths => {
      return prevMonths.map(m => {
        if (m.id !== selectedMonthId) return m;

        const existingRecord = m.records[memberId] || {
          memberId,
          jumlahPinjaman: 0,
          angsuran: 0,
          jasa: 0,
          simpananWajib: 100000,
          angKe: null,
          isTidakBayar: false
        };

        return {
          ...m,
          records: {
            ...m.records,
            [memberId]: {
              ...existingRecord,
              ...updatedFields
            }
          }
        };
      });
    });
  };

  // Add Member
  const handleAddMember = (name: string, schoolId: string) => {
    const newMemberId = `m-custom-${Date.now()}`;
    const newMember: Member = {
      id: newMemberId,
      name: name.toUpperCase(),
      schoolId
    };

    setMembers(prev => [...prev, newMember]);

    // Add empty records for all months for this member
    setMonths(prevMonths => {
      return prevMonths.map(m => {
        return {
          ...m,
          records: {
            ...m.records,
            [newMemberId]: {
              memberId: newMemberId,
              jumlahPinjaman: 0,
              angsuran: 0,
              jasa: 0,
              simpananWajib: 100000,
              angKe: null,
              isTidakBayar: false
            }
          }
        };
      });
    });
  };

  // Delete Member
  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    // Prune the member records
    setMonths(prevMonths => {
      return prevMonths.map(m => {
        const copy = { ...m.records };
        delete copy[id];
        return {
          ...m,
          records: copy
        };
      });
    });
  };

  // Apply Peminjaman Baru / Restructuring a Member
  const handleApplyNewLoan = (
    memberId: string,
    loanAmount: number,
    installment: number,
    interest: number,
    startAngKeValue = 1
  ) => {
    handleUpdateRecord(memberId, {
      jumlahPinjaman: loanAmount,
      angsuran: installment,
      jasa: interest,
      angKe: startAngKeValue,
      isTidakBayar: false
    });
  };

  // "Automate Next Month" (Siklus Rollover Bulanan)
  const handleRollOverMonth = () => {
    if (months.length === 0) return;

    // Get latest month in the row
    const latestMonth = months[months.length - 1];
    
    // Parse latest label, e.g. "Juni 2026"
    const parts = latestMonth.labelText.split(' ');
    const monthName = parts[0] || 'Juni';
    const year = parseInt(parts[1]) || 2026;

    const idIndoMonths = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    let currentIdx = idIndoMonths.indexOf(monthName);
    if (currentIdx === -1) currentIdx = 5; // fallback

    let nextIdx = currentIdx + 1;
    let nextYear = year;
    if (nextIdx >= 12) {
      nextIdx = 0;
      nextYear += 1;
    }

    const nextMonthName = idIndoMonths[nextIdx];
    const nextLabelText = `${nextMonthName} ${nextYear}`;
    const nextId = `${nextMonthName.substring(0, 3).toLowerCase()}-${nextYear}`;

    // Verify duplication
    if (months.some(m => m.id === nextId)) {
      alert(`Bulan "${nextLabelText}" sudah tergenerasi sebelumnya.`);
      return;
    }

    // Now copy and process starting balances from latestMonth records
    const nextMonthRecords: Record<string, MonthlyRecord> = {};

    members.forEach(m => {
      const prevRec = latestMonth.records[m.id];
      if (prevRec) {
        // New start balance is outstanding loan of previous month
        const prevComputedRem = prevRec.isTidakBayar
          ? prevRec.jumlahPinjaman
          : Math.max(0, prevRec.jumlahPinjaman - prevRec.angsuran);

        let nextAngsuran = prevRec.angsuran;
        let nextJasa = prevRec.jasa;
        let nextAngKe = prevRec.angKe;

        if (prevComputedRem <= 0) {
          nextAngsuran = 0;
          nextJasa = 0;
          nextAngKe = null;
        } else {
          // Adjust remaining small installments
          if (prevComputedRem < nextAngsuran) {
            nextAngsuran = prevComputedRem;
          }
          // Recalculate monthly flat co-op interest (typically keeps same or 1% if changed)
          // If you kept previous month interest, let's keep it, or recal/scale
          if (prevRec.jumlahPinjaman > 0) {
            const ratio = prevComputedRem / prevRec.jumlahPinjaman;
            // standard 1% of new outstanding
            nextJasa = Math.round(prevComputedRem * 0.01);
          }

          // Increment installment count by 1 (unless they were suspended, where count stays the same)
          if (prevRec.angKe !== null) {
            nextAngKe = prevRec.isTidakBayar ? prevRec.angKe : prevRec.angKe + 1;
          }
        }

        nextMonthRecords[m.id] = {
          memberId: m.id,
          jumlahPinjaman: prevComputedRem,
          angsuran: nextAngsuran,
          jasa: nextJasa,
          simpananWajib: prevRec.simpananWajib,
          angKe: nextAngKe,
          isTidakBayar: false
        };
      } else {
        // Fallback default
        nextMonthRecords[m.id] = {
          memberId: m.id,
          jumlahPinjaman: 0,
          angsuran: 0,
          jasa: 0,
          simpananWajib: 100000,
          angKe: null,
          isTidakBayar: false
        };
      }
    });

    const newMonthData: MonthData = {
      id: nextId,
      labelText: nextLabelText,
      records: nextMonthRecords,
      isAHBIncluded: true,
      bersihAHB: {
        angsuran: latestMonth.bersihAHB?.angsuran || 24960300,
        jasa: latestMonth.bersihAHB?.jasa || 8734000,
        wajib: latestMonth.bersihAHB?.wajib || 3800000
      }
    };

    setMonths(prev => [...prev, newMonthData]);
    setSelectedMonthId(nextId);
    alert(`Berhasil melakukan Rollover otomatis ke periode baru "${nextLabelText}". Semua saldo sisa pinjaman anggota telah dimigrasikan menjadi saldo pokok bulan depan!`);
  };

  // --- EXPORT AND IMPORT WORKFLOWS ---
  const handleExportData = () => {
    const payload = {
      schools,
      members,
      months,
      config
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPN_Air_Hangat_Backup_${selectedMonthId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.schools && parsed.members && parsed.months) {
          setSchools(parsed.schools);
          setMembers(parsed.members);
          setMonths(parsed.months);
          if (parsed.config) setConfig(parsed.config);
          
          if (parsed.months.length > 0) {
            setSelectedMonthId(parsed.months[0].id);
          }
          alert('Database cadangan KPN berhasil diunggah dan direstorasi secara sempurna!');
        } else {
          alert('Format data cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal mendiversifikasi file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    setSchools(INITIAL_SCHOOLS);
    setMembers(INITIAL_MEMBERS);
    setMonths(getInitialMonths());
    setConfig(DEFAULT_SIGNERS);
    setSelectedMonthId('jan-2026');
    setActiveTab('worksheet');
    alert('Seluruh database dikembalikan ke setelan bawaan pabrik (Factory Default).');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800 font-sans">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0 text-white border-r border-slate-800 print:hidden hidden md:flex" id="sidebar-layout">
        <div className="p-5 flex-1 flex flex-col">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 text-white mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <span className="font-bold">K</span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block leading-tight">KPN GURU SD</span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold leading-none">AIR HANGAT</span>
            </div>
          </div>

          {/* Quick Active Month Status Badge */}
          <div className="mb-6 bg-slate-800/60 rounded-lg p-2.5 border border-slate-800">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Periode Potongan Aktif</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs font-bold text-white">{activeMonthData?.labelText}</span>
            </div>
          </div>
          
          {/* Navigation Links inside Sidebar */}
          <div className="space-y-1 flex-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-2">Menu Utama</p>

            {/* Tab index 2: Lembar Potongan */}
            <button
              onClick={() => setActiveTab('worksheet')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
                activeTab === 'worksheet'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-worksheet-btn"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span>Lembar Potongan (Worksheet)</span>
            </button>

            {/* Tab index 3: Restrukturisasi / Baru */}
            <button
              onClick={() => setActiveTab('loan-wizard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
                activeTab === 'loan-wizard'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-loan-wizard-btn"
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>Pinjaman Baru</span>
            </button>

            {/* Tab index 3.1: Approval Sekolah */}
            <button
              onClick={() => setActiveTab('approval-sekolah')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
                activeTab === 'approval-sekolah'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-approval-sekolah-btn"
            >
              <Landmark className="w-3.5 h-3.5 shrink-0 text-current" />
              <span>Approval Sekolah</span>
            </button>

            {/* Tab index 3.2: Daftar Tunggakan */}
            <button
              onClick={() => setActiveTab('tunggakan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
                activeTab === 'tunggakan'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-rose-450 hover:text-white hover:bg-slate-800'
              }`}
              id="tab-tunggakan-btn"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Daftar Tunggakan (Arrears)</span>
            </button>

            {/* Tab index 4: PDF / Cetak Laporan */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-md transition duration-150 ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-emerald-400 hover:text-white hover:bg-slate-800'
              }`}
              id="tab-reports-btn"
            >
              <Printer className="w-3.5 h-3.5 shrink-0 text-current" />
              <span>Cetak Laporan PDF</span>
            </button>

            {/* Tab index 5: Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-settings-btn"
            >
              <SettingsIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Pengaturan (Settings)</span>
            </button>
          </div>

          {/* Sync Status Info */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="text-[9px] text-slate-500 font-mono text-center">
              Cooperative Ledger v2.4 • 2026
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE NAVIGATION HEADER ================= */}
      <header className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex flex-col gap-2.5 md:hidden print:hidden" id="mobile-navigation-topbar">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">
              <span>K</span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xs block leading-tight">KPN GURU SD</span>
              <span className="text-[8px] text-slate-400 font-mono tracking-widest block leading-none font-bold">AIR HANGAT</span>
            </div>
          </div>

          <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-mono">
            {activeMonthData?.labelText}
          </span>
        </div>

        {/* Horizontal scrollbar buttons for mobile */}
        <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'worksheet' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Worksheet
          </button>
          <button
            onClick={() => setActiveTab('loan-wizard')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'loan-wizard' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Pinjaman Baru
          </button>
          <button
            onClick={() => setActiveTab('approval-sekolah')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'approval-sekolah' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Approval Sekolah
          </button>
          <button
            onClick={() => setActiveTab('tunggakan')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'tunggakan' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Tunggakan
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'reports' ? 'bg-blue-600 text-white text-emerald-300' : 'bg-slate-800 text-slate-300'}`}
          >
            PDF Cetak
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 text-[10px] font-bold rounded shrink-0 ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Setting
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-x-hidden focus:outline-none min-h-screen">
        
        {/* Top Header Bar for Desktop displaying information */}
        <header className="h-16 bg-white border-b border-slate-200 items-center justify-between px-6 shrink-0 hidden md:flex print:hidden">
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">
              {activeTab === 'worksheet' && "Lembar Potongan (Worksheet)"}
              {activeTab === 'loan-wizard' && "Registrasi Pinjaman Baru & Restrukturisasi"}
              {activeTab === 'approval-sekolah' && "Approval Pembayaran Sekolah"}
              {activeTab === 'tunggakan' && "Pencatatan Gagal Bayar & Tunggakan"}
              {activeTab === 'reports' && "Cetak Formulir Laporan PDF KPN"}
              {activeTab === 'settings' && "Pengaturan Parameter Lembaga & Database"}
            </h1>
            <p className="text-[11px] text-slate-400 italic">
              Periode : {activeMonthData?.labelText} &bull; Luaran Koperasi Guru SD Air Hangat
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={async () => {
                await reloadBackendState();
                alert('✓ Database koperasi berhasil disinkronisasi langsung dengan Google Sheets!');
              }}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition ${
                isSyncing 
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50/50'
              }`}
              title="Perbarui data anggota dan potongan koperasi secara langsung dari Google Sheets"
            >
              <Database className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkron Google Sheet'}</span>
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">Hub: 085266648555</span>
            <div className="h-4 w-px bg-slate-250"></div>
            {activeTab === 'worksheet' && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">
                Auto-Save Ready
              </span>
            )}
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase">
              {members.length} Anggota Terdaftar
            </span>
          </div>
        </header>

        {/* Content Panel Frame */}
        <main className="flex-1 px-4 sm:px-6 py-6 w-full print:bg-white print:p-0 print:m-0 print:max-w-full">
          {months.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-xl my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              <span className="text-xs text-slate-500 mt-2 font-mono">Menghubungkan basis data...</span>
            </div>
          ) : (
            <div className="print:block">
              {/* 2. Worksheet (Standard spreadsheets and data management) */}
              <div className={`${activeTab === 'worksheet' ? 'block' : 'hidden'} print:hidden space-y-6`}>
                <Worksheet
                  schools={schools}
                  members={members}
                  monthData={activeMonthData}
                  onUpdateRecord={handleUpdateRecord}
                  onAddMember={handleAddMember}
                  onDeleteMember={handleDeleteMember}
                  onRollOverMonth={handleRollOverMonth}
                  monthsList={months}
                  selectedMonthId={selectedMonthId}
                  onChangeMonth={setSelectedMonthId}
                />
              </div>

              {/* 3. Multi-loan form wizards */}
              <div className={`${activeTab === 'loan-wizard' ? 'block' : 'hidden'} print:hidden`}>
                <LoanForm
                  schools={schools}
                  members={members}
                  monthData={activeMonthData}
                  onApplyNewLoan={handleApplyNewLoan}
                />
              </div>

              {/* 3.1. School Approval */}
              <div className={`${activeTab === 'approval-sekolah' ? 'block' : 'hidden'} print:hidden`}>
                <SchoolApproval onTransactionComplete={reloadBackendState} />
              </div>

              {/* 3.2. Arrears Viewer */}
              <div className={`${activeTab === 'tunggakan' ? 'block' : 'hidden'} print:hidden`}>
                <ArrearsViewer onTransactionComplete={reloadBackendState} />
              </div>

              {/* 4. PDF Output report render container */}
              <div className={`${activeTab === 'reports' ? 'block' : 'print:block hidden'}`}>
                <PdfReport
                  schools={schools}
                  members={members}
                  monthData={activeMonthData}
                  config={config}
                />
              </div>

              {/* 5. Custom parameter adjustments */}
              <div className={`${activeTab === 'settings' ? 'block' : 'hidden'} print:hidden`}>
                <Settings
                  config={config}
                  onUpdateConfig={setConfig}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  onResetFactory={handleResetFactory}
                  schools={schools}
                  setSchools={setSchools}
                  members={members}
                  setMembers={setMembers}
                  months={months}
                  setMonths={setMonths}
                />
              </div>
            </div>
          )}
        </main>

        {/* Auxiliary visual indicator footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-3.5 text-center px-4 mt-auto print:hidden">
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">
            KPN GURU SD KECAMATAN AIR HANGAT &copy; 2026 &bull; INTEGRASI OTOMASI REKAPITULASI DUA WILAYAH
          </p>
        </footer>
      </div>
    </div>
  );
}
