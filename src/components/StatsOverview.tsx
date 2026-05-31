import React from 'react';
import { School, Member, MonthData } from '../types';
import { TrendingUp, Users, DollarSign, Wallet, ShieldCheck, Landmark } from 'lucide-react';

interface StatsOverviewProps {
  monthData: MonthData;
  schools: School[];
  members: Member[];
}

export default function StatsOverview({ monthData, schools, members }: StatsOverviewProps) {
  // Compute global figures
  let totalOutstanding = 0;
  let totalInstallment = 0;
  let totalInterest = 0;
  let totalSavings = 0;
  let totalSkipped = 0;
  let activeLoansCount = 0;

  // Separated dynamic subdistrict totals
  let ahOutstanding = 0;
  let ahInstallment = 0;
  let ahInterest = 0;
  let ahSavings = 0;

  let ahbOutstanding = 0;
  let ahbInstallment = 0;
  let ahbInterest = 0;
  let ahbSavings = 0;

  const records = monthData.records;

  members.forEach(m => {
    const rec = records[m.id];
    if (rec) {
      const isAHB = m.schoolId.endsWith('-ahb');
      if (!rec.isTidakBayar) {
        totalOutstanding += rec.jumlahPinjaman;
        totalInstallment += rec.angsuran;
        totalInterest += rec.jasa;
        totalSavings += rec.simpananWajib;
        if (rec.jumlahPinjaman > 0) activeLoansCount++;

        if (isAHB) {
          ahbOutstanding += rec.jumlahPinjaman;
          ahbInstallment += rec.angsuran;
          ahbInterest += rec.jasa;
          ahbSavings += rec.simpananWajib;
        } else {
          ahOutstanding += rec.jumlahPinjaman;
          ahInstallment += rec.angsuran;
          ahInterest += rec.jasa;
          ahSavings += rec.simpananWajib;
        }
      } else {
        totalSkipped++;
      }
    }
  });

  const rawTotalPotongan = totalInstallment + totalInterest + totalSavings;
  const ahTotal = ahInstallment + ahInterest + ahSavings;
  const ahbTotal = ahbInstallment + ahbInterest + ahbSavings;

  // Compute school-wise stats
  const schoolStats = schools.map(sch => {
    let schOutstanding = 0;
    let schInstallment = 0;
    let schInterest = 0;
    let schSavings = 0;
    let schCount = 0;

    members.filter(m => m.schoolId === sch.id).forEach(m => {
      const rec = records[m.id];
      if (rec && !rec.isTidakBayar) {
        schOutstanding += rec.jumlahPinjaman;
        schInstallment += rec.angsuran;
        schInterest += rec.jasa;
        schSavings += rec.simpananWajib;
        schCount++;
      }
    });

    const total = schInstallment + schInterest + schSavings;

    return {
      schoolName: sch.name,
      outstanding: schOutstanding,
      installment: schInstallment,
      interest: schInterest,
      savings: schSavings,
      total,
      memberCount: schCount
    };
  });

  // Sort schools by total potongan descending
  const sortedSchools = [...schoolStats].sort((a, b) => b.total - a.total);

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
    <div className="space-y-6" id="dashboard-tab">
      {/* Prime Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Penerimaan Potongan */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex items-start gap-3.5 transition hover:shadow-md duration-150" id="stat-card-total-potongan">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Total Potongan Bersih</p>
            <h3 className="text-xl font-black text-slate-800 mt-1.5 font-mono">{formatRp(rawTotalPotongan)}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Estimasi bulan: {monthData.labelText}</p>
          </div>
        </div>

        {/* Card 2: Pokok Angsuran */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex items-start gap-3.5 transition hover:shadow-md duration-150" id="stat-card-angsuran">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Angsuran Pokok</p>
            <h3 className="text-xl font-black text-slate-800 mt-1.5 font-mono">{formatRp(totalInstallment)}</h3>
            <div className="flex gap-1.5 items-center text-[10px] mt-1 text-slate-400 font-mono">
              <span className="font-bold text-blue-600">
                {rawTotalPotongan > 0 ? ((totalInstallment / rawTotalPotongan) * 100).toFixed(1) : 0}%
              </span>
              <span>Proporsi Pokok</span>
            </div>
          </div>
        </div>

        {/* Card 3: Jasa Pinjaman */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex items-start gap-3.5 transition hover:shadow-md duration-150" id="stat-card-jasa">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Landmark className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Jasa Koperasi (1%)</p>
            <h3 className="text-xl font-black text-blue-600 mt-1.5 font-mono">{formatRp(totalInterest)}</h3>
            <div className="flex gap-1.5 items-center text-[10px] mt-1 text-slate-400 font-mono">
              <span className="font-bold text-blue-600">
                {rawTotalPotongan > 0 ? ((totalInterest / rawTotalPotongan) * 100).toFixed(1) : 0}%
              </span>
              <span>Proporsi Jasa</span>
            </div>
          </div>
        </div>

        {/* Card 4: Simpanan Wajib */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex items-start gap-3.5 transition hover:shadow-md duration-150 bg-blue-50/20 border-blue-100" id="stat-card-simpanan">
          <div className="p-2.5 bg-blue-100/60 text-blue-700 rounded-lg shrink-0">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest leading-none">Simpanan Wajib</p>
            <h3 className="text-xl font-black text-blue-900 mt-1.5 font-mono">{formatRp(totalSavings)}</h3>
            <p className="text-[9px] text-blue-700 mt-1 font-bold bg-blue-100/60 px-1.5 py-0.5 rounded inline-block">
              Kas Tabungan Anggota
            </p>
          </div>
        </div>
      </div>

      {/* Auxiliary Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Summary of outstanding loan asset */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between" id="stat-card-outstanding">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Portofolio Pinjaman</span>
              <Wallet className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Total Pinjaman Beredar (Outstanding)</p>
                <p className="text-2xl font-black text-slate-800 mt-1 font-mono">{formatRp(totalOutstanding)}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Peminjam Aktif</p>
                  <p className="text-sm font-bold text-slate-850 mt-1">{activeLoansCount} Anggota</p>
                </div>
                <div className="bg-amber-50/40 p-2 rounded border border-amber-100">
                  <p className="text-[9px] text-amber-800 uppercase tracking-widest">Ditangguhkan</p>
                  <p className="text-sm font-bold text-amber-700 mt-1">{totalSkipped} Orang</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
            * Penundaan potongan dilakukan karena penyesuaian saldo bulanan anggota secara manual.
          </div>
        </div>

        {/* Center & Right Column: School-wise Contribution chart & tables */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between" id="stat-card-table-schools">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Kontribusi Per Instansi / Sekolah</h3>
                <p className="text-[10px] text-slate-400 font-mono">Urutan kontribusi tertinggi ke terendah bulan ini</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                {schools.length} Instansi
              </span>
            </div>

            {/* School List Layout with Progress Bars */}
            <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedSchools.map((item, idx) => {
                const maxTotal = sortedSchools[0]?.total || 1;
                const ratioPercent = (item.total / maxTotal) * 100;

                return (
                  <div key={idx} className="space-y-1" id={`school-bar-${idx}`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-750">{item.schoolName}</span>
                      <div className="space-x-2 text-slate-500 font-mono text-[11px]">
                        <span>{item.memberCount} Agt &bull;</span>
                        <span className="font-bold text-slate-900">{formatRp(item.total)}</span>
                      </div>
                    </div>
                    {/* Gauge Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${ratioPercent}%` }}
                      />
                    </div>
                    {/* Sub breakdown details */}
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono leading-none">
                      <span>Outstanding: {formatRp(item.outstanding)}</span>
                      <span>Pokok: {formatRp(item.installment)} | Jasa: {formatRp(item.interest)} | Wajib: {formatRp(item.savings)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recapitulation total combined row - Air Hangat (AH) + Air Hangat Barat (AHB) */}
      {members.some(m => m.schoolId.endsWith('-ahb')) && (
        <div className="bg-slate-100/75 border border-slate-200 rounded-xl p-5" id="stat-combined-rekap">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3.5 flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse block"></span>
            Struktur Gabungan Air Hangat (AH) &amp; Air Hangat Barat (AHB)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Total Bersih Air Hangat (AH)</span>
              <p className="text-lg font-black text-slate-800 mt-1 font-mono">{formatRp(ahTotal)}</p>
              <span className="text-[9px] text-slate-400 font-mono block mt-1">Pokok: {formatRp(ahInstallment)} | Jasa: {formatRp(ahInterest)} | Wajib: {formatRp(ahSavings)}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Total Bersih Air Hangat Barat (AHB)</span>
              <p className="text-lg font-black text-slate-800 mt-1 font-mono">{formatRp(ahbTotal)}</p>
              <span className="text-[9px] text-slate-400 font-mono block mt-1">Pokok: {formatRp(ahbInstallment)} | Jasa: {formatRp(ahbInterest)} | Wajib: {formatRp(ahbSavings)}</span>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-3 ring-4 ring-blue-500/5">
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block font-mono bg-blue-50 px-1 rounded w-fit">Kombinasi Total Bersih</span>
              <p className="text-xl font-black text-blue-600 mt-1 font-mono">
                {formatRp(rawTotalPotongan)}
              </p>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-50 leading-none">
                <span>Pokok: {formatRp(totalInstallment)}</span>
                <span>Jasa: {formatRp(totalInterest)}</span>
                <span>Wajib: {formatRp(totalSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
