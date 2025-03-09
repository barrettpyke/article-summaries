import { InputRow, OutputRow } from '@/types';
import * as XLSX from 'xlsx';

export const fileToJson = async (file: File): Promise<InputRow[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

export const outputRowToBlob = (response: OutputRow[]) => {
  const worksheet = XLSX.utils.json_to_sheet(response);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  return blob;
};
