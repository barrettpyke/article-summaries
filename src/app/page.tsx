'use client';

import ExcelFileInput from '@/components/ExcelFileInput/ExcelFileInput';
import { InputRow } from '@/types';

export default function Home() {
  const onFileUpload = async (file: InputRow[]) => {
    try {
      const response = await fetch('api/summarize-file', {
        method: 'POST',
        body: JSON.stringify(file),
      });

      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
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
        columns: summary, tags <br /> <br />
        <div className="ml-10">
          The tags will display the sentiment (positive, neutral, negative) and the theme
          of the article.
        </div>
      </div>
      <ExcelFileInput onFileUpload={onFileUpload} />
    </div>
  );
}
