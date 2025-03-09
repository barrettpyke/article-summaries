'use client';

import ExcelFileInput from '@/components/ExcelFileInput/ExcelFileInput';
import { InputRow, OutputRow } from '@/types';

export default function Home() {
  const onFileUpload = async (file: InputRow[]): Promise<OutputRow[]> => {
    const response = await fetch('api/summarize-file', {
      method: 'POST',
      body: JSON.stringify(file),
    });

    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      if (response.status === 429) {
        throw new Error(
          `Too many requests, limit the number of articles in the file to a maximum of 15.`,
        );
      } else if (response.status === 500) {
        throw new Error(
          `Your input is too long to return a summary. Please limit the articles to a word count of 30,000.`,
        );
      }
      throw new Error('There was an error processing your request, please try again.');
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
