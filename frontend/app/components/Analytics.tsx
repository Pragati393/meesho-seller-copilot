"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
export default function Analytics() {

    const [stats, setStats] = useState({

        listings: 0,

        pricing: 0,

        replies: 0

    });

    useEffect(() => {

        fetchStats();

    }, []);

    async function fetchStats() {

    try {

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const response = await fetch(
            `http://127.0.0.1:8000/dashboard/stats?user_id=${user.id}`
        );

        const data = await response.json();

        setStats({
            listings: data.total_listings,
            pricing: data.total_pricing,
            replies: data.total_replies,
        });

    }

    catch (error) {

        console.log(error);

    }

}

    return (

        <section className="max-w-6xl mx-auto mt-12">

            <div className="grid md:grid-cols-3 gap-8">

                <div className="bg-white shadow-xl rounded-3xl p-8 text-center">

                    <h1 className="text-5xl font-bold text-pink-600">

                        {stats.listings}

                    </h1>

                    <p className="mt-4 text-gray-500">

                        📦 Listings Generated

                    </p>

                </div>

                <div className="bg-white shadow-xl rounded-3xl p-8 text-center">

                    <h1 className="text-5xl font-bold text-green-600">

                        {stats.pricing}

                    </h1>

                    <p className="mt-4 text-gray-500">

                        💰 Pricing Reports

                    </p>

                </div>

                <div className="bg-white shadow-xl rounded-3xl p-8 text-center">

                    <h1 className="text-5xl font-bold text-blue-600">

                        {stats.replies}

                    </h1>

                    <p className="mt-4 text-gray-500">

                        💬 Customer Replies

                    </p>

                </div>

            </div>

        </section>

    );

}