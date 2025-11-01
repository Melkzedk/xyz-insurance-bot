import React from "react";
import ChatBox from "./components/ChatBox";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">
            Insurance Q&A Bot (Prototype)
          </h1>
          <p className="text-sm text-slate-600">
            Ask any question about the organization's policies, claims, & coverage.
          </p>
        </header>

        <main className="bg-white shadow rounded-lg p-4">
          <ChatBox />
        </main>
      </div>
    </div>
  );
}
