"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../../lib/supabase";

export default function PricingAgent() {
  const [product, setProduct] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const [amazonPrice, setAmazonPrice] = useState(0);
  const [flipkartPrice, setFlipkartPrice] = useState(0);
  const [meeshoPrice, setMeeshoPrice] = useState(0);

  const [aggressivePrice, setAggressivePrice] = useState(0);
  const [balancedPrice, setBalancedPrice] = useState(0);
  const [premiumPrice, setPremiumPrice] = useState(0);

  const [recommendedPrice, setRecommendedPrice] = useState(0);

  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  const [confidence, setConfidence] = useState("");

  const [strategy, setStrategy] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generatePricing() {

  if (!product.trim()) {
    alert("Please enter a product name.");
    return;
  }

  if (!costPrice) {
    alert("Please enter the cost price.");
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
      `http://${process.env.NEXT_PUBLIC_API_URL}/pricing?product=${encodeURIComponent(product)}&cost_price=${costPrice}&user_id=${user.id}`
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setAmazonPrice(data.amazon_price);
    setFlipkartPrice(data.flipkart_price);
    setMeeshoPrice(data.meesho_price);

    setAggressivePrice(data.aggressive_price);
    setBalancedPrice(data.balanced_price);
    setPremiumPrice(data.premium_price);

    setRecommendedPrice(data.recommended_price);

    setProfit(data.profit);
    setProfitMargin(data.profit_margin);

    setConfidence(data.confidence);

    setStrategy(data.strategy);

  } catch (error) {

    console.error(error);
    alert("Unable to connect to the server.");

  } finally {

    setLoading(false);

  }
}

  function copyStrategy() {
    navigator.clipboard.writeText(strategy);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">

      <div className="text-center pt-16">

        <h1 className="text-5xl font-bold text-pink-600">
          💰 Pricing Agent
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          AI Powered Competitor Price Analysis
        </p>

      </div>

      {/* Input Card */}

      <div className="max-w-3xl mx-auto mt-16 bg-white shadow-2xl rounded-3xl p-10">

        <h2 className="text-2xl font-bold mb-6">
          Product Details
        </h2>

        <input
          type="text"
          placeholder="Enter Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full border p-4 rounded-xl mb-5"
        />

        <input
          type="number"
          placeholder="Enter Cost Price"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          className="w-full border p-4 rounded-xl"
        />

        <button
          onClick={generatePricing}
          disabled={loading}
          className="mt-8 bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Generate Pricing Strategy"}
        </button>

      </div>

      {strategy && (

<>
    {/* Success Banner */}

    <div className="max-w-6xl mx-auto mt-8">

        <div className="bg-green-100 border border-green-400 rounded-2xl p-6 text-center shadow-lg transition hover:scale-[1.01]">

            <h2 className="text-2xl font-bold text-green-700">
                ✅ Pricing Strategy Generated Successfully
            </h2>

            <p className="text-green-600 mt-2">
                Competitor analysis and AI recommendations are ready.
            </p>

        </div>

    </div>

    <div className="max-w-6xl mx-auto mt-8 mb-20">

        {/* Competitor Prices */}

        <h2 className="text-3xl font-bold mb-6">
          📊 Competitor Prices
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="text-gray-500 font-semibold">
              Amazon
            </h3>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              ₹{amazonPrice}
            </p>

          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="text-gray-500 font-semibold">
              Flipkart
            </h3>

            <p className="text-4xl font-bold text-yellow-500 mt-3">
              ₹{flipkartPrice}
            </p>

          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="text-gray-500 font-semibold">
              Meesho Average
            </h3>

            <p className="text-4xl font-bold text-pink-600 mt-3">
              ₹{meeshoPrice}
            </p>

          </div>

        </div>

        {/* Pricing Strategies */}

        <h2 className="text-3xl font-bold mt-12 mb-6">
          💰 Pricing Strategies
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-green-100 rounded-2xl p-6 text-center">

            <h3 className="font-bold text-green-800">
              🟢 Aggressive
            </h3>

            <p className="text-4xl font-bold mt-3">
              ₹{aggressivePrice}
            </p>

            <p className="mt-2 text-sm">
              Higher Sales
            </p>

          </div>

          <div className="bg-blue-100 rounded-2xl p-6 text-center border-4 border-blue-500">

            <h3 className="font-bold text-blue-800">
              🔵 Balanced ⭐
            </h3>

            <p className="text-4xl font-bold mt-3">
              ₹{balancedPrice}
            </p>

            <p className="mt-2 text-sm">
              Recommended
            </p>

          </div>

          <div className="bg-purple-100 rounded-2xl p-6 text-center">

            <h3 className="font-bold text-purple-800">
              🟣 Premium
            </h3>

            <p className="text-4xl font-bold mt-3">
              ₹{premiumPrice}
            </p>

            <p className="mt-2 text-sm">
              Higher Profit
            </p>

          </div>

        </div>

        {/* Profit */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="font-semibold">
              💵 Profit
            </h3>

            <p className="text-4xl font-bold mt-3 text-green-600">
              ₹{profit}
            </p>

          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="font-semibold">
              📈 Profit Margin
            </h3>

            <p className="text-4xl font-bold mt-3 text-orange-600">
              {profitMargin}%
            </p>

          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

            <h3 className="font-semibold">
              📊 Confidence
            </h3>

            <p className="font-bold text-lg mt-4">
              {confidence}
            </p>

          </div>

        </div>

        {/* AI Strategy */}

        <div className="bg-white shadow-2xl rounded-3xl p-10 mt-10">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold">
              🤖 AI Recommendation
            </h2>

            <button
              onClick={copyStrategy}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              {copied ? "✅ Copied!" : "📋 Copy Strategy"}
            </button>

          </div>

          <div className="prose max-w-none">
            <ReactMarkdown>
              {strategy}
            </ReactMarkdown>
          </div>

        </div>

      </div>
      </>
      )}

    </main>
  );
}