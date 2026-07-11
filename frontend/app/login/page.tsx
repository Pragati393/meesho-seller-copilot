"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function login() {

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({

            email,

            password,

        });

        setLoading(false);

        if (error) {

            alert(error.message);

            return;

        }

        router.push("/dashboard");

    }

    async function signup() {

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    setLoading(false);

    console.log("Signup data:", data);
    console.log("Signup error:", error);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Account created successfully!");
}

    return (

        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">

            <div className="bg-white shadow-2xl rounded-3xl p-10 w-[420px]">

                <h1 className="text-4xl font-bold text-center text-pink-600">

                    Meesho Seller Co-Pilot

                </h1>

                <p className="text-center text-gray-500 mt-3">

                    Login to continue

                </p>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    className="w-full mt-8 border rounded-xl p-4"

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    className="w-full mt-5 border rounded-xl p-4"

                />

                <button

                    onClick={login}

                    disabled={loading}

                    className="w-full mt-8 bg-pink-600 text-white py-4 rounded-xl hover:bg-pink-700"

                >

                    {loading ? "Please wait..." : "Login"}

                </button>

                <button

                    onClick={signup}

                    disabled={loading}

                    className="w-full mt-4 border border-pink-600 text-pink-600 py-4 rounded-xl hover:bg-pink-50"

                >

                    Create Account

                </button>

            </div>

        </main>

    );

}