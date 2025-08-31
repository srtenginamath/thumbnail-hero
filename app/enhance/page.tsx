"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EnhancePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("lifestyle");
  const [loading, setLoading] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!prompt) return alert("Please enter a prompt");
    setLoading(true);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();
      setEnhancedPrompt(data.enhancedPrompt);
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          🎨 AI Thumbnail Prompt Enhancer
        </h1>

        {/* Prompt input */}
        <textarea
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your idea (e.g. make this cooking food channel thumbnail)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        {/* Style selector */}
        <select
          className="w-full p-3 border rounded-lg mb-4"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="gaming">🎮 Gaming</option>
          <option value="lifestyle">🏡 Lifestyle</option>
          <option value="tech">💻 Tech</option>
          <option value="professional">📊 Professional</option>
        </select>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Enhancing..." : "Generate Enhanced Prompt"}
        </button>

        {/* Results */}
        {enhancedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 border rounded-lg bg-gray-50"
          >
            <h2 className="font-bold text-lg mb-2">✨ Enhanced Prompt</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {enhancedPrompt}
            </p>

            <h2 className="font-bold text-lg mt-4 mb-2">
              📌 Optimization Suggestions
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
