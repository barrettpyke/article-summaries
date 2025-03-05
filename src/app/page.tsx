'use client';

import ExcelFileInput from '@/components/ExcelFileInput';

export default function Home() {
  const onFileUpload = (file: string[]) => {
    console.log(file[0]);
  };

  return (
    <div>
      <ExcelFileInput onFileUpload={onFileUpload} />
    </div>
  );
}
