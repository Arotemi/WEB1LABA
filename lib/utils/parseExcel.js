import XLSX from 'xlsx';

export function parseExcel(filePath, exelDataStructure = {}) {
    const workbook = XLSX.read(filePath, { raw: true });
    const first_sheet = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[first_sheet];
    const headers = {};
    const data = [];

    for (const cell in worksheet) {
        if (cell[0] === '!') continue;
        // parse out the column, row, and value
        const col = cell.substring(0, 1);
        const row = parseInt(cell.substring(1), 10);
        const value = worksheet[cell].v;

        // store header names
        if (row === 1) {
            headers[col] = exelDataStructure[col] || value;
            continue;
        }

        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
    }

    // drop those first two rows which are empty
    data.shift();
    data.shift();

    return { data };
}
