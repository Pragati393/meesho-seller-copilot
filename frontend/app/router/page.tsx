"use client";

import { useState } from "react";

export default function RouterPage() {

    const [query, setQuery] = useState("");
    const [result, setResult] = useState("");
    const [agent, setAgent] = useState("");
    const [loading, setLoading] = useState(false);

    async function askAssistant() {

        if (!query.trim()) {
            alert("Please enter a request.");
            return;
        }

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/router?query=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        setAgent(data.agent);

        setResult(
            data.response || data.message || "No response."
        );

        setLoading(false);
    }

    function copyResult() {
        navigator.clipboard.writeText(result);
        alert("Copied!");
    }

    return (

        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-10">

            <div className="max-w-4xl mx-auto">

                <h1 className="text-5xl font-bold text-pink-600 text-center">
                    🤖 AI Seller Assistant
                </h1>

                <p className="text-center text-gray-500 mt-4 mb-10">
                    Ask anything. I'll automatically choose the correct AI agent.
                </p>

                <textarea
                    rows={5}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Example: Generate a listing for a cotton kurti..."
                    className="w-full border rounded-xl p-5"
                />

                <button
                    onClick={askAssistant}
                    disabled={loading}
                    className="mt-6 bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700"
                >
                    {loading ? "Thinking..." : "Ask AI"}
                </button>

                {agent && (

                    <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">

                        <div className="flex justify-between">

                            <h2 className="text-3xl font-bold">
                                {agent}
                            </h2>

                            <button
                                onClick={copyResult}
                                className="bg-green-600 text-white px-5 py-2 rounded-xl"
                            >
                                Copy
                            </button>

                        </div>

                        <pre className="whitespace-pre-wrap mt-8">
                            {result}
                        </pre>

                    </div>

                )}

            </div>

        </main>

    );

}