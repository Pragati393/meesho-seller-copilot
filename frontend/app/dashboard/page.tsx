"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

import Header from "../components/Header";
import Hero from "../components/Hero";
import AIAssistant from "../components/AIAssistant";
import Analytics from "../components/Analytics";
import AgentCards from "../components/AgentCards";

export default function Dashboard() {

    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.push("/login");
        }

    }

    return (

        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">

            <Header />

            <Hero />

            <AIAssistant />

            <Analytics />

            <AgentCards />

        </main>

    );

}