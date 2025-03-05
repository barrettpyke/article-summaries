'use client';

import { DragEvent, Ref, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelFileInputProps {
  onFileUpload: (json: string[]) => void;
}

const ExcelFileInput: React.FC<ExcelFileInputProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
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
        setFile(selectedFile);
        processExcel(selectedFile);
      } else {
        setError('Please upload an Excel file.');
        setFile(null);
      }
    }
  };

  const processExcel = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: string[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (onFileUpload) {
        onFileUpload(jsonData);
      }
    } catch (err) {
      setError(`Error processing file: ${err}`);
    }
  };

  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="border-2 border-dashed border-gray pa-20 text-center cursor-pointer"
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        {file ? (
          <div>Selected file: {file.name}</div>
        ) : (
          <>
            <div>Drag and drop a .xlsx or .xls file here.</div>
            <button onClick={onClick}>Select file</button>
          </>
        )}
      </div>
      {error && <div className="text-red">{error}</div>}
    </div>
  );
};

export default ExcelFileInput;
