export const parseJson = (inputString: string) => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = inputString.match(jsonRegex);
  console.log(match);
  if (match) {
    const jsonContent = match[1].trim();
    return JSON.parse(jsonContent);
  }
};
