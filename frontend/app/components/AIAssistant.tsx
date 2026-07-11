"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AIAssistant() {

    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [options, setOptions] = useState<string[]>([]);
    async function askAI() {

    if (!query.trim()) {
        alert("Please enter your request.");
        return;
    }

    setLoading(true);

    try {

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/router?query=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        // Clear previous state
        setResponse("");
        setOptions([]);

        if (data.action === "route") {

            switch (data.agent) {

                case "listing":
                    setResponse("📦 Listing request detected. Redirecting...");
                    setTimeout(() => router.push("/listing-agent"), 800);
                    return;

                case "pricing":
                    setResponse("💰 Pricing request detected. Redirecting...");
                    setTimeout(() => router.push("/pricing-agent"), 800);
                    return;

               case "reply":
                    setResponse("💬 Customer reply request detected. Redirecting...");
                    setTimeout(() => router.push("/reply-agent"), 800);
                    return;
            }

        }

        if (data.action === "clarify") {

            setResponse(data.message);
            setOptions(data.options);

        }

    } catch (err) {

    setResponse("Unable to connect to the backend.");

} finally {

    setLoading(false);

}

}

    function copyResponse() {

        navigator.clipboard.writeText(response);

        alert("Copied!");

    }

    return (

        <section className="max-w-5xl mx-auto mt-12">

            <div className="bg-white rounded-3xl shadow-2xl p-10">

                <h2 className="text-4xl font-bold text-center">
                    🤖 AI Seller Assistant
                </h2>

                <p className="text-center text-gray-500 mt-4">
                    Ask anything about selling on Meesho.
                    The Router Agent will automatically choose
                    the correct AI Agent.
                </p>

                <textarea

                    rows={5}

                    value={query}

                    onChange={(e) => setQuery(e.target.value)}

                    placeholder="Example: Generate a listing for a cotton kurti..."

                    className="w-full mt-8 border rounded-2xl p-5 outline-none focus:ring-2 focus:ring-pink-500"

                />

                <div className="flex justify-center mt-8">

                    <button

                        onClick={askAI}

                        disabled={loading}

                        className="bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"

                    >

                        {loading ? "Thinking..." : "🚀 Ask AI"}

                    </button>

                </div>


                {response && (

<div className="mt-6 bg-gray-50 rounded-2xl p-6">

    <div className="flex justify-between items-center mb-4">

        <h3 className="text-xl font-bold">
            AI Response
        </h3>

        <button
            onClick={copyResponse}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
            Copy
        </button>

    </div>

    <pre className="whitespace-pre-wrap">
        {response}
    </pre>

    {options.length > 0 && (

        <div className="mt-6 flex flex-wrap gap-4">

            {options.map((option) => (

                <button
                    key={option}
                    onClick={() => {

                        if (option.includes("Listing"))
                            router.push("/listing-agent");

                        if (option.includes("Pricing"))
                            router.push("/pricing-agent");

                        if (option.includes("Reply"))
                            router.push("/reply-agent");

                    }}
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700"
                >
                    {option}
                </button>

            ))}

        </div>

    )}

</div>

)}
 

            </div>

        </section>

    );

}