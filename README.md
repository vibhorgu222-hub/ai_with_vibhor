# Aura — a Gemini-powered chat UI (React)

A ChatGPT/Gemini-style AI chat interface built with React + Vite, talking directly to Google's Gemini API. Includes a collapsible sidebar with chat history, a typing/reveal effect for responses, and a responsive layout.

## Features

- Clean two-pane layout: collapsible sidebar + chat panel
- Prompt suggestion cards on the empty state
- Streaming-style word-by-word reveal of responses
- Multi-turn conversation context sent to the model
- Basic Markdown handling (bold, italics, code blocks, bullet lists)
- Recent prompt history you can click to replay
- Fully responsive down to mobile

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Add your API key**

   Get a free Gemini API key at https://aistudio.google.com/app/apikey, then:

   ```bash
   cp .env.sample .env
   ```

   Edit `.env` and paste your key:

   ```
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open the printed local URL (usually http://localhost:5173).

4. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Project structure

```
gemini-clone/
├── index.html
├── package.json
├── vite.config.js
├── .env.sample
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx                # Renders Sidebar + Main
    ├── index.css               # Design tokens & global styles
    ├── config/
    │   └── gemini.js          # Gemini API call logic
    ├── context/
    │   └── Context.jsx        # Global chat state (React Context)
    └── components/
        ├── Sidebar.jsx / .css # Collapsible sidebar + history
        └── Main.jsx / .css    # Chat window, input bar, suggestion cards
```

## Notes

- The model used is `gemini-2.0-flash`. To change it, edit the `MODEL` constant in `src/config/gemini.js`.
- The API key is read from the browser via `import.meta.env.VITE_GEMINI_API_KEY`, which means it's exposed client-side. That's fine for local development, but for a real production deployment you should proxy requests through your own backend so the key isn't shipped to the browser.
- Chat history is kept in memory only (React state) — refreshing the page clears it. Swap in `localStorage` or a database if you want persistence.
