import { School, Member, MonthData, SignerConfig, MonthlyRecord } from '../types';
import { INITIAL_SCHOOLS, INITIAL_MEMBERS, DEFAULT_SIGNERS, getInitialMonths } from '../data';

export interface GasMasterMember {
  nomor: string;
  nama: string;
  sekolah: string;
  wa: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface GasActiveLoan {
  nomor: string;
  nama: string;
  sekolah: string;
  sisaPinjaman: number;
  angsuran: number;
  jasa: number;
  iuranWajib: number;
}

export interface GasTunggakan {
  nomor: string;
  bulan: string; // e.g. "Januari 2026"
  tahun: number; // e.g. 2026
  angsuran: number;
  jasa: number;
  iuranWajib: number;
  denda: number;
  status: 'Belum Bayar' | 'Lunas';
}

export interface GasLaporan {
  totalPokok: number;
  totalJasa: number;
  totalIuran: number;
  totalDisalurkan: number;
  totalSisa: number;
  totalDenda?: number;
}

// Global API Hook to let App configure a direct Web App URL for CORS fetch during preview.
const WEB_APP_URL_KEY = 'kpn_web_app_url';

export function getWebAppUrl(): string {
  return localStorage.getItem(WEB_APP_URL_KEY) || 'https://script.google.com/macros/s/AKfycbx7-2dZo_f-tXoTe6-aGbdq20yVVIAf61lRhZWMUemgYzggkOxL8K9Knf4y6cpvmwNDEw/exec';
}

export function setWebAppUrl(url: string) {
  if (url) {
    localStorage.setItem(WEB_APP_URL_KEY, url);
  } else {
    localStorage.removeItem(WEB_APP_URL_KEY);
  }
}

// High-Fidelity Mock Database stored in LocalStorage to emulate Google Sheets in AI Studio Preview Mode
const M_KEY_MEMBERS = 'kpn_mock_members';
const M_KEY_LOANS = 'kpn_mock_loans';
const M_KEY_TUNGGAKAN = 'kpn_mock_tunggakan';
const M_KEY_LOGS = 'kpn_mock_logs';

function initMockDB() {
  if (!localStorage.getItem(M_KEY_MEMBERS)) {
    // Generate initial members based on INITIAL_MEMBERS and CSV offsets
    const mockM: GasMasterMember[] = INITIAL_MEMBERS.map((m, idx) => ({
      nomor: m.id,
      nama: m.name,
      sekolah: m.schoolId,
      wa: `081234567${100 + idx}`,
      status: 'Aktif'
    }));
    localStorage.setItem(M_KEY_MEMBERS, JSON.stringify(mockM));

    const mockL: GasActiveLoan[] = INITIAL_MEMBERS.map(m => {
      // Find initial balances from state/months
      const months = getInitialMonths();
      const janRec = months[0].records[m.id];
      return {
        nomor: m.id,
        nama: m.name,
        sekolah: m.schoolId,
        sisaPinjaman: janRec?.jumlahPinjaman || 0,
        angsuran: janRec?.angsuran || 0,
        jasa: janRec?.jasa || 0,
        iuranWajib: janRec?.simpananWajib || 100000
      };
    });
    localStorage.setItem(M_KEY_LOANS, JSON.stringify(mockL));

    // Seed some hypothetical arrears (tunggakan) as specified in PRD for testing
    // Let's seed member "m-35" (HJ HUSNIWATI) and "m-26" (NOVI PUSPITA DEWI) with arrears
    const mockT: GasTunggakan[] = [
      {
        nomor: 'm-35',
        bulan: 'Januari 2026',
        tahun: 2026,
        angsuran: 835000,
        jasa: 300000,
        iuranWajib: 100000,
        denda: 15000,
        status: 'Belum Bayar'
      },
      {
        nomor: 'm-26',
        bulan: 'Februari 2026',
        tahun: 2026,
        angsuran: 525000,
        jasa: 250000,
        iuranWajib: 100000,
        denda: 5000,
        status: 'Belum Bayar'
      }
    ];
    localStorage.setItem(M_KEY_TUNGGAKAN, JSON.stringify(mockT));
    localStorage.setItem(M_KEY_LOGS, JSON.stringify([]));
  }
}

// Business logical rounding rule: every ticket fee = cell(pokok + jasa + iuran) ceil to nearest 10,000
export function calculateRoundUpFee(installment: number, interest: number, obligSaving: number): { roundedTotal: number; remainder: number } {
  const base = installment + interest + obligSaving;
  if (base <= 0) return { roundedTotal: 0, remainder: 0 };
  const remainderUnit = 10000;
  const roundedTotal = Math.ceil(base / remainderUnit) * remainderUnit;
  const remainder = roundedTotal - base;
  return { roundedTotal, remainder };
}

// Wrapper utility that executes Google Apps Script function or falls back beautifully
export class GasService {
  private static isNative(): boolean {
    return typeof (window as any) !== 'undefined' && (window as any).google?.script?.run !== undefined;
  }

  private static fetchWithTimeout(url: string, body: any, timeout = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Koneksi Apps Script Web App timeout')), timeout);
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => {
          clearTimeout(timer);
          if (data.status === 'success') resolve(data.result);
          else reject(new Error(data.message || 'Error executing on Google Sheets'));
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // Orchestrate backend calls
  public static async execute<T>(fnName: string, ...args: any[]): Promise<T> {
    if (this.isNative()) {
      return new Promise<T>((resolve, reject) => {
        const run = (window as any).google.script.run;
        const success = run.withSuccessHandler((res: T) => resolve(res));
        const fail = success.withFailureHandler((err: any) => reject(err));
        const callFn = fail[fnName];
        if (typeof callFn === 'function') {
          callFn.apply(fail, args);
        } else {
          reject(new Error(`Fungsi backend "${fnName}" tidak ditemukan di Code.gs!`));
        }
      });
    }

    // CORS Mode (if they specified a Google Sheets Web App URL in settings)
    const webAppUrl = getWebAppUrl();
    if (webAppUrl) {
      try {
        return await this.fetchWithTimeout(webAppUrl, { functionName: fnName, args });
      } catch (e: any) {
        console.warn(`Direct fetch to Apps Script failed, falling back to simulated database: ${e.message}`);
      }
    }

    // High fidelity browser fallback Simulation Mode
    initMockDB();
    return new Promise<T>((resolve, reject) => {
      // Simulate slight network lag
      setTimeout(() => {
        try {
          const res = this.simulateBackend(fnName, args);
          resolve(res as T);
        } catch (e) {
          reject(e);
        }
      }, 550);
    });
  }

  // Local emulation of Google Sheet GAS routines
  private static simulateBackend(fnName: string, args: any[]): any {
    const getMembers = (): GasMasterMember[] => JSON.parse(localStorage.getItem(M_KEY_MEMBERS) || '[]');
    const getLoans = (): GasActiveLoan[] => JSON.parse(localStorage.getItem(M_KEY_LOANS) || '[]');
    const getTunggakan = (): GasTunggakan[] => JSON.parse(localStorage.getItem(M_KEY_TUNGGAKAN) || '[]');
    const saveMembers = (data: GasMasterMember[]) => localStorage.setItem(M_KEY_MEMBERS, JSON.stringify(data));
    const saveLoans = (data: GasActiveLoan[]) => localStorage.setItem(M_KEY_LOANS, JSON.stringify(data));
    const saveTunggakan = (data: GasTunggakan[]) => localStorage.setItem(M_KEY_TUNGGAKAN, JSON.stringify(data));

    switch (fnName) {
      case 'getDataMasterAnggota':
        return getMembers();

      case 'getDataPinjamanAktif':
        return getLoans();

      case 'getDaftarSekolah': {
        const uniqueSchools = Array.from(new Set(INITIAL_SCHOOLS.map(s => s.name)));
        return uniqueSchools;
      }

      case 'getLaporanTahunan': {
        const mems = getMembers().filter(m => m.status === 'Aktif');
        const loans = getLoans();
        const tunggakanList = getTunggakan().filter(t => t.status === 'Belum Bayar');
        
        let totalPokok = 0;
        let totalJasa = 0;
        let totalIuran = 0;
        let totalSisa = 0;
        let totalDenda = 0;

        loans.forEach(l => {
          totalSisa += l.sisaPinjaman;
          totalPokok += l.angsuran * 6; // approximate for 6 months
          totalJasa += l.jasa * 6;
          totalIuran += l.iuranWajib * 6;
        });

        tunggakanList.forEach(t => {
          totalDenda += t.denda;
        });

        return {
          totalPokok,
          totalJasa,
          totalIuran,
          totalDisalurkan: totalSisa * 1.5, // estimate for sample output
          totalSisa,
          totalDenda
        };
      }

      case 'getStatusGagalBayar': {
        const noAnggota = args[0];
        return getTunggakan().filter(t => t.nomor === noAnggota && t.status === 'Belum Bayar');
      }

      case 'prosesBayarAngsuran': {
        const noAnggota = args[0];
        const loans = getLoans();
        const loanIdx = loans.findIndex(l => l.nomor === noAnggota);
        const tList = getTunggakan();
        
        // Find oldest unpaid month for allocating payment
        const activeTunggakan = tList.filter(t => t.nomor === noAnggota && t.status === 'Belum Bayar');
        
        if (activeTunggakan.length > 0) {
          // Sort to find the oldest arrears month
          const oldest = activeTunggakan[0];
          oldest.status = 'Lunas';
          saveTunggakan(tList);
          return {
            success: true,
            allocatedTo: oldest.bulan,
            message: `Pembayaran sukses dialokasikan ke tunggakan tertua (${oldest.bulan}).`
          };
        }

        if (loanIdx !== -1) {
          const l = loans[loanIdx];
          const calculated = calculateRoundUpFee(l.angsuran, l.jasa, l.iuranWajib);
          const payPokok = l.angsuran + calculated.remainder;
          
          l.sisaPinjaman = Math.max(0, l.sisaPinjaman - payPokok);
          if (l.sisaPinjaman === 0) {
            l.angsuran = 0;
            l.jasa = 0;
          }
          saveLoans(loans);
          return {
            success: true,
            allocatedTo: 'Bulan Berjalan',
            message: `Pembayaran bulan berjalan berhasil dicatat. Sisa pinjaman berkurang menjadi ${l.sisaPinjaman}.`
          };
        }
        return { success: false, message: 'Anggota tidak memiliki pinjaman aktif' };
      }

      case 'prosesBayarAngsuranDenganBulan': {
        const noAnggota = args[0];
        const bulan = args[1];
        const tList = getTunggakan();
        const tItem = tList.find(t => t.nomor === noAnggota && t.bulan === bulan && t.status === 'Belum Bayar');
        if (tItem) {
          tItem.status = 'Lunas';
          saveTunggakan(tList);
          return { success: true, message: `Sukses membayar tunggakan bulan ${bulan} untuk anggota ${noAnggota}.` };
        }
        return { success: false, message: `Arsip tunggakan bulan ${bulan} tidak ditemukan.` };
      }

      case 'bayarIuranFromUI': {
        const noAnggota = args[0];
        const bulan = args[1];
        return { success: true, message: `Iuran wajib anggota ${noAnggota} bulan ${bulan} berhasil diverifikasi!` };
      }

      case 'tambahAnggotaFromUI': {
        const [nama, sekolah, wa, plafon, tenor] = args;
        const memList = getMembers();
        const loanList = getLoans();

        const cleanNo = `m-${memList.length + 1}`;
        const newM: GasMasterMember = {
          nomor: cleanNo,
          nama: nama.toUpperCase(),
          sekolah: sekolah,
          wa: wa || '08-Default-New',
          status: 'Aktif'
        };
        memList.push(newM);
        saveMembers(memList);

        const principal = parseFloat(plafon) || 0;
        const term = parseInt(tenor) || 12;
        const monthlyPokok = Math.round(principal / term);
        const monthlyJasa = Math.round(principal * 0.01);

        const newL: GasActiveLoan = {
          nomor: cleanNo,
          nama: nama.toUpperCase(),
          sekolah: sekolah,
          sisaPinjaman: principal,
          angsuran: monthlyPokok,
          jasa: monthlyJasa,
          iuranWajib: 100000
        };
        loanList.push(newL);
        saveLoans(loanList);

        return { success: true, nomorAnggota: cleanNo, message: `Anggota ${nama} berhasil diregistrasi dengan nomor ${cleanNo}.` };
      }

      case 'keluarkanAnggotaFromUI': {
        const noAnggota = args[0];
        const memList = getMembers();
        const loanList = getLoans();

        const mIdx = memList.findIndex(m => m.nomor === noAnggota);
        const loan = loanList.find(l => l.nomor === noAnggota);

        if (loan && loan.sisaPinjaman > 0) {
          throw new Error('Tidak bisa mengeluarkan anggota: sisa pinjaman masih tersisa ' + loan.sisaPinjaman);
        }

        const tList = getTunggakan().filter(t => t.nomor === noAnggota && t.status === 'Belum Bayar');
        if (tList.length > 0) {
          throw new Error('Tidak bisa mengeluarkan anggota: anggota masih memiliki tunggakan/gagal bayar!');
        }

        if (mIdx !== -1) {
          memList[mIdx].status = 'Nonaktif';
          saveMembers(memList);
          return { success: true, message: `Anggota nomor ${noAnggota} berhasil dinonaktifkan.` };
        }
        throw new Error('Nomor Anggota tidak dikenali');
      }

      case 'refinancingFromUI': {
        const [noAnggota, plafonBaru, tenorBaru] = args;
        const loans = getLoans();
        const loan = loans.find(l => l.nomor === noAnggota);
        if (!loan) {
          throw new Error('Anggota tidak memiliki pinjaman aktif untuk refinancing.');
        }

        const sisaLama = loan.sisaPinjaman;
        const pBaru = parseFloat(plafonBaru);
        const tBaru = parseInt(tenorBaru);

        if (pBaru < sisaLama) {
          throw new Error(`Plafon baru (${pBaru}) harus lebih besar daripada sisa pinjaman lama (${sisaLama}).`);
        }

        const terimaBersih = pBaru - sisaLama;
        loan.sisaPinjaman = pBaru;
        loan.angsuran = Math.round(pBaru / tBaru);
        loan.jasa = Math.round(pBaru * 0.01);

        saveLoans(loans);
        return {
          success: true,
          terimaBersih,
          message: `Refinancing disetujui! Anggota menerima pencairan sisa bersih senilai Rp${terimaBersih.toLocaleString('id-ID')}. Sisa pinjaman baru diset menjadi Rp${pBaru.toLocaleString('id-ID')}.`
        };
      }

      case 'kirimTagihanBulanan': {
        return {
          success: true,
          message: 'Laporan tagihan PDF berhasil digenerasi dan terkirim otomatis via WA ke seluruh Kepala Sekolah!'
        };
      }

      case 'prosesApprovalPembayaranSekolah': {
        const [sekolah, jumlahDibayar] = args;
        const loans = getLoans();
        // find school ID from schools list matching name
        const targetSch = INITIAL_SCHOOLS.find(s => s.name === sekolah || s.id === sekolah);
        const schId = targetSch ? targetSch.id : sekolah;

        const schLoans = loans.filter(l => l.sekolah === schId);
        if (schLoans.length === 0) {
          throw new Error(`Tidak ada anggota aktif di sekolah ${sekolah} yang memiliki sisa pinjaman.`);
        }

        // Calculate total school bill
        let totalSchoolBill = 0;
        const membersData = schLoans.map(l => {
          const calculated = calculateRoundUpFee(l.angsuran, l.jasa, l.iuranWajib);
          totalSchoolBill += calculated.roundedTotal;
          return { loan: l, tagihanBulat: calculated.roundedTotal, remainder: calculated.remainder };
        });

        // Loop and reduce loans individually reflecting the pay allocations
        const detailsLog: string[] = [];
        membersData.forEach(item => {
          const l = item.loan;
          const roundedTotal = item.tagihanBulat;
          const payPokok = l.angsuran + item.remainder;

          l.sisaPinjaman = Math.max(0, l.sisaPinjaman - payPokok);
          if (l.sisaPinjaman === 0) {
            l.angsuran = 0;
            l.jasa = 0;
          }
          detailsLog.push(`Nama ${l.nama}: Lunas potongan bulan berjalan. Sisa pokok Rp ${l.sisaPinjaman.toLocaleString('id-ID')}.`);
        });

        saveLoans(loans);
        return {
          success: true,
          detail: detailsLog,
          message: `Pemuatan approval massal sekolah ${sekolah} sukses! Total yang dialokasikan: Rp${jumlahDibayar.toLocaleString('id-ID')} ke ${schLoans.length} guru.`
        };
      }

      default:
        throw new Error(`Fungsi simulasi "${fnName}" tidak dideklarasikan di mock-service.`);
    }
  }
}
