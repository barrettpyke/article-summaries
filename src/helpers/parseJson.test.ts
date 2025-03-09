import { parseJson } from './parseJson';

describe('parseJson', () => {
  it('should parse valid JSON within code blocks', () => {
    const input = `Some text before\n\`\`\`json\n{"key": "value", "number": 123}\n\`\`\`\nSome text after`;
    const expected = { key: 'value', number: 123 };
    expect(parseJson(input)).toEqual(expected);
  });
});
