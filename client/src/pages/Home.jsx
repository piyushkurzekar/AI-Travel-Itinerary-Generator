import { Link } from "react-router-dom";
import {
  Plane, Upload, Wand2, Map, Share2, ArrowRight,
  Star, CheckCircle, Globe, Shield,
} from "lucide-react";
import Navbar from "../components/common/Navbar";

const Feature = ({ icon: Icon, title, desc, color }) => (
  <div className="text-center p-6 group">
    <div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
    >
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
      {num}
    </div>
    <div className="pt-1">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

const Home = () => (
  <div className="min-h-screen bg-white">
    <Navbar />

    {/* Hero */}
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
          <Star size={14} className="text-yellow-300" />
          AI-Powered Travel Planning
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Your Travel Docs →<br />
          <span className="text-sky-300">Perfect Itinerary</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your flight tickets, hotel bookings, and travel docs. Our AI
          extracts all details and builds a personalized day-by-day itinerary
          in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start for free <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
          <p className="text-gray-500">From upload to itinerary in minutes</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Feature
            icon={Upload}
            title="Smart Upload"
            desc="Drag & drop PDFs, photos of tickets, or booking confirmations"
            color="bg-blue-500"
          />
          <Feature
            icon={Wand2}
            title="AI Extraction"
            desc="Gemini AI reads your documents and extracts all booking details"
            color="bg-purple-500"
          />
          <Feature
            icon={Map}
            title="Day-by-Day Plan"
            desc="Get a complete itinerary tailored to your pace, budget & interests"
            color="bg-green-500"
          />
          <Feature
            icon={Share2}
            title="Share & Export"
            desc="Share with friends via public link or download as PDF"
            color="bg-orange-500"
          />
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          <p className="text-gray-500">Three simple steps to your perfect trip</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Step
              num="1"
              title="Upload your travel documents"
              desc="Drag and drop your flight tickets, hotel bookings, or any travel PDFs and images."
            />
            <Step
              num="2"
              title="Review & customize details"
              desc="AI extracts all booking info. Edit anything and set your preferences — budget, pace, interests."
            />
            <Step
              num="3"
              title="Get your AI itinerary"
              desc="Receive a complete day-by-day plan with activities, meals, transport, tips, and budget breakdown."
            />
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 space-y-4">
            {[
              { icon: CheckCircle, text: "Supports PDF, JPG, PNG formats", color: "text-green-500" },
              { icon: Globe, text: "Public sharing with unique link", color: "text-blue-500" },
              { icon: Shield, text: "Secure JWT authentication", color: "text-purple-500" },
              { icon: Star, text: "Powered by Google Gemini AI", color: "text-yellow-500" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <Icon className={color} size={18} />
                <span className="text-sm font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-blue-600 text-white text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to plan your next adventure?</h2>
        <p className="text-blue-100 mb-8">
          Join thousands of travelers who plan smarter with TripAI.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Get started free <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-8 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="p-1 bg-blue-600 rounded">
          <Plane className="text-white" size={12} />
        </div>
        <span className="font-semibold text-gray-600">TripAI</span>
      </div>
      <p>© {new Date().getFullYear()} TripAI. AI-powered travel itinerary generator.</p>
    </footer>
  </div>
);

export default Home;
