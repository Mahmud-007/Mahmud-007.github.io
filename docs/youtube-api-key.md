# YouTube live refresh: getting an API key

The site already shows your videos without any key. They are read from your
channel's public feed each time the site is built.

A key adds one thing: when someone opens the page, the browser asks YouTube
for your newest videos and your subscriber count, so the page is fresh even if
the site has not been rebuilt for a while. If the key is missing or stops
working, the page quietly keeps the videos from the last build.

## Steps

1. Go to https://console.cloud.google.com/ and create a project (any name).
2. Open **APIs & Services → Library**, find **YouTube Data API v3**, and click
   **Enable**.
3. Open **APIs & Services → Credentials → Create credentials → API key**.
4. Click the new key to edit it, then set both restrictions:
   - **Application restrictions → Websites**, and add:
     - `https://mahmud-007.github.io/*`
     - your Netlify address, for example `https://your-site.netlify.app/*`
     - `http://localhost:8000/*`
   - **API restrictions → Restrict key → YouTube Data API v3**.
5. In the project folder, create two files, each with this one line:

   `.env.development` and `.env.production`

   ```
   GATSBY_YOUTUBE_API_KEY=your-key-here
   ```

   Both files are git-ignored. On Netlify, add the same variable under
   **Site configuration → Environment variables** instead.
6. Rebuild or redeploy.

## Things to know

- The key is visible to anyone who views the page source. That is expected for
  a browser key. The website restriction in step 4 is what makes it safe, so
  do not skip it.
- The free quota is 10,000 units a day. One page view uses 2 units, and
  results are remembered for the rest of the visitor's session.
