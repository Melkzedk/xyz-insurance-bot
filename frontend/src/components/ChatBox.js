import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./Message";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "bot-welcome",
      sender: "bot",
      text: "👋 Hello Ask me about insurance policies, claims, or coverage (prototype).",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async () => {
    const question = input.trim();
    if (!question) return;
    const userMsg = { id: Date.now() + "-u", sender: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await axios.post(`${API_BASE}/ask`, { question });
      if (resp.data && resp.data.match) {
        const ansText = resp.data.match.answer;
        const botMsg = { id: Date.now() + "-b", sender: "bot", text: ansText };
        setMessages((m) => [...m, botMsg]);
      } else {
        const fallback =
          resp.data.message || "Sorry, I don't have that information yet!";
        setMessages((m) => [
          ...m,
          { id: Date.now() + "-b", sender: "bot", text: fallback },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + "-b",
          sender: "bot",
          text: "⚠️ Server error. Try again later..",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-xl rounded-2xl border border-gray-200 h-[80vh] w-full max-w-2xl mx-auto overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((m) => (
          <Message key={m.id} sender={m.sender} text={m.text} />
        ))}

        {loading && (
          <div className="flex items-start space-x-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-indigo-100" />
            <div className="bg-indigo-50 p-3 rounded-lg max-w-sm">
              <div className="h-3 w-24 bg-indigo-100 rounded" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="border-t border-gray-200 bg-white p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your insurance question here and press Enter..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-500">
            Press{" "}
            <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd>{" "}
            to send
          </p>

          <button
            onClick={sendQuestion}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
            disabled={!input.trim() || loading}
          >
            {loading ? "Thinking...." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
}
