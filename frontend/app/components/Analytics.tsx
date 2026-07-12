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
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats?user_id=${user.id}`
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

        <section className="max-w-4xl mx-auto mt-14 px-6">

            <p className="font-data text-xs uppercase tracking-[0.2em] text-parchment text-center mb-3">
                &mdash; Today&apos;s Register &mdash;
            </p>

            <div className="grid grid-cols-3 divide-x divide-paper-line/30 bg-ink-light rounded-lg border border-white/10">

                <div className="p-6 md:p-8 text-center">

                    <h1 className="font-data text-4xl md:text-5xl font-semibold text-mustard">
                        {stats.listings}
                    </h1>

                    <p className="mt-3 text-parchment text-sm font-body">
                        Listings Generated
                    </p>

                </div>

                <div className="p-6 md:p-8 text-center">

                    <h1 className="font-data text-4xl md:text-5xl font-semibold text-ledger-green">
                        {stats.pricing}
                    </h1>

                    <p className="mt-3 text-parchment text-sm font-body">
                        Pricing Reports
                    </p>

                </div>

                <div className="p-6 md:p-8 text-center">

                    <h1 className="font-data text-4xl md:text-5xl font-semibold text-stamp">
                        {stats.replies}
                    </h1>

                    <p className="mt-3 text-parchment text-sm font-body">
                        Customer Replies
                    </p>

                </div>

            </div>

        </section>

    );

}