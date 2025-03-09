## Article Summarization App

### About

This app allows a user to upload an Excel spreadsheet of articles and outputs another file with a summary, context (positive, negative, neutral), and an overall theme.

You can find the hosted application here:
https://article-summaries.vercel.app/

### Prompt Details

The prompt (located [here](./src/app/api/summarize-file/route.ts)) clearly defines the output format (JSON and the object keys) which makes it very easy to parse out the response and return it to the client. It also puts limits on the summary (3 sentence max) for conciseness. The theme and sentiment values are given clear constraints and examples for the model to pull from as well. I also added a confidence score and logic that returns unknown if the confidence score is under a certain threshold (0.7).

### Model Details

The api/summarize-file POST route leverages the gemini-1.5-flash model to build the summaries and detect the sentiment and theme. This model is rate limited to 15 requests per minute and 1,000,000 tokens per minute since it is the free tier membership. See the latest limits here in the [gemini api docs](https://ai.google.dev/gemini-api/docs/rate-limits).

If the requests per minute hit the limit then an error is shown to the user. I also show an error if the 1,000,000 tokens per minute limit is hit informing the user to restrict each article's word count to 30,000 (calculated based on 100 tokens per 60-80 words).

### Running the App

1. Clone the repo
2. Run `npm install` in the root directory
3. Add a .env file with a `GEMINI_API_KEY` variable that contains a Gemini api key capable of using the gemini-1.5-flash model
4. Run `npm run dev`

There is test data located [here](./src/testing/test_data.xlsx)
