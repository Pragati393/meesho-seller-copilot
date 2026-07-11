import Link from "next/link";

export default function AgentCards() {

    return (

        <section className="max-w-6xl mx-auto mt-14">

            <div className="grid md:grid-cols-3 gap-8">

                <Link href="/listing-agent">

                    <div className="bg-white shadow-xl rounded-3xl p-8 hover:scale-105 transition cursor-pointer">

                        <h2 className="text-3xl font-bold">

                            📦 Listing Agent

                        </h2>

                        <p className="mt-4 text-gray-500">

                            Generate SEO-friendly product titles,
                            descriptions and keywords.

                        </p>

                    </div>

                </Link>

                <Link href="/pricing-agent">

                    <div className="bg-white shadow-xl rounded-3xl p-8 hover:scale-105 transition cursor-pointer">

                        <h2 className="text-3xl font-bold">

                            💰 Pricing Agent

                        </h2>

                        <p className="mt-4 text-gray-500">

                            Analyze competitor prices and recommend
                            the best selling price.

                        </p>

                    </div>

                </Link>

                <Link href="/reply-agent">

                    <div className="bg-white shadow-xl rounded-3xl p-8 hover:scale-105 transition cursor-pointer">

                        <h2 className="text-3xl font-bold">

                            💬 Reply Agent

                        </h2>

                        <p className="mt-4 text-gray-500">

                            Generate professional customer replies
                            in seconds.

                        </p>

                    </div>

                </Link>

            </div>

        </section>

    );

}