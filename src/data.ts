import { School, Member, MonthData, SignerConfig, MonthlyRecord } from './types';

export const INITIAL_SCHOOLS: School[] = [
  { id: 'sdn-31', name: 'SDN 31/III  Muara Semerah' },
  { id: 'sdn-32', name: 'SDN 32/III  Pasar Semurup' },
  { id: 'sdn-33', name: 'SDN 33/III Air Tenang' },
  { id: 'sdn-34', name: 'SDN 34/ III Pendung Hilir' },
  { id: 'sdn-40', name: 'SDN 40/III Koto Majidin Mudik' },
  { id: 'sdn-64', name: 'SDN 64/III Koto Baru' },
  { id: 'sdn-83', name: 'SDN 83/III Koto Majidin' },
  { id: 'sdn-116', name: 'SDN 116/III  Koto Dua Lama' },
  { id: 'sdn-119', name: 'SDN 119/III Koto Majidin Hilir' },
  { id: 'sdn-157', name: 'SDN 157/III  Pendung Mudik' },
  { id: 'tk-ah', name: 'TK AH' },
  // Air Hangat Barat (AHB) Schools
  { id: 'sdn-63-ahb', name: 'SDN 63/III Koto Tengah' },
  { id: 'sdn-84-ahb', name: 'SDN 84/III Dusun Baru' },
  { id: 'sdn-108-ahb', name: 'SDN 108/III Koto Mudik' },
  { id: 'sdn-117-ahb', name: 'SDN 117/III Koto Datuk' },
  { id: 'sdn-178-ahb', name: 'SDN 178/III Koto Dua Baru' },
  { id: 'sdn-191-ahb', name: 'SDN 191/III Koto Cayo' },
  { id: 'sdn-192-ahb', name: 'SDN 192/III Air Panas Baru' },
  { id: 'sdn-193-ahb', name: 'SDN 193/III Koto Mubai' },
  { id: 'sdn-220-ahb', name: 'SDN 220/III Pugu' }
];

export const DEFAULT_SIGNERS: SignerConfig = {
  ketuaName: 'H. JAIRUN, S.PdI, S.Pd',
  ketuaTitle: 'Ketua',
  sekretarisName: 'OPPER ANTONI, S.Pd',
  sekretarisTitle: 'Wk. Sekretaris',
  bendaharaName: 'HJ. DELFIA, S.Pd',
  bendaharaTitle: 'Bendahara',
  csPhone: '085266648555'
};

const RAW_CSV_DATA = `NO,NAMA,SD,SISA PINJAMAN 31/12/2025,Angsuran,Jasa 1%,Iuran Wajib
1,KASMADIA,31,24.580.000,615.000,295.000,100.000
2,YANI TONDRI,31,56.250.000,1.250.000,600.000,100.000
3,EVA SETIARINII,31,59.000.000,1.000.000,600.000,100.000
4,EDEAROZA FELASIANER,31,56.000.000,1.000.000,600.000,100.000
5,YENI INDRIANI,31,,-,-,100.000
6,ADE SURYA ELITA,31,17.380.000,590.000,280.000,100.000
7,ISON INDRA LOKA,31,24.050.000,425.000,300.000,100.000
8,SAHLAN ALPANI,32,8.680.000,660.000,100.000,100.000
9,EVAYANTIMALA,33,55.000.000,1.000.000,600.000,100.000
10,ANDI JAMIN,33,,-,-,100.000
11,HJ YURTITA,33,57.600.000,800.000,600.000,100.000
12,HERMIANI,33,24.750.000,750.000,300.000,100.000
13,MEGAWATI,34,35.450.000,1.550.000,370.000,100.000
14,DEKATRI ELVITA,34,2.250.000,750.000,150.000,100.000
15,WINDA HASTUTI,34,,,,100.005
16,WENI SUTRIATI,34,5.926.000,187.000,63.000,100.000
17,ERMI EKAPUTRI,40,,-,-  ,100.000
18,ASTIA MURNI,40,,-,-  ,100.000
19,NIRWANA,40,26.000.000,1.000.000,600.000,100.000
20,HENDARMIN,40,6.640.000,835.000,200.000,100.000
21,LOLY WIDYA,40,19.750.000,1.050.000,250.000,100.000
22,WELLY AMLIA.K,40,6.300.000,177.000,63.000,100.000
23,PIVI SUMANTI,64,56.840.000,920.000,580.000,100.000
24,EMILYA SUTRI,64,35.839.500,784.000,376.000,100.000
25,EKA MEYTRIYENTI,64,3.645.000,177.000,63.000,100.000
26,NOVI PUSPITA DEWI,64,21.660.000,525.000,250.000,100.000
27,ENI MARLINA,64,,,,100.000
28,IDA HARYANIS,83,13.700.000,420.000,200.000,100.000
29,ELI WARNIDAR,116,18.000.000,650.000,310.000,100.000
30,HADMISON,116,24.960.000,630.000,300.000,100.000
31,RISKALIDA,116,27.000.000,600.000,300.000,100.000
32,INANG SUTRIA NINGSIH,116,3.114.000,177.000,63.000,100.000
33,DENI PITRIALIS,116,3.114.000,177.000,63.000,100.000
34,ETRIA AGNESTIA,116,13.740.000,420.000,150.000,100.000
35,HJ HUSNIWATI,119,10.795.000,835.000,300.000,100.000
36,HJ ZURNAWATI,119,,-,-  ,100.000
37,DESMA ELIA,119,,-,-  ,100.000
38,SYAFRIANI,119,22.000.000,500.000,250.000,100.000
39,HJ OSMADAWIRNI,119,,-,-  ,100.000
40,TIWI SURYANI,119,9.360.000,560.000,200.000,100.000
41,FITRI IDAROYANI,119,3.316.000,334.000,120.000,100.000
42,EMALIAH,157,14.375.000,625.000,300.000,100.000
43,MESY WIDYA,157,12.395.000,345.000,155.000,100.000
44,RUNAINI,157,3.645.000,177.000,63.000,100.000
45,SANTI MILIAR,TK,13.320.000,-,-  ,100.000
46,ENI YUR,TK,24.305.000,695.000,250.000,100.000
47,ELNI SASMITA,TK,17.650.000,1.050.000,250.000,100.000
48,HAFRI NINGSIH,63,,-,-  ,100.000
49,JALMINITA,63,16.080.000,560.000,200.000,100.000
50,NOVIA ERIANTI,63,18.750.000,177.000,63.000,100.000
51,MUHAMMAD AMIN,63,3.291.000,750.000,270.000,100.000
52,RIKA PRAMESWARI,63,19.440.000,695.000,250.000,100.000
53,NADYA FIRDA ZAHIRA,63,5.061.000,177.000,63.000,100.000
54,HJ YENI MARLINA,84,25.000.000,5.000.000,500.000,100.000
55,REKA SARTIKA,84,,-,-  ,100.000
56,DESI SANDRA,84,19.080.000,840.000,300.000,100.000
57,IMA FEBRIANI,84,20.830.000,695.000,250.000,100.000
58,NORA YULIANAI,108,70.786.000,1.000.000,710.000,100.000
59,HJ DARMILISNARTII,108,,-,-  ,100.000
60,HJ OLI KARTINI,108,2.890.000,1.005.000,250.000,100.000
61,SILPIA,108,43.750.000,1.250.000,600.000,100.000
62,SUSI IRAWANIS,108,7.760.000,280.000,100.000,100.000
63,ANA NIARTI,117,,,,100.000
64,WELA OVAN VIANA,117,,,,100.000
65,SYAFRIAL ARIF,117,29.375.000,625.000,300.000,100.000
66,HJ HUSNIWATI,119,10.795.000,835.000,300.000,100.000
67,IRNAINI,178,7.296.000,918.000,330.000,100.000
68,FEBRINA,178,38.300.000,850.000,400.000,100.000
69,EPIL YANI,178,,-,-  ,100.000
70,YURHAILIS,178,2.199.100,178.300,63.000,100.000
71,SUSI YUNIDARWATI,178,34.675.000,775.000,370.000,100.000
72,"RAKSON, M",191,31.150.000,1.490.000,500.000,100.000
73,RINI SUSANTI,191,37.700.000,980.000,470.000,100.000
74,HELMI TRIANA,191,11.250.000,1.250.000,150.000,100.000
75,PEUUMISNAWATI,191,37.461.000,700.000,480.000,100.000
76,WIWIT PITRIA NINGSIH,191,21.010.000,695.000,250.000,100.000
77,CHINTIA MILYANI,191,21.010.000,695.000,250.000,100.000
78,ANIDARWATI,192,16.500.000,750.000,270.000,100.000
79,HARTIATI,192,,,,100.000
80,NELMA ANGGRIYANI,192,27.525.000,750.000,360.000,100.000
81,ISWADI,192,,-,-  ,100.000
82,PENI ROSITA,193,43.750.000,750.000,270.000,100.000
83,SYAHRIL B,193,500.000,,,100.000
84,YENTI MARLINA,193,52.700.000,750.000,360.000,100.000`;

function parseMoney(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/\./g, '').trim();
  if (clean === '-' || clean === '') return 0;
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function mapSchoolCodeToId(code: string): string {
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode === '31') return 'sdn-31';
  if (cleanCode === '32') return 'sdn-32';
  if (cleanCode === '33') return 'sdn-33';
  if (cleanCode === '34') return 'sdn-34';
  if (cleanCode === '40') return 'sdn-40';
  if (cleanCode === '64') return 'sdn-64';
  if (cleanCode === '83') return 'sdn-83';
  if (cleanCode === '116') return 'sdn-116';
  if (cleanCode === '119') return 'sdn-119';
  if (cleanCode === '157') return 'sdn-157';
  if (cleanCode === 'TK') return 'tk-ah';
  
  // Air Hangat Barat
  if (cleanCode === '63') return 'sdn-63-ahb';
  if (cleanCode === '84') return 'sdn-84-ahb';
  if (cleanCode === '108') return 'sdn-108-ahb';
  if (cleanCode === '117') return 'sdn-117-ahb';
  if (cleanCode === '178') return 'sdn-178-ahb';
  if (cleanCode === '191') return 'sdn-191-ahb';
  if (cleanCode === '192') return 'sdn-192-ahb';
  if (cleanCode === '193') return 'sdn-193-ahb';
  if (cleanCode === '220') return 'sdn-220-ahb';
  
  return 'sdn-31'; // Fallback
}

// Generate INITIAL_MEMBERS and memberDetailsMap instantly
export const INITIAL_MEMBERS: Member[] = [];
interface MemberDetail {
  sisaPinjaman: number;
  angsuran: number;
  jasa: number;
  wajib: number;
  no: number;
}
const memberDetailsMap: Record<string, MemberDetail> = {};

const rows = RAW_CSV_DATA.split('\n').slice(1);

rows.forEach((row) => {
  if (!row.trim()) return;
  const cols = splitCsvLine(row);
  if (cols.length < 3) return;
  
  const noStr = cols[0].trim();
  const name = cols[1].trim().toUpperCase();
  const schoolCode = cols[2].trim();
  
  if (!name || name === 'JUMLAH') return;
  
  const noVal = parseInt(noStr) || 1;
  const schoolId = mapSchoolCodeToId(schoolCode);
  const sisaPinjaman = parseMoney(cols[3]);
  const angsuran = parseMoney(cols[4]);
  const jasa = parseMoney(cols[5]);
  const wajib = parseMoney(cols[6]) || 100000;
  
  // Create a unique deterministic ID
  const id = `m-${noVal}`;
  
  // Check if we already registered this ID (handle double entries cleanly if any)
  const isDup = INITIAL_MEMBERS.some(m => m.id === id);
  const finalId = isDup ? `${id}-dup` : id;
  
  INITIAL_MEMBERS.push({
    id: finalId,
    name,
    schoolId
  });
  
  memberDetailsMap[finalId] = {
    sisaPinjaman,
    angsuran,
    jasa,
    wajib,
    no: noVal
  };
});

export function getInitialMonths(): MonthData[] {
  const months: MonthData[] = [];
  const monthNames = ['Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026', 'Mei 2026', 'Juni 2026'];
  const monthKeys = ['jan-2026', 'feb-2026', 'mar-2026', 'apr-2026', 'mei-2026', 'jun-2026'];

  // Base setup
  for (let i = 0; i < 6; i++) {
    months.push({
      id: monthKeys[i],
      labelText: monthNames[i],
      records: {},
      isAHBIncluded: false
    });
  }

  // Populate records member by member
  INITIAL_MEMBERS.forEach(m => {
    const details = memberDetailsMap[m.id];
    if (!details) return;

    for (let i = 0; i < 6; i++) {
      let pinjaman = details.sisaPinjaman;
      let angsuran = details.angsuran;
      let jasa = details.jasa;
      let wajib = details.wajib;
      let angKe: number | null = null;
      let isTidakBayar = false;

      if (details.sisaPinjaman > 0) {
        // Amortization projection over months (index i)
        // Month i starts with prev computed balance subtracting the installment
        const sub = i * details.angsuran;
        pinjaman = Math.max(0, details.sisaPinjaman - sub);

        if (pinjaman <= 0) {
          angsuran = 0;
          jasa = 0;
          angKe = null;
          isTidakBayar = true; // No remaining payment needed
        } else {
          angsuran = details.angsuran;
          jasa = details.jasa;
          if (pinjaman < angsuran) {
            angsuran = pinjaman;
          }
          angKe = 1 + i;
        }
      } else {
        // No loans
        pinjaman = 0;
        angsuran = 0;
        jasa = 0;
        angKe = null;
        // Non-loans still have obligatory savings, so payment is only saving
      }

      months[i].records[m.id] = {
        memberId: m.id,
        jumlahPinjaman: pinjaman,
        angsuran: angsuran,
        jasa: jasa,
        simpananWajib: wajib,
        angKe,
        isTidakBayar: isTidakBayar
      };
    }
  });

  return months;
}
