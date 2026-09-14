import React, { useState } from "react";
import axios from "axios";
import "./AIAssistant.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text:
        "Hello! I am CampusBot 🤖. Ask me about college timings, library hours, canteen, complaints or Lost & Found.",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const userQuery = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        text: userQuery,
        sender: "user",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");

      let erpId = "";

      if (storedUser) {
        const user = JSON.parse(storedUser);
        erpId = user.erpId || "";
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/ai/chat`,
        {
          message: userQuery,
          erpId: erpId,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          text:
            response.data.reply ||
            "Sorry, I could not generate a response.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          text:
            "⚠️ AI Assistant is temporarily unavailable.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">

      {/* OPEN BUTTON */}
      {!isOpen && (
        <button
          className="ai-open-button"
          onClick={() => setIsOpen(true)}
        >
          🤖 Ask CampusBot
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="ai-chat-window">

          {/* HEADER */}
          <div className="ai-chat-header">
            <span>🤖 Campus Assistant</span>

            <button
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* MESSAGES */}
          <div className="ai-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`ai-message ${
                  msg.sender === "user"
                    ? "ai-user-message"
                    : "ai-bot-message"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="ai-typing">
                Typing...
              </div>
            )}

          </div>

          {/* INPUT */}
          <form
            className="ai-input-form"
            onSubmit={handleSend}
          >
            <input
              type="text"
              placeholder="Ask about your complaint..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AIAssistant;