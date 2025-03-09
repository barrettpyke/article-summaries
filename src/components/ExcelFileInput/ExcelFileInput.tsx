'use client';

import { DragEvent, Ref, useRef, useState } from 'react';
import { headersValid, isExcelFile } from './validation';
import { InputRow, OutputRow } from '@/types';
import LoadingSpinner from '../LoadingSpinner';
import { saveAs } from 'file-saver';
import { fileToJson, outputRowToBlob } from './excel';

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
      if (isExcelFile(selectedFile)) {
        setIsLoading(true);
        processExcel(selectedFile);
      } else {
        setError('Please upload an Excel file.');
      }
    }
  };

  const processExcel = async (file: File) => {
    try {
      const jsonData = await fileToJson(file);

      if (!headersValid(jsonData[0])) {
        setError(
          'Invalid headers, please set the following headers in the first row, in this order: article, authorName, metadata',
        );
        setIsLoading(false);
        return;
      }

      if (onFileUpload) {
        const response: OutputRow[] = await onFileUpload(jsonData);
        const blob = outputRowToBlob(response);
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
