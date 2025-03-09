const EXPECTED_HEADERS = ['article', 'authorName', 'metadata'];

// leave this as a generic object so we can test if invalid headers return false
export const headersValid = (row: object) => {
  const headers = Object.keys(row);

  if (headers.length !== EXPECTED_HEADERS.length) {
    return false;
  }

  for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
    if (headers[i] !== EXPECTED_HEADERS[i]) {
      return false;
    }
  }

  return true;
};

export const isExcelFile = (selectedFile: File) => {
  return (
    selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    selectedFile.type === 'application/vnd.ms-excel'
  );
};
