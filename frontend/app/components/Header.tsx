"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Header() {

    const router = useRouter();

    async function logout() {

        await supabase.auth.signOut();

        router.push("/login");

    }

    return (

        <header className="flex justify-between items-center px-10 py-6">

            <Link href="/history">

                <button className="bg-white shadow-lg px-6 py-3 rounded-xl hover:bg-pink-50">

                    📜 History

                </button>

            </Link>

            <button

                onClick={logout}

                className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700"

            >

                Logout

            </button>

        </header>

    );

}