import React, { useState, useEffect } from 'react';
import { GasService, calculateRoundUpFee } from '../services/gasService';
import { Landmark, ArrowRight, ShieldCheck, Loader2, AlertTriangle, Coins, RefreshCw } from 'lucide-react';

interface SchoolApprovalProps {
  onTransactionComplete: () => void;
}

interface PreviewMemberAllocation {
  id: string;
  name: string;
  pokok: number;
  jasa: number;
  iuran: number;
  totalBulat: number;
  alokasi: number;
  sisaTagihan: number;
}

export default function SchoolApproval({ onTransactionComplete }: SchoolApprovalProps) {
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  
  // States loaded from backend
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [membersInSchool, setMembersInSchool] = useState<any[]>([]);
  const [schoolHasArrears, setSchoolHasArrears] = useState<boolean>(false);
  
  // Form variables
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [arrearsHandling, setArrearsHandling] = useState<'ignore' | 'warn'>('warn');
  const [previewAllocations, setPreviewAllocations] = useState<PreviewMemberAllocation[]>([]);
  const [successResponse, setSuccessResponse] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch school listings from backend
  const loadSchools = async () => {
    try {
      setLoading(true);
      const res = await GasService.execute<string[]>('getDaftarSekolah');
      setSchools(res || []);
      if (res && res.length > 0) {
        setSelectedSchool(res[0]);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal memuat data sekolah: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  // Check bills for selected school
  const handleCheckBills = async () => {
    if (!selectedSchool) return;
    try {
      setChecking(true);
      setErrorMsg('');
      setSuccessResponse('');
      setPreviewAllocations([]);

      // Fetch active loans and members
      const activeLoans = await GasService.execute<any[]>('getDataPinjamanAktif');
      const allMembers = await GasService.execute<any[]>('getDataMasterAnggota');

      // Filter members belonging to selected school
      // In sheet, school might be full name or abbreviation. Match flexibly mapping to name or schoolId.
      const schoolIdMap: Record<string, string> = {
        'sdn-31': 'SDN 31/III  Muara Semerah',
        'sdn-32': 'SDN 32/III  Pasar Semurup',
        'sdn-33': 'SDN 33/III Air Tenang',
        'sdn-34': 'SDN 34/ III Pendung Hilir',
        'sdn-40': 'SDN 40/III Koto Majidin Mudik',
        'sdn-64': 'SDN 64/III Koto Baru',
        'sdn-83': 'SDN 83/III Koto Majidin',
        'sdn-116': 'SDN 116/III  Koto Dua Lama',
        'sdn-119': 'SDN 119/III Koto Majidin Hilir',
        'sdn-157': 'SDN 157/III  Pendung Mudik',
        'tk-ah': 'TK AH',
        'sdn-63-ahb': 'SDN 63/III Koto Tengah',
        'sdn-84-ahb': 'SDN 84/III Dusun Baru',
        'sdn-108-ahb': 'SDN 108/III Koto Mudik',
        'sdn-117-ahb': 'SDN 117/III Koto Datuk',
        'sdn-178-ahb': 'SDN 178/III Koto Dua Baru',
        'sdn-191-ahb': 'SDN 191/III Koto Cayo',
        'sdn-192-ahb': 'SDN 192/III Air Panas Baru',
        'sdn-193-ahb': 'SDN 193/III Koto Mubai',
        'sdn-220-ahb': 'SDN 220/III Pugu'
      };

      const matchedMembers = allMembers.filter(m => {
        const schIdOrName = m.sekolah || m.schoolId;
        const normalizedMemberSchool = (schoolIdMap[schIdOrName] || schIdOrName || '').toLowerCase().trim();
        const normalizedSelectedSchool = selectedSchool.toLowerCase().trim();
        return normalizedMemberSchool === normalizedSelectedSchool || schIdOrName === selectedSchool;
      });

      if (matchedMembers.length === 0) {
        setErrorMsg(`Tidak ada data anggota aktif yang tercatat untuk instansi "${selectedSchool}".`);
        setTotalBill(0);
        return;
      }

      // Check tagihan for each member
      let runningSum = 0;
      let hasUnpaidArrears = false;

      const itemsWithBills = await Promise.all(matchedMembers.map(async (m) => {
        // Find existing loan
        const loan = activeLoans.find(l => l.nomor === m.nomor || l.id === m.nomor);
        const outstanding = loan ? loan.sisaPinjaman : 0;
        const angsuran = loan ? loan.angsuran : 0;
        const jasa = loan ? loan.jasa : 0;
        const iuran = loan ? (loan.iuranWajib || 100000) : 100000;

        // check if this member has arrears (tunggakan) in backend
        const arrears = await GasService.execute<any[]>('getStatusGagalBayar', m.nomor);
        const hasArrears = arrears && arrears.length > 0;
        if (hasArrears) {
          hasUnpaidArrears = true;
        }

        const calculated = calculateRoundUpFee(angsuran, jasa, iuran);
        runningSum += calculated.roundedTotal;

        return {
          id: m.nomor,
          name: m.nama,
          pokok: angsuran,
          jasa: jasa,
          iuran,
          outstanding,
          totalBulat: calculated.roundedTotal,
          hasArrears,
          arrearsCount: arrears ? arrears.length : 0
        };
      }));

      setMembersInSchool(itemsWithBills);
      setTotalBill(runningSum);
      setAmountPaid(runningSum); // default input is total rounded bill
      setSchoolHasArrears(hasUnpaidArrears);

    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal memproses pengecekan tagihan: ' + e.message);
    } finally {
      setChecking(false);
    }
  };

  // Run the allocation math on client before authorizing
  const handleCalculateAllocations = () => {
    if (membersInSchool.length === 0) return;
    setErrorMsg('');
    
    let remainingPool = amountPaid;
    const computedList: PreviewMemberAllocation[] = membersInSchool.map(m => {
      // Allocate to each member up to their tagihan bulat
      const requested = m.totalBulat;
      let allocated = 0;
      
      if (remainingPool >= requested) {
        allocated = requested;
        remainingPool -= requested;
      } else {
        allocated = remainingPool;
        remainingPool = 0;
      }

      return {
        id: m.id,
        name: m.name,
        pokok: m.pokok,
        jasa: m.jasa,
        iuran: m.iuran,
        totalBulat: requested,
        alokasi: allocated,
        sisaTagihan: Math.max(0, requested - allocated)
      };
    });

    setPreviewAllocations(computedList);
    setSuccessResponse('✓ Simulasi alokasi selesai dihitung! Klik Setujui & Proses untuk meresmikan ke Google Sheets.');
  };

  // Resmikan / trigger approval
  const handleProcessApproval = async () => {
    if (!selectedSchool || amountPaid <= 0) return;
    try {
      setProcessing(true);
      setErrorMsg('');
      setSuccessResponse('');

      const result = await GasService.execute<any>('prosesApprovalPembayaranSekolah', selectedSchool, amountPaid);
      
      if (result && result.success) {
        setSuccessResponse(`✓ ${result.message || 'Status tagihan massal sukses disinkronkan!'}`);
        setPreviewAllocations([]);
        setMembersInSchool([]);
        setTotalBill(0);
        setAmountPaid(0);
        onTransactionComplete(); // Tell parent App to refresh registries
      } else {
        setErrorMsg(result?.message || 'Proses massal ditolak oleh backend.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Terjadi kegagalan transmisi approval: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  // Format IDR helper
  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm" id="school-approval-panel">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">Approval Pembayaran Per Sekolah</h3>
          <p className="text-[11px] text-slate-400">Verifikasi dan input setoran massal per instansi. Tagihan dibulatkan ke kelipatan Rp 10.000 terdekat</p>
        </div>
        <Landmark className="w-5 h-5 text-slate-400" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xs text-slate-500 mt-2 font-mono">Menghubungkan sekolah...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Select bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-650 mb-1.5 uppercase tracking-wide font-mono">Instansi / Sekolah Pembayar</label>
              <select
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setTotalBill(0);
                  setMembersInSchool([]);
                  setPreviewAllocations([]);
                  setErrorMsg('');
                  setSuccessResponse('');
                }}
                disabled={checking || processing}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded p-3 focus:ring-1 focus:ring-blue-500 text-slate-705 cursor-pointer focus:outline-none"
              >
                {schools.map((sch, i) => (
                  <option key={i} value={sch}>{sch}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCheckBills}
              disabled={checking || processing || !selectedSchool}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm transition disabled:opacity-50 cursor-pointer h-[42px]"
            >
              {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Cek Tagihan Sekolah</span>
            </button>
          </div>

          {/* Feedback section and messages */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-650 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {successResponse && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successResponse}</span>
            </div>
          )}

          {/* If school checked bills, display total results */}
          {totalBill > 0 && (
            <div className="border border-slate-200 rounded-lg bg-slate-50/50 p-5 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/60 pb-3 gap-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black uppercase">Pencapaian Rekap Sekolah</span>
                  <h4 className="text-sm font-black text-slate-800 mt-0.5">{selectedSchool}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black block">Total Tagihan Bulat</span>
                  <span className="text-xl font-black text-blue-600 font-mono">{formatRp(totalBill)}</span>
                </div>
              </div>

              {/* Arrears warning tracker */}
              {schoolHasArrears && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Perhatian: Anggota di sekolah ini terdeteksi memiliki tunggakan/gagal bayar!</span>
                  </div>
                  <p>Sesuai aturan koperasi (PRD 8.1), transaksi approval sekolah massal mewajibkan pelunasan tunggakan tunggal terlebih dahulu di menu tunggakan, agar setoran massal alokasi lunas tepat sasaran.</p>
                  
                  {/* Option dropdown */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="font-bold">Sikap:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="arrears"
                        checked={arrearsHandling === 'warn'}
                        onChange={() => setArrearsHandling('warn')}
                        className="text-blue-650"
                      />
                      <span>Wajib bayar tunggakan terpisah (Rekomendasi)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment input amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-slate-650 mb-1 font-mono">Jumlah Setoran Sekolah Terbayar (IDR)</label>
                  <div className="relative flex items-center">
                    <Coins className="w-4 h-4 text-slate-450 absolute left-3" />
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => {
                        setAmountPaid(parseInt(e.target.value) || 0);
                        setPreviewAllocations([]);
                      }}
                      className="w-full bg-white border border-slate-200 rounded p-2 pl-9 text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculateAllocations}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold uppercase cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Hitung Alokasi</span>
                </button>
              </div>
            </div>
          )}

          {/* Allocation table preview section */}
          {previewAllocations.length > 0 && (
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono block">Rincian Preview Alokasi Pembayaran Massal</span>
              
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-250 text-slate-450 font-mono font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-2.5 px-3">Nama Anggota</th>
                      <th className="py-2.5 px-3 text-right">Pokok+Jasa+Iuran</th>
                      <th className="py-2.5 px-3 text-right">Tagihan Bulat</th>
                      <th className="py-2.5 px-3 text-right text-blue-700">Setoran Alokasi</th>
                      <th className="py-2.5 px-3 text-right text-rose-600">Sisa Tagihan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {previewAllocations.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/45 text-slate-800">
                        <td className="py-2 px-3 font-bold">{p.name}</td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-500">
                          {formatRp(p.pokok + p.jasa + p.iuran)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] font-semibold text-slate-700">
                          {formatRp(p.totalBulat)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] font-bold text-blue-700 bg-blue-50/30">
                          {formatRp(p.alokasi)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] font-bold text-rose-600">
                          {formatRp(p.sisaTagihan)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Approval button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleProcessApproval}
                  disabled={processing || (schoolHasArrears && arrearsHandling === 'warn')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition duration-150 disabled:cursor-not-allowed"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Setujui &amp; Proses Pembayaran Massal</span>
                </button>
              </div>
              {schoolHasArrears && arrearsHandling === 'warn' && (
                <p className="text-[10px] text-rose-600 text-right leading-none">
                  * Tombol dinonaktifkan karena sekolah memiliki tunggakan terdeteksi. Silakan selesaikan tunggakan terlebih dahulu di menu Tunggakan.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
