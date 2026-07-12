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

        <header className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-white/10">

            <span className="font-display italic text-lg text-parchment tracking-wide">
                Seller&apos;s Co-Pilot
            </span>

            <div className="flex items-center gap-4">

                <Link href="/history">

                    <button className="font-data text-xs uppercase tracking-widest text-paper border border-paper-line/40 px-5 py-2.5 rounded-t-md hover:bg-ink-light transition">
                        Register &middot; History
                    </button>

                </Link>

                <button

                    onClick={logout}

                    className="font-data text-xs uppercase tracking-widest ink-stamp px-5 py-2.5 text-stamp hover:bg-stamp hover:text-paper transition -rotate-2"

                >

                    Logout

                </button>

            </div>

        </header>

    );

}