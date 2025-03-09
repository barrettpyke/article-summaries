import { headersValid } from './validation';

describe('headersValid', () => {
  it('should return true for valid headers', () => {
    const validRow = {
      article: 'test',
      authorName: 'john smith',
      metadata: '{clicks: 200}',
    };
    expect(headersValid(validRow)).toBe(true);
  });

  it('should return false for incorrect headers', () => {
    const invalidRow = {
      article: 'test',
      author: 'john smith',
      metadata: '{clicks: 200}',
    };
    expect(headersValid(invalidRow)).toBe(false);
  });

  it('should return false for unordered headers', () => {
    const invalidRow = {
      authorName: 'john smith',
      article: 'test',
      metadata: '{clicks: 200}',
    };
    expect(headersValid(invalidRow)).toBe(false);
  });

  it('should return false for too many headers', () => {
    const invalidRow = {
      article: 'test',
      authorName: 'john smith',
      metadata: '{clicks: 200}',
      tooMany: 'test2',
    };
    expect(headersValid(invalidRow)).toBe(false);
  });
});
