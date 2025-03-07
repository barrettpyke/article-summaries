import { headersValid } from './headersValid';

describe('headersValid', () => {
  it('should return true for valid headers', () => {
    const validHeaders = ['article', 'authorName', 'metadata'];
    expect(headersValid(validHeaders)).toBe(true);
  });

  it('should return false for incorrect headers', () => {
    const invalidHeaders = ['article', 'author', 'metadata'];
    expect(headersValid(invalidHeaders)).toBe(false);
  });

  it('should return false for unordered headers', () => {
    const invalidHeaders = ['authorName', 'article', 'metadata'];
    expect(headersValid(invalidHeaders)).toBe(false);
  });

  it('should return false for too many headers', () => {
    const invalidHeaders = ['article', 'authorName', 'metadata', 'test'];
    expect(headersValid(invalidHeaders)).toBe(false);
  });
});
