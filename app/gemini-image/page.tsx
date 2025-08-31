/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

export default function GeminiImagePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    setResponseText("");

    try {
      const res = await fetch("/api/gemini-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      // Existing code

      const data = await res.json();
      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        alert("No image was returned. Please try again or adjust your prompt.");
      }
      if (data.text) {
        setResponseText(data.text);
      }
    } catch (err) {
      console.error("Error generating image:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">🎨 Gemini Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt (e.g., banana in costume)"
        className="border p-2 rounded w-full max-w-md mb-4"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {responseText && <p className="mt-4 text-gray-700">✨ {responseText}</p>}

      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated"
            className="rounded shadow-lg max-w-md"
          />
        </div>
      )}
    </div>
  );
}
