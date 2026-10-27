"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "../../lib/api";

export default function Home() {
  const [product, setProduct] = useState("");
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

async function generateListing() {


  if (!product.trim()) {
    alert("Please enter a product name.");
    return;
  }

  setLoading(true);

  try {

    const data = await apiFetch<{ listing: string }>("/generate", {
      method: "POST",
      body: { product },
    });

    setListing(data.listing);

  } catch (error) {

    console.error(error);
    setListing(
      error instanceof Error ? `⚠️ ${error.message}` : "⚠️ Unable to connect to the server."
    );

  } finally {

    setLoading(false);

  }
}
function copyListing() {

  navigator.clipboard.writeText(listing);

  setCopied(true);

  setTimeout(() => {

    setCopied(false);

  }, 2000);

}

  return (
  <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">

    <div className="text-center pt-16">
      <h1 className="text-5xl font-bold text-pink-600">
        📦 Listing Agent
      </h1>

      <p className="text-gray-500 mt-4 text-lg">
        Generate AI-powered listings instantly
      </p>
    </div>

    {/* Input Card */}
    <div className="max-w-3xl mx-auto mt-16 bg-white shadow-2xl rounded-3xl p-10">

      <h2 className="text-2xl font-bold mb-6">
        Product Name
      </h2>

      <input
        type="text"
        placeholder="Enter product name"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <button
       onClick={generateListing}
       disabled={loading}
       className="mt-8 bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 disabled:bg-gray-400"
       >
      {loading ? "Generating..." : "Generate Listing"}
       </button>

    </div>

    {listing && (
<>

{/* Success Banner */}

<div className="max-w-5xl mx-auto mt-8">

  <div className="bg-green-100 border border-green-400 rounded-2xl p-6 text-center shadow-lg transition hover:scale-[1.01]">

    <h2 className="text-2xl font-bold text-green-700">
      ✅ Listing Generated Successfully
    </h2>

    <p className="text-green-600 mt-2">
      Your AI-powered product listing is ready.
    </p>

  </div>

</div>

{/* Output Card */}

<div className="max-w-5xl mx-auto mt-8 bg-white shadow-2xl rounded-3xl p-10 mb-20">

    
<div className="flex justify-between items-center mb-8">

  <h2 className="text-3xl font-bold">
    Generated Listing
  </h2>

  <button
  onClick={copyListing}
  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
>
  {copied ? "✅ Copied!" : "📋 Copy Listing"}
</button>

</div>
 <div className="prose max-w-none">
    <ReactMarkdown>
      {listing}
    </ReactMarkdown>
  </div>


    </div>
    </>
    )} 

  </main>
);
}