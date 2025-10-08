import React from "react";

export default function Message({ sender, text }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${isUser ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"} p-3 rounded-lg max-w-[80%]`}>
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  );
}
