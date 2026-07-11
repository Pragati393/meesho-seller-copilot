import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">

      {/* Hero Section */}
      <section className="text-center pt-28">
        <h1 className="text-6xl font-bold text-pink-600">
          Meesho Seller Co-Pilot
        </h1>

        <p className="mt-6 text-xl text-gray-700">
          AI-powered multi-agent assistant for Bharat sellers
        </p>

        <p className="mt-4 text-gray-500">
          Generate listings, optimize pricing and reply to customers using AI.
        </p>

        <div className="mt-10">
          <Link href="/login">
            <button className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-pink-700 shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8 px-16 mt-28">

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold">
            📦 Listing Agent
          </h2>

          <p className="mt-4 text-gray-600">
            Generate product titles, descriptions,
            keywords and hashtags automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold">
            💰 Pricing Agent
          </h2>

          <p className="mt-4 text-gray-600">
            Analyze competitor prices and recommend
            profitable selling prices.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold">
            💬 Reply Agent
          </h2>

          <p className="mt-4 text-gray-600">
            Generate smart customer replies
            in multiple languages.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="text-center mt-24 pb-8 text-gray-500">
        Built with Next.js • FastAPI • Gemini • PostgreSQL
      </footer>

    </main>
  );
}