export interface School {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  schoolId: string;
}

export interface MonthlyRecord {
  memberId: string;
  jumlahPinjaman: number;    // Outstanding balance at start of month
  angsuran: number;          // Installment amount
  jasa: number;              // Interest amount (1% or customized)
  simpananWajib: number;     // Obligatory savings
  angKe: number | null;      // Charge installment index (e.g. 1, 2, 3...)
  isTidakBayar: boolean;     // Skip/deferred payment this month
}

export interface MonthData {
  id: string; // e.g. "January 2026"
  labelText: string; // e.g. "Januari 2026"
  records: Record<string, MonthlyRecord>; // Key: memberId
  isAHBIncluded?: boolean; // Sum total includes Air Hangat Barat or other items
  bersihAHB?: {
    angsuran: number;
    jasa: number;
    wajib: number;
  };
}

export interface SignerConfig {
  ketuaName: string;
  ketuaTitle: string;
  sekretarisName: string;
  sekretarisTitle: string;
  bendaharaName: string;
  bendaharaTitle: string;
  csPhone: string;
}
