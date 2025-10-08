import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./Message";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "bot-welcome", sender: "bot", text: "Hello — ask me about insurance policies, claims, or coverage (prototype)." }
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
        const fallback = resp.data.message || "Sorry, I don't have that information yet.";
        setMessages((m) => [...m, { id: Date.now() + "-b", sender: "bot", text: fallback }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { id: Date.now() + "-b", sender: "bot", text: "Server error. Try again later." }]);
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
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m) => (
          <Message key={m.id} sender={m.sender} text={m.text} />
        ))}
        {loading && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            <div className="bg-slate-100 p-3 rounded-lg max-w-lg">
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question here and press Enter..."
          className="w-full p-3 border rounded-md resize-none h-20 focus:outline-none focus:ring"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-slate-500">Press Enter to send</div>
          <button
            onClick={sendQuestion}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={!input.trim() || loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
