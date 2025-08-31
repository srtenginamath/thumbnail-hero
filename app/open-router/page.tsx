/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState<string>("");
  const [aiImages, setAiImages] = useState<string[]>([]); // ✅ multiple generated images

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    // 1. Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.url) {
      setTitle("Upload failed: " + JSON.stringify(uploadData));
      return;
    }
    setUploadedUrl(uploadData.url);

    // 2. Call OpenRouter API
    const res = await fetch("/api/thumbnail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: uploadData.url, prompt }),
    });
    const data = await res.json();

    const message = data?.choices?.[0]?.message;

    // ✅ Extract text
    if (typeof message?.content === "string") {
      setTitle(message.content);
    } else if (Array.isArray(message?.content)) {
      setTitle(message.content.map((c: any) => c.text).join("\n"));
    }

    // ✅ Extract base64 images (if any)
    if (message?.images?.length > 0) {
      const urls = message.images.map((img: any) => img.image_url.url);
      setAiImages(urls);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-6">
      <h1 className="text-3xl font-bold">AI Thumbnail Generator</h1>

      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Prompt */}
      <input
        type="text"
        placeholder="Enter context (e.g. make this thumbnail for food cooking)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-md"
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Thumbnail
      </button>

      {/* Uploaded Image Preview with Title */}
      {(uploadedUrl || preview) && (
        <div className="relative mt-8 w-[400px] h-[225px] border shadow-lg rounded overflow-hidden">
          <img
            src={uploadedUrl || preview!}
            alt="uploaded"
            className="w-full h-full object-cover"
          />
          {title && (
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-lg font-bold px-3 py-2 rounded">
              {title}
            </div>
          )}
        </div>
      )}

      {/* ✅ Show AI Generated Images */}
      {aiImages.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiImages.map((img, i) => (
            <div
              key={i}
              className="w-[400px] h-[225px] shadow rounded overflow-hidden"
            >
              <img
                src={img} // base64 string works directly
                alt={`ai-thumbnail-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
