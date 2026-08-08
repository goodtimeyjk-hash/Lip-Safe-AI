/**
 * Travel Together - CSV Exporter Utility
 * Handles data conversion to CSV format and triggers browser file download.
 */

/**
 * Converts ledger transactions array to a UTF-8 BOM CSV file and triggers download.
 * @param {Array} transactions - Array of transaction objects from Store
 * @param {string} filename - Target output file name (default: ledger_export.csv)
 */
export function exportTransactionsToCSV(transactions = [], filename = 'ledger_export.csv') {
  if (!transactions || transactions.length === 0) {
    alert('내보낼 장부 거래 내역이 없습니다.');
    return;
  }

  // Define CSV Header
  const headers = ['날짜', '회원명', '구분', '사용내역/적요', '총금액(원)', '해외여행적립금(원)', '공동사용금(원)'];

  // Map rows
  const rows = transactions.map(tx => {
    const typeStr = tx.type === 'INCOME' ? '수입' : '지출';
    const travelAmt = tx.travelAmount || 0;
    const commonAmt = tx.commonAmount || 0;
    
    // Clean string values for CSV escaping
    const descEscaped = `"${(tx.description || '').replace(/"/g, '""')}"`;
    const nameEscaped = `"${(tx.userName || '').replace(/"/g, '""')}"`;

    return [
      tx.date,
      nameEscaped,
      typeStr,
      descEscaped,
      tx.amount,
      travelAmt,
      commonAmt
    ].join(',');
  });

  // Combine headers and rows with UTF-8 BOM for Excel compatibility (\uFEFF)
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
