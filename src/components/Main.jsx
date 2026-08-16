import { useContext, useRef, useEffect } from "react";
import "./Main.css";
import { Context } from "../context/Context";

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 12l16-8-6 16-3-7-7-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const SparkIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l1.9 5.9L20 10l-6.1 2.1L12 18l-1.9-5.9L4 10l6.1-2.1L12 2z"
      fill="url(#sparkGrad)"
    />
    <defs>
      <linearGradient id="sparkGrad" x1="4" y1="2" x2="20" y2="18">
        <stop offset="0" stopColor="var(--accent-1)" />
        <stop offset="1" stopColor="var(--accent-2)" />
      </linearGradient>
    </defs>
  </svg>
);

const suggestionCards = [
  {
    text: "Suggest beautiful places to see on an upcoming road trip",
    kind: "compass",
  },
  {
    text: "Summarize this concept: quantum entanglement, for a curious 12 year old",
    kind: "brain",
  },
  {
    text: "Brainstorm team bonding activities for a small remote team",
    kind: "users",
  },
  {
    text: "Improve the readability of the following code",
    kind: "code",
  },
];

const cardIcon = (kind) => {
  switch (kind) {
    case "compass":
      return "🧭";
    case "brain":
      return "🧠";
    case "users":
      return "🤝";
    case "code":
      return "</>";
    default:
      return "✦";
  }
};

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    error,
  } = useContext(Context);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [resultData, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSent();
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p className="brand">
          Aura <span className="brand-dot">●</span>
        </p>
        <div className="avatar">Y</div>
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span className="grad-text">Hello, there.</span>
              </p>
              <p className="greet-sub">How can I help you today?</p>
            </div>

            <div className="cards">
              {suggestionCards.map((card, i) => (
                <button
                  key={i}
                  className="card"
                  onClick={() => onSent(card.text)}
                >
                  <p>{card.text}</p>
                  <span className="card-icon">{cardIcon(card.kind)}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-turn">
              <div className="avatar user-avatar">Y</div>
              <p className="turn-text">{recentPrompt}</p>
            </div>

            <div className="result-turn model-turn">
              <div className="avatar model-avatar">
                <SparkIcon size={16} />
              </div>
              {loading ? (
                <div className="loader">
                  <span className="shimmer-line" />
                  <span className="shimmer-line short" />
                  <span className="shimmer-line" />
                </div>
              ) : error ? (
                <p className="turn-text error-text">{error}</p>
              ) : (
                <p
                  className="turn-text"
                  dangerouslySetInnerHTML={{ __html: resultData }}
                />
              )}
            </div>
            <div ref={bottomRef} />
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Message Aura…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="send-btn"
              disabled={!input.trim() || loading}
              onClick={() => onSent()}
            >
              <SendIcon />
            </button>
          </div>
          <p className="bottom-info">
            Aura may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
