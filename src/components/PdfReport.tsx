import React, { useRef, useState, useEffect } from 'react';
import { School, Member, MonthData, SignerConfig } from '../types';
import { Printer, FileText, CheckSquare, Layers, HelpCircle } from 'lucide-react';
// @ts-ignore
import opperAntoniSig from '../assets/images/regenerated_image_1779975286978.png';

interface PdfReportProps {
  schools: School[];
  members: Member[];
  monthData: MonthData;
  config: SignerConfig;
}

function KoperasiLogo() {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = [
    "https://images.weserv.nl/?url=https://pasla.jambiprov.go.id/wp-content/uploads/2023/02/lambang-koperasi.png",
    "https://pasla.jambiprov.go.id/wp-content/uploads/2023/02/lambang-koperasi.png",
    "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/3/3d/Logo_koperasi.png",
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Logo_koperasi.png"
  ];

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(prev => prev + 1);
    } else {
      setSrcIndex(sources.length); // Trigger SVG rendering
    }
  };

  if (srcIndex >= sources.length) {
    return (
      <svg viewBox="0 0 200 200" className="w-14 h-14" style={{ minWidth: "56px", minHeight: "56px" }}>
        <defs>
          <clipPath id="circle-clip-fallback">
            <circle cx="100" cy="100" r="72" />
          </clipPath>
          <path id="ribbonPath-fallback" d="M 45,168 Q 100,186 155,168" />
        </defs>

        {/* Outer gear teeth */}
        <g fill="#fbbf24" stroke="#1e293b" strokeWidth="1">
          <rect x="95" y="16" width="10" height="12" transform="rotate(-150, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-135, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-120, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-105, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-90, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-75, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-60, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-45, 100, 100)" rx="1.5" />
          <rect x="95" y="16" width="10" height="12" transform="rotate(-30, 100, 100)" rx="1.5" />
        </g>

        {/* Outer Circle Ring */}
        <circle cx="100" cy="100" r="77" fill="none" stroke="#2c3e50" strokeWidth="1" />
        <circle cx="100" cy="100" r="73" fill="none" stroke="#fbbf24" strokeWidth="6.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#2c3e50" strokeWidth="1" />

        {/* Clipped Red/White Quadrant Background */}
        <g clipPath="url(#circle-clip-fallback)">
          {/* Top Left: White */}
          <rect x="25" y="25" width="75" height="75" fill="#ffffff" />
          {/* Top Right: Red */}
          <rect x="100" y="25" width="75" height="75" fill="#dc2626" />
          {/* Bottom Left: Red */}
          <rect x="25" y="100" width="75" height="75" fill="#dc2626" />
          {/* Bottom Right: White */}
          <rect x="100" y="100" width="75" height="75" fill="#ffffff" />
        </g>

        {/* Inner Core: Tree Canopy, Scales, Shield */}
        {/* The Banyan Tree Canopy */}
        <path 
          d="M 100,80 C 80,80 66,95 66,112 C 66,128 78,135 90,135 Q 100,135 100,128 Q 100,135 110,135 C 122,135 134,128 134,112 C 134,95 120,80 100,80 Z" 
          fill="#22c55e" 
          stroke="#15803d" 
          strokeWidth="2" 
        />
        {/* Trunk with roots */}
        <path d="M 97,135 L 97,148 L 103,148 L 103,135 Z" fill="#854d0e" stroke="#78350f" strokeWidth="1" />

        {/* Scales (Timbangan) */}
        <path d="M 60,86 L 140,86" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <path d="M 60,86 L 140,86" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
        
        {/* Scale Hangers */}
        <path d="M 65,86 L 58,103 M 65,86 L 72,103" stroke="#2c3e50" strokeWidth="1" />
        <path d="M 54,103 L 76,103 A 11,11 0 0,1 54,103" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />
        
        <path d="M 135,86 L 128,103 M 135,86 L 142,103" stroke="#2c3e50" strokeWidth="1" />
        <path d="M 124,103 L 146,103 A 11,11 0 0,1 124,103" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />

        {/* Center Shield with Star */}
        <path 
          d="M 91,62 L 109,62 C 109,74 106,81 100,86 C 94,81 91,74 91,62 Z" 
          fill="#111827" 
          stroke="#fbbf24" 
          strokeWidth="1.5" 
        />
        <polygon 
          points="100,67 101.5,70.5 105,71 102.5,73.5 103.2,77 100,75 96.8,77 97.5,73.5 95,71 98.5,70.5" 
          fill="#fbbf24" 
          stroke="#1e293b" 
          strokeWidth="0.5" 
        />

        {/* Left Side: Chain */}
        <g fill="#fbbf24" stroke="#2c3e50" strokeWidth="1">
          <ellipse cx="45" cy="85" rx="5" ry="8" transform="rotate(-20, 45, 85)" />
          <ellipse cx="38" cy="98" rx="5" ry="8" transform="rotate(-10, 38, 98)" />
          <ellipse cx="34" cy="112" rx="5" ry="8" transform="rotate(0, 34, 112)" />
          <ellipse cx="34" cy="126" rx="5" ry="8" transform="rotate(10, 34, 126)" />
          <ellipse cx="38" cy="140" rx="5" ry="8" transform="rotate(20, 38, 140)" />
          <ellipse cx="45" cy="153" rx="5" ry="8" transform="rotate(30, 45, 153)" />
        </g>

        {/* Right Side: Cotton and Rice */}
        <g fill="#ffffff" stroke="#15803d" strokeWidth="1">
          <circle cx="152" cy="85" r="5" />
          <circle cx="156" cy="88" r="4.5" />
          <circle cx="148" cy="89" r="4" />
          
          <circle cx="159" cy="100" r="5" />
          <circle cx="163" cy="103" r="4.5" />
          <circle cx="155" cy="104" r="4" />
          
          <circle cx="162" cy="115" r="5" fill="#fbbf24" stroke="#ca8a04" />
        </g>
        <g fill="#fbbf24" stroke="#ca8a04" strokeWidth="1">
          <ellipse cx="161" cy="126" rx="3" ry="5.5" transform="rotate(-30, 161, 126)" />
          <ellipse cx="157" cy="136" rx="3" ry="5.5" transform="rotate(-40, 157, 136)" />
          <ellipse cx="151" cy="145" rx="3" ry="5.5" transform="rotate(-50, 151, 145)" />
          <ellipse cx="143" cy="153" rx="3" ry="5.5" transform="rotate(-60, 143, 153)" />
        </g>

        {/* Ribbon at the bottom */}
        <g>
          <path d="M 33,165 L 43,158 L 43,172 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          <path d="M 167,165 L 157,158 L 157,172 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          <path d="M 40,158 Q 100,180 160,158 L 157,173 Q 100,195 43,173 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          
          <text className="font-sans" fontSize="7.5" fontWeight="900" fill="#1e293b" letterSpacing="0.2">
            <textPath href="#ribbonPath-fallback" startOffset="50%" textAnchor="middle">
              KOPERASI INDONESIA
            </textPath>
          </text>
        </g>
      </svg>
    );
  }

  return (
    <img 
      src={sources[srcIndex]} 
      alt="Logo Koperasi Indonesia" 
      className="w-14 h-14 object-contain"
      onError={handleError}
      referrerPolicy="no-referrer"
      style={{ minWidth: "56px", minHeight: "56px" }}
    />
  );
}

function JairunSignature() {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = [
    "https://lh3.googleusercontent.com/d/1hPPZ3Npa_hx9U6lHGWNuChWL9OwnPRex",
    "https://images.weserv.nl/?url=drive.google.com/uc?export=download&id=1hPPZ3Npa_hx9U6lHGWNuChWL9OwnPRex",
    "https://drive.google.com/uc?export=download&id=1hPPZ3Npa_hx9U6lHGWNuChWL9OwnPRex",
    "https://drive.google.com/uc?export=view&id=1hPPZ3Npa_hx9U6lHGWNuChWL9OwnPRex"
  ];

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(prev => prev + 1);
    }
  };

  return (
    <img 
      src={sources[srcIndex]} 
      alt="Tanda Tangan H. JAIRUN, S.PdI, S.Pd" 
      className="h-[48px] w-auto max-w-[110px] mx-auto object-contain select-none pb-1"
      onError={handleError}
      referrerPolicy="no-referrer"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

function OpperAntoniSignature() {
  return (
    <img 
      src={opperAntoniSig} 
      alt="Tanda Tangan OPPER ANTONI, S.Pd" 
      className="h-[52px] w-auto max-w-[130px] mx-auto select-none pb-1 object-contain translate-y-1 scale-110"
      referrerPolicy="no-referrer"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

export default function PdfReport({ schools, members, monthData, config }: PdfReportProps) {
  const [printMode, setPrintMode] = useState<'single' | 'recap' | 'bulk' | 'treasurer'>('single');
  const [selectedRegion, setSelectedRegion] = useState<'AH' | 'AHB'>('AH');
  
  const initialAhSchoolId = schools.find(s => !s.id.endsWith('-ahb'))?.id || '';
  const initialAhbSchoolId = schools.find(s => s.id.endsWith('-ahb'))?.id || '';
  
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(initialAhSchoolId);
  const [treasurerSchool1, setTreasurerSchool1] = useState<string>(schools[0]?.id || '');
  const [treasurerSchool2, setTreasurerSchool2] = useState<string>(schools[1]?.id || '');
  const [treasurerSchool3, setTreasurerSchool3] = useState<string>(schools[2]?.id || '');
  const [treasurerSchool4, setTreasurerSchool4] = useState<string>(schools[3]?.id || '');

  // Helper currency format
  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  // Switch region helper
  const handleRegionChange = (reg: 'AH' | 'AHB') => {
    setSelectedRegion(reg);
    const firstSchool = schools.find(s => reg === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));
    if (firstSchool) {
      setSelectedSchoolId(firstSchool.id);
    }
  };

  // Filter schools and members belonging to active region
  const activeRegionSchools = schools.filter(s => selectedRegion === 'AH' ? !s.id.endsWith('-ahb') : s.id.endsWith('-ahb'));
  
  // 1. Single School Data
  const currentSchool = schools.find(s => s.id === selectedSchoolId) || activeRegionSchools[0] || schools[0];
  const activeSchoolId = currentSchool?.id || '';
  const schoolMembers = members.filter(m => m.schoolId === activeSchoolId);

  // Compute school totals (Gross sum of members of current selected school)
  let singleTotalOutstanding = 0;
  let singleTotalInstallment = 0;
  let singleTotalInterest = 0;
  let singleTotalSavings = 0;
  let singleTotalDeductions = 0;
  let singleTotalRemaining = 0;

  schoolMembers.forEach(m => {
    const rec = monthData.records[m.id];
    if (rec) {
      if (!rec.isTidakBayar) {
        singleTotalOutstanding += rec.jumlahPinjaman;
        singleTotalInstallment += rec.angsuran;
        singleTotalInterest += rec.jasa;
        singleTotalSavings += rec.simpananWajib;
        singleTotalDeductions += rec.angsuran + rec.jasa + rec.simpananWajib;
        singleTotalRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
      } else {
        singleTotalOutstanding += rec.jumlahPinjaman;
        singleTotalSavings += rec.simpananWajib;
        singleTotalDeductions += rec.simpananWajib;
        singleTotalRemaining += rec.jumlahPinjaman;
      }
    }
  });

  // 2. Air Hangat (AH) Region Totals Calculation
  let ahGrossOutstanding = 0;
  let ahGrossInstallment = 0;
  let ahGrossInterest = 0;
  let ahGrossSavings = 0;
  let ahGrossDeductions = 0;
  let ahGrossRemaining = 0;
  let ahGrossMembersCount = 0;
  let ahGrossActiveCount = 0;

  const ahSchoolsList = schools.filter(s => !s.id.endsWith('-ahb'));
  ahSchoolsList.forEach(sch => {
    const schMembers = members.filter(m => m.schoolId === sch.id);
    ahGrossMembersCount += schMembers.length;
    schMembers.forEach(m => {
      const rec = monthData.records[m.id];
      if (rec) {
        ahGrossOutstanding += rec.jumlahPinjaman;
        ahGrossInstallment += rec.angsuran;
        ahGrossInterest += rec.jasa;
        ahGrossSavings += rec.simpananWajib;
        ahGrossDeductions += rec.angsuran + rec.jasa + rec.simpananWajib;
        ahGrossRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
        if (rec.jumlahPinjaman > 0) ahGrossActiveCount++;
      }
    });
  });

  // AH non-payers details (Tidak bayar Potongan KPN AH)
  const ahUnpaidMembers = members.filter(m => {
    if (m.schoolId.endsWith('-ahb')) return false;
    const rec = monthData.records[m.id];
    return rec?.isTidakBayar === true;
  });

  let ahUnpaidOutstanding = 0;
  let ahUnpaidInstallment = 0;
  let ahUnpaidInterest = 0;
  let ahUnpaidSavings = 0;
  let ahUnpaidDeductions = 0;
  let ahUnpaidRemaining = 0;

  ahUnpaidMembers.forEach(m => {
    const rec = monthData.records[m.id];
    if (rec) {
      ahUnpaidOutstanding += rec.jumlahPinjaman;
      ahUnpaidInstallment += rec.angsuran || 0;
      ahUnpaidInterest += rec.jasa || 0;
      ahUnpaidSavings += rec.simpananWajib || 0;
      ahUnpaidDeductions += (rec.angsuran || 0) + (rec.jasa || 0) + (rec.simpananWajib || 0);
      ahUnpaidRemaining += rec.jumlahPinjaman;
    }
  });

  // AH Clean values (Jumlah Bersih AH)
  const ahCleanOutstanding = ahGrossOutstanding;
  const ahCleanInstallment = ahGrossInstallment - ahUnpaidInstallment;
  const ahCleanInterest = ahGrossInterest - ahUnpaidInterest;
  const ahCleanSavings = ahGrossSavings - ahUnpaidSavings;
  const ahCleanDeductions = ahGrossDeductions - ahUnpaidDeductions;
  const ahCleanRemaining = ahGrossRemaining; // we keep original gross remaining or dynamic remains

  // 3. Air Hangat Barat (AHB) Region Totals Calculation
  let ahbOutstanding = 0;
  let ahbInstallment = 0;
  let ahbInterest = 0;
  let ahbSavings = 0;
  let ahbDeductions = 0;
  let ahbRemaining = 0;
  let ahbMembersCount = 0;
  let ahbActiveCount = 0;

  const ahbSchoolsList = schools.filter(s => s.id.endsWith('-ahb'));
  ahbSchoolsList.forEach(sch => {
    const schMembers = members.filter(m => m.schoolId === sch.id);
    ahbMembersCount += schMembers.length;
    schMembers.forEach(m => {
      const rec = monthData.records[m.id];
      if (rec) {
        if (!rec.isTidakBayar) {
          ahbOutstanding += rec.jumlahPinjaman;
          ahbInstallment += rec.angsuran;
          ahbInterest += rec.jasa;
          ahbSavings += rec.simpananWajib;
          ahbDeductions += rec.angsuran + rec.jasa + rec.simpananWajib;
          ahbRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
          if (rec.jumlahPinjaman > 0) ahbActiveCount++;
        } else {
          ahbOutstanding += rec.jumlahPinjaman;
          ahbSavings += rec.simpananWajib;
          ahbDeductions += rec.simpananWajib;
          ahbRemaining += rec.jumlahPinjaman;
        }
      }
    });
  });

  // 4. Grand Total Combined (AH + AHB)
  const grandOutstanding = ahCleanOutstanding + ahbOutstanding;
  const grandInstallment = ahCleanInstallment + ahbInstallment;
  const grandInterest = ahCleanInterest + ahbInterest;
  const grandSavings = ahCleanSavings + ahbSavings;
  const grandDeductions = ahCleanDeductions + ahbDeductions;
  const grandRemaining = ahCleanRemaining + ahbRemaining;
  const grandAgtCount = (ahGrossActiveCount - ahUnpaidMembers.filter(m => (monthData.records[m.id]?.jumlahPinjaman || 0) > 0).length) + ahbActiveCount;

  // 5. Build active Recapitulation array for display table
  const recapRows = activeRegionSchools.map((sch, index) => {
    let outstanding = 0;
    let installment = 0;
    let interest = 0;
    let savings = 0;
    let deductions = 0;
    let remaining = 0;
    let activeCount = 0;

    const schMembers = members.filter(m => m.schoolId === sch.id);

    schMembers.forEach(m => {
      const rec = monthData.records[m.id];
      if (rec) {
        outstanding += rec.jumlahPinjaman;
        installment += rec.angsuran;
        interest += rec.jasa;
        savings += rec.simpananWajib;
        deductions += rec.angsuran + rec.jasa + rec.simpananWajib;
        remaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
        if (rec.jumlahPinjaman > 0) activeCount++;
      }
    });

    return {
      index: index + 1,
      name: sch.name.replace('/III', '').trim(),
      outstanding,
      installment,
      interest,
      savings,
      deductions,
      remaining,
      membersCount: schMembers.length,
      activeCount
    };
  });

  // Sum active recap rows for printout headers
  const totalRecapOutstanding = recapRows.reduce((sum, r) => sum + r.outstanding, 0);
  const totalRecapInstallment = recapRows.reduce((sum, r) => sum + r.installment, 0);
  const totalRecapInterest = recapRows.reduce((sum, r) => sum + r.interest, 0);
  const totalRecapSavings = recapRows.reduce((sum, r) => sum + r.savings, 0);
  const totalRecapDeductions = recapRows.reduce((sum, r) => sum + r.deductions, 0);
  const totalRecapRemaining = recapRows.reduce((sum, r) => sum + r.remaining, 0);
  const totalRecapAgt = recapRows.reduce((sum, r) => sum + r.membersCount, 0);

  // Unpaid members specific to currently viewed region
  const unpaidMembers = members.filter(m => {
    const isOfRegion = selectedRegion === 'AH' ? !m.schoolId.endsWith('-ahb') : m.schoolId.endsWith('-ahb');
    if (!isOfRegion) return false;
    const rec = monthData.records[m.id];
    return rec?.isTidakBayar && rec?.jumlahPinjaman > 0;
  });

  const sumUnpaidOutstanding = unpaidMembers.reduce((sum, m) => sum + (monthData.records[m.id]?.jumlahPinjaman || 0), 0);
  const sumUnpaidInstallment = unpaidMembers.reduce((sum, m) => sum + (monthData.records[m.id]?.angsuran || 0), 0);
  const sumUnpaidInterest = unpaidMembers.reduce((sum, m) => sum + (monthData.records[m.id]?.jasa || 0), 0);
  const sumUnpaidSavings = unpaidMembers.reduce((sum, m) => sum + (monthData.records[m.id]?.simpananWajib || 0), 0);
  const sumUnpaidTotal = sumUnpaidInstallment + sumUnpaidInterest + sumUnpaidSavings;
  const sumUnpaidRemaining = unpaidMembers.reduce((sum, m) => sum + (monthData.records[m.id]?.jumlahPinjaman || 0), 0);

  return (
    <div className="space-y-6" id="pdf-report-tab">
      {/* Dynamic @page media styles for browser print dialog defaults */}
      {printMode === 'treasurer' ? (
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page {
              size: 210mm 330mm portrait !important;
              margin: 12mm 10mm 12mm 10mm !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
          }
        `}} />
      ) : (
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page {
              size: 297mm 210mm landscape !important;
              margin: 10mm !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
          }
        `}} />
      )}

      {/* Regional Selector Tab for PDF Generation */}
      <div className="flex border border-slate-205 rounded-xl overflow-hidden bg-slate-100 print:hidden divide-x divide-slate-200">
        <button
          type="button"
          onClick={() => handleRegionChange('AH')}
          className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedRegion === 'AH'
              ? 'bg-blue-600 text-white font-extrabold shadow-sm'
              : 'text-slate-650 hover:text-slate-800 hover:bg-slate-50 bg-slate-100'
          }`}
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
              : 'text-slate-650 hover:text-slate-800 hover:bg-slate-50 bg-slate-100'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedRegion === 'AHB' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          <span>WILAYAH CABANG AHB (Air Hangat Barat) — 9 Sekolah</span>
        </button>
      </div>

      {/* Tab Control and Configurations */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {/* Single school view */}
          <button
            onClick={() => setPrintMode('single')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer ${
              printMode === 'single'
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-150 text-slate-800 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Laporan Per-Sekolah</span>
          </button>

          {/* Recap view */}
          <button
            onClick={() => setPrintMode('recap')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer ${
              printMode === 'recap'
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-150 text-slate-800 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Rekapitulasi KPN</span>
          </button>

          {/* Treasurer Portrait view */}
          <button
            onClick={() => setPrintMode('treasurer')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer ${
              printMode === 'treasurer'
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-150 text-slate-800 border border-slate-200'
            }`}
            title="Format laporan portrait 1 lembar khusus F4 (21cm x 33cm) diserahkan ke Bendahara Gaji"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-750 font-bold">Laporan ke Bendahara (F4)</span>
          </button>

          {/* Bulk view */}
          <button
            onClick={() => setPrintMode('bulk')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer ${
              printMode === 'bulk'
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-150 text-slate-800 border border-slate-200'
            }`}
            title="Cetak/Simpan semua lembar potongan sekaligus dengan pembatas halaman"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-750 font-bold">Cetak Massal Semua</span>
          </button>
        </div>

        {/* Selected School indicator if mode is single */}
        <div className="flex items-center gap-2">
          {printMode === 'single' && (
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="bg-white border border-slate-250 rounded px-2.5 py-1 text-xs select-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-800"
            >
              {activeRegionSchools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF / Print</span>
          </button>
        </div>
      </div>

      {/* RENDER INSTRUCTION BOX */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-2.5 print:hidden">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[10px] text-blue-800 block mb-1">Panduan Cetak PDF Hasil Terbaik:</span>
          {printMode === 'treasurer' ? (
            <p className="leading-relaxed text-blue-700">
              Saat kotak dialog Windows Print terbuka, pilih tujuan <strong className="text-blue-950">"Save as PDF"</strong> atau printer Anda. Atur ukuran kertas menjadi <strong className="text-blue-950">F4 (Folio/Oficio 210 x 330 mm)</strong>, jadikan orientasi <strong className="text-blue-950">Portrait (Tegak)</strong>, centang <strong className="text-blue-950">"Header and footer" (dimatikan)</strong>, serta centang <strong className="text-blue-950">"Background graphics" (diaktifkan)</strong> agar warna tabel tercetak dengan sempurna!
            </p>
          ) : (
            <p className="leading-relaxed text-blue-700">
              Saat kotak dialog Windows Print terbuka, pilih tujuan <strong className="text-blue-950">"Save as PDF"</strong> atau printer Anda. Atur ukuran kertas menjadi <strong className="text-blue-950">A4 / Letter</strong>, jadikan orientasi <strong className="text-blue-950">Landscape (Mendatar)</strong> untuk kenyamanan membaca, centang <strong className="text-blue-950">"Header and footer" (dimatikan)</strong>, serta centang <strong className="text-blue-950">"Background graphics" (diaktifkan)</strong> agar warna tabel tercetak dengan sempurna!
            </p>
          )}
        </div>
      </div>

      {/* 4 School Selectors for Treasurer mode (hidden during print) */}
      {printMode === 'treasurer' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 print:hidden animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Pilih 4 Sekolah untuk Disusun pada 1 Lembar F4 Portrait</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Sekolah Ke-1 (Atas)', val: treasurerSchool1, setVal: setTreasurerSchool1 },
              { label: 'Sekolah Ke-2', val: treasurerSchool2, setVal: setTreasurerSchool2 },
              { label: 'Sekolah Ke-3', val: treasurerSchool3, setVal: setTreasurerSchool3 },
              { label: 'Sekolah Ke-4 (Bawah)', val: treasurerSchool4, setVal: setTreasurerSchool4 }
            ].map((cfg, ind) => (
              <div key={ind} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">{cfg.label}</label>
                <select
                  value={cfg.val}
                  onChange={(e) => cfg.setVal(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">- Sembunyikan Sekolah -</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== PRINT AREA CONTAINER ==================== */}
      <div className="bg-slate-100 p-4 md:p-8 rounded-xl border border-slate-200 flex justify-center print:bg-white print:p-0 print:border-none print:shadow-none">
        
        {/* Printable Paper A4/F4 Page */}
        <div className={`w-full bg-white text-black shadow-lg print:shadow-none print:p-0 font-sans print:max-w-full transition-all duration-300 ${
          printMode === 'treasurer' ? 'max-w-[210mm] p-6 md:p-8' : 'max-w-[297mm] p-6 md:p-10'
        }`}>
          
          {/* MODE A: SINGLE SCHOOL REPORT */}
          {printMode === 'single' && (
            <div id="print-single-school" className="space-y-6">
              {renderHeader()}
              
              {/* Report Sub-Header */}
              <div className="flex justify-between items-end border-b border-black pb-2 text-xs">
                <div>
                  <span className="font-mono">Daftar Potongan Bulan : </span>
                  <span className="font-bold underline uppercase tracking-tight">{monthData.labelText}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">{currentSchool?.name}</span>
                </div>
              </div>

              {/* Table Data */}
              {renderSchoolTable(schoolMembers, singleTotalOutstanding, singleTotalInstallment, singleTotalInterest, singleTotalSavings, singleTotalDeductions, singleTotalRemaining)}

              {/* Footnotes & Signatures */}
              {renderSignatures(config, `Pengurus ${currentSchool?.name || ''}`)}
            </div>
          )}

          {/* MODE B: RECAPITULATION OVERALL REPORT */}
          {printMode === 'recap' && (
            <div id="print-recap" className="space-y-6">
              {renderHeader(true)}

              {/* Recap Sub-Header */}
              <div className="flex justify-between items-end border-b border-black pb-2 text-xs">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider block">REKAPITULASI PENGEMBALIAN PINJAMAN KPN AIR HANGAT {selectedRegion === 'AHB' ? 'BARAT (AHB)' : '(AH)'}</span>
                  <span className="font-medium text-slate-800">Periode Potongan: <strong>{monthData.labelText}</strong></span>
                </div>
                <span className="font-mono text-[10px] text-gray-400">Total: {activeRegionSchools.length} Instansi</span>
              </div>

              {/* Table Recap */}
              <table className="w-full text-left text-[11px] border border-black border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-black text-center font-bold">
                    <th className="py-2 px-1 border-r border-black w-8">NO</th>
                    <th className="py-2 px-2 border-r border-black text-left">NAMA INSTANSI</th>
                    <th className="py-2 px-2 border-r border-black text-right">JUMLAH PINJAMAN</th>
                    <th className="py-2 px-2 border-r border-black text-right">ANGSURAN PINJAMAN</th>
                    <th className="py-2 px-2 border-r border-black text-right">JASA PINJAMAN (1%)</th>
                    <th className="py-2 px-2 border-r border-black text-right">SIMPANAN WAJIB</th>
                    <th className="py-2 px-2 border-r border-black text-right">JUMLAH POTONGAN</th>
                    <th className="py-2 px-2 border-r border-black text-right">SISA PINJAMAN</th>
                    <th className="py-2 px-1 text-center w-12">AGT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/40">
                  {recapRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-1.5 px-1 border-r border-black text-center font-mono">{idx + 1}</td>
                      <td className="py-1.5 px-2 border-r border-black font-semibold">{row.name}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.outstanding === 0 ? '-' : formatRp(row.outstanding)}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.installment === 0 ? '-' : formatRp(row.installment)}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.interest === 0 ? '-' : formatRp(row.interest)}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.savings === 0 ? '-' : formatRp(row.savings)}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono font-bold text-gray-950">{row.deductions === 0 ? '-' : formatRp(row.deductions)}</td>
                      <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.remaining === 0 ? '-' : formatRp(row.remaining)}</td>
                      <td className="py-1.5 px-1 text-center font-mono">{row.membersCount}</td>
                    </tr>
                  ))}

                  {/* JUMLAH AKHIR */}
                  <tr className="bg-gray-100 border-t-2 border-black font-bold">
                    <td colSpan={2} className="py-2 px-2 border-r border-black text-center text-xs">J U M L A H</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapOutstanding)}</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapInstallment)}</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapInterest)}</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapSavings)}</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono text-xs">{formatRp(totalRecapDeductions)}</td>
                    <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapRemaining)}</td>
                    <td className="py-2 px-1 text-center font-mono text-xs">{totalRecapAgt}</td>
                  </tr>

                  {selectedRegion === 'AH' && (
                    <>
                      {/* TIDAK BAYAR LIST ROW */}
                      <tr className="bg-amber-50/40 text-gray-500 italic [font-style:italic]">
                        <td colSpan={2} className="py-2 px-2 border-r border-black text-center font-bold text-[10px]">TIDAK BAYAR/DITANGGUHKAN</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px]">{formatRp(ahUnpaidOutstanding)}</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px]">{formatRp(ahUnpaidInstallment)}</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px]">{formatRp(ahUnpaidInterest)}</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px]">{formatRp(ahUnpaidSavings)}</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px] text-gray-800 font-bold">{formatRp(ahUnpaidDeductions)}</td>
                        <td className="py-2 px-2 border-r border-black text-right font-mono text-[10px]">{formatRp(ahUnpaidRemaining)}</td>
                        <td className="py-2 px-1 text-center font-mono text-[10px]">{ahUnpaidMembers.length}</td>
                      </tr>

                      {/* GRAND TOTAL BERSIH KPN AH */}
                      <tr className="bg-emerald-50 text-emerald-950 border-t border-black font-extrabold text-xs">
                        <td colSpan={2} className="py-2.5 px-2 border-r border-black text-left">1. JUMLAH BERSIH TERIMA KPN GURU SD (AH)</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">-</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanInstallment)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanInterest)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanSavings)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-black text-emerald-700 bg-emerald-100">{formatRp(ahCleanDeductions)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">{formatRp(ahCleanRemaining)}</td>
                        <td className="py-2.5 px-1 text-center font-mono">{ahGrossActiveCount - ahUnpaidMembers.length}</td>
                      </tr>

                      {/* TOTAL BERSIH TERIMA KPN AHB */}
                      <tr className="bg-slate-50 text-slate-800 border-t border-slate-200 font-bold text-xs">
                        <td colSpan={2} className="py-2.5 px-2 border-r border-black text-left">2. JUMLAH BERSIH TERIMA KPN CABANG (AHB)</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">-</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbInstallment)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbInterest)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbSavings)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-extrabold text-slate-700 bg-slate-100">{formatRp(ahbDeductions)}</td>
                        <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">{formatRp(ahbRemaining)}</td>
                        <td className="py-2.5 px-1 text-center font-mono">{ahbActiveCount}</td>
                      </tr>

                      {/* CONSOLIDATED GRAND TOTAL */}
                      <tr className="bg-blue-600 text-white border-t-2 border-black font-extrabold text-xs">
                        <td colSpan={2} className="py-3 px-2 border-r border-black text-left uppercase font-black">JUMLAH TOTAL BERSIH YANG DITERIMA (AH + AHB)</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">-</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandInstallment)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandInterest)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandSavings)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-black text-yellow-300 text-sm bg-blue-700">{formatRp(grandDeductions)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">{formatRp(grandRemaining)}</td>
                        <td className="py-3 px-1 text-center font-mono">{grandAgtCount}</td>
                      </tr>
                    </>
                  )}

                  {selectedRegion === 'AHB' && (
                    /* FOR AHB BRAND RECAP */
                    <tr className="bg-emerald-600 text-white border-t-2 border-black font-extrabold text-xs">
                      <td colSpan={2} className="py-3 px-2 border-r border-black text-left uppercase font-black font-sans">TOTAL BERSIH TERIMA KPN (AHB)</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">-</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapInstallment)}</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapInterest)}</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapSavings)}</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-black text-yellow-300 text-sm bg-emerald-700">{formatRp(totalRecapDeductions)}</td>
                      <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">{formatRp(totalRecapRemaining)}</td>
                      <td className="py-3 px-1 text-center font-mono">{totalRecapAgt}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* RENDER DITANGGUHKAN MEMBERS OVERVIEW IN BULK PRINT ONLY */}
              {unpaidMembers.length > 0 && (
                <div className="bg-slate-50 border border-black text-[10px] p-2 rounded-lg">
                  <span className="font-bold underline text-slate-800 block">Daftar Penangguhan Potongan KPN Bulan Ini:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1 font-mono">
                    {unpaidMembers.map((m, uidx) => {
                      const sch = schools.find(s => s.id === m.schoolId)?.name.replace('/III', '').trim();
                      return (
                        <div key={uidx} className="bg-white px-2 py-0.5 border border-slate-200 rounded">
                          <span className="font-semibold">{m.name}</span> ({sch})
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footnotes & Signatures */}
              {renderSignatures(config, 'Pembuat Daftar')}
            </div>
          )}

          {/* MODE C: BULK ALL SCHOOLS GENERATION WITH PAGEBREAKS */}
          {printMode === 'bulk' && (
            <div id="print-bulk-all" className="space-y-12">
              <div className="bg-slate-100 p-3 rounded text-xs block print:hidden text-center text-slate-700 border border-slate-200">
                ⚠️ Anda berada dalam mode Preview Cetak Massal ({selectedRegion}). Semua <strong className="text-slate-900">{activeRegionSchools.length} instansi/sekolah</strong> dideretkan ke bawah, masing-masing dibatasi dengan pembatas halaman. Klik tombol "Cetak PDF" untuk memicu printer secara massal.
              </div>

              {activeRegionSchools.map((sch, schIdx) => {
                const schM = members.filter(m => m.schoolId === sch.id);
                
                // Calculate individual totals
                let bOutstanding = 0;
                let bInstallment = 0;
                let bInterest = 0;
                let bSavings = 0;
                let bDeductions = 0;
                let bRemaining = 0;

                schM.forEach(m => {
                  const rec = monthData.records[m.id];
                  if (rec) {
                    if (!rec.isTidakBayar) {
                      bOutstanding += rec.jumlahPinjaman;
                      bInstallment += rec.angsuran;
                      bInterest += rec.jasa;
                      bSavings += rec.simpananWajib;
                      bDeductions += rec.angsuran + rec.jasa + rec.simpananWajib;
                      bRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
                    } else {
                      bOutstanding += rec.jumlahPinjaman;
                      bSavings += rec.simpananWajib;
                      bDeductions += rec.simpananWajib;
                      bRemaining += rec.jumlahPinjaman;
                    }
                  }
                });

                return (
                  <div key={sch.id} className="space-y-6 pt-4 border-t border-dashed border-gray-300 print:border-none print:pt-0 print:m-0 page-break">
                    {renderHeader()}
                    
                    {/* Report Sub-Header */}
                    <div className="flex justify-between items-end border-b border-black pb-2 text-xs">
                      <div>
                        <span className="font-mono">Daftar Potongan Bulan : </span>
                        <span className="font-bold underline uppercase tracking-tight">{monthData.labelText}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm">{sch.name}</span>
                      </div>
                    </div>

                    {/* Table Data */}
                    {renderSchoolTable(schM, bOutstanding, bInstallment, bInterest, bSavings, bDeductions, bRemaining)}

                    {/* Footnotes & Signatures */}
                    {renderSignatures(config, `Pengurus ${sch.name}`)}
                  </div>
                );
              })}

              {/* RENDER THE RECAP AS THE FINAL PAGE OF BULK PRINT */}
              <div className="space-y-6 pt-8 border-t-2 border-solid border-slate-800 print:border-none page-break">
                {renderHeader(true)}
                
                <div className="flex justify-between items-end border-b border-black pb-2 text-xs">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider block font-bold">REKAPITULASI AKHIR SEMUA SEKOLAH (BULK COMPILATION)</span>
                    <span className="font-medium text-slate-800">Periode Potongan: <strong>{monthData.labelText}</strong></span>
                  </div>
                </div>

                {/* Recap Summary Table in Bulk */}
                <table className="w-full text-left text-[11px] border border-black border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black text-center font-bold">
                      <th className="py-2 px-1 border-r border-black w-8">NO</th>
                      <th className="py-2 px-2 border-r border-black text-left">NAMA INSTANSI</th>
                      <th className="py-2 px-2 border-r border-black text-right">JUMLAH PINJAMAN</th>
                      <th className="py-2 px-2 border-r border-black text-right">ANGSURAN PINJAMAN</th>
                      <th className="py-2 px-2 border-r border-black text-right">JASA PINJAMAN (1%)</th>
                      <th className="py-2 px-2 border-r border-black text-right">SIMPANAN WAJIB</th>
                      <th className="py-2 px-2 border-r border-black text-right">JUMLAH POTONGAN</th>
                      <th className="py-2 px-2 border-r border-black text-right">SISA PINJAMAN</th>
                      <th className="py-2 px-1 text-center">AGT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 px-1 border-r border-black text-center font-mono">{idx + 1}</td>
                        <td className="py-1.5 px-2 border-r border-black font-semibold">{row.name}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.outstanding === 0 ? '-' : formatRp(row.outstanding)}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.installment === 0 ? '-' : formatRp(row.installment)}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.interest === 0 ? '-' : formatRp(row.interest)}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.savings === 0 ? '-' : formatRp(row.savings)}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono font-bold">{row.deductions === 0 ? '-' : formatRp(row.deductions)}</td>
                        <td className="py-1.5 px-2 border-r border-black text-right font-mono">{row.remaining === 0 ? '-' : formatRp(row.remaining)}</td>
                        <td className="py-1.5 px-1 text-center font-mono">{row.membersCount}</td>
                      </tr>
                    ))}
                    {/* JUMLAH AKHIR */}
                    <tr className="bg-gray-100 border-t-2 border-black font-bold text-xs">
                      <td colSpan={2} className="py-2 px-2 border-r border-black text-center">J U M L A H</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapOutstanding)}</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapInstallment)}</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapInterest)}</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapSavings)}</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono text-sm">{formatRp(totalRecapDeductions)}</td>
                      <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(totalRecapRemaining)}</td>
                      <td className="py-2 px-1 text-center font-mono">{totalRecapAgt}</td>
                    </tr>

                    {selectedRegion === 'AH' && (
                      <>
                        {/* TIDAK BAYAR LIST ROW */}
                        <tr className="bg-amber-50/40 text-gray-500 italic [font-style:italic] text-[10px]">
                          <td colSpan={2} className="py-2 px-2 border-r border-black text-center font-bold">TIDAK BAYAR/DITANGGUHKAN</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(ahUnpaidOutstanding)}</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(ahUnpaidInstallment)}</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(ahUnpaidInterest)}</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(ahUnpaidSavings)}</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono text-gray-800 font-bold">{formatRp(ahUnpaidDeductions)}</td>
                          <td className="py-2 px-2 border-r border-black text-right font-mono">{formatRp(ahUnpaidRemaining)}</td>
                          <td className="py-2 px-1 text-center font-mono">{ahUnpaidMembers.length}</td>
                        </tr>

                        {/* GRAND TOTAL BERSIH KPN AH */}
                        <tr className="bg-emerald-50 text-emerald-950 border-t border-black font-extrabold text-xs">
                          <td colSpan={2} className="py-2.5 px-2 border-r border-black text-left">1. JUMLAH BERSIH TERIMA KPN GURU SD (AH)</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">-</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanInstallment)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanInterest)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-bold text-blue-750">{formatRp(ahCleanSavings)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-black text-emerald-700 bg-emerald-100">{formatRp(ahCleanDeductions)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">{formatRp(ahCleanRemaining)}</td>
                          <td className="py-2.5 px-1 text-center font-mono">{ahGrossActiveCount - ahUnpaidMembers.length}</td>
                        </tr>

                        {/* TOTAL BERSIH TERIMA KPN AHB */}
                        <tr className="bg-slate-50 text-slate-800 border-t border-slate-200 font-bold text-xs">
                          <td colSpan={2} className="py-2.5 px-2 border-r border-black text-left">2. JUMLAH BERSIH TERIMA KPN CABANG (AHB)</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">-</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbInstallment)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbInterest)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono text-blue-750">{formatRp(ahbSavings)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-extrabold text-slate-700 bg-slate-100">{formatRp(ahbDeductions)}</td>
                          <td className="py-2.5 px-2 border-r border-black text-right font-mono font-normal">{formatRp(ahbRemaining)}</td>
                          <td className="py-2.5 px-1 text-center font-mono">{ahbActiveCount}</td>
                        </tr>

                        {/* CONSOLIDATED GRAND TOTAL */}
                        <tr className="bg-blue-600 text-white border-t-2 border-black font-extrabold text-xs">
                          <td colSpan={2} className="py-3 px-2 border-r border-black text-left uppercase font-black">JUMLAH TOTAL BERSIH YANG DITERIMA (AH + AHB)</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">-</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandInstallment)}</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandInterest)}</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(grandSavings)}</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-black text-yellow-300 text-sm bg-blue-700">{formatRp(grandDeductions)}</td>
                          <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">{formatRp(grandRemaining)}</td>
                          <td className="py-3 px-1 text-center font-mono">{grandAgtCount}</td>
                        </tr>
                      </>
                    )}

                    {selectedRegion === 'AHB' && (
                      <tr className="bg-emerald-600 text-white border-t-2 border-black font-extrabold text-xs">
                        <td colSpan={2} className="py-3 px-2 border-r border-black text-left uppercase font-black">TOTAL BERSIH TERIMA KPN (AHB)</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">-</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapInstallment)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapInterest)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-bold">{formatRp(totalRecapSavings)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-black text-yellow-300 text-sm bg-emerald-700">{formatRp(totalRecapDeductions)}</td>
                        <td className="py-3 px-2 border-r border-black text-right font-mono font-normal">{formatRp(totalRecapRemaining)}</td>
                        <td className="py-3 px-1 text-center font-mono">{totalRecapAgt}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {renderSignatures(config, 'Pembuat Daftar')}
              </div>
            </div>
          )}

          {/* MODE D: LAPORAN BENDAHARA (F4 PORTRAIT) */}
          {printMode === 'treasurer' && (
            <div id="print-treasurer" className="space-y-4">
              {renderHeader(true)}

              {/* Title Section */}
              <div className="text-center space-y-0.5">
                <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DAFTAR POTONGAN ANGGOTA PER INSTANSI</h3>
                <p className="text-[11px] font-semibold text-slate-800">
                  Periode Potongan: <span className="underline uppercase tracking-tight font-extrabold">{monthData.labelText}</span>
                </p>
              </div>

              {/* Render selected schools */}
              <div className="space-y-4">
                {[treasurerSchool1, treasurerSchool2, treasurerSchool3, treasurerSchool4]
                  .filter(Boolean)
                  .map((schId) => {
                    const sch = schools.find(s => s.id === schId);
                    if (!sch) return null;

                    const schMembers = members.filter(m => m.schoolId === schId);

                    // Compute school totals
                    let btOutstanding = 0;
                    let btInstallment = 0;
                    let btInterest = 0;
                    let btSavings = 0;
                    let btDeductions = 0;
                    let btRemaining = 0;

                    schMembers.forEach(m => {
                      const rec = monthData.records[m.id];
                      if (rec) {
                        if (!rec.isTidakBayar) {
                          btOutstanding += rec.jumlahPinjaman;
                          btInstallment += rec.angsuran;
                          btInterest += rec.jasa;
                          btSavings += rec.simpananWajib;
                          btDeductions += rec.angsuran + rec.jasa + rec.simpananWajib;
                          btRemaining += Math.max(0, rec.jumlahPinjaman - rec.angsuran);
                        } else {
                          btOutstanding += rec.jumlahPinjaman;
                          btSavings += rec.simpananWajib;
                          btDeductions += rec.simpananWajib;
                          btRemaining += rec.jumlahPinjaman;
                        }
                      }
                    });

                    return (
                      <div key={sch.id} className="space-y-1">
                        {/* School Heading */}
                        <div className="flex justify-between items-end border-b border-black pb-0.5">
                          <span className="font-bold uppercase text-[9px] tracking-wide">
                            INSTANSI / SEKOLAH: <span className="underline">{sch.name}</span>
                          </span>
                          <span className="font-mono text-[8px] text-gray-500">
                            {schMembers.length} Anggota
                          </span>
                        </div>

                        {/* High density F4 table */}
                        <table className="w-full text-left text-[9px] border border-black border-collapse">
                          <thead>
                            <tr className="bg-gray-100 border-b border-black text-center font-bold text-[8px]">
                              <th className="py-0.5 px-1 border-r border-black w-6">No</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-left">Nama Anggota</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Jumlah Pinjaman</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Angsuran</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Jasa 1%</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Simpanan Wajib</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Jumlah Mo</th>
                              <th className="py-0.5 px-1.5 border-r border-black text-right">Sisa Pinjaman</th>
                              <th className="py-0.5 px-1 text-center w-10">Ang Ke</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/30">
                            {schMembers.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="py-2 text-center text-gray-400 font-mono text-[8px]">
                                  Belum ada anggota koperasi terdaftar di instansi ini.
                                </td>
                              </tr>
                            ) : (
                              schMembers.map((m, idx) => {
                                const rec = monthData.records[m.id];
                                if (!rec) return null;

                                const totalDeducts = rec.isTidakBayar
                                  ? rec.simpananWajib
                                  : (rec.angsuran + rec.jasa + rec.simpananWajib);

                                const startLoan = rec.jumlahPinjaman;
                                const computedRem = rec.isTidakBayar
                                  ? rec.jumlahPinjaman
                                  : Math.max(0, rec.jumlahPinjaman - rec.angsuran);

                                return (
                                  <tr key={m.id} className={rec.isTidakBayar ? 'bg-amber-50/25 text-gray-400 font-normal shadow-none' : ''}>
                                    <td className="py-0.5 px-1 border-r border-black text-center font-mono">{idx + 1}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black font-semibold uppercase text-slate-950">
                                      {m.name}
                                    </td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{startLoan === 0 ? '-' : formatRp(startLoan)}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{rec.isTidakBayar ? '-' : (rec.angsuran === 0 ? '-' : formatRp(rec.angsuran))}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{rec.isTidakBayar ? '-' : (rec.jasa === 0 ? '-' : formatRp(rec.jasa))}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{rec.simpananWajib === 0 ? '-' : formatRp(rec.simpananWajib)}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono font-bold text-black">{totalDeducts === 0 ? '-' : formatRp(totalDeducts)}</td>
                                    <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{computedRem === 0 ? '-' : formatRp(computedRem)}</td>
                                    <td className="py-0.5 px-1 border-black text-center font-mono text-[8.5px]">{rec.angKe === null ? '-' : rec.angKe}</td>
                                  </tr>
                                );
                              })
                            )}

                            {/* Aggregates row for school */}
                            {schMembers.length > 0 && (
                              <tr className="bg-gray-100 border-t border-black font-bold text-[8.5px]">
                                <td colSpan={2} className="py-0.5 px-1.5 border-r border-black text-center">JUMLAH</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{formatRp(btOutstanding)}</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{formatRp(btInstallment)}</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{formatRp(btInterest)}</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{formatRp(btSavings)}</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono font-bold text-black">{formatRp(btDeductions)}</td>
                                <td className="py-0.5 px-1.5 border-r border-black text-right font-mono">{formatRp(btRemaining)}</td>
                                <td className="py-0.5 px-1 border-black text-center font-mono text-[8px]">-</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
              </div>

              {/* Portraits signatures with exactly the specified names */}
              {renderTreasurerSignatures()}
            </div>
          )}

        </div>
      </div>
    </div>
  );

  // Mini Renders
  function renderHeader(isRecap = false) {
    return (
      <div className="relative pb-1" id="header-printout">
        <div className="grid grid-cols-[64px_1fr_64px] items-center gap-2">
          {/* Left: Logo Koperasi Indonesia */}
          <div className="flex justify-start">
            <KoperasiLogo />
          </div>
          
          {/* Center: Header Text Centered */}
          <div className="text-center space-y-0.5">
            <h1 className="text-base sm:text-lg font-extrabold tracking-wide uppercase text-black font-serif leading-tight">KOPERASI PEGAWAI NEGERI ( KPN )</h1>
            <h2 className="text-xs sm:text-sm font-bold text-black uppercase leading-tight">GURU SD KECAMATAN AIR HANGAT</h2>
            <p className="text-[8px] sm:text-[9.5px] font-mono tracking-wider text-gray-700 font-semibold leading-tight">
              BADAN HUKUM NO.05/BH/III 1/KOP.UKM/2005 &nbsp;|&nbsp; TANGGAL : 25 NOVEMBER 2005
            </p>
          </div>

          {/* Right: Symmetrical placeholder spacer to center text perfectly */}
          <div className="w-[64px] h-1" />
        </div>
        <div className="w-full h-1 bg-black mt-2" />
        <div className="w-full h-[1px] bg-black mt-0.5" />
      </div>
    );
  }

  function renderSchoolTable(
    mList: Member[],
    sumO: number,
    sumI: number,
    sumInt: number,
    sumS: number,
    sumD: number,
    sumRem: number
  ) {
    return (
      <table className="w-full text-left text-[11px] border border-black border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-black text-center font-bold">
            <th className="py-1.5 px-1 border-r border-black w-8">No</th>
            <th className="py-1.5 px-2 border-r border-black text-left">Nama Anggota</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Jumlah Pinjaman</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Angsuran</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Jasa 1%</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Simpanan Wajib</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Jumlah</th>
            <th className="py-1.5 px-2 border-r border-black text-right">Sisa Pinjaman</th>
            <th className="py-1.5 px-1 text-center w-14">Ang Ke</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/30">
          {mList.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-400 font-mono">Belum ada anggota koperasi terdaftar di instansi ini.</td>
            </tr>
          ) : (
            mList.map((m, idx) => {
              const rec = monthData.records[m.id];
              if (!rec) return null;

              const totalDeducts = rec.isTidakBayar
                ? rec.simpananWajib
                : (rec.angsuran + rec.jasa + rec.simpananWajib);

              const startLoan = rec.jumlahPinjaman;
              const computedRem = rec.isTidakBayar
                ? rec.jumlahPinjaman
                : Math.max(0, rec.jumlahPinjaman - rec.angsuran);

              return (
                <tr key={m.id} className={rec.isTidakBayar ? 'bg-amber-50/25 text-gray-400' : ''}>
                  <td className="py-1 px-1 border-r border-black text-center font-mono">{idx + 1}</td>
                  <td className="py-1 px-2 border-r border-black font-semibold">
                    {m.name}
                    {rec.isTidakBayar && <span className="text-[8px] border border-amber-600 font-bold px-1 ml-1 rounded select-none font-mono">TIDAK BAYAR</span>}
                  </td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono">{startLoan === 0 ? '-' : formatRp(startLoan)}</td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono">{rec.isTidakBayar ? '-' : (rec.angsuran === 0 ? '-' : formatRp(rec.angsuran))}</td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono">{rec.isTidakBayar ? '-' : (rec.jasa === 0 ? '-' : formatRp(rec.jasa))}</td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono">{rec.simpananWajib === 0 ? '-' : formatRp(rec.simpananWajib)}</td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono font-bold text-black">{totalDeducts === 0 ? '-' : formatRp(totalDeducts)}</td>
                  <td className="py-1 px-2 border-r border-black text-right font-mono">{computedRem === 0 ? '-' : formatRp(computedRem)}</td>
                  <td className="py-1 px-1 text-center font-mono">{rec.angKe === null ? '-' : rec.angKe}</td>
                </tr>
              );
            })
          )}

          {/* TABLE SUMMARY ROWS */}
          {mList.length > 0 && (
            <tr className="bg-gray-100 border-t-2 border-black font-bold">
              <td colSpan={2} className="py-1.5 px-2 border-r border-black text-center text-xs">J U M L A H</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono">{formatRp(sumO)}</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono">{formatRp(sumI)}</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono">{formatRp(sumInt)}</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono">{formatRp(sumS)}</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono text-xs">{formatRp(sumD)}</td>
              <td className="py-1.5 px-2 border-r border-black text-right font-mono">{formatRp(sumRem)}</td>
              <td className="py-1.5 px-1 border-black text-center font-mono text-[9px]">-</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  function renderSignatures(cfg: SignerConfig, labelMaker = 'PEMBUAT DAFTAR') {
    return (
      <div className="space-y-4 pt-4 border-t border-gray-150 text-[11px] leading-relaxed">
        {/* Contact warning */}
        <div className="flex justify-between text-[10px] italic">
          <span>Jika ada kesalahan hubungi: <strong>{cfg.csPhone}</strong> &nbsp;|&nbsp; Simulasi Pinjaman dan Permohonan Pinjaman : <a href="https://bit.ly/permohonan-kpn-ah" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 font-semibold">https://bit.ly/permohonan-kpn-ah</a></span>
          <span className="font-mono text-gray-500">KPN GURU SD AIR HANGAT</span>
        </div>

        {/* Three-Column Signatures with Barcode in Center */}
        <div className="grid grid-cols-3 text-center pt-2 items-center">
          {/* Column Left: Ketua / Pengurus info */}
          <div className="flex flex-col justify-between h-28 text-center">
            <div>
              <p className="font-semibold">{cfg.ketuaTitle},</p>
            </div>
            <div className="relative h-11 flex items-center justify-center">
              {cfg.ketuaName.includes('JAIRUN') && (
                <div className="absolute -top-3 max-h-14">
                  <JairunSignature />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="font-bold underline text-xs">{cfg.ketuaName}</p>
              <p className="text-[10px] text-gray-500">NA. ..............................................</p>
            </div>
          </div>

          {/* Column Center: QR Code / Barcode */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fbit.ly%2Fpermohonan-kpn-ah" 
              alt="QR Code KPN" 
              className="w-14 h-14 border p-0.5 border-gray-200 rounded bg-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[7px] text-gray-400 font-mono tracking-wider">KPN GURU SD AH</span>
          </div>

          {/* Column Right: Sekretaris / Pembuat Daftar */}
          <div className="flex flex-col justify-between h-28 text-center">
            <div>
              <p className="font-semibold">{cfg.sekretarisTitle},</p>
              {labelMaker && !labelMaker.startsWith('Pengurus') && (
                <p className="text-gray-400 text-[10px] font-mono leading-none">{labelMaker}</p>
              )}
            </div>
            <div className="relative h-11 flex items-center justify-center">
              {cfg.sekretarisName.includes('OPPER ANTONI') && (
                <div className="absolute -top-3 max-h-14">
                  <OpperAntoniSignature />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="font-bold underline text-xs">{cfg.sekretarisName}</p>
              <p className="text-[10px] text-gray-500">NA. ..............................................</p>
            </div>
          </div>
        </div>


      </div>
    );
  }

  function renderTreasurerSignatures() {
    return (
      <div className="pt-4 border-t border-black text-[10px] leading-relaxed">
        {/* Contact warning */}
        <div className="flex justify-between text-[9px] italic text-slate-500 font-mono">
          <span>Hubungi Pengurus jika ada kekeliruan: HP. <strong>{config.csPhone}</strong></span>
          <span>Dicetak otomatis via Aplikasi KPN Guru SD</span>
        </div>

        {/* Three-Column Signatures with Barcode in Center */}
        <div className="grid grid-cols-3 text-center pt-3 items-center">
          {/* Column Left: Ketua */}
          <div className="flex flex-col justify-between h-28 text-center">
            <div>
              <p className="font-bold text-[11px] uppercase">Ketua,</p>
            </div>
            <div className="relative h-11 flex items-center justify-center">
              <div className="absolute -top-3 max-h-14">
                <JairunSignature />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold underline text-[11px]">H. JAIRUN, S.PdI, S.Pd</p>
              <p className="text-[10px] font-mono font-bold">NA. ..............................................</p>
            </div>
          </div>

          {/* Column Center: QR Code / Barcode */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fbit.ly%2Fpermohonan-kpn-ah" 
              alt="QR Code KPN" 
              className="w-14 h-14 border p-0.5 border-gray-200 rounded bg-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[7px] text-slate-500 font-mono tracking-wider">KPN GURU SD AH</span>
          </div>

          {/* Column Right: Wk. Sekretaris */}
          <div className="flex flex-col justify-between h-28 text-center">
            <div>
              <p className="font-bold text-[11px] uppercase">Wk. Sekretaris,</p>
            </div>
            <div className="relative h-11 flex items-center justify-center">
              <div className="absolute -top-3 max-h-14">
                <OpperAntoniSignature />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold underline text-[11px]">OPPER ANTONI, S.Pd</p>
              <p className="text-[10px] font-mono">NA. ..............................................</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
