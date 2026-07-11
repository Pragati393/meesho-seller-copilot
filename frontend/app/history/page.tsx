"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
interface Listing {
  id: number;
  product_name: string;
  listing: string;
  created_at: string;
}

interface Pricing {
  id: number;
  product_name: string;
  cost_price: number;
  recommended_price: number;
  profit: number;
  profit_margin: number;
  strategy: string;
  created_at: string;
}

interface Reply {
  id: number;
  customer_message: string;
  reply: string;
  created_at: string;
}

export default function HistoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {

  try {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const listingRes = await fetch(
      `http://${process.env.NEXT_PUBLIC_API_URL}/history/listings?user_id=${user.id}`
    );

    const pricingRes = await fetch(
      `http://${process.env.NEXT_PUBLIC_API_URL}/history/pricing?user_id=${user.id}`
    );

    const replyRes = await fetch(
      `http://${process.env.NEXT_PUBLIC_API_URL}/history/replies?user_id=${user.id}`
    );

    setListings(await listingRes.json());
    setPricing(await pricingRes.json());
    setReplies(await replyRes.json());

  } catch (error) {

    console.error(error);
    alert("Unable to load history.");

  }

}

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold text-center text-pink-600 mb-12">
        📜 History
      </h1>

      {/* Listing History */}

      <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          📦 Listing History
        </h2>

        {listings.length === 0 ? (
          <p>No Listings Found</p>
        ) : (
          listings.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-5 mb-5"
            >
              <div className="flex justify-between">

                <div>

                  <h3 className="font-bold text-xl">
                    {item.product_name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                </div>

                <button
                  onClick={() => copyText(item.listing)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Copy
                </button>

              </div>

              <pre className="whitespace-pre-wrap mt-4">
                {item.listing}
              </pre>

            </div>
          ))
        )}

      </div>

      {/* Pricing History */}

      <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          💰 Pricing History
        </h2>

        {pricing.length === 0 ? (
          <p>No Pricing History</p>
        ) : (
          pricing.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-5 mb-5"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-bold text-xl">
                    {item.product_name}
                  </h3>

                  <p>
                    Cost Price: ₹{item.cost_price}
                  </p>

                  <p>
                    Recommended Price: ₹{item.recommended_price}
                  </p>

                  <p>
                    Profit: ₹{item.profit}
                  </p>

                  <p>
                    Margin: {item.profit_margin}%
                  </p>

                </div>

                <button
                  onClick={() => copyText(item.strategy)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg h-10"
                >
                  Copy
                </button>

              </div>

              <pre className="whitespace-pre-wrap mt-5">
                {item.strategy}
              </pre>

            </div>
          ))
        )}

      </div>

      {/* Reply History */}

      <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          💬 Reply History
        </h2>

        {replies.length === 0 ? (
          <p>No Reply History</p>
        ) : (
          replies.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-5 mb-5"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-bold">
                    Customer Message
                  </h3>

                  <p>{item.customer_message}</p>

                </div>

                <button
                  onClick={() => copyText(item.reply)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg h-10"
                >
                  Copy
                </button>

              </div>

              <div className="mt-4">

                <h3 className="font-bold">
                  AI Reply
                </h3>

                <pre className="whitespace-pre-wrap">
                  {item.reply}
                </pre>

              </div>

            </div>
          ))
        )}

      </div>

    </main>
  );
}