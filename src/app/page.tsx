'use client';

import ExcelFileInput from '@/components/ExcelFileInput/ExcelFileInput';
import { Row } from '@/types';

export default function Home() {
  const onFileUpload = async (file: Row[]) => {
    try {
      const response = await fetch('api/summarize-file', {
        method: 'POST',
        body: JSON.stringify(file),
      });

      return response.json();
    } catch (err) {
      throw new Error(`${err}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-10 text-lg font-bold">
        Generate summaries and determine the sentiment of articles with AI
      </div>
      <div>
        Upload a .xlsx or .xls file with the headers: article, authorName, metadata
      </div>
      <div>
        Once the file is processed a spreadsheet will be returned with the additional
        columns: summary, sentiment
      </div>
      <ExcelFileInput onFileUpload={onFileUpload} />
    </div>
  );
}
