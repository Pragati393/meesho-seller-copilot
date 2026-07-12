import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-paper">

      {/* Hero Section */}
      <section className="text-center pt-28">
        <h1 className="text-6xl font-bold font-display text-paper">
          Meesho Seller Co-Pilot
        </h1>

        <p className="mt-6 text-xl text-parchment">
          AI-powered multi-agent assistant for Bharat sellers
        </p>

        <p className="mt-4 text-parchment">
          Generate listings, optimize pricing and reply to customers using AI.
        </p>

        <div className="mt-10">
          <Link href="/login">
            <button className="bg-stamp text-paper px-8 py-4 rounded-xl text-lg hover:bg-ink-light shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8 px-16 mt-28">

        <div className="bg-paper text-ink border border-paper-line rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold font-display">
            Listing Agent
          </h2>

          <p className="mt-4 text-ink/60">
            Generate product titles, descriptions,
            keywords and hashtags automatically.
          </p>
        </div>

        <div className="bg-paper text-ink border border-paper-line rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold font-display">
            Pricing Agent
          </h2>

          <p className="mt-4 text-ink/60">
            Analyze competitor prices and recommend
            profitable selling prices.
          </p>
        </div>

        <div className="bg-paper text-ink border border-paper-line rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold font-display">
            Reply Agent
          </h2>

          <p className="mt-4 text-ink/60">
            Generate smart customer replies
            in multiple languages.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="text-center mt-24 pb-8 text-parchment">
        Built with Next.js • FastAPI • Gemini • PostgreSQL
      </footer>

    </main>
  );
}