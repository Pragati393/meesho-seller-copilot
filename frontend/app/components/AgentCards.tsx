import Link from "next/link";

export default function AgentCards() {

    return (

        <section className="max-w-6xl mx-auto mt-14 px-6">

            <p className="font-data text-xs uppercase tracking-[0.2em] text-parchment text-center mb-6">
                &mdash; Choose a Specialist &mdash;
            </p>

            <div className="grid md:grid-cols-3 gap-8">

                <Link href="/listing-agent">

                    <div className="relative bg-paper text-ink rounded-md border border-paper-line border-dashed p-8 pt-10 hover:-translate-y-1.5 transition cursor-pointer shadow-lg -rotate-1">

                        <span className="absolute -top-4 -right-3 ink-stamp text-[10px] px-3 py-1.5 text-stamp bg-paper rotate-6">
                            Listing
                        </span>

                        <h2 className="font-display font-semibold text-2xl">
                            Listing Agent
                        </h2>

                        <p className="mt-3 text-ink/60 font-body text-sm">
                            Generate SEO-friendly product titles,
                            descriptions and keywords.
                        </p>

                    </div>

                </Link>

                <Link href="/pricing-agent">

                    <div className="relative bg-paper text-ink rounded-md border border-paper-line border-dashed p-8 pt-10 hover:-translate-y-1.5 transition cursor-pointer shadow-lg rotate-1">

                        <span className="absolute -top-4 -right-3 ink-stamp text-[10px] px-3 py-1.5 text-ledger-green bg-paper -rotate-6">
                            Pricing
                        </span>

                        <h2 className="font-display font-semibold text-2xl">
                            Pricing Agent
                        </h2>

                        <p className="mt-3 text-ink/60 font-body text-sm">
                            Analyze competitor prices and recommend
                            the best selling price.
                        </p>

                    </div>

                </Link>

                <Link href="/reply-agent">

                    <div className="relative bg-paper text-ink rounded-md border border-paper-line border-dashed p-8 pt-10 hover:-translate-y-1.5 transition cursor-pointer shadow-lg -rotate-1">

                        <span className="absolute -top-4 -right-3 ink-stamp text-[10px] px-3 py-1.5 text-mustard bg-paper rotate-6">
                            Reply
                        </span>

                        <h2 className="font-display font-semibold text-2xl">
                            Reply Agent
                        </h2>

                        <p className="mt-3 text-ink/60 font-body text-sm">
                            Generate professional customer replies
                            in seconds.
                        </p>

                    </div>

                </Link>

            </div>

        </section>

    );

}