// Handles all communication with the Google Generative Language API (Gemini).
// Get a free API key at https://aistudio.google.com/app/apikey and put it in .env as VITE_GEMINI_API_KEY

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-3.7-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Sends a prompt (optionally with prior turns for context) to the Gemini API
 * and returns the generated text.
 * @param {string} prompt - the new user prompt
 * @param {Array<{role: string, text: string}>} history - prior conversation turns
 * @returns {Promise<string>} the model's reply text
 */
async function runChat(prompt, history = []) {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Create a .env file with VITE_GEMINI_API_KEY=your_key_here"
    );
  }

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.9,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();

  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  if (!text) {
    // Handle blocked / empty responses gracefully
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Response blocked: ${blockReason}`);
    }
    throw new Error("No response received from the model.");
  }

  return text;
}

export default runChat;
