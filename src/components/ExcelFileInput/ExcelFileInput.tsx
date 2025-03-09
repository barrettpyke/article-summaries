'use client';

import { DragEvent, Ref, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { headersValid } from './headersValid';
import { InputRow, OutputRow } from '@/types';
import LoadingSpinner from '../LoadingSpinner';
import { saveAs } from 'file-saver';

interface ExcelFileInputProps {
  onFileUpload: (json: InputRow[]) => Promise<OutputRow[]>;
}

const ExcelFileInput: React.FC<ExcelFileInputProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef: Ref<HTMLInputElement> = useRef(null);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError('');
    const droppedFile = e.dataTransfer?.files[0];

    if (droppedFile) {
      handleFile(droppedFile);
    } else {
      setError('File upload failed.');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    if (e.target.files) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    } else {
      setError('File upload failed.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input value
    }
  };

  const onClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      if (
        selectedFile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel'
      ) {
        setIsLoading(true);
        processExcel(selectedFile);
      } else {
        setError('Please upload an Excel file.');
      }
    }
  };

  const processExcel = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: InputRow[] = XLSX.utils.sheet_to_json(worksheet);

      if (!headersValid(jsonData[0])) {
        setError(
          'Invalid headers, please set the following headers in the first row, in this order: article, authorName, metadata',
        );
        setIsLoading(false);
        return;
      }

      if (onFileUpload) {
        const response: OutputRow[] = await onFileUpload(jsonData);
        console.log(response);
        const worksheet = XLSX.utils.json_to_sheet(response);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `summary_output.xlsx`);
      }
    } catch (err) {
      setError(`${err}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {error && <div className="text-red-500 mt-10">{error}</div>}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="h-75 w-150 mt-10 border-2 border-dashed border-gray-300 rounded-md pa-20 text-center bg-gray-100"
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        {isLoading ? (
          <div className="mt-10">
            Processing...
            <div className="flex justify-center mr-2 mt-5">
              <LoadingSpinner />
            </div>
          </div>
        ) : (
          <>
            <div className="font-bold mt-10">Drag and drop a file here</div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-10"
              onClick={onClick}
            >
              Select file
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExcelFileInput;
