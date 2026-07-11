"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../../lib/supabase";

export default function ReplyAgent() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateReply() {

  if (!message.trim()) {
    alert("Please enter a customer message.");
    return;
  }

  setLoading(true);

  try {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/reply?message=${encodeURIComponent(message)}&user_id=${user.id}`
    );

    const data = await response.json();

    if (data.reply) {
      setReply(data.reply);
    } else {
      setReply(data.error || "⚠️ Unable to generate reply.");
    }

  } catch (error) {

    console.error(error);
    setReply("⚠️ Unable to connect to the server.");

  } finally {

    setLoading(false);

  }
}

  function copyReply() {
    navigator.clipboard.writeText(reply);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">

      {/* Heading */}
      <div className="text-center pt-16">
        <h1 className="text-5xl font-bold text-pink-600">
          💬 Reply Agent
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Generate professional replies for your customers
        </p>
      </div>

      {/* Input Card */}
      <div className="max-w-3xl mx-auto mt-16 bg-white shadow-2xl rounded-3xl p-10">

        <h2 className="text-2xl font-bold mb-6">
          Customer Message
        </h2>

        <textarea
          placeholder="Enter customer message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-4 rounded-xl h-40"
        />

        <button
          onClick={generateReply}
          disabled={loading}
          className="mt-8 bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Reply"}
        </button>

      </div>

      {reply && (

<>

<div className="max-w-5xl mx-auto mt-8">

  <div className="bg-green-100 border border-green-400 rounded-2xl p-6 text-center shadow-lg transition hover:scale-[1.01]">

    <h2 className="text-2xl font-bold text-green-700">
      ✅ Customer Reply Generated Successfully
    </h2>

    <p className="text-green-600 mt-2">
      Your professional customer response is ready.
    </p>

  </div>

</div>

<div className="max-w-5xl mx-auto mt-8 bg-white shadow-2xl rounded-3xl p-10 mb-20">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Suggested Reply
          </h2>

          <button
            onClick={copyReply}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            {copied ? "✅ Copied!" : "📋 Copy Reply"}
          </button>

        </div>

        <div className="prose max-w-none">
          <ReactMarkdown>{reply}</ReactMarkdown>
        </div>

      </div>
      </>
      )}
    </main>
  );
}