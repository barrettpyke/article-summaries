## Article Summarization App

### About

This app allows a user to upload an Excel spreadsheet of articles and outputs another file with a summary, context (positive, negative, neutral), and an overall theme.

It uses NextJS to build out the frontend and backend with a BFF design pattern. The api/summarize-file POST route leverages the gemini-1.5-flash model to build the summaries and detect the sentiment and theme.

You can find the hosted application here:
https://article-summaries.vercel.app/

### Running the App

1. Clone the repo
2. Run `npm install` in the root directory
3. Add a .env file with a `GEMINI_API_KEY` variable that contains a Gemini api key capable of using the gemini-1.5-flash model
4. Run `npm run dev`
