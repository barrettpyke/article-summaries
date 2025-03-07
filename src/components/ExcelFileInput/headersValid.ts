const EXPECTED_HEADERS = ['article', 'authorName', 'metadata'];

export const headersValid = (headers: string[]) => {
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
