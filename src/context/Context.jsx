import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [history, setHistory] = useState([]); // [{role, text}]
  const [error, setError] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 20 * index);
  };

  // Converts a subset of Markdown (**bold**, bullet lists) into HTML
  // so it renders nicely without pulling in a markdown library.
  const formatResponse = (rawText) => {
    let formatted = rawText
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Turn lines starting with "* " or "- " into <li> inside <ul>
    const lines = formatted.split("\n");
    let html = "";
    let inList = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${trimmed.slice(2)}</li>`;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<br/>${line}`;
      }
    }
    if (inList) html += "</ul>";
    return html;
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setInput("");
  };

  const onSent = async (promptOverride) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setError("");

    const finalPrompt = promptOverride !== undefined ? promptOverride : input;
    if (!finalPrompt.trim()) {
      setLoading(false);
      return;
    }

    setRecentPrompt(finalPrompt);
    setPrevPrompts((prev) => {
      if (prev.includes(finalPrompt)) return prev;
      return [...prev, finalPrompt];
    });

    try {
      const responseText = await runChat(finalPrompt, history);

      const formatted = formatResponse(responseText);
      const words = formatted.split(" ");
      words.forEach((word, i) => delayPara(i, word + " "));

      setHistory((prev) => [
        ...prev,
        { role: "user", text: finalPrompt },
        { role: "model", text: responseText },
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setResultData("");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    error,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
