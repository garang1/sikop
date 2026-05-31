import React, { useState, useEffect } from 'react';
import { GasService, calculateRoundUpFee } from '../services/gasService';
import { Users, CreditCard, ShieldAlert, Loader2, RefreshCw, AlertCircle, Coins, Search } from 'lucide-react';

interface ArrearsViewerProps {
  onTransactionComplete: () => void;
}

export default function ArrearsViewer({ onTransactionComplete }: ArrearsViewerProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberNo, setSelectedMemberNo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingArrears, setFetchingArrears] = useState<boolean>(false);
  const [paying, setPaying] = useState<boolean>(false);
  
  const [arrearsList, setArrearsList] = useState<any[]>([]);
  const [successResponse, setSuccessResponse] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch list of members
  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await GasService.execute<any[]>('getDataMasterAnggota');
      const activeMembers = res ? res.filter(m => m.status === 'Aktif') : [];
      setMembers(activeMembers);
      if (activeMembers.length > 0) {
        setSelectedMemberNo(activeMembers[0].nomor || activeMembers[0].id);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal memuat data anggota: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Fetch Arrears whenever selected member changes
  const fetchArrearsForMember = async (noAnggota: string) => {
    if (!noAnggota) return;
    try {
      setFetchingArrears(true);
      setErrorMsg('');
      setSuccessResponse('');
      
      const res = await GasService.execute<any[]>('getStatusGagalBayar', noAnggota);
      setArrearsList(res || []);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal mengambil data gagal bayar: ' + e.message);
    } finally {
      setFetchingArrears(false);
    }
  };

  useEffect(() => {
    if (selectedMemberNo) {
      fetchArrearsForMember(selectedMemberNo);
    }
  }, [selectedMemberNo]);

  // Pay single month of arrears
  const handlePaySingleMonth = async (bulan: string) => {
    if (!selectedMemberNo) return;
    try {
      setPaying(true);
      setErrorMsg('');
      setSuccessResponse('');

      const result = await GasService.execute<any>('prosesBayarAngsuranDenganBulan', selectedMemberNo, bulan);
      if (result && result.success) {
        setSuccessResponse(`✓ Sukses melunasi tunggakan bulan "${bulan}"!`);
        await fetchArrearsForMember(selectedMemberNo);
        onTransactionComplete(); // Tell App.tsx to refresh
      } else {
        setErrorMsg(result?.message || 'Proses pembayaran ditolak.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Terjadi kesalahan pembayaran: ' + e.message);
    } finally {
      setPaying(false);
    }
  };

  // Pay all arrears at once
  const handlePayAllArrears = async () => {
    if (!selectedMemberNo || arrearsList.length === 0) return;
    try {
      setPaying(true);
      setErrorMsg('');
      setSuccessResponse('');

      // Pay each consecutive month
      for (const t of arrearsList) {
        await GasService.execute<any>('prosesBayarAngsuranDenganBulan', selectedMemberNo, t.bulan);
      }

      setSuccessResponse('✓ Sukses melunasi seluruh tunggakan anggota!');
      await fetchArrearsForMember(selectedMemberNo);
      onTransactionComplete();
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal melunasi semua tunggakan: ' + e.message);
    } finally {
      setPaying(false);
    }
  };

  // Format currency helper
  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Search filtered member list for comfort selection
  const filteredMembers = members.filter(m => 
    m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nomor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm" id="arrears-viewer-panel">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">Pencatatan Gagal Bayar &amp; Tunggakan</h3>
          <p className="text-[11px] text-slate-400">Arsip tunggakan iuran bulanan anggota. Anggota dinyatakan gagal bayar jika belum melunasi kewajiban s/d tanggal 10</p>
        </div>
        <ShieldAlert className="w-5 h-5 text-rose-500" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xs text-slate-500 mt-2 font-mono">Memuat nama anggota...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Member lookup field */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col relative md:col-span-1">
              <label className="text-[11px] font-bold text-slate-650 mb-1.5 uppercase font-mono tracking-wide">Cari Cepat Anggota</label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Ketik nama / nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[11px] font-bold text-slate-650 mb-1.5 uppercase font-mono tracking-wide">Pilih Anggota Tersaring</label>
              <select
                value={selectedMemberNo}
                onChange={(e) => setSelectedMemberNo(e.target.value)}
                disabled={fetchingArrears || paying}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded p-2.5 focus:outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
              >
                {filteredMembers.map((m, i) => (
                  <option key={i} value={m.nomor || m.id}>{m.nama} ({m.nomor})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback response notifications */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-650 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {successResponse && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successResponse}</span>
            </div>
          )}

          {/* Arrears table selection result */}
          {fetchingArrears ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
              <span className="text-[10px] text-slate-405 font-mono mt-2">Mengecek sisa tunggakan...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">Daftar Tunggakan Terlapor</span>
                {arrearsList.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePayAllArrears}
                    disabled={paying}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px] uppercase tracking-wide cursor-pointer disabled:opacity-40"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Lunas Semua Tunggakan</span>
                  </button>
                )}
              </div>

              {arrearsList.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-150 rounded-xl bg-slate-50 text-slate-400 italic text-xs">
                  ✓ Anggota tidak memiliki tunggakan/gagal bayar. Seluruh setoran lunas bersih!
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-250 text-slate-450 font-mono font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-2.5 px-3">Bulan</th>
                        <th className="py-2.5 px-3 text-right">Pokok+Jasa+Iuran</th>
                        <th className="py-2.5 px-3 text-right">Denda Keterlambatan</th>
                        <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                        <th className="py-2.5 px-3 text-right">Keadaan</th>
                        <th className="py-2.5 px-3 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {arrearsList.map((t, idx) => {
                        const calculated = calculateRoundUpFee(t.angsuran, t.jasa, t.iuranWajib || 100000);
                        const roundedTotal = calculated.roundedTotal;
                        const subTotal = roundedTotal + (t.denda || 0);

                        return (
                          <tr key={idx} className="hover:bg-rose-50/10 text-slate-800">
                            <td className="py-2.5 px-3 font-semibold text-rose-900 font-mono uppercase">{t.bulan}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                              {formatRp(t.angsuran + t.jasa + (t.iuranWajib || 100000))} (Dibulatkan)
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[11px] font-bold text-amber-600">
                              {formatRp(t.denda || 0)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[11px] font-black text-rose-700 bg-rose-50/10">
                              {formatRp(subTotal)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono">
                              <span className="bg-rose-100 text-rose-850 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-rose-200 leading-none">
                                Gagal Bayar
                              </span>
                            </td>
                            <td className="py-1 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handlePaySingleMonth(t.bulan)}
                                disabled={paying}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase text-[9px] tracking-wider cursor-pointer"
                              >
                                {paying ? 'Logging...' : 'Bayar Bulan Ini'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
