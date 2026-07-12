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

        <section className="max-w-4xl mx-auto mt-14 px-6 pb-20">

            <div className="ruled-paper rounded-lg shadow-2xl p-8 md:p-10 text-ink border border-paper-line">

                <h2 className="font-display font-semibold text-3xl text-center">
                    Ask the Assistant
                </h2>

                <p className="text-center text-ink/60 mt-3 font-body">
                    Write your request in your own words. The Router Agent
                    reads it and hands it to the right specialist.
                </p>

                <textarea

                    rows={5}

                    value={query}

                    onChange={(e) => setQuery(e.target.value)}

                    placeholder="Example: Generate a listing for a cotton kurti..."

                    className="w-full mt-8 bg-transparent border border-ink/20 rounded-md p-5 outline-none focus:ring-2 focus:ring-mustard font-body leading-[35px]"

                />

                <div className="flex justify-center mt-8">

                    <button

                        onClick={askAI}

                        disabled={loading}

                        className="ink-stamp font-data text-sm px-8 py-3.5 text-stamp border-stamp hover:bg-stamp hover:text-paper transition disabled:opacity-40 disabled:cursor-not-allowed rotate-1"

                    >

                        {loading ? "Thinking…" : "Ask AI"}

                    </button>

                </div>


                {response && (

<div className="mt-6 bg-paper border border-paper-line rounded-md p-6">

    <div className="flex justify-between items-center mb-4">

        <h3 className="font-display font-semibold text-lg">
            AI Response
        </h3>

        <button
            onClick={copyResponse}
            className="font-data text-xs uppercase tracking-widest text-ledger-green border border-ledger-green px-3 py-1.5 rounded hover:bg-ledger-green hover:text-paper transition"
        >
            Copy
        </button>

    </div>

    <pre className="whitespace-pre-wrap font-body text-sm">
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
                    className="font-data text-xs uppercase tracking-widest bg-ink text-paper px-5 py-2.5 rounded hover:bg-ink-light transition"
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