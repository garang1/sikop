const fs = require('fs');
const XLSX = require('xlsx');

async function run() {
  try {
    const excelUrl = 'https://docs.google.com/spreadsheets/d/14XRmqV2PGRuqeMvUUXX9aTKtPli-LYK3yX42596oTLo/export?format=xlsx';
    const response = await fetch(excelUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const buffer = await response.arrayBuffer();
    const destPath = './temp_sheet.xlsx';
    fs.writeFileSync(destPath, Buffer.from(buffer));
    
    const workbook = XLSX.readFile(destPath);
    const worksheet = workbook.Sheets['AHB'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // We have 6 months across columns:
    // Month cols offset:
    const monthColumns = [
      { name: 'Januari 2026', startCol: 0 },
      { name: 'Februari 2026', startCol: 10 },
      { name: 'Maret 2026', startCol: 20 },
      { name: 'April 2026', startCol: 30 },
      { name: 'Mei 2026', startCol: 40 },
      { name: 'Juni 2026', startCol: 50 },
    ];
    
    // Let's identify the row ranges for each school in the sheet.
    // Schools can be found by scanning column 4 (index 4) or searching columns.
    // Let's scan all rows and record row index where a school header is found.
    const schoolSections = [];
    
    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row) continue;
      
      const cleanedRow = row.map(v => v !== null && v !== undefined ? String(v).trim() : '');
      
      // Look for a cell in the row containing "SDN" or "TK" followed by a slash or name
      let foundSchName = '';
      cleanedRow.forEach((cell) => {
        if (cell.includes('SDN') || cell.includes('TK')) {
          if (cell.includes('/') && cell.includes('III') && !cell.includes('BULAN') && !cell.includes('TANGGAL') && !cell.includes('BADAN') && !cell.includes('KOPERASI')) {
            foundSchName = cell;
          }
        }
      });
      
      if (foundSchName) {
        schoolSections.push({ name: foundSchName.replace(/\s+/g, ' ').trim(), rIndex: r });
      }
    }
    
    console.log("Identified schools:", schoolSections);
    
    // For each school, the members start below the header (r + 2 because r+1 is No | Nama | ...)
    // And end when we see a row containing "JUMLAH" or "J U M L A H" or the next school header.
    for (let sIdx = 0; sIdx < schoolSections.length; sIdx++) {
      const sch = schoolSections[sIdx];
      const startRow = sch.rIndex + 2; // Rows of member data start here
      const endRow = (sIdx + 1 < schoolSections.length) ? schoolSections[sIdx + 1].rIndex : data.length;
      
      sch.members = [];
      const seenMemberNames = new Set();
      
      // We look at the first month (Januari at startCol 0) to find the primary member names list for this school
      for (let r = startRow; r < endRow; r++) {
        const row = data[r];
        if (!row) continue;
        const cleanedRow = row.map(v => v !== null && v !== undefined ? String(v).trim() : '');
        
        const noVal = cleanedRow[0];
        const nameVal = cleanedRow[1];
        
        if (noVal && /^\d+$/.test(noVal) && nameVal) {
          const upperName = nameVal.toUpperCase().trim();
          if (!seenMemberNames.has(upperName)) {
            seenMemberNames.add(upperName);
            sch.members.push({ name: nameVal.trim(), originalRowOffset: r - sch.rIndex });
          }
        }
      }
    }
    
    // Now, let's extract the monthly records for each member of each school.
    // For each school, for each member name:
    // We look at each of the 6 months. How do we match the member in each month?
    // In some months, a member might be in a different row offset.
    // Strictest approach: parse the rows under that school section for that month by matching NAME!
    const resultObj = {};
    
    schoolSections.forEach((sch) => {
      const cleanSchoolName = sch.name;
      resultObj[cleanSchoolName] = [];
      
      sch.members.forEach((memb) => {
        const memberRecord = { name: memb.name, months: [] };
        
        // Loop through 6 months
        monthColumns.forEach((mCol) => {
          // Find the member under this school section for this month by name matching!
          let foundRowData = null;
          
          // Outer scan for member row in this school's range in sheet
          const startSearchRow = sch.rIndex + 2;
          const endSearchRow = (schoolSections.indexOf(sch) + 1 < schoolSections.length) ? schoolSections[schoolSections.indexOf(sch) + 1].rIndex : data.length;
          
          for (let r = startSearchRow; r < endSearchRow; r++) {
            const row = data[r];
            if (!row) continue;
            
            const nameInCol = row[mCol.startCol + 1];
            if (nameInCol && String(nameInCol).trim().toUpperCase() === memb.name.toUpperCase()) {
              // Found! Extract their values for this month
              foundRowData = {
                pinjaman: row[mCol.startCol + 2],
                angsuran: row[mCol.startCol + 3],
                jasa: row[mCol.startCol + 4],
                wajib: row[mCol.startCol + 5],
                jumlah: row[mCol.startCol + 6],
                sisa: row[mCol.startCol + 7],
                angKe: row[mCol.startCol + 8]
              };
              break;
            }
          }
          
          if (foundRowData) {
            memberRecord.months.push({
              month: mCol.name,
              pinjaman: foundRowData.pinjaman !== undefined && foundRowData.pinjaman !== null ? Number(foundRowData.pinjaman) : 0,
              angsuran: foundRowData.angsuran !== undefined && foundRowData.angsuran !== null ? Number(foundRowData.angsuran) : 0,
              jasa: foundRowData.jasa !== undefined && foundRowData.jasa !== null ? Number(foundRowData.jasa) : 0,
              wajib: foundRowData.wajib !== undefined && foundRowData.wajib !== null ? Number(foundRowData.wajib) : 100000,
              sisa: foundRowData.sisa !== undefined && foundRowData.sisa !== null ? Number(foundRowData.sisa) : 0,
              angKe: foundRowData.angKe !== undefined && foundRowData.angKe !== null ? Number(foundRowData.angKe) : null,
              isTidakBayar: false
            });
          } else {
            // Not found in this month (they are either not paying, inactive, or not in the list for this month)
            memberRecord.months.push({
              month: mCol.name,
              pinjaman: 0,
              angsuran: 0,
              jasa: 0,
              wajib: 0,
              sisa: 0,
              angKe: null,
              isTidakBayar: true
            });
          }
        });
        
        resultObj[cleanSchoolName].push(memberRecord);
      });
    });
    
    // Save the parsed data to a JSON file so that we can easily inspect or load it in our React app!
    fs.writeFileSync('./src/ahbParsedData.json', JSON.stringify(resultObj, null, 2));
    console.log("Successfully dumped all AHB data to /src/ahbParsedData.json!");
    
    // Let's print out the school names and a quick sample of the first member of each school to confirm
    Object.keys(resultObj).forEach((schName) => {
      console.log(`\nSample from "${schName}" (${resultObj[schName].length} members):`);
      if (resultObj[schName].length > 0) {
        const m = resultObj[schName][0];
        console.log(`- Member Name: ${m.name}`);
        m.months.forEach((mon) => {
          console.log(`  * ${mon.month}: Pinj: ${mon.pinjaman}, Ang: ${mon.angsuran}, Jasa: ${mon.jasa}, Wajib: ${mon.wajib}, Sisa: ${mon.sisa}, AngKe: ${mon.angKe}, TidakBayar: ${mon.isTidakBayar}`);
        });
      }
    });
    
    fs.unlinkSync(destPath);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
