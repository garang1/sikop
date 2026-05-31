import React, { useState, useRef } from 'react';
import { SignerConfig, School, Member, MonthData } from '../types';
import { getWebAppUrl, setWebAppUrl } from '../services/gasService';
import {
  Save,
  ShieldAlert,
  Download,
  Upload,
  Phone,
  Key,
  HelpCircle,
  Users,
  School as SchoolIcon,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Search,
  CheckCircle,
  FileText
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface SettingsProps {
  config: SignerConfig;
  onUpdateConfig: (newConfig: SignerConfig) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetFactory: () => void;
  schools: School[];
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  months: MonthData[];
  setMonths: React.Dispatch<React.SetStateAction<MonthData[]>>;
}

export default function Settings({
  config,
  onUpdateConfig,
  onExportData,
  onImportData,
  onResetFactory,
  schools,
  setSchools,
  members,
  setMembers,
  months,
  setMonths
}: SettingsProps) {
  // --- SUB TABS ---
  const [activeSubTab, setActiveSubTab] = useState<'signers' | 'schools' | 'members'>('signers');

  // --- SIGNERS FORM STATES ---
  const [ketuaName, setKetuaName] = useState(config.ketuaName);
  const [ketuaTitle, setKetuaTitle] = useState(config.ketuaTitle);
  const [sekretarisName, setSekretarisName] = useState(config.sekretarisName);
  const [sekretarisTitle, setSekretarisTitle] = useState(config.sekretarisTitle);
  const [bendaharaName, setBendaharaName] = useState(config.bendaharaName);
  const [bendaharaTitle, setBendaharaTitle] = useState(config.bendaharaTitle);
  const [csPhone, setCsPhone] = useState(config.csPhone);

  const [signerUpdated, setSignerUpdated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiUrl, setApiUrl] = useState<string>(getWebAppUrl());

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmImport, setShowConfirmImport] = useState(false);

  // --- MASTER SCHOOLS STATES ---
  const [schoolRegionTab, setSchoolRegionTab] = useState<'AH' | 'AHB'>('AHB');
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [editingSchoolName, setEditingSchoolName] = useState('');
  const [newSchoolNameInput, setNewSchoolNameInput] = useState('');
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  // --- MASTER MEMBERS STATES ---
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberSchoolFilter, setMemberSchoolFilter] = useState('ALL');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMemberName, setEditingMemberName] = useState('');
  const [editingMemberSchoolId, setEditingMemberSchoolId] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Add new member state
  const [newMemberNameInput, setNewMemberNameInput] = useState('');
  const [newMemberSchoolId, setNewMemberSchoolId] = useState('');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  // Success banners
  const [successMessage, setSuccessMessage] = useState('');

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // --- SIGNERS FORM SERVICE ---
  const handleSaveSigners = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ketuaName: ketuaName.trim(),
      ketuaTitle: ketuaTitle.trim(),
      sekretarisName: sekretarisName.trim(),
      sekretarisTitle: sekretarisTitle.trim(),
      bendaharaName: bendaharaName.trim(),
      bendaharaTitle: bendaharaTitle.trim(),
      csPhone: csPhone.trim()
    });
    setSignerUpdated(true);
    triggerNotification('✓ Konfigurasi tanda tangan pengurus berhasil disimpan!');
    setTimeout(() => setSignerUpdated(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowConfirmImport(true);
      if (e.target) e.target.value = '';
    }
  };

  // --- MASTER SCHOOL OPERATIONS ---
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newSchoolNameInput.trim();
    if (!cleanName) return;

    // Suffix (AHB) automatically if adding to AHB region
    let finalName = cleanName;
    if (schoolRegionTab === 'AHB' && !cleanName.toUpperCase().includes('(AHB)')) {
      finalName = `${cleanName} (AHB)`;
    }

    const isAHB = schoolRegionTab === 'AHB';
    const newId = `sdn-custom-${Date.now()}${isAHB ? '-ahb' : ''}`;

    const newSchool: School = {
      id: newId,
      name: finalName
    };

    setSchools(prev => [...prev, newSchool]);
    setNewSchoolNameInput('');
    triggerNotification(`✓ Berhasil menambahkan instansi/sekolah "${finalName}"!`);
  };

  const startEditSchool = (sch: School) => {
    setEditingSchoolId(sch.id);
    setEditingSchoolName(sch.name);
  };

  const saveEditSchool = (schoolId: string) => {
    const cleanName = editingSchoolName.trim();
    if (!cleanName) return;
    setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, name: cleanName } : s));
    setEditingSchoolId(null);
    triggerNotification(`✓ Nama sekolah berhasil diperbarui menjadi "${cleanName}"!`);
  };

  const executeDeleteSchool = () => {
    if (!schoolToDelete) return;
    const schId = schoolToDelete.id;
    const schName = schoolToDelete.name;

    // 1. Remove school
    setSchools(prev => prev.filter(s => s.id !== schId));

    // 2. Remove all members associated with this school
    const assocMembers = members.filter(m => m.schoolId === schId);
    const assocMemberIds = assocMembers.map(m => m.id);

    if (assocMemberIds.length > 0) {
      setMembers(prev => prev.filter(m => m.schoolId !== schId));
      
      // Prune records in month data
      setMonths(prev => {
        return prev.map(mMonth => {
          const recordsCopy = { ...mMonth.records };
          assocMemberIds.forEach(id => {
            delete recordsCopy[id];
          });
          return {
            ...mMonth,
            records: recordsCopy
          };
        });
      });
    }

    setSchoolToDelete(null);
    triggerNotification(`✓ Instansi "${schName}" beserta ${assocMembers.length} anggota di dalamnya berhasil dihapus.`);
  };

  // --- MASTER MEMBER OPERATIONS ---
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newMemberNameInput.trim().toUpperCase();
    const schId = newMemberSchoolId;
    if (!name || !schId) return;

    const newMemId = `m-custom-${Date.now()}`;
    const newMember: Member = {
      id: newMemId,
      name,
      schoolId: schId
    };

    // 1. Add to members list
    setMembers(prev => [...prev, newMember]);

    // 2. Setup blank default record for all months
    setMonths(prevMonths => {
      return prevMonths.map(mMonth => {
        return {
          ...mMonth,
          records: {
            ...mMonth.records,
            [newMemId]: {
              memberId: newMemId,
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

    setNewMemberNameInput('');
    setShowAddMemberForm(false);
    triggerNotification(`✓ Berhasil menambahkan Anggota baru: ${name}!`);
  };

  const startEditMember = (mem: Member) => {
    setEditingMemberId(mem.id);
    setEditingMemberName(mem.name);
    setEditingMemberSchoolId(mem.schoolId);
  };

  const saveEditMember = (memberId: string) => {
    const cleanName = editingMemberName.trim().toUpperCase();
    if (!cleanName || !editingMemberSchoolId) return;

    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, name: cleanName, schoolId: editingMemberSchoolId } : m));
    setEditingMemberId(null);
    triggerNotification(`✓ Biodata anggota "${cleanName}" berhasil diperbarui!`);
  };

  const executeDeleteMember = () => {
    if (!memberToDelete) return;
    const memId = memberToDelete.id;
    const memName = memberToDelete.name;

    // 1. Remove from members list
    setMembers(prev => prev.filter(m => m.id !== memId));

    // 2. Prune records from months
    setMonths(prev => {
      return prev.map(mMonth => {
        const recordsCopy = { ...mMonth.records };
        delete recordsCopy[memId];
        return {
          ...mMonth,
          records: recordsCopy
        };
      });
    });

    setMemberToDelete(null);
    triggerNotification(`✓ Anggota "${memName}" berhasil dihapus dari database.`);
  };


  // Filtering lists
  const filteredSchools = schools.filter(s => {
    const isAHB = s.id.endsWith('-ahb');
    return schoolRegionTab === 'AHB' ? isAHB : !isAHB;
  });

  const searchedMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearchQuery.toLowerCase());
    const matchSchool = memberSchoolFilter === 'ALL' || m.schoolId === memberSchoolFilter;
    return matchSearch && matchSchool;
  });

  return (
    <div className="space-y-6" id="settings-center">
      {/* SUCCESS POPUP DECORATOR */}
      {successMessage && (
        <div className="fixed bottom-10 right-10 bg-slate-900 border border-slate-800 text-white rounded-lg px-5 py-4 flex items-center gap-3 shadow-2xl z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-mono tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* TOP CONFIGURATION SELECTOR CARDS */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden p-1.5 gap-1" id="settings-tab-bar">
        <button
          onClick={() => setActiveSubTab('signers')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'signers'
              ? 'bg-slate-900 text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Pengurus &amp; Tanda Tangan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schools')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'schools'
              ? 'bg-slate-900 text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <SchoolIcon className="w-4 h-4" />
          <span>Kelola Data Sekolah ({schools.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('members')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'members'
              ? 'bg-slate-900 text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Data Anggota ({members.length})</span>
        </button>
      </div>

      {/* TAB SUB-VIEWS */}
      {activeSubTab === 'signers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-signer-pane">
          {/* Signatories Forms */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">Konfigurasi Pengurus &amp; Tanda Tangan</h3>
                <p className="text-[11px] text-slate-400">Tentukan nama penandatangan yang dicetak pada bagian bawah lembar potongan per sekolah</p>
              </div>
              <Key className="w-5 h-5 text-slate-400" />
            </div>

            <form onSubmit={handleSaveSigners} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ketua */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Nama Ketua Koperasi</label>
                  <input
                    type="text"
                    value={ketuaName}
                    onChange={(e) => setKetuaName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Jabatan Ketua</label>
                  <input
                    type="text"
                    value={ketuaTitle}
                    onChange={(e) => setKetuaTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Sekretaris */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Nama Pembuat Daftar / Sekretaris</label>
                  <input
                    type="text"
                    value={sekretarisName}
                    onChange={(e) => setSekretarisName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Jabatan Pembuat Daftar</label>
                  <input
                    type="text"
                    value={sekretarisTitle}
                    onChange={(e) => setSekretarisTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Bendahara */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Nama Bendahara Koperasi</label>
                  <input
                    type="text"
                    value={bendaharaName}
                    onChange={(e) => setBendaharaName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-650 block">Jabatan Bendahara</label>
                  <input
                    type="text"
                    value={bendaharaTitle}
                    onChange={(e) => setBendaharaTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* No HP CS */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-650 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nomor Kontak Pengurus (Bantuan / CS)</span>
                  </label>
                  <input
                    type="text"
                    value={csPhone}
                    onChange={(e) => setCsPhone(e.target.value)}
                    placeholder="Contoh: 085266648555"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Signer</span>
                </button>
              </div>
            </form>
          </div>

           {/* Safety Backups, Import Export block */}
          <div className="space-y-6">
            {/* Google Sheets Live CORS connection block */}
            <div className="bg-white border border-blue-200 rounded-xl p-6 space-y-4 shadow-sm bg-blue-50/10">
              <div className="flex items-center gap-2 text-blue-800">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest font-black leading-none">Integrasi Google Sheets Live</h4>
              </div>
              <p className="text-xs text-slate-550 leading-relaxed font-sans">
                Koneksikan dashboard KPN secara realtime dengan Google Sheets Anda yang sudah terpasang Google Apps Script. Publikasikan Apps Script Anda sebagai <strong>Aplikasi Web (Web App Deployment)</strong> dengan setelan akses <strong>"Anyone"</strong>, lalu tempel URL-nya di bawah ini:
              </p>

              <div className="space-y-2.5">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfy.../exec"
                  className="w-full bg-white border border-slate-200 rounded p-2.5 text-xs font-mono text-slate-705 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                
                <button
                  type="button"
                  onClick={() => {
                    setWebAppUrl(apiUrl.trim());
                    triggerNotification(
                      apiUrl.trim() 
                        ? '✓ Terkoneksi secara Live dengan Google Sheets Web App!' 
                        : '✓ Mode Simulasi (Local Storage) diaktifkan.'
                    );
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide rounded transition shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{apiUrl.trim() ? 'Simpan & Aktifkan Live Sheets' : 'Gunakan Mode Simulasi (Default)'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Cadangan &amp; Impor Data</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda dapat menyimpan seluruh isi database koperasi termasuk data anggota dan rekap potongan 6 bulan ini ke dalam file lokal (.json) untuk pencadangan.
              </p>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <button
                  onClick={onExportData}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide rounded transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Cadangan Data (.json)</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wide rounded transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Cadangan Data (.json)</span>
                </button>
              </div>
            </div>

            {/* Clear/Reset card */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-850">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest font-extrabold">Zona Bahaya</h4>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Tindakan ini akan mengembalikan data potongan bulanan, penandatangan, seluruh anggota, dan sekolah ke kondisi bawaan awal (Factory Default). Segala modifikasi data baru akan hilang secara permanen.
              </p>

              <button
                onClick={() => {
                  setShowConfirmReset(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wide rounded transition shadow-sm cursor-pointer border border-rose-700/10"
              >
                Kembalikan ke Data Bawaan Awal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LEVEL: MASTER SCHOOLS EDITOR */}
      {activeSubTab === 'schools' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6" id="settings-school-pane">
          <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <SchoolIcon className="w-4 h-4 text-blue-600" />
                <span>Pengelola Nama Instansi / Sekolah Master</span>
              </h3>
              <p className="text-[11px] text-slate-400">Sesuaikan nama sekolah agar sesuai seutuhnya dengan penamaan pada google sheet Anda</p>
            </div>
            
            {/* Region Filter for School Manager */}
            <div className="flex bg-slate-100 p-1 rounded border border-slate-250 self-start">
              <button
                onClick={() => setSchoolRegionTab('AH')}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wide rounded transition cursor-pointer ${
                  schoolRegionTab === 'AH' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Utama (AH) — 11 SD
              </button>
              <button
                onClick={() => setSchoolRegionTab('AHB')}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wide rounded transition cursor-pointer ${
                  schoolRegionTab === 'AHB' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cabang (AHB) — 9 SD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List Table Area to display schools */}
            <div className="md:col-span-2 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-2.5 px-3">ID Sekolah</th>
                    <th className="py-2.5 px-3">Nama Instansi / Sekolah</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredSchools.map((sch) => {
                    const assocCount = members.filter(m => m.schoolId === sch.id).length;
                    const isEditing = editingSchoolId === sch.id;

                    return (
                      <tr key={sch.id} className="hover:bg-slate-50/55 transition text-slate-700">
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 font-bold">{sch.id}</td>
                        <td className="py-2.5 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingSchoolName}
                              onChange={(e) => setEditingSchoolName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{sch.name}</span>
                              <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono uppercase">
                                {assocCount} Anggota
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex justify-end items-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditSchool(sch.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition cursor-pointer"
                                  title="Simpan Perubahan"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingSchoolId(null)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                  title="Batal"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditSchool(sch)}
                                  className="p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded transition cursor-pointer"
                                  title="Ubah Nama"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setSchoolToDelete(sch)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded transition cursor-pointer"
                                  title="Hapus Instansi"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Addition block widget */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-fit space-y-4">
              <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-slate-450 block border-b border-slate-200 pb-1.5">Tambah Instansi Baru</span>
              <form onSubmit={handleAddSchool} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block">Nama Sekolah Baru</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SDN 99/III Hamparan"
                    value={newSchoolNameInput}
                    onChange={(e) => setNewSchoolNameInput(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold leading-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {schoolRegionTab === 'AHB' && (
                    <span className="text-[9px] text-slate-500 italic block leading-tight mt-1">
                      * Suffix " (AHB)" akan otomatis disisipkan di belakang nama jika belum ada, untuk menandakan sub-cabang Air Hangat Barat.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 text-white rounded text-xs font-bold uppercase tracking-wide cursor-pointer shadow-sm transition ${
                    schoolRegionTab === 'AHB' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan ke Wilayah {schoolRegionTab}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MASTER DATA: MEMBERS CONFIGURATION LIST AND SEARCH */}
      {activeSubTab === 'members' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-5" id="settings-member-pane">
          <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-650" />
                <span>Pengelola Master Anggota KPN ({members.length} Terdaftar)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Cari, perbaiki ejaan nama anggota, atur penempatan sekolah, serta daftarkan anggota baru di sini</p>
            </div>

            <button
              onClick={() => {
                setNewMemberSchoolId(schools[0]?.id || '');
                setShowAddMemberForm(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider self-start shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrasi Anggota Baru</span>
            </button>
          </div>

          {/* Quick Filters Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Search */}
            <div className="md:col-span-2 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Cari nama anggota KPN... (contoh: KASMADIA, DARLIUS...)"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
              {memberSearchQuery && (
                <button
                  onClick={() => setMemberSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* School selection filter */}
            <select
              value={memberSchoolFilter}
              onChange={(e) => setMemberSchoolFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
            >
              <option value="ALL">Semua Sekolah &amp; Instansi</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse relative font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 text-slate-400 font-mono font-bold uppercase text-[9px] tracking-wider z-10">
                  <th className="py-2 px-3">ID Anggota</th>
                  <th className="py-2 px-3">Nama Anggota KPN (Capital)</th>
                  <th className="py-2 px-3">Instansi / Sekolah Naungan</th>
                  <th className="py-2 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {searchedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      Tidak menemukan anggota yang sesuai dengan kriteria pencarian/filter di cabang ini.
                    </td>
                  </tr>
                ) : (
                  searchedMembers.map((mem) => {
                    const isEditing = editingMemberId === mem.id;
                    const sch = schools.find(s => s.id === mem.schoolId);

                    return (
                      <tr key={mem.id} className="hover:bg-slate-50/55 transition text-slate-700">
                        <td className="py-2 px-3 font-mono text-[9px] text-slate-400 font-bold">{mem.id}</td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingMemberName}
                              onChange={(e) => setEditingMemberName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono block uppercase"
                            />
                          ) : (
                            <span className="font-extrabold text-slate-800 font-mono">{mem.name}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <select
                              value={editingMemberSchoolId}
                              onChange={(e) => setEditingMemberSchoolId(e.target.value)}
                              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 block w-full text-slate-700"
                            >
                              {schools.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                              sch?.id.endsWith('-ahb') 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                : 'bg-blue-50 border-blue-100 text-blue-800'
                            }`}>
                              {sch ? sch.name : 'Unknown School'}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex justify-end items-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditMember(mem.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition cursor-pointer"
                                  title="Simpan"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingMemberId(null)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                  title="Batal"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditMember(mem)}
                                  className="p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded transition cursor-pointer"
                                  title="Ubah Biodata / Pindahkan Sekolah"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setMemberToDelete(mem)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded transition cursor-pointer"
                                  title="Hapus Anggota"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUPS FOR ZONE CHANGES */}
      <ConfirmModal
        isOpen={showConfirmReset}
        title="Konfirmasi Reset Pabrik"
        message="APAKAH ANDA YAKIN INGIN MELAKUKAN RESET MASTER? Tindakan ini akan mengembalikan data potongan bulanan, penandatangan, seluruh anggota, dan sekolah ke kondisi bawaan awal (Factory Default) secara permanen. Segala modifikasi data baru akan hilang!"
        type="danger"
        confirmText="Reset Sekarang"
        cancelText="Batal"
        onConfirm={() => {
          onResetFactory();
          setShowConfirmReset(false);
        }}
        onCancel={() => setShowConfirmReset(false)}
      />

      <ConfirmModal
        isOpen={showConfirmImport}
        title="Konfirmasi Impor Cadangan"
        message="Apakah Anda yakin ingin mengimpor data eksternal? Data di layar sekarang akan ditimpa sepenuhnya oleh data cadangan ini secara permanen."
        type="warning"
        confirmText="Impor Sekarang"
        cancelText="Batal"
        onConfirm={() => {
          if (selectedFile) {
            onImportData(selectedFile);
          }
          setShowConfirmImport(false);
          setSelectedFile(null);
        }}
        onCancel={() => {
          setShowConfirmImport(false);
          setSelectedFile(null);
        }}
      />

      {/* CONFIRM DELETION FOR SCHOOL */}
      <ConfirmModal
        isOpen={schoolToDelete !== null}
        title="Konfirmasi Hapus Instansi / Sekolah"
        message={`Apakah Anda benar-benar yakin ingin menghapus "${schoolToDelete?.name}"? TINDAKAN INI AKAN SECARA OTOMATIS MENGHAPUS SELURUH ANGGOTA yang berteduh di bawah instansi ini serta seluruh rekam potongan bulanan mereka dari database secara permanen!`}
        type="danger"
        confirmText="Hapus Berserta Anggotanya"
        cancelText="Batal"
        onConfirm={executeDeleteSchool}
        onCancel={() => setSchoolToDelete(null)}
      />

      {/* CONFIRM DELETION FOR MEMBER */}
      <ConfirmModal
        isOpen={memberToDelete !== null}
        title="Konfirmasi Hapus Anggota"
        message={`Apakah Anda yakin ingin menghapus "${memberToDelete?.name}" dari keanggotaan KPN Air Hangat? Segala nominal simpanan dan pinjaman bulanan anggota ini akan dihapus permanen.`}
        type="danger"
        confirmText="Hapus Anggota"
        cancelText="Batal"
        onConfirm={executeDeleteMember}
        onCancel={() => setMemberToDelete(null)}
      />

      {/* REGISTER NEW MEMBER MODAL DIALOG */}
      {showAddMemberForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fade-in print:hidden">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold font-mono uppercase tracking-wide">Registrasi Anggota KPN Baru</span>
              </div>
              <button
                onClick={() => setShowAddMemberForm(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="p-6 space-y-4">
              <div className="space-y-1.55">
                <label className="text-[11px] font-bold text-slate-600 block">Nama Anggota Lengkap (Maks. Capital)</label>
                <input
                  type="text"
                  required
                  placeholder="CONTOH: BUDI HARIANTO, S.Pd"
                  value={newMemberNameInput}
                  onChange={(e) => setNewMemberNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded p-2.5 text-xs font-bold leading-none focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase font-mono text-slate-850"
                />
              </div>

              <div className="space-y-1.55">
                <label className="text-[11px] font-bold text-slate-600 block">Penayangan Instansi / Sekolah</label>
                <select
                  value={newMemberSchoolId}
                  onChange={(e) => setNewMemberSchoolId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  required
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 text-slate-600 text-xs font-bold uppercase rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded shadow-sm transition cursor-pointer"
                >
                  Registrasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
