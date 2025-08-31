/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleGenerate = async () => {
    if (!file || !prompt) return;

    // Upload image via server-side or Cloudinary endpoint
    const fd = new FormData();
    fd.append("file", file);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await uploadRes.json();
    if (!url) return alert("Upload failed");

    const res = await fetch("/api/thumbnail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url, prompt }),
    });

    const data = await res.json();
    if (data.images) {
      setThumbs(data.images.map((img: any) => img.url));
      setDesc(data.description || "");
    } else {
      alert("Generation failed: " + JSON.stringify(data));
    }
  };

  return (
    <div className="p-10 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold">Fal.ai Thumbnail Generator</h1>

      <input type="file" accept="image/*" onChange={handleFile} />
      <input
        type="text"
        placeholder="Prompt (e.g. make this thumbnail for food cooking)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Thumbnail
      </button>

      {preview && (
        <div className="mt-6 w-[400px] h-[225px] border shadow">
          <img
            src={preview}
            alt="Uploaded"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {desc && <p className="mt-4 text-gray-700">{desc}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {thumbs.map((url, i) => (
          <div
            key={i}
            className="w-[400px] h-[225px] shadow rounded overflow-hidden"
          >
            <img
              src={url}
              alt={`Generated ${i}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
