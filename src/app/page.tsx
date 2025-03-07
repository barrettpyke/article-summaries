'use client';

import ExcelFileInput from '@/components/ExcelFileInput/ExcelFileInput';

export default function Home() {
  const onFileUpload = (file: string[][]) => {
    console.log(file);
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
